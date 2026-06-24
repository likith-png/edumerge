import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  Check,
  AlertTriangle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  School,
  Info,
  ExternalLink,
  Edit2,
  X,
  ChevronRight,
  TrendingUp,
  Building,
  CheckSquare,
  AlertCircle,
  Award,
  Settings,
  Bell,
  History,
  LayoutGrid,
  FileText,
  List,
  Library,
  Sparkles
} from 'lucide-react';

// -----------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// -----------------------------------------------------------------------------

type ScreenView = 'today' | 'overview' | 'coverage' | 'alp' | 'planner' | 'mlp' | 'ct' | 'exam_check' | 'alerts' | 'configuration' | 'syllabus';

interface Unit {
  id: number;
  name: string;
  type: 'Course Book' | 'Workbook' | 'Writing' | 'Grammar' | 'Activity' | 'Poem';
  term: 'Term 1' | 'Term 2';
  assessment: 'FA1' | 'SA1' | 'FA3' | 'SA2' | 'Not Assessed';
  sessions: number;
  plannedMonth: string;
}

interface Holiday {
  date: string;
  name: string;
}

interface NoBagDay {
  date: string;
  activity: string;
}

interface ExamWindow {
  name: string;
  startDate: string;
  endDate: string;
}

interface TrackerDay {
  id: number;
  date: string;
  day: string;
  type: string;
  topic: string;
  status: string;
  reason: string;
  inputVal: string;
  week: string;
  period?: number;
  teacherComment?: string;
  evidenceType?: string;
  evidenceDetails?: string;
}

interface Subtopic {
  id: number;
  name: string;
  duration?: string;
  status?: 'Completed' | 'In Progress' | 'Planned';
}

interface Chapter {
  id: number;
  name: string;
  plannedPeriods: number;
  subtopics: Subtopic[];
  assessmentTag?: string;
  targetDate?: string;
  targetDays?: number;
  bufferDays?: number;
  actualDaysSpent?: number;
  completionNotes?: string;
  completionEvidence?: string;
  completionStatus?: 'Planned' | 'In Progress' | 'Completed';
}

interface SubjectPlan {
  subject: string;
  teacher: string;
  chapters: Chapter[];
  progressPercent: number;
}

interface AcademicMonth {
  month: string;
  year: number;
  workingDays: number;
  holidays: Holiday[];
  examDays: number;
  ptmDays: number;
  eventDays: number;
  revisionDays?: number;
  noBagDay?: NoBagDay;
  examWindow?: ExamWindow;
}

// -----------------------------------------------------------------------------
// MOCKED DATA FROM EXISTING MODULES
// -----------------------------------------------------------------------------

const academicCalendar: { academicYear: string; months: AcademicMonth[] } = {
  academicYear: "2025-26",
  months: [
    {
      month: "June", year: 2025,
      workingDays: 19,
      holidays: [{ date: "2025-06-15", name: "Bakrid" }],
      examDays: 0, ptmDays: 0, eventDays: 1,
      noBagDay: { date: "2025-06-20", activity: "Sorting Common and Proper Nouns" }
    },
    {
      month: "July", year: 2025,
      workingDays: 23,
      holidays: [],
      examDays: 2, ptmDays: 1, eventDays: 0,
      noBagDay: { date: "2025-07-18", activity: "Draw and label singular and plural" }
    },
    {
      month: "August", year: 2025,
      workingDays: 19,
      holidays: [
        { date: "2025-08-15", name: "Independence Day" },
        { date: "2025-08-27", name: "Ganesh Chaturthi" }
      ],
      examDays: 0, ptmDays: 0, eventDays: 1,
      noBagDay: { date: "2025-08-08", activity: "Rainbow poem recitation" }
    },
    {
      month: "September", year: 2025,
      workingDays: 20,
      holidays: [
        { date: "2025-09-05", name: "Teachers Day" },
        { date: "2025-09-06", name: "Krishna Janmashtami" },
        { date: "2025-09-16", name: "Ganesha Festival" }
      ],
      examDays: 3, ptmDays: 1, eventDays: 1, revisionDays: 4,
      noBagDay: { date: "2025-09-20", activity: "Pick and Speak" },
      examWindow: { name: "SA1", startDate: "2025-09-30", endDate: "2025-10-02" }
    },
    {
      month: "October", year: 2025,
      workingDays: 13,
      holidays: [
        { date: "2025-10-02", name: "Gandhi Jayanti" },
        { date: "2025-10-20", name: "Dussehra" }
      ],
      examDays: 3, ptmDays: 1, eventDays: 0,
      noBagDay: { date: "2025-10-10", activity: "Gamified verb activity" }
    },
    {
      month: "November", year: 2025,
      workingDays: 18,
      holidays: [{ date: "2025-11-01", name: "Kannada Rajyotsava" }],
      examDays: 0, ptmDays: 0, eventDays: 5,
      noBagDay: { date: "2025-11-14", activity: "Draw and write describing words" }
    },
    {
      month: "December", year: 2025,
      workingDays: 17,
      holidays: [{ date: "2025-12-25", name: "Christmas" }],
      examDays: 0, ptmDays: 0, eventDays: 0,
      noBagDay: { date: "2025-12-12", activity: "Speak 3 lines on personal hygiene" }
    },
    {
      month: "January", year: 2026,
      workingDays: 18,
      holidays: [{ date: "2026-01-26", name: "Republic Day" }],
      examDays: 0, ptmDays: 1, eventDays: 1,
      noBagDay: { date: "2026-01-09", activity: "Listen and draw - Tongue Twisters" }
    },
    {
      month: "February", year: 2026,
      workingDays: 20,
      holidays: [],
      examDays: 0, ptmDays: 0, eventDays: 0,
      noBagDay: { date: "2026-02-13", activity: "Animal riddle jar" }
    },
    {
      month: "March", year: 2026,
      workingDays: 20,
      holidays: [{ date: "2026-03-31", name: "Annual Exam End" }],
      examDays: 10, ptmDays: 1, eventDays: 0
    }
  ]
};

const timetable = {
  class: "1", section: "A",
  schedule: [
    { subject: "English", periodsPerWeek: 6,
      slots: [
        { day: "Monday", period: 3 },
        { day: "Tuesday", period: 1 },
        { day: "Wednesday", period: 4 },
        { day: "Thursday", period: 2 },
        { day: "Friday", period: 1 },
        { day: "Saturday", period: 3 }
      ],
      teacher: "Priya R"
    },
    { subject: "Mathematics", periodsPerWeek: 5, teacher: "Sunita K" },
    { subject: "EVS", periodsPerWeek: 4, teacher: "Meena L" },
    { subject: "Hindi", periodsPerWeek: 4, teacher: "Rekha S" }
  ]
};

// Initial Unit List
const INITIAL_UNITS: Unit[] = [
  // Term 1
  { id: 1, name: "Welcome", type: "Course Book", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 2, name: "Red Raincoat", type: "Course Book", term: "Term 1", assessment: "FA1", sessions: 5, plannedMonth: "June" },
  { id: 3, name: "Rani's First Day at School", type: "Course Book", term: "Term 1", assessment: "SA1", sessions: 7, plannedMonth: "July" },
  { id: 4, name: "The Blue Jackal", type: "Course Book", term: "Term 1", assessment: "SA1", sessions: 5, plannedMonth: "August" },
  { id: 5, name: "The Rainbow (Poem)", type: "Course Book", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "August" },
  { id: 6, name: "WS1 Welcome", type: "Workbook", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 7, name: "WS2 Naming Words", type: "Workbook", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 8, name: "WS3 Common and Proper Nouns", type: "Workbook", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 9, name: "WS4 Gender", type: "Workbook", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 10, name: "WS5 A An The", type: "Workbook", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "July" },
  { id: 11, name: "WS7 One and Many", type: "Workbook", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "July" },
  { id: 12, name: "WS9 Personal Pronouns", type: "Workbook", term: "Term 1", assessment: "SA1", sessions: 4, plannedMonth: "August" },
  { id: 13, name: "WS10 Am Is Are", type: "Workbook", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "September" },
  { id: 14, name: "WS28 Punctuation", type: "Workbook", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "September" },
  { id: 15, name: "Using Polite Expressions", type: "Writing", term: "Term 1", assessment: "FA1", sessions: 2, plannedMonth: "June" },
  { id: 16, name: "Writing about Oneself", type: "Writing", term: "Term 1", assessment: "SA1", sessions: 4, plannedMonth: "July" },
  { id: 17, name: "Rearranging Words to Form Sentences", type: "Writing", term: "Term 1", assessment: "SA1", sessions: 3, plannedMonth: "August" },
  // Term 2
  { id: 18, name: "Friendship Land", type: "Course Book", term: "Term 2", assessment: "FA3", sessions: 4, plannedMonth: "October" },
  { id: 19, name: "The Royal Toothache", type: "Course Book", term: "Term 2", assessment: "FA3", sessions: 5, plannedMonth: "November" },
  { id: 20, name: "I Love Mum and Dad (Poem)", type: "Course Book", term: "Term 2", assessment: "FA3", sessions: 3, plannedMonth: "November" },
  { id: 21, name: "The Parrot and the Fig Tree", type: "Course Book", term: "Term 2", assessment: "SA2", sessions: 4, plannedMonth: "December" },
  { id: 22, name: "Tale of Peter Rabbit", type: "Course Book", term: "Term 2", assessment: "SA2", sessions: 5, plannedMonth: "January" },
  { id: 23, name: "The Little Plant (Poem)", type: "Course Book", term: "Term 2", assessment: "SA2", sessions: 2, plannedMonth: "February" },
  { id: 24, name: "WS14 Doing Words", type: "Workbook", term: "Term 2", assessment: "FA3", sessions: 2, plannedMonth: "October" },
  { id: 25, name: "WS6 Describing Words", type: "Workbook", term: "Term 2", assessment: "FA3", sessions: 2, plannedMonth: "October" },
  { id: 26, name: "WS20 Joining Words", type: "Workbook", term: "Term 2", assessment: "FA3", sessions: 2, plannedMonth: "October" },
  { id: 27, name: "WS12 Possessive Adjectives", type: "Workbook", term: "Term 2", assessment: "SA2", sessions: 4, plannedMonth: "December" },
  { id: 28, name: "WS18 Question Words", type: "Workbook", term: "Term 2", assessment: "SA2", sessions: 2, plannedMonth: "December" },
  { id: 29, name: "WS17 Position Words", type: "Workbook", term: "Term 2", assessment: "SA2", sessions: 3, plannedMonth: "January" },
  { id: 30, name: "WS19 Present Simple", type: "Workbook", term: "Term 2", assessment: "SA2", sessions: 3, plannedMonth: "February" },
  { id: 31, name: "Completing a Rebus Story", type: "Writing", term: "Term 2", assessment: "FA3", sessions: 3, plannedMonth: "December" },
  { id: 32, name: "Describing a Picture", type: "Writing", term: "Term 2", assessment: "SA2", sessions: 3, plannedMonth: "February" }
];

export default function LessonPlan() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('today');
  const [unitsList, setUnitsList] = useState<Unit[]>(INITIAL_UNITS);

  const getSubjectProgress = (sp: SubjectPlan) => {
    const totalSubtopics = sp.chapters.reduce((sum, ch) => sum + ch.subtopics.length, 0);
    if (totalSubtopics === 0) return 0;
    const completedSubtopics = sp.chapters.reduce((sum, ch) => sum + ch.subtopics.filter(s => s.status === 'Completed').length, 0);
    return Math.round((completedSubtopics / totalSubtopics) * 100);
  };

  // --- DEMO TODAY AND CONFIGS (Part L) ---
  const TODAY = new Date("2025-09-20");

  const [bufferConfig, setBufferConfig] = useState<Record<string, number>>({
    June: 2, July: 2, August: 2, September: 0,
    October: 0, November: 2, December: 2,
    January: 2, February: 2, March: 0
  });

  const timetableSlots = {
    Monday: { period: 3, time: "10:30 AM" },
    Tuesday: { period: 1, time: "9:00 AM" },
    Wednesday: { period: 4, time: "11:30 AM" },
    Thursday: { period: 2, time: "9:45 AM" },
    Friday: { period: 1, time: "9:00 AM" },
    Saturday: { period: 3, time: "10:30 AM" }
  };

  const ctLogs: Record<string, Array<{ type: string; action: string; date: string; time: string; by: string; note?: string }>> = {
    "WS9 Personal Pronouns": [
      { type: "system", action: "Created", date: "01 Sep 2025", time: "09:00 AM", by: "System" },
      { type: "teacher", action: "Marked Partial", date: "18 Sep 2025", time: "11:20 AM",
        by: "Priya R", note: "2 of 3 sessions done" },
      { type: "teacher", action: "Updated", date: "20 Sep 2025", time: "09:15 AM",
        by: "Priya R", note: "3 of 3 sessions done" }
    ],
    "WS10 Am Is Are": [
      { type: "system", action: "Created", date: "01 Sep 2025", time: "09:00 AM", by: "System" },
      { type: "teacher", action: "Completed", date: "17 Sep 2025", time: "10:45 AM", by: "Priya R" }
    ],
    "WS28 Punctuation": [
      { type: "system", action: "Created", date: "01 Sep 2025", time: "09:00 AM", by: "System" },
      { type: "teacher", action: "Marked Partial", date: "19 Sep 2025", time: "11:00 AM",
        by: "Priya R", note: "2 of 3 sessions done" }
    ]
  };

  const [notifications, setNotifications] = useState([
    { id: 1, read: false, icon: "red-clock",
      title: "Pending CT update - Class 1A English",
      body: "2 sessions from 18 Sep and 19 Sep not marked.",
      time: "Today, 6:00 PM", action: "CT" },
    { id: 2, read: false, icon: "amber-warning",
      title: "SA1 in 10 days - 3 topics at risk",
      body: "WS9, WS28, Writing incomplete. SA1 on 30 Sep.",
      time: "Today, 8:00 AM", action: "EXAM" },
    { id: 3, read: true, icon: "blue-info",
      title: "Monthly Plan approved - August",
      body: "August MLP approved by VP on 01 Sep.",
      time: "01 Sep, 10:30 AM", action: "MLP" }
  ]);

  const alpLog = [
    { type: "create", action: "Created", date: "01 Jun 2025", time: "10:00 AM", by: "Priya R" },
    { type: "edit", action: "Unit Added", date: "03 Jun 2025", time: "02:30 PM",
      by: "Priya R", note: "Added WS28 Punctuation (SA1)" },
    { type: "edit", action: "Sessions Updated", date: "05 Jun 2025", time: "11:00 AM",
      by: "Priya R", note: "Red Raincoat: 4 to 5 sessions" },
    { type: "submit", action: "Submitted", date: "06 Jun 2025", time: "09:00 AM", by: "Priya R" },
    { type: "return", action: "Returned", date: "07 Jun 2025", time: "04:00 PM",
      by: "VP Anitha", note: "Add more writing units for SA1" },
    { type: "edit", action: "Unit Added", date: "08 Jun 2025", time: "10:15 AM",
      by: "Priya R", note: "Added Writing about Oneself" },
    { type: "submit", action: "Resubmitted", date: "08 Jun 2025", time: "10:30 AM", by: "Priya R" },
    { type: "approve", action: "Approved", date: "10 Jun 2025", time: "11:00 AM", by: "VP Anitha" }
  ];

  const [simulate6PM, setSimulate6PM] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [openLogRowId, setOpenLogRowId] = useState<number | null>(null);
  const [miniTimetableOpen, setMiniTimetableOpen] = useState(false);
  const [alpLogOpen, setAlpLogOpen] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Syllabus Plan Screen States
  const [selectedSyllabusSubject, setSelectedSyllabusSubject] = useState<string>("English");
  const [syllabusViewRole, setSyllabusViewRole] = useState<'teacher' | 'coordinator' | 'headmaster'>("teacher");
  const [authorizedRoles, setAuthorizedRoles] = useState<string[]>(['headmaster', 'coordinator']);
  const [reminderConfig, setReminderConfig] = useState({ staffDaysThreshold: 2 });
  const [escalationConfig, setEscalationConfig] = useState([
    { level: 1, role: 'Coordinator', daysAfterBuffer: 1, active: true },
    { level: 2, role: 'Vice Principal', daysAfterBuffer: 3, active: true },
    { level: 3, role: 'Principal', daysAfterBuffer: 5, active: true }
  ]);
  const [teacherSubView, setTeacherSubView] = useState<'builder' | 'marking'>('builder');
  const [newChapterName, setNewChapterName] = useState<string>("");
  const [newChapterPeriods, setNewChapterPeriods] = useState<number>(5);
  const [newChapterAssessment, setNewChapterAssessment] = useState<string>("FA1");
  const [newSubtopicName, setNewSubtopicName] = useState<Record<number, string>>({});
  const [syllabusInputMode, setSyllabusInputMode] = useState<'manual' | 'ai'>('manual');
  const [aiOutlineText, setAiOutlineText] = useState<string>("");
  const [aiTotalWeeks, setAiTotalWeeks] = useState<number>(16);
  const [aiPeriodsPerWeek, setAiPeriodsPerWeek] = useState<number>(5);
  const [aiFocusPath, setAiFocusPath] = useState<string>("Standard");
  const [aiSyncCalendar, setAiSyncCalendar] = useState<boolean>(true);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiGeneratedChapters, setAiGeneratedChapters] = useState<Chapter[] | null>(null);
  const [aiGenerationStep, setAiGenerationStep] = useState<string>("");
  const [subjectPlans, setSubjectPlans] = useState<SubjectPlan[]>([
    {
      subject: "English",
      teacher: "Priya R",
      progressPercent: 75,
      chapters: [
        {
          id: 1, name: "Welcome & Naming Words", plannedPeriods: 8, assessmentTag: "FA1",
          targetDate: "2025-06-25", targetDays: 8, bufferDays: 2,
          completionStatus: "Completed", actualDaysSpent: 8,
          subtopics: [
            { id: 101, name: "Introduction to Nouns", status: "Completed" },
            { id: 102, name: "Proper Nouns vs Common Nouns", status: "Completed" },
            { id: 103, name: "Singular & Plural Pronunciations", status: "Completed" }
          ]
        },
        {
          id: 2, name: "Personal Pronouns", plannedPeriods: 6, assessmentTag: "FA1",
          targetDate: "2025-07-20", targetDays: 6, bufferDays: 2,
          completionStatus: "Completed", actualDaysSpent: 6,
          subtopics: [
            { id: 104, name: "Use of He, She, It", status: "Completed" },
            { id: 105, name: "They, We, You exercises", status: "Completed" },
            { id: 106, name: "Workbook exercises on pronouns", status: "Completed" }
          ]
        },
        {
          id: 3, name: "Am, Is, Are Auxiliary Verbs", plannedPeriods: 5, assessmentTag: "SA1",
          targetDate: "2025-08-25", targetDays: 5, bufferDays: 2,
          completionStatus: "Completed", actualDaysSpent: 5,
          subtopics: [
            { id: 107, name: "Auxiliary verb rules", status: "Completed" },
            { id: 108, name: "Constructing simple sentences", status: "Completed" }
          ]
        },
        {
          id: 4, name: "Basic Punctuation", plannedPeriods: 4, assessmentTag: "SA1",
          targetDate: "2025-09-15", targetDays: 4, bufferDays: 2,
          completionStatus: "In Progress", actualDaysSpent: 3,
          subtopics: [
            { id: 109, name: "Capital Letters & Full Stops", status: "In Progress" },
            { id: 110, name: "Question Marks & Exclamations", status: "Planned" }
          ]
        },
        {
          id: 13, name: "Pronouns & Articles Exercise", plannedPeriods: 5, assessmentTag: "SA1",
          targetDate: "2025-09-19", targetDays: 5, bufferDays: 3,
          completionStatus: "In Progress", actualDaysSpent: 2,
          subtopics: [
            { id: 111, name: "Articles worksheets", status: "In Progress" }
          ]
        }
      ]
    },
    {
      subject: "Mathematics",
      teacher: "Rajesh K",
      progressPercent: 60,
      chapters: [
        {
          id: 5, name: "Shapes & Spatial Understanding", plannedPeriods: 10, assessmentTag: "FA1",
          targetDate: "2025-06-30", targetDays: 10, bufferDays: 3,
          completionStatus: "Completed", actualDaysSpent: 10,
          subtopics: [
            { id: 201, name: "Identifying 2D Shapes (Circle, Square, Triangle)", status: "Completed" },
            { id: 202, name: "Exploring 3D Shapes (Sphere, Cube, Cone)", status: "Completed" },
            { id: 203, name: "Rolling and Sliding concepts", status: "Completed" }
          ]
        },
        {
          id: 6, name: "Numbers 1 to 20", plannedPeriods: 12, assessmentTag: "SA1",
          targetDate: "2025-08-10", targetDays: 12, bufferDays: 3,
          completionStatus: "In Progress", actualDaysSpent: 8,
          subtopics: [
            { id: 204, name: "Counting objects", status: "Completed" },
            { id: 205, name: "Comparing quantities (More/Less)", status: "In Progress" },
            { id: 206, name: "Writing Number Names", status: "Planned" }
          ]
        },
        {
          id: 7, name: "Addition up to 9", plannedPeriods: 8, assessmentTag: "SA1",
          targetDate: "2025-09-18", targetDays: 8, bufferDays: 2,
          completionStatus: "Planned", actualDaysSpent: 0,
          subtopics: [
            { id: 207, name: "Concept of addition with objects", status: "Planned" },
            { id: 208, name: "Addition on the Number Line", status: "Planned" }
          ]
        }
      ]
    },
    {
      subject: "Science / EVS",
      teacher: "Sunitha S",
      progressPercent: 45,
      chapters: [
        {
          id: 8, name: "About Myself & My Body Parts", plannedPeriods: 6, assessmentTag: "FA1",
          targetDate: "2025-06-20", targetDays: 6, bufferDays: 2,
          completionStatus: "Completed", actualDaysSpent: 6,
          subtopics: [
            { id: 301, name: "Labeling external body parts", status: "Completed" },
            { id: 302, name: "Understanding Sensory Organs", status: "Completed" }
          ]
        },
        {
          id: 9, name: "My Family & Relationships", plannedPeriods: 8, assessmentTag: "SA1",
          targetDate: "2025-08-05", targetDays: 8, bufferDays: 2,
          completionStatus: "In Progress", actualDaysSpent: 4,
          subtopics: [
            { id: 303, name: "Nuclear vs Joint families", status: "In Progress" },
            { id: 304, name: "Roles of family members", status: "Planned" }
          ]
        },
        {
          id: 10, name: "Plants Around Us", plannedPeriods: 10, assessmentTag: "SA1",
          targetDate: "2025-09-14", targetDays: 10, bufferDays: 3,
          completionStatus: "Planned", actualDaysSpent: 0,
          subtopics: [
            { id: 305, name: "Types of plants (Trees, Shrubs, Herbs)", status: "Planned" },
            { id: 306, name: "Parts of a plant and photosynthesis basic", status: "Planned" }
          ]
        }
      ]
    },
    {
      subject: "Social Studies",
      teacher: "Anjali M",
      progressPercent: 30,
      chapters: [
        {
          id: 11, name: "Good Habits & Cleanliness", plannedPeriods: 5, assessmentTag: "FA1",
          targetDate: "2025-06-15", targetDays: 5, bufferDays: 2,
          completionStatus: "In Progress", actualDaysSpent: 3,
          subtopics: [
            { id: 401, name: "Daily hygiene routines", status: "Completed" },
            { id: 402, name: "Table manners and politeness", status: "In Progress" }
          ]
        },
        {
          id: 12, name: "Festivals of India", plannedPeriods: 8, assessmentTag: "SA1",
          targetDate: "2025-09-22", targetDays: 8, bufferDays: 3,
          completionStatus: "Planned", actualDaysSpent: 0,
          subtopics: [
            { id: 403, name: "National festivals (Republic Day, etc.)", status: "Planned" },
            { id: 404, name: "Religious festivals & cultural diversity", status: "Planned" }
          ]
        }
      ]
    }
  ]);

  // Today screen state
  const [todaySessionMarked, setTodaySessionMarked] = useState(false);

  // Configuration screen states
  const [configSetup, setConfigSetup] = useState({
    academicYear: '2025-26',
    board: 'CBSE',
    classVal: '1',
    section: 'A',
    subject: 'English',
    teacher: 'Priya R'
  });
  const [editingConfigField, setEditingConfigField] = useState<string | null>(null);
  const [tempConfigVal, setTempConfigVal] = useState('');

  const [assessments, setAssessments] = useState([
    { id: 'FA1', name: 'FA1', startDate: '2025-07-15', endDate: '2025-07-18', classes: 'All Classes' },
    { id: 'SA1', name: 'SA1', startDate: '2025-09-30', endDate: '2025-10-02', classes: 'All Classes' },
    { id: 'FA3', name: 'FA3', startDate: '2025-12-10', endDate: '2025-12-13', classes: 'All Classes' },
    { id: 'SA2', name: 'SA2', startDate: '2026-03-10', endDate: '2026-03-25', classes: 'All Classes' }
  ]);
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [tempAssessmentDates, setTempAssessmentDates] = useState({ startDate: '', endDate: '' });

  const [globalDefaultBuffer, setGlobalDefaultBuffer] = useState(2);
  
  // Notification Config toggles (Part G3)
  const [daily6PMToggle, setDaily6PMToggle] = useState(true);
  const [notifyTeacherToggle, setNotifyTeacherToggle] = useState(true);
  const [notifyCoordinator24h, setNotifyCoordinator24h] = useState(true);
  const [notifyVP48h, setNotifyVP48h] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelWhatsApp, setChannelWhatsApp] = useState(false);

  // MLP configured buffer inline stepper states
  const [isEditingMlpBuffer, setIsEditingMlpBuffer] = useState(false);
  const [tempBufferVal, setTempBufferVal] = useState(0);

  // Toast helper
  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast(prev => prev === msg ? null : prev);
    }, 2000);
  };

  // ── IRIS MENTOR AI PLAN GENERATION ENGINE ────────────────────
  const generateAiSyllabusPlan = (
    subject: string,
    outlineText: string,
    focus: string,
    totalWeeks: number,
    periodsPerWeek: number
  ) => {
    let chapterNames: string[] = [];
    if (outlineText && outlineText.trim()) {
      chapterNames = outlineText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }
    
    if (chapterNames.length === 0) {
      if (subject.toLowerCase().includes('math')) {
        chapterNames = [
          "Shapes & Spatial Orientation",
          "Number Sense & Place Value (1 to 100)",
          "Addition & Subtraction Foundations",
          "Patterns & Symmetry",
          "Introduction to Measurement",
          "Time, Calendars & Money Concepts",
          "Data Handling & Representation"
        ];
      } else if (subject.toLowerCase().includes('english')) {
        chapterNames = [
          "Welcome & Naming Words (Nouns)",
          "Pronouns & Action Verbs",
          "Basic Punctuation & Articles",
          "Vocabulary Building & Synonyms",
          "Simple Sentence Construction",
          "Reading Comprehension & Short Stories",
          "Poetry Recitation & Rhyming Patterns"
        ];
      } else if (subject.toLowerCase().includes('science')) {
        chapterNames = [
          "Living & Non-Living Things",
          "Plant Life Cycles & Structure",
          "Animals: Habitats & Feeding",
          "The Human Body & Five Senses",
          "Air, Water, and Weather Seasons",
          "Light, Sound, and Shadow Patterns",
          "Force, Motion & Simple Machines"
        ];
      } else {
        chapterNames = [
          "Unit 1: Fundamentals & Overview",
          "Unit 2: Core Concepts & Principles",
          "Unit 3: Intermediate Applications",
          "Unit 4: Advanced Problem Solving",
          "Unit 5: Case Studies & Project Work",
          "Unit 6: Semester Review & Final Assessment"
        ];
      }
    }

    const chapters: Chapter[] = [];
    const totalPeriods = totalWeeks * periodsPerWeek;
    const periodsPerChapter = Math.max(2, Math.floor(totalPeriods / chapterNames.length));
    let currentDate = new Date(2025, 5, 1); // 1 June 2025

    chapterNames.forEach((name, index) => {
      const chId = Date.now() + index;
      let subtopicNames: string[] = [];
      if (subject.toLowerCase().includes('math')) {
        subtopicNames = [
          `Introduction to ${name}`,
          `Core rules and operations for ${name}`,
          `Practical exercises and word problems`,
          `Concept check & classroom activity`
        ];
      } else {
        subtopicNames = [
          `Key concepts of ${name}`,
          `Detailed study and explanations`,
          `Workbook exercises and activities`,
          `Chapter summary and assessment`
        ];
      }

      const subtopics: Subtopic[] = subtopicNames.map((sName, sIdx) => ({
        id: chId * 10 + sIdx,
        name: sName,
        status: 'Planned'
      }));

      currentDate.setDate(currentDate.getDate() + 15 + Math.floor(index * 2));
      const formattedDate = currentDate.toISOString().split('T')[0];

      let assessment = 'Not Assessed';
      if (index < 2) assessment = 'FA1';
      else if (index < 4) assessment = 'SA1';
      else if (index < 6) assessment = 'FA3';
      else assessment = 'SA2';

      chapters.push({
        id: index + 100,
        name: name.includes(":") || name.toLowerCase().startsWith("chapter") || name.toLowerCase().startsWith("unit") ? name : `Chapter ${index + 1}: ${name}`,
        plannedPeriods: periodsPerChapter,
        subtopics,
        assessmentTag: assessment,
        targetDate: formattedDate,
        targetDays: periodsPerChapter,
        bufferDays: Math.floor(periodsPerChapter * 0.3),
        completionStatus: 'Planned',
        actualDaysSpent: 0
      });
    });

    return chapters;
  };

  const handleTriggerIrisGeneration = () => {
    setIsAiGenerating(true);
    setAiGenerationStep("Initializing Iris Mentor Planner Engine...");
    
    setTimeout(() => {
      setAiGenerationStep("Parsing input chapters & syllabus core topics...");
      setTimeout(() => {
        setAiGenerationStep("Syncing with Academic Calendar for holidays & Bagless days...");
        setTimeout(() => {
          setAiGenerationStep("Optimizing period distribution & setting buffer thresholds...");
          setTimeout(() => {
            const generated = generateAiSyllabusPlan(selectedSyllabusSubject, aiOutlineText, aiFocusPath, aiTotalWeeks, aiPeriodsPerWeek);
            setAiGeneratedChapters(generated);
            setIsAiGenerating(false);
            showToast("Syllabus generated successfully by Iris Mentor!");
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleApplyAiGeneratedPlan = () => {
    if (!aiGeneratedChapters) return;
    
    setSubjectPlans(prev => prev.map(sp => {
      if (sp.subject === selectedSyllabusSubject) {
        return {
          ...sp,
          chapters: aiGeneratedChapters,
          progressPercent: 0
        };
      }
      return sp;
    }));

    if (selectedSyllabusSubject === "English") {
      const newUnits: Unit[] = aiGeneratedChapters.map(ch => {
        let month = 'September';
        const term = ch.assessmentTag === 'FA3' || ch.assessmentTag === 'SA2' ? 'Term 2' : 'Term 1';
        if (term === 'Term 1') {
          month = ch.assessmentTag === 'FA1' ? 'June' : 'August';
        } else {
          month = ch.assessmentTag === 'FA3' ? 'October' : 'December';
        }
        return {
          id: ch.id,
          name: ch.name,
          type: "Course Book",
          term: term,
          assessment: (ch.assessmentTag || 'Not Assessed') as any,
          sessions: ch.plannedPeriods,
          plannedMonth: month
        };
      });
      setUnitsList(prev => [
        ...prev.filter(u => !u.name.toLowerCase().includes("noun") && !u.name.toLowerCase().includes("pronoun") && !u.name.toLowerCase().includes("auxiliary")),
        ...newUnits
      ]);
    }
    
    setAiGeneratedChapters(null);
    setAiOutlineText("");
    setSyllabusInputMode("manual");
    showToast(`Iris Mentor AI Planner applied to ${selectedSyllabusSubject}!`);
  };

  // Syllabus Plan Action Handlers
  const handleAddChapter = (subjectName: string) => {
    if (!newChapterName.trim()) {
      showToast("Chapter name cannot be empty");
      return;
    }
    const newId = Date.now();
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          const newChap: Chapter = {
            id: newId,
            name: newChapterName.trim(),
            plannedPeriods: newChapterPeriods,
            assessmentTag: newChapterAssessment,
            subtopics: []
          };
          return {
            ...p,
            chapters: [...p.chapters, newChap]
          };
        }
        return p;
      })
    );

    // Sync with unitsList if English
    if (subjectName === "English") {
      let month = 'September';
      const term = newChapterAssessment === 'FA3' || newChapterAssessment === 'SA2' ? 'Term 2' : 'Term 1';
      if (term === 'Term 1') {
        month = newChapterAssessment === 'FA1' ? 'June' : 'August';
      } else {
        month = newChapterAssessment === 'FA3' ? 'October' : 'December';
      }

      const newUnit: Unit = {
        id: newId,
        name: newChapterName.trim(),
        type: "Course Book",
        term: term,
        assessment: newChapterAssessment as any,
        sessions: newChapterPeriods,
        plannedMonth: month
      };
      setUnitsList(prev => [...prev, newUnit]);
    }

    setNewChapterName("");
    showToast(`Chapter "${newChapterName}" added successfully`);
  };

  const getChapterStatus = (chapter: Chapter, today: Date): 'completed' | 'on-track' | 'target-delay' | 'overdue' => {
    if (chapter.completionStatus === 'Completed') {
      return 'completed';
    }
    if (!chapter.targetDate) {
      return 'on-track';
    }
    const tDate = new Date(chapter.targetDate);
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetZero = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
    
    if (todayZero.getTime() <= targetZero.getTime()) {
      return 'on-track';
    }
    
    const buffer = chapter.bufferDays || 0;
    const bufferLimitDate = new Date(targetZero.getTime() + buffer * 24 * 60 * 60 * 1000);
    
    if (todayZero.getTime() <= bufferLimitDate.getTime()) {
      return 'target-delay';
    }
    return 'overdue';
  };

  const handleDeleteChapter = (subjectName: string, chapterId: number) => {
    // Sync with unitsList if English
    if (subjectName === "English") {
      const engPlan = subjectPlans.find(p => p.subject === "English");
      const chap = engPlan?.chapters.find(c => c.id === chapterId);
      if (chap) {
        setUnitsList(prev => prev.filter(u => u.name !== chap.name));
      }
    }

    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.filter(c => c.id !== chapterId)
          };
        }
        return p;
      })
    );
    showToast("Chapter removed");
  };

  const handleAddSubtopic = (subjectName: string, chapterId: number) => {
    const text = newSubtopicName[chapterId];
    if (!text || !text.trim()) {
      showToast("Subtopic name cannot be empty");
      return;
    }
    const newId = Date.now();
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                return {
                  ...c,
                  subtopics: [
                    ...c.subtopics,
                    { id: newId, name: text.trim(), status: 'Planned' }
                  ]
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
    setNewSubtopicName(prev => ({ ...prev, [chapterId]: "" }));
    showToast(`Subtopic "${text}" added`);
  };

  const handleDeleteSubtopic = (subjectName: string, chapterId: number, subtopicId: number) => {
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                return {
                  ...c,
                  subtopics: c.subtopics.filter(s => s.id !== subtopicId)
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
    showToast("Subtopic removed");
  };

  const handleToggleSubtopicStatus = (subjectName: string, chapterId: number, subtopicId: number) => {
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                return {
                  ...c,
                  subtopics: c.subtopics.map(s => {
                    if (s.id === subtopicId) {
                      const nextStatus = s.status === 'Completed' ? 'Planned' : s.status === 'In Progress' ? 'Completed' : 'In Progress';
                      return { ...s, status: nextStatus };
                    }
                    return s;
                  })
                };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const handleUpdateChapterTargets = (subjectName: string, chapterId: number, fields: { targetDate?: string, targetDays?: number, bufferDays?: number }) => {
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                return { ...c, ...fields };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const handleUpdateChapterStatus = (subjectName: string, chapterId: number, status: 'Planned' | 'In Progress' | 'Completed') => {
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                const updatedSub = status === 'Completed'
                  ? c.subtopics.map(s => ({ ...s, status: 'Completed' as const }))
                  : c.subtopics;
                return { ...c, completionStatus: status, subtopics: updatedSub };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  const handleUpdateChapterProgressDetails = (subjectName: string, chapterId: number, fields: { actualDaysSpent?: number, completionNotes?: string, completionEvidence?: string }) => {
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === subjectName) {
          return {
            ...p,
            chapters: p.chapters.map(c => {
              if (c.id === chapterId) {
                return { ...c, ...fields };
              }
              return c;
            })
          };
        }
        return p;
      })
    );
  };

  // Completed sessions tracking state (keys: unit.id, values: completed sessions)
  // pre-filled for June (100%), July (100%), August (87% - WS9: 3/4, Writing Rearranging: 2/3), September (WS10: 3/3, WS28: 2/3, WS9: 3/4)
  const [unitCompletions, setUnitCompletions] = useState<Record<number, number>>({
    1: 2,  // Welcome
    2: 5,  // Red Raincoat
    3: 7,  // Rani's First Day
    4: 5,  // The Blue Jackal
    5: 3,  // The Rainbow
    6: 2,  // WS1 Welcome
    7: 2,  // WS2 Naming Words
    8: 2,  // WS3 Common & Proper Nouns
    9: 2,  // WS4 Gender
    10: 3, // WS5 A An The
    11: 3, // WS7 One and Many
    12: 3, // WS9 Personal Pronouns (August: 3/4 completed)
    13: 3, // WS10 Am Is Are (September: 3/3 completed)
    14: 2, // WS28 Punctuation (September: 2/3 completed)
    15: 2, // Polite Expressions
    16: 2, // Writing about Oneself (Partially completed for SA1 readiness check: 2/4)
    17: 2, // Rearranging Words (August: 2/3 completed, September: 2 completed - 1 remaining)
  });

  // Track September curriculum tracker actions
  // Pre-filled with Sept ctMarks and actions.
  const [trackerDays, setTrackerDays] = useState<TrackerDay[]>([
    // Week 1
    { id: 1, date: "01 Sep", day: "Monday", type: "Teaching", topic: "WS9 Personal Pronouns", status: "Done", reason: "", inputVal: "", week: "Week 1", period: 3, teacherComment: "Explained personal pronouns using interactive charts.", evidenceType: "Classwork", evidenceDetails: "Workbook Exercises A & B" },
    { id: 2, date: "02 Sep", day: "Tuesday", type: "Teaching", topic: "WS9 Personal Pronouns", status: "Done", reason: "", inputVal: "", week: "Week 1", period: 1, teacherComment: "Completed singular vs plural pronouns discussion.", evidenceType: "Homework", evidenceDetails: "Pronoun Quiz Sheet 1" },
    { id: 3, date: "03 Sep", day: "Wednesday", type: "Teaching", topic: "WS9 Personal Pronouns", status: "Done", reason: "", inputVal: "", week: "Week 1", period: 4, teacherComment: "Conducted quick verbal drills in groups.", evidenceType: "None", evidenceDetails: "" },
    { id: 4, date: "04 Sep", day: "Thursday", type: "Teaching", topic: "WS9 Personal Pronouns", status: "Done", reason: "", inputVal: "", week: "Week 1", period: 2, teacherComment: "Finished the pronoun unit exercises.", evidenceType: "Classwork", evidenceDetails: "Grammar textbook page 22" },
    { id: 5, date: "05 Sep", day: "Friday", type: "Holiday", topic: "Teachers Day", status: "Holiday", reason: "", inputVal: "", week: "Week 1" },
    { id: 6, date: "06 Sep", day: "Saturday", type: "Holiday", topic: "Krishna Janmashtami", status: "Holiday", reason: "", inputVal: "", week: "Week 1" },

    // Week 2
    { id: 7, date: "08 Sep", day: "Monday", type: "Teaching", topic: "WS10 Am Is Are", status: "Done", reason: "", inputVal: "", week: "Week 2", period: 3 },
    { id: 8, date: "09 Sep", day: "Tuesday", type: "Teaching", topic: "WS10 Am Is Are", status: "Done", reason: "", inputVal: "", week: "Week 2", period: 1 },
    { id: 9, date: "10 Sep", day: "Wednesday", type: "Teaching", topic: "WS10 Am Is Are", status: "Done", reason: "", inputVal: "", week: "Week 2", period: 4 },
    { id: 10, date: "11 Sep", day: "Thursday", type: "Buffer", topic: "Buffer Class", status: "Buffer", reason: "", inputVal: "", week: "Week 2", period: 2 },
    { id: 11, date: "12 Sep", day: "Friday", type: "Teaching", topic: "WS28 Punctuation", status: "Done", reason: "", inputVal: "", week: "Week 2", period: 1 },
    { id: 12, date: "13 Sep", day: "Saturday", type: "Teaching", topic: "WS28 Punctuation", status: "Done", reason: "", inputVal: "", week: "Week 2", period: 3 },

    // Week 3
    { id: 13, date: "15 Sep", day: "Monday", type: "Teaching", topic: "WS28 Punctuation", status: "Done", reason: "", inputVal: "", week: "Week 3", period: 3 },
    { id: 14, date: "16 Sep", day: "Tuesday", type: "Holiday", topic: "Ganesha Festival", status: "Holiday", reason: "", inputVal: "", week: "Week 3" },
    { id: 15, date: "17 Sep", day: "Wednesday", type: "Teaching", topic: "WS9 Personal Pronouns (Carry Forward)", status: "Done", reason: "", inputVal: "", week: "Week 3", period: 4 },
    { id: 16, date: "18 Sep", day: "Thursday", type: "Teaching", topic: "WS28 Punctuation", status: "Partial", reason: "", inputVal: "2", week: "Week 3", period: 2 },
    { id: 17, date: "19 Sep", day: "Friday", type: "Teaching", topic: "WS9 Personal Pronouns", status: "Partial", reason: "", inputVal: "3", week: "Week 3", period: 1 },
    { id: 18, date: "20 Sep", day: "Saturday", type: "No Bag Day", topic: "Pick and Speak - sorting nouns activity", status: "No Bag Day", reason: "", inputVal: "", week: "Week 3", period: 3 },

    // Week 4
    { id: 19, date: "22 Sep", day: "Monday", type: "Teaching", topic: "Rearranging Words (Carry Forward)", status: "Partial", reason: "", inputVal: "1", week: "Week 4", period: 3 },
    { id: 20, date: "23 Sep", day: "Tuesday", type: "Revision", topic: "English Grammar Revision", status: "Revision", reason: "", inputVal: "", week: "Week 4" },
    { id: 21, date: "24 Sep", day: "Wednesday", type: "Revision", topic: "Sentence Structures Revision", status: "Revision", reason: "", inputVal: "", week: "Week 4" },
    { id: 22, date: "25 Sep", day: "Thursday", type: "Revision", topic: "Reading Book Practice", status: "Revision", reason: "", inputVal: "", week: "Week 4" },
    { id: 23, date: "26 Sep", day: "Friday", type: "Revision", topic: "Punctuation Drills", status: "Revision", reason: "", inputVal: "", week: "Week 4" },
    { id: 24, date: "27 Sep", day: "Saturday", type: "Buffer", topic: "Buffer Class", status: "Buffer", reason: "", inputVal: "", week: "Week 4" },

    // Exam Week
    { id: 25, date: "29 Sep", day: "Monday", type: "Event", topic: "Academic Prep Day", status: "Event", reason: "", inputVal: "", week: "Exam Week" },
    { id: 26, date: "30 Sep", day: "Tuesday", type: "Exam", topic: "SA1 English Exam", status: "Exam", reason: "", inputVal: "", week: "Exam Week" },
    { id: 27, date: "01 Oct", day: "Wednesday", type: "Exam", topic: "SA1 Mathematics Exam", status: "Exam", reason: "", inputVal: "", week: "Exam Week" },
    { id: 28, date: "02 Oct", day: "Thursday", type: "Exam", topic: "SA1 EVS Exam / Gandhi Jayanti", status: "Exam", reason: "", inputVal: "", week: "Exam Week" }
  ]);

  // Sidebar link tooltips states
  const [showCalendarTooltip, setShowCalendarTooltip] = useState(false);
  const [showTimetableTooltip, setShowTimetableTooltip] = useState(false);

  // Month selectors in MLP screen
  const [activeMlpMonth, setActiveMlpMonth] = useState('September');

  // ALP Edit Inline sessions states
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [editingSessionVal, setEditingSessionVal] = useState<string>('');

  // ALP Add Unit Drawer state
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitType, setNewUnitType] = useState<Unit['type']>('Course Book');
  const [newUnitTerm, setNewUnitTerm] = useState<Unit['term']>('Term 1');
  const [newUnitSessions, setNewUnitSessions] = useState(3);
  const [newUnitAssessment, setNewUnitAssessment] = useState<Unit['assessment']>('FA1');

  // ALP Filters tab
  const [alpFilter, setAlpFilter] = useState<'All' | 'Term 1' | 'Term 2'>('All');

  // CT Weeks Toggle States (for expanding)
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({
    'Week 1': false,
    'Week 2': false,
    'Week 3': true,
    'Week 4': false,
    'Exam Week': false
  });

  // Toggle Week Expand/Collapse
  const toggleWeek = (weekName: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekName]: !prev[weekName]
    }));
  };

  // Handler for CT Tracker Action Buttons
  const handleTrackerStatus = (dayId: number, newStatus: string) => {
    setTrackerDays(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          // If the day topic represents a specific unit, update unitCompletions too
          updateCompletionsFromTracker(day.topic, newStatus, day.inputVal);
          return {
            ...day,
            status: newStatus,
            // reset reason/input if status changed
            reason: newStatus === 'Skipped' ? day.reason || 'Holiday' : '',
            inputVal: newStatus === 'Partial' ? day.inputVal || '1' : ''
          };
        }
        return day;
      })
    );
  };

  const handleTrackerSkippedReason = (dayId: number, reason: string) => {
    setTrackerDays(prev =>
      prev.map(day => (day.id === dayId ? { ...day, reason } : day))
    );
  };

  const handleTrackerPartialInput = (dayId: number, val: string) => {
    setTrackerDays(prev =>
      prev.map(day => {
        if (day.id === dayId) {
          const numeric = parseInt(val) || 0;
          updateCompletionsFromTracker(day.topic, 'Partial', val);
          return { ...day, inputVal: val };
        }
        return day;
      })
    );
  };
  const handleTrackerComment = (dayId: number, comment: string) => {
    setTrackerDays(prev =>
      prev.map(day => (day.id === dayId ? { ...day, teacherComment: comment } : day))
    );
  };

  const handleTrackerEvidenceType = (dayId: number, type: string) => {
    setTrackerDays(prev =>
      prev.map(day => (day.id === dayId ? { ...day, evidenceType: type, evidenceDetails: type === 'None' ? '' : day.evidenceDetails } : day))
    );
  };

  const handleTrackerEvidenceDetails = (dayId: number, details: string) => {
    setTrackerDays(prev =>
      prev.map(day => (day.id === dayId ? { ...day, evidenceDetails: details } : day))
    );
  };

  // Helper to sync Tracker marking to the Unit completions state
  const updateCompletionsFromTracker = (topicName: string, status: string, partialVal: string) => {
    // Find matching unit in unitsList
    let normalizedTopic = topicName.replace(" (Carry Forward)", "");
    const matchingUnit = unitsList.find(u => u.name === normalizedTopic);
    if (!matchingUnit) return;

    let newCompletedSessions = matchingUnit.sessions;
    if (status === 'Partial') {
      newCompletedSessions = parseInt(partialVal) || 0;
    } else if (status === 'Skipped') {
      newCompletedSessions = 0;
    }

    setUnitCompletions(prev => ({
      ...prev,
      [matchingUnit.id]: Math.min(matchingUnit.sessions, newCompletedSessions)
    }));
  };

  // -----------------------------------------------------------------------------
  // CALCULATION LOGIC
  // -----------------------------------------------------------------------------

  // periodsPerWeek for English is 6
  const periodsPerWeek = 6;

  // Calculate stats for each month
  const getMonthCalculations = (monthName: string) => {
    const calendarMonth = academicCalendar.months.find(m => m.month === monthName);
    if (!calendarMonth) {
      return {
        effectiveDays: 0,
        sessionsAvailable: 0,
        plannedSessions: 0,
        completedSessions: 0,
        bufferSessions: 0,
        bufferStatus: "No Buffer" as const,
        coveragePercent: 0,
        carryoverSessions: 0
      };
    }

    const { workingDays, examDays, ptmDays, eventDays, revisionDays = 0 } = calendarMonth;
    const effectiveDays = workingDays - examDays - ptmDays - eventDays - revisionDays;
    const sessionsAvailable = Math.floor((effectiveDays * periodsPerWeek) / 5);

    // Sum planned sessions of units allocated to this month
    const plannedUnits = unitsList.filter(u => u.plannedMonth === monthName);
    const plannedSessions = plannedUnits.reduce((acc, curr) => acc + curr.sessions, 0);

    // Sum completed sessions for units allocated to this month
    const completedSessions = plannedUnits.reduce((acc, curr) => {
      const comp = unitCompletions[curr.id] !== undefined ? unitCompletions[curr.id] : 0;
      return acc + comp;
    }, 0);

    // Buffer calculation based on config (Part J1)
    const configuredBuffer = bufferConfig[monthName] !== undefined ? bufferConfig[monthName] : 2;
    const sessionsPlanned = monthName === 'September' ? 12 : plannedSessions;
    const bufferSessions = sessionsAvailable - sessionsPlanned - configuredBuffer;
    
    // Status color ranges: >= 2 is Safe, 1 is Tight, <= 0 is No Buffer
    const bufferStatus = bufferSessions >= 2 ? "Safe" : bufferSessions === 1 ? "Tight" : "No Buffer";

    // Coverage Percent
    const coveragePercent = plannedSessions > 0 ? Math.round((completedSessions / plannedSessions) * 100) : 0;

    // Carryover calculation
    const carryoverSessions = Math.max(0, plannedSessions - completedSessions);

    return {
      effectiveDays,
      sessionsAvailable,
      plannedSessions: sessionsPlanned, // return active planned sessions count
      completedSessions,
      bufferSessions,
      bufferStatus,
      coveragePercent,
      carryoverSessions
    };
  };

  // Helper to parse tracker date string e.g. "01 Sep" to a Date object
  const parseDateStr = (dateStr: string) => {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length < 2) return new Date();
    const day = parseInt(parts[0]) || 1;
    const monthStr = parts[1];
    
    const monthsMap: Record<string, number> = {
      June: 5, July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
      January: 0, February: 1, March: 2,
      Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
      Jan: 0, Feb: 1, Mar: 2
    };
    
    const month = monthsMap[monthStr] !== undefined ? monthsMap[monthStr] : 8;
    const year = month >= 5 ? 2025 : 2026;
    return new Date(year, month, day);
  };

  // getDayStatus for tracker execution logic (Part F1)
  const getDayStatus = (teachingDate: string, currentStatus: string) => {
    const rowDate = parseDateStr(teachingDate);
    const diff = Math.floor((TODAY.getTime() - rowDate.getTime()) / 86400000);
    if (currentStatus === "Done") return "completed";
    if (diff > 0) return "overdue";       // past today, not marked Done
    if (diff === 0) return "due-today";   // today, not yet marked Done
    return "upcoming";                    // future date
  };

  // Pre-calculate stats for current September active view
  const septCalc = getMonthCalculations('September');

  // Let's manually calculate SA1 Readiness based on the approved 14 SA1 readiness topics
  // Total SA1 readiness topics: 14. Completed: 10.
  // 10 Completed: Welcome, Red Raincoat, WS1, WS2, Rani's First Day, The Blue Jackal, The Rainbow Poem, WS5, WS7, WS10
  // 4 Incomplete: WS9, WS28, Writing about Oneself, Rearranging Words
  const getSA1ReadinessStats = () => {
    // We calculate these dynamically based on unitCompletions to keep it true to state
    // We match the 10 SA1 units + 4 selected FA1 units (Welcome, Red Raincoat, WS1, WS2)
    const sa1UnitIds = [3, 4, 5, 10, 11, 12, 13, 14, 16, 17, 1, 2, 6, 7];
    const totalSA1Topics = sa1UnitIds.length;
    
    let completedSA1Topics = 0;
    let sessionsRemaining = 0;
    
    const completedList: Unit[] = [];
    const incompleteList: { unit: Unit; remaining: number }[] = [];

    unitsList.forEach(unit => {
      if (sa1UnitIds.includes(unit.id)) {
        const completed = unitCompletions[unit.id] !== undefined ? unitCompletions[unit.id] : 0;
        const isDone = completed >= unit.sessions;
        if (isDone) {
          completedSA1Topics++;
          completedList.push(unit);
        } else {
          const remaining = Math.max(0, unit.sessions - completed);
          sessionsRemaining += remaining;
          incompleteList.push({ unit, remaining });
        }
      }
    });

    const readinessPercent = totalSA1Topics > 0 ? Math.round((completedSA1Topics / totalSA1Topics) * 100) : 0;

    return {
      readinessPercent,
      completedSA1Topics,
      totalSA1Topics,
      sessionsRemaining,
      daysUntilSA1: 12, // Pre-filled date demo difference between Sept 18 & Sept 30
      completedList,
      incompleteList
    };
  };

  const sa1Stats = getSA1ReadinessStats();

  // Handlers for Screen 2 (ALP) Actions
  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;

    // Determine an appropriate month for the new unit based on term and current counts
    let month = 'September';
    if (newUnitTerm === 'Term 1') {
      month = newUnitAssessment === 'FA1' ? 'June' : 'August';
    } else {
      month = newUnitAssessment === 'FA3' ? 'October' : 'December';
    }

    const newUnit: Unit = {
      id: Math.max(...unitsList.map(u => u.id)) + 1,
      name: newUnitName,
      type: newUnitType,
      term: newUnitTerm,
      assessment: newUnitAssessment,
      sessions: newUnitSessions,
      plannedMonth: month
    };

    setUnitsList(prev => [...prev, newUnit]);

    // Sync to English subjectPlan
    setSubjectPlans(prev =>
      prev.map(p => {
        if (p.subject === "English") {
          if (p.chapters.some(c => c.name === newUnit.name)) return p;
          const newChap: Chapter = {
            id: newUnit.id,
            name: newUnit.name,
            plannedPeriods: newUnit.sessions,
            assessmentTag: newUnit.assessment,
            subtopics: [
              { id: Date.now() + 1, name: "Core Concept", status: "Planned" },
              { id: Date.now() + 2, name: "Practice Exercises", status: "Planned" }
            ]
          };
          return {
            ...p,
            chapters: [...p.chapters, newChap]
          };
        }
        return p;
      })
    );

    setIsAddDrawerOpen(false);
    setNewUnitName('');
  };

  const handleDeleteUnit = (id: number) => {
    const unitToDelete = unitsList.find(u => u.id === id);
    if (unitToDelete) {
      setSubjectPlans(prev =>
        prev.map(p => {
          if (p.subject === "English") {
            return {
              ...p,
              chapters: p.chapters.filter(c => c.name !== unitToDelete.name)
            };
          }
          return p;
        })
      );
    }

    setUnitsList(prev => prev.filter(u => u.id !== id));
    setUnitCompletions(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleStartEditing = (unitId: number, currentSessions: number) => {
    setEditingUnitId(unitId);
    setEditingSessionVal(currentSessions.toString());
  };

  const handleSaveSessions = (unitId: number) => {
    const parsed = parseInt(editingSessionVal);
    if (!isNaN(parsed) && parsed > 0) {
      setUnitsList(prev =>
        prev.map(u => (u.id === unitId ? { ...u, sessions: parsed } : u))
      );

      // Sync back to subjectPlans for English
      const updatedUnit = unitsList.find(u => u.id === unitId);
      if (updatedUnit) {
        setSubjectPlans(prev =>
          prev.map(p => {
            if (p.subject === "English") {
              return {
                ...p,
                chapters: p.chapters.map(c =>
                  c.name === updatedUnit.name ? { ...c, plannedPeriods: parsed } : c
                )
              };
            }
            return p;
          })
        );
      }
    }
    setEditingUnitId(null);
  };

  // Reminders & Escalations calculation
  const activeReminders: Array<{ subject: string; teacher: string; chapterName: string; targetDate: string; daysPast: number }> = [];
  const activeEscalations: Array<{ subject: string; teacher: string; chapterName: string; bufferDate: string; level: number; escalatedTo: string; daysOverdue: number }> = [];

  subjectPlans.forEach(sp => {
    sp.chapters.forEach(ch => {
      if (ch.completionStatus !== 'Completed' && ch.targetDate) {
        const tDate = new Date(ch.targetDate);
        const diffTime = TODAY.getTime() - tDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Reminders trigger if past targetDate by at least staffDaysThreshold
        if (diffDays >= reminderConfig.staffDaysThreshold) {
          activeReminders.push({
            subject: sp.subject,
            teacher: sp.teacher,
            chapterName: ch.name,
            targetDate: ch.targetDate,
            daysPast: diffDays
          });
        }

        // Escalations trigger if past targetDate + bufferDays
        const buffer = ch.bufferDays || 0;
        const bufferTime = tDate.getTime() + (buffer * 24 * 60 * 60 * 1000);
        const diffBufferTime = TODAY.getTime() - bufferTime;
        const diffBufferDays = Math.floor(diffBufferTime / (1000 * 60 * 60 * 24));

        if (diffBufferDays >= 0) {
          escalationConfig.forEach(esc => {
            if (esc.active && diffBufferDays >= esc.daysAfterBuffer) {
              activeEscalations.push({
                subject: sp.subject,
                teacher: sp.teacher,
                chapterName: ch.name,
                bufferDate: new Date(bufferTime).toISOString().split('T')[0],
                level: esc.level,
                escalatedTo: esc.role,
                daysOverdue: diffBufferDays
              });
            }
          });
        }
      }
    });
  });

  // Group units for ALP view
  const groupedUnits = {
    "Term 1 - FA1": unitsList.filter(u => u.term === 'Term 1' && u.assessment === 'FA1'),
    "Term 1 - SA1": unitsList.filter(u => u.term === 'Term 1' && u.assessment === 'SA1'),
    "Term 2 - FA3": unitsList.filter(u => u.term === 'Term 2' && u.assessment === 'FA3'),
    "Term 2 - SA2": unitsList.filter(u => u.term === 'Term 2' && u.assessment === 'SA2'),
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-slate-800 flex flex-col font-sans select-none antialiased">
      
      {/* -----------------------------------------------------------------------
          TOPBAR Component (Fixed height 52px, navy bg)
          ----------------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 h-[52px] bg-[#000099] text-white flex items-center justify-between px-6 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-2 py-0.5 rounded-[4px] shadow-sm">
            <span className="text-[#000099] font-black tracking-tight text-xs">edu</span>
          </div>
          <span className="text-[#FF9A01] font-black tracking-tight text-sm">merge</span>
          <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider ml-1 border-l border-white/20 pl-2">School ERP</span>
        </div>

        <div className="flex items-center gap-2">
          <School className="w-4.5 h-4.5 text-[#FF9A01]" />
          <span className="text-sm font-semibold tracking-wide">Lesson Plan Module</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white/80 text-[11px] font-medium hidden lg:inline bg-white/10 px-2.5 py-1 rounded-full">
            Navkis Educational Centre, Bengaluru | 2025-26
          </span>
          
          {/* Notification bell icon (Part G1) */}
          <div className="relative">
            <button 
              onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors relative flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-white" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[8px] font-black leading-none border border-[#000099]">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Dropdown panel */}
            {notificationPanelOpen && (
              <>
                {/* Click outside overlay */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationPanelOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E0D8] rounded-[10px] shadow-2xl z-50 text-slate-800 py-2">
                  <div className="px-4 py-2 border-b border-[#E2E0D8] flex items-center justify-between text-xs font-bold">
                    <span className="text-[#000099]">Notifications</span>
                    <button 
                      onClick={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        showToast("All marked as read");
                      }}
                      className="text-[#FF9A01] hover:text-[#e08800] text-[10px] font-black underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E0D8]">
                    {notifications.map(n => {
                      let IconComponent = Info;
                      let iconColor = 'text-blue-600 bg-blue-50';
                      if (n.icon === 'red-clock') {
                        IconComponent = Clock;
                        iconColor = 'text-red-600 bg-red-50';
                      } else if (n.icon === 'amber-warning') {
                        IconComponent = AlertTriangle;
                        iconColor = 'text-amber-600 bg-amber-50';
                      }
                      
                      return (
                        <div 
                          key={n.id}
                          onClick={() => {
                            // Mark single notification as read
                            setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                            setNotificationPanelOpen(false);
                            
                            // Route based on action
                            if (n.action === 'CT') {
                              setCurrentScreen('ct');
                              setExpandedWeeks(prev => ({ ...prev, 'Week 3': true }));
                            } else if (n.action === 'EXAM') {
                              setCurrentScreen('exam_check');
                            } else if (n.action === 'MLP') {
                              setCurrentScreen('mlp');
                            }
                          }}
                          className={`p-3 flex gap-3 cursor-pointer transition-colors hover:bg-[#F8F8F6] ${
                            n.read 
                              ? 'bg-[#F8F8F6] text-slate-500' 
                              : 'bg-white border-l-2 border-l-[#000099]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <h4 className={`text-xs text-slate-800 leading-tight ${!n.read ? 'font-bold' : 'font-medium'}`}>
                              {n.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                              {n.body}
                            </p>
                            <span className="text-[9px] text-slate-400 font-semibold block pt-0.5">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-[#FF9A01] text-white flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-all">
            PR
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[52px]">
        {/* -----------------------------------------------------------------------
            SIDEBAR Component (Fixed width 232px, white bg)
            ----------------------------------------------------------------------- */}
        <aside className="w-[232px] fixed left-0 top-[52px] bottom-0 z-40 bg-white border-r border-[#E2E0D8] flex flex-col justify-between p-4">
          
          <div className="space-y-6">
            {/* School context at top */}
            <div className="p-3.5 bg-[#F8F8F6] rounded-[10px] border border-[#E2E0D8] flex items-center gap-3">
              <div className="p-2 bg-[#000099]/10 rounded-[6px]">
                <Building className="w-4.5 h-4.5 text-[#000099]" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Active Class</span>
                <span className="text-xs font-bold text-[#000099] truncate block leading-tight">Class 1A | English</span>
                <span className="text-[10px] text-slate-500 font-semibold truncate block mt-0.5">Teacher: Priya R</span>
              </div>
            </div>

            {/* Navigation links (Part M) */}
            <nav className="space-y-1">
              {[
                { id: 'today', label: 'Today', icon: Clock },
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'coverage', label: 'Coverage', icon: LayoutGrid },
                { id: 'syllabus', label: 'Syllabus Plan', icon: Library },
                { id: 'alp', label: 'Annual Plan', icon: Calendar },
                { id: 'mlp', label: 'Monthly Plan', icon: BookOpen },
                { id: 'ct', label: 'Daily Tracker', icon: CheckSquare },
                { id: 'exam_check', label: 'Exam Check', icon: AlertTriangle },
                { id: 'alerts', label: 'Alerts', icon: AlertCircle }
              ].map(item => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                
                // Part M Today active orange accent
                let activeClass = 'bg-[#000099] text-white border-l-[4px] border-[#FF9A01] shadow-md shadow-blue-900/10';
                if (item.id === 'today' && isActive) {
                  activeClass = 'bg-[#FF9A01] text-white border-l-[4px] border-[#000099] shadow-md shadow-orange-500/10';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id as ScreenView)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? activeClass
                        : 'text-slate-600 hover:bg-[#F8F8F6] hover:text-[#000099]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? (item.id === 'today' ? 'text-white' : 'text-[#FF9A01]') : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    
                    {/* Alerts badge "3" (Part M) */}
                    {item.id === 'alerts' && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        3
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Divider before Configuration (Part M) */}
              <div className="border-t border-[#E2E0D8] my-2"></div>
              
              {(() => {
                const isActive = currentScreen === 'configuration';
                return (
                  <button
                    onClick={() => setCurrentScreen('configuration')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#000099] text-white border-l-[4px] border-[#FF9A01] shadow-md shadow-blue-900/10'
                        : 'text-slate-600 hover:bg-[#F8F8F6] hover:text-[#000099]'
                    }`}
                  >
                    <Settings className={`w-4 h-4 ${isActive ? 'text-[#FF9A01]' : 'text-slate-400'}`} />
                    <span>Configuration</span>
                  </button>
                );
              })()}
            </nav>
          </div>

          {/* Read-only links at the bottom with Tooltips */}
          <div className="space-y-1 border-t border-[#E2E0D8] pt-3">
            
            {/* Academic Calendar Link */}
            <div 
              className="relative group p-3 rounded-[10px] text-xs text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-[#E2E0D8] transition-all"
              onMouseEnter={() => setShowCalendarTooltip(true)}
              onMouseLeave={() => setShowCalendarTooltip(false)}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Academic Calendar</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              {showCalendarTooltip && (
                <div className="absolute left-[220px] top-1/2 -translate-y-1/2 bg-[#000099] text-white text-[11px] py-1.5 px-3 rounded-[6px] shadow-lg z-50 whitespace-nowrap">
                  Managed in Academic Calendar module.
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#000099]"></div>
                </div>
              )}
            </div>

            {/* Timetable Link */}
            <div 
              className="relative group p-3 rounded-[10px] text-xs text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between border border-transparent hover:border-[#E2E0D8] transition-all"
              onMouseEnter={() => setShowTimetableTooltip(true)}
              onMouseLeave={() => setShowTimetableTooltip(false)}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Timetable</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              {showTimetableTooltip && (
                <div className="absolute left-[220px] top-1/2 -translate-y-1/2 bg-[#000099] text-white text-[11px] py-1.5 px-3 rounded-[6px] shadow-lg z-50 whitespace-nowrap">
                  Managed in Timetable module.
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#000099]"></div>
                </div>
              )}
            </div>

          </div>

        </aside>

        {/* -----------------------------------------------------------------------
            CONTENT AREA (Scrollable, padded, starts after sidebar)
            ----------------------------------------------------------------------- */}
        <main className="flex-1 ml-[232px] p-6 overflow-y-auto max-w-[1048px] mx-auto w-full">

          {/* ===================================================================
              SCREEN 7: Today's View (Teacher View - Part F2 & H3)
              =================================================================== */}
          {currentScreen === 'today' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                    Today's Agenda
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Saturday, 20 Sep 2025 | Class 1A English
                  </p>
                </div>
                
                {/* Simulate 6 PM Toggle */}
                <div className="flex items-center gap-2 bg-white border border-[#E2E0D8] px-3 py-1.5 rounded-[10px] shadow-sm select-none">
                  <span className="text-[11px] font-bold text-slate-600">Simulate 6 PM</span>
                  <button 
                    onClick={() => setSimulate6PM(!simulate6PM)}
                    className={`w-9 h-5.5 rounded-full p-0.5 transition-colors relative focus:outline-none cursor-pointer ${
                      simulate6PM ? 'bg-red-600' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                      simulate6PM ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Today Card and Deadline Strip (Part F2) */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Today Card Content */}
                <div className="p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#000099]/10 text-[#000099] rounded-[8px] shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px] font-black uppercase text-slate-500">
                          Period 3 • 10:30 AM
                        </span>
                        
                        {/* Overdue Badge if unmarked after 6 PM */}
                        {!todaySessionMarked && simulate6PM && (
                          <span className="text-[9px] bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-[4px] font-black uppercase tracking-wider animate-pulse">
                            Overdue
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-sm font-bold text-slate-800">
                        Pick and Speak - sorting nouns activity
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        Subject: English (No Bag Day Activity) | Teacher: Priya R
                      </p>
                    </div>
                  </div>

                  {/* Mark Action Button */}
                  <div>
                    {todaySessionMarked ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                        <Check className="w-4 h-4 stroke-[3]" /> Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setTodaySessionMarked(true);
                          showToast("Today's session marked completed");
                        }}
                        className="bg-[#FF9A01] hover:bg-[#e08800] text-white text-xs font-bold px-4 py-2 rounded-[8px] shadow-sm hover:scale-105 transition-all cursor-pointer"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>

                {/* Deadline Strip Banner */}
                {(() => {
                  if (todaySessionMarked) {
                    return (
                      <div className="bg-emerald-50 border-t border-emerald-200 text-emerald-800 px-5 py-3 text-xs font-bold flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Today's session marked. You're up to date.</span>
                      </div>
                    );
                  } else if (simulate6PM) {
                    return (
                      <div className="bg-red-50 border-t border-red-200 text-red-800 px-5 py-3 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Today's deadline passed. Session marked as overdue.</span>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-amber-50 border-t border-amber-200 text-amber-800 px-5 py-3 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Mark today's session before 6:00 PM to avoid a late notification.</span>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Coming up this week (Part H3) */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                  Coming up this week
                </h3>
                
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] divide-y divide-[#E2E0D8]">
                  {[
                    { date: "22 Sep", day: "Monday", time: "P3 • 10:30 AM", topic: "Rearranging Words (Carry Forward)", type: "Teaching", badge: "bg-blue-50 text-blue-700 border-blue-200" },
                    { date: "23 Sep", day: "Tuesday", time: "P1 • 9:00 AM", topic: "English Grammar Revision", type: "Revision", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                    { date: "24 Sep", day: "Wednesday", time: "P4 • 11:30 AM", topic: "Sentence Structures Revision", type: "Revision", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                    { date: "25 Sep", day: "Thursday", time: "P2 • 9:45 AM", topic: "Reading Book Practice", type: "Revision", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" }
                  ].map((upcoming, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-16">
                          <span className="font-bold text-slate-800 block">{upcoming.date}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">{upcoming.day.substring(0, 3)}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-[4px] border text-[9px] font-bold ${upcoming.badge}`}>
                          {upcoming.type}
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block">{upcoming.topic}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{upcoming.time}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setCurrentScreen('ct');
                          setExpandedWeeks(prev => ({ ...prev, 'Week 4': true }));
                        }}
                        className="text-[#000099] hover:text-blue-900 font-bold hover:underline cursor-pointer"
                      >
                        Go to CT
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => setMiniTimetableOpen(true)}
                    className="text-[#FF9A01] hover:text-[#e08800] text-xs font-bold underline cursor-pointer flex items-center gap-1.5"
                  >
                    View Full Timetable
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              SCREEN 1: Overview (Principal View - DEFAULT LANDING)
              =================================================================== */}
          {currentScreen === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Headings */}
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Academic Overview, Class 1A English | 2025-26
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Navkis Educational Centre | Teacher: Priya R
                </p>
              </div>

              {/* 4 Stat cards in a row */}
              <div className="grid grid-cols-4 gap-4">
                
                <div className="bg-[#000099] text-white p-4 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E0D8]/20 flex flex-col justify-between">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Sessions Available</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#FF9A01]">{septCalc.sessionsAvailable}</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase">Periods</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold block mt-1">Calculated for September</span>
                </div>

                <div className="bg-[#000099] text-white p-4 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E0D8]/20 flex flex-col justify-between">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Sessions Planned</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#FF9A01]">12</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase">Periods</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold block mt-1">Syllabus allocated</span>
                </div>

                <div className="bg-[#000099] text-white p-4 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E0D8]/20 flex flex-col justify-between">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Sessions Completed</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#FF9A01]">8</span>
                    <span className="text-[10px] text-white/50 font-bold uppercase">Periods</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold block mt-1">Excludes revision periods</span>
                </div>

                <div className="bg-[#000099] text-white p-4 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E0D8]/20 flex flex-col justify-between">
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Coverage This Month</span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#FF9A01]">73%</span>
                  </div>
                  <span className="text-[10px] text-white/40 font-semibold block mt-1">Target progress tracker</span>
                </div>

              </div>

              {/* Exam Readiness Card */}
              <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FF9A01]" />
                    <span className="text-xs font-bold text-[#000099] uppercase tracking-wide">Exam Readiness Status</span>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    sa1Stats.readinessPercent > 80 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : sa1Stats.readinessPercent >= 60 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {sa1Stats.readinessPercent}% Ready
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>SA1 Readiness</span>
                    <span>{sa1Stats.completedSA1Topics} of {sa1Stats.totalSA1Topics} Topics Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3.5 border border-slate-200/50 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        sa1Stats.readinessPercent > 80 
                          ? 'bg-emerald-500' 
                          : sa1Stats.readinessPercent >= 60 
                            ? 'bg-[#FF9A01]' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${sa1Stats.readinessPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    Evaluates all CBSE Term 1 (FA1 and SA1) English lesson plan completions.
                  </p>
                </div>
              </div>

              {/* Monthly Status Strip */}
              <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <h3 className="text-xs font-bold text-[#000099] uppercase tracking-wide mb-3">
                  Monthly Curriculum Coverage
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { month: "June", val: "100%", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { month: "July", val: "100%", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { month: "August", val: "87%", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                    { month: "September", val: "73%", style: "bg-amber-50 text-amber-700 border-amber-200" },
                    { month: "October", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" },
                    { month: "November", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" },
                    { month: "December", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" },
                    { month: "January", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" },
                    { month: "February", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" },
                    { month: "March", val: "Upcoming", style: "bg-slate-50 text-slate-500 border-slate-200" }
                  ].map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-1 min-w-[80px] text-center border p-2.5 rounded-[8px] flex flex-col justify-between h-16 ${m.style}`}
                    >
                      <span className="text-[10px] font-bold block">{m.month}</span>
                      <span className="text-xs font-black block mt-1.5">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buffer Status Table */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="p-4 border-b border-[#E2E0D8] bg-slate-50/50">
                  <h3 className="text-xs font-bold text-[#000099] uppercase tracking-wide">
                    Academic Year Session Buffer Details
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                        <th className="py-3 px-4 font-bold uppercase tracking-wider">Month</th>
                        <th className="py-3 px-3 text-center font-bold uppercase tracking-wider">Working Days</th>
                        <th className="py-3 px-3 text-center font-bold uppercase tracking-wider">Effective Days</th>
                        <th className="py-3 px-3 text-center font-bold uppercase tracking-wider">Sessions Available</th>
                        <th className="py-3 px-3 text-center font-bold uppercase tracking-wider">Sessions Planned</th>
                        <th className="py-3 px-3 text-center font-bold uppercase tracking-wider">Buffer</th>
                        <th className="py-3 px-4 text-center font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E0D8]">
                      {[
                        { month: "June", working: 19, eff: 18, avail: 21, planned: 17, buf: 4, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "July", working: 23, eff: 20, avail: 24, planned: 17, buf: 7, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "August", working: 19, eff: 18, avail: 21, planned: 15, buf: 6, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "September", working: 20, eff: 11, avail: 13, planned: 13, buf: 0, stat: "No Buffer", col: "text-red-700 bg-red-50 border-red-100", highlight: true },
                        { month: "October", working: 13, eff: 9, avail: 10, planned: 10, buf: 0, stat: "No Buffer", col: "text-red-700 bg-red-50 border-red-100" },
                        { month: "November", working: 18, eff: 13, avail: 15, planned: 8, buf: 7, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "December", working: 17, eff: 16, avail: 19, planned: 11, buf: 8, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "January", working: 18, eff: 16, avail: 19, planned: 10, buf: 9, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "February", working: 20, eff: 20, avail: 24, planned: 8, buf: 16, stat: "Safe", col: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                        { month: "March", working: 20, eff: 9, avail: 10, planned: 10, buf: 0, stat: "No Buffer", col: "text-red-700 bg-red-50 border-red-100" }
                      ].map((row, idx) => (
                        <tr 
                          key={idx} 
                          className={`hover:bg-slate-50/50 transition-colors ${
                            row.highlight ? 'bg-red-50 hover:bg-red-100/50 font-bold border-l-4 border-red-600' : ''
                          }`}
                        >
                          <td className="py-2.5 px-4 font-bold text-[#000099]">{row.month}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">{row.working}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">{row.eff}</td>
                          <td className="py-2.5 px-3 text-center text-slate-700 font-bold">{row.avail}</td>
                          <td className="py-2.5 px-3 text-center text-slate-700 font-bold">{row.planned}</td>
                          <td className="py-2.5 px-3 text-center text-slate-800 font-black">{row.buf}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.col}`}>
                              {row.stat}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              SCREEN 2: Annual Lesson Plan (ALP)
              =================================================================== */}
          {currentScreen === 'alp' && (
            <div className="space-y-6 animate-fadeIn relative">
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                    Annual Lesson Plan, Class 1A English | 2025-26
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    CBSE Syllabus Course Book, Workbook, and Writing allocations.
                  </p>
                </div>
                
                <div className="bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg select-none">
                  Read-Only View
                </div>
              </div>

              {/* ALP Status Bar (Part F3 & I2) */}
              <div className="bg-white border border-[#E2E0D8] p-3.5 rounded-[10px] shadow-sm flex items-center justify-between text-xs flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">
                    Draft
                  </span>
                  
                  {/* Submission Overdue Badge since current month is Sept past June */}
                  <span className="bg-[#FEE2E2] text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-black uppercase text-[9px] tracking-wider animate-pulse">
                    Submission Overdue
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAlpLogOpen(true)}
                    className="text-slate-400 hover:text-slate-600 font-bold underline cursor-pointer"
                  >
                    View History
                  </button>
                </div>
              </div>

              {/* Filters & Tabs */}
              <div className="flex border-b border-[#E2E0D8]">
                {['All', 'Term 1', 'Term 2'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAlpFilter(tab as any)}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all -mb-[2px] ${
                      alpFilter === tab
                        ? 'border-[#000099] text-[#000099]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab} {tab === 'All' ? 'Units' : ''}
                  </button>
                ))}
              </div>

              {/* Grouped Unit List */}
              <div className="space-y-6">
                {Object.entries(groupedUnits).map(([groupTitle, list]) => {
                  // Filter based on selected tab
                  const matchesFilter = 
                    alpFilter === 'All' || 
                    (alpFilter === 'Term 1' && groupTitle.startsWith('Term 1')) ||
                    (alpFilter === 'Term 2' && groupTitle.startsWith('Term 2'));
                  
                  if (!matchesFilter || list.length === 0) return null;

                  return (
                    <div 
                      key={groupTitle} 
                      className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      <div className="bg-[#000099]/5 px-4 py-3 border-b border-[#E2E0D8] flex items-center justify-between">
                        <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                          {groupTitle}
                        </h3>
                        <span className="text-[10px] bg-white text-slate-500 border border-[#E2E0D8] px-2 py-0.5 rounded-full font-bold">
                          {list.length} {list.length === 1 ? 'Unit' : 'Units'}
                        </span>
                      </div>
                      
                      <div className="divide-y divide-[#E2E0D8]">
                        {list.map((unit) => {
                          // Color dots per unit type
                          let dotColor = 'bg-[#000099]';
                          let pillColor = 'bg-blue-50 text-blue-800 border-blue-200';
                          if (unit.type === 'Workbook') {
                            dotColor = 'bg-[#FF9A01]';
                            pillColor = 'bg-orange-50 text-orange-800 border-orange-200';
                          } else if (unit.type === 'Writing') {
                            dotColor = 'bg-emerald-600';
                            pillColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                          } else if (unit.type === 'Poem') {
                            dotColor = 'bg-purple-600';
                            pillColor = 'bg-purple-50 text-purple-800 border-purple-200';
                          }

                          return (
                            <div key={unit.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block">{unit.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider border px-1.5 py-0.2 rounded-md ${pillColor}`}>
                                      {unit.type}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">Planned for {unit.plannedMonth}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                {/* Read-Only Sessions Counter */}
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-[#E2E0D8] rounded-[6px]">
                                  <span className="text-xs font-bold text-slate-700">{unit.sessions} Sessions</span>
                                </div>

                                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                  {unit.assessment}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Summary Row */}
              <div className="bg-[#000099] text-white p-4.5 rounded-[10px] shadow-lg flex items-center justify-between text-xs font-extrabold flex-wrap gap-4 mt-6">
                <div className="flex gap-4">
                  <span>Total Units: <strong className="text-[#FF9A01] text-sm">{unitsList.length}</strong></span>
                  <span>Total Planned Sessions: <strong className="text-[#FF9A01] text-sm">{unitsList.reduce((a, b) => a + b.sessions, 0)}</strong></span>
                </div>
                <div className="flex gap-3 text-[10px] uppercase tracking-wider text-white/80">
                  <span>FA1: {unitsList.filter(u => u.assessment === 'FA1').reduce((a, b) => a + b.sessions, 0)}</span>
                  <span>SA1: {unitsList.filter(u => u.assessment === 'SA1').reduce((a, b) => a + b.sessions, 0)}</span>
                  <span>FA3: {unitsList.filter(u => u.assessment === 'FA3').reduce((a, b) => a + b.sessions, 0)}</span>
                  <span>SA2: {unitsList.filter(u => u.assessment === 'SA2').reduce((a, b) => a + b.sessions, 0)}</span>
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              SCREEN: Syllabus Planner (NEW)
              =================================================================== */}
          {currentScreen === 'planner' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Syllabus Planner - Month-by-Month Distribution
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Review all 10 months simultaneously. Reassign units to balance teaching loads and maintain buffers.
                </p>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {academicCalendar.months.map(m => {
                  const calcs = getMonthCalculations(m.month);
                  const monthUnits = unitsList.filter(u => u.plannedMonth === m.month);

                  return (
                    <div 
                      key={m.month} 
                      className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-[#000099] text-white px-4 py-3 flex items-center justify-between border-b border-[#E2E0D8]">
                        <div>
                          <h3 className="text-xs font-black uppercase tracking-wider">{m.month}</h3>
                          <span className="text-[9px] text-white/60 font-semibold">Available: {calcs.sessionsAvailable} periods</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          m.month === 'September' 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : calcs.bufferSessions >= 2 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : calcs.bufferSessions === 1 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          Buf: {m.month === 'September' ? 1 : calcs.bufferSessions}
                        </span>
                      </div>

                      {/* Units list */}
                      <div className="p-3 flex-1 space-y-2 max-h-[220px] overflow-y-auto bg-slate-50/50">
                        {monthUnits.length === 0 ? (
                          <div className="h-full flex items-center justify-center py-8">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">No units assigned</span>
                          </div>
                        ) : (
                          monthUnits.map(unit => (
                            <div key={unit.id} className="bg-white p-2.5 rounded-[8px] border border-[#E2E0D8] flex items-center justify-between gap-2 shadow-sm hover:border-[#FF9A01] transition-all">
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 truncate block">{unit.name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{unit.sessions} sessions • {unit.type}</span>
                              </div>
                              {/* Month selector dropdown */}
                              <select
                                value={unit.plannedMonth}
                                onChange={(e) => {
                                  const newMonth = e.target.value;
                                  setUnitsList(prev => 
                                    prev.map(u => u.id === unit.id ? { ...u, plannedMonth: newMonth } : u)
                                  );
                                }}
                                className="text-[10px] border border-[#E2E0D8] rounded-[4px] bg-white p-1 focus:outline-none font-bold text-slate-600 cursor-pointer"
                              >
                                {academicCalendar.months.map(opt => (
                                  <option key={opt.month} value={opt.month}>{opt.month.substring(0, 3)}</option>
                                ))}
                              </select>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer Summary */}
                      <div className="bg-slate-50 px-4 py-2 border-t border-[#E2E0D8] text-[10px] font-bold text-slate-500 flex justify-between items-center">
                        <span>Total Planned: {m.month === 'September' ? 12 : calcs.plannedSessions} periods</span>
                        <span className="text-slate-400">({monthUnits.length} units)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===================================================================
              SCREEN 3: Monthly Lesson Plan (MLP)
              =================================================================== */}
          {currentScreen === 'mlp' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                      Monthly Plan, Class 1A English
                    </h1>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      Draft
                    </span>
                    {activeMlpMonth === 'September' && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Distribute and map curriculum units month-by-month.
                  </p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Last updated: 20 Sep, 9:15 AM by Priya R
                  </p>
                </div>
              </div>

              {/* Month tabs */}
              <div className="flex border-b border-[#E2E0D8] overflow-x-auto whitespace-nowrap">
                {academicCalendar.months.map(m => (
                  <button
                    key={m.month}
                    onClick={() => setActiveMlpMonth(m.month)}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
                      activeMlpMonth === m.month
                        ? 'border-[#000099] text-[#000099]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {m.month.substring(0, 3)}
                  </button>
                ))}
              </div>

              {/* Calculations Info bar with hover breakdown */}
              {(() => {
                const calcs = getMonthCalculations(activeMlpMonth);
                const calMonth = academicCalendar.months.find(m => m.month === activeMlpMonth)!;
                const configuredBuffer = bufferConfig[activeMlpMonth] !== undefined ? bufferConfig[activeMlpMonth] : 2;
                const availableBuffer = calcs.sessionsAvailable - calcs.plannedSessions - configuredBuffer;
                
                return (
                  <>
                    <div className="bg-[#000099]/5 border border-[#E2E0D8] rounded-[10px] p-4 flex items-center justify-between text-xs font-extrabold flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span>Working Days: <strong className="text-[#000099] font-black">{calMonth.workingDays}</strong></span>
                        
                        {/* Hover breakdown for Effective Days */}
                        <div className="relative group">
                          <span className="cursor-pointer border-b border-dashed border-[#000099] flex items-center gap-1">
                            Effective Days: <strong className="text-[#000099] font-black">{calcs.effectiveDays}</strong>
                            <Info className="w-3.5 h-3.5 text-[#000099]/70" />
                          </span>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[#000099] text-white text-[11px] p-3 rounded-[8px] shadow-lg z-50 whitespace-nowrap leading-relaxed">
                            Working: {calMonth.workingDays} - Exam: {calMonth.examDays} - PTM: {calMonth.ptmDays} - Events: {calMonth.eventDays} {calMonth.revisionDays ? `- Revision: ${calMonth.revisionDays}` : ''} = {calcs.effectiveDays}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#000099]"></div>
                          </div>
                        </div>

                        <span>Sessions Available: <strong className="text-[#000099] font-black">{calcs.sessionsAvailable}</strong></span>
                        <span>Planned: <strong className="text-[#000099] font-black">{activeMlpMonth === 'September' ? 12 : calcs.plannedSessions}</strong></span>
                      </div>

                      <div className="flex items-center gap-4 flex-wrap text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-bold text-[10px] uppercase">
                            Configured Buffer: <strong className="text-[#000099] font-black">{configuredBuffer} days</strong>
                          </span>
                        </div>

                        <span className="border-l border-slate-200 pl-4 text-slate-500 font-bold text-[10px] uppercase">
                          Available Buffer: <strong className="text-[#000099] font-black">{availableBuffer} session(s)</strong>
                        </span>
                      </div>
                    </div>

                    {/* No Bag Day alert bar */}
                    {calMonth.noBagDay && (
                      <div className="bg-[#FF9A01] text-white p-3 rounded-[10px] text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
                        <Award className="w-4.5 h-4.5" />
                        <span>No Bag Day on {calMonth.noBagDay.date.split('-')[2]} {calMonth.month} - {calMonth.noBagDay.activity}</span>
                      </div>
                    )}

                    {/* Unit table for selected month */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                              <th className="py-3 px-4 font-bold">Unit Name</th>
                              <th className="py-3 px-4 font-bold">Type</th>
                              <th className="py-3 px-4 text-center font-bold">Planned Sessions</th>
                              <th className="py-3 px-4 text-center font-bold">Completed</th>
                              <th className="py-3 px-4 text-center font-bold">Status</th>
                              <th className="py-3 px-4 text-center font-bold">Carry Forward</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E0D8]">
                            {(() => {
                              // Filter units planned for this month
                              let monthUnits = unitsList.filter(u => u.plannedMonth === activeMlpMonth);
                              
                              // If September, show WS9 and Rearranging Words as Carry Forward units in the list
                              if (activeMlpMonth === 'September') {
                                const ws9Unit = unitsList.find(u => u.id === 12);
                                const rearrangingUnit = unitsList.find(u => u.id === 17);
                                monthUnits = [
                                  ws9Unit,
                                  ...monthUnits,
                                  rearrangingUnit
                                ].filter(Boolean) as Unit[];
                              }

                              if (monthUnits.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                                      No curriculum units allocated for this month.
                                    </td>
                                  </tr>
                                );
                              }

                              return monthUnits.map((unit) => {
                                const completed = unitCompletions[unit.id] !== undefined ? unitCompletions[unit.id] : 0;
                                const isDone = completed >= unit.sessions;
                                
                                // Specific logic for September statuses
                                let statusPill = 'bg-slate-50 text-slate-500 border-slate-200';
                                let statusText = 'Not Started';
                                
                                if (isDone) {
                                  statusPill = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                  statusText = 'Done';
                                } else if (completed > 0) {
                                  statusPill = 'bg-amber-50 text-amber-700 border-amber-200';
                                  statusText = 'In Progress';
                                }

                                // If it is September and is a carry forward unit
                                const isCarryForward = activeMlpMonth === 'September' && (unit.id === 12 || unit.id === 17);
                                if (isCarryForward) {
                                  statusPill = 'bg-blue-50 text-blue-700 border-blue-200';
                                  statusText = 'Carry Forward';
                                }

                                return (
                                  <tr key={unit.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="py-3 px-4 font-bold text-slate-800">{unit.name}</td>
                                    <td className="py-3 px-4 font-semibold text-slate-500">{unit.type}</td>
                                    <td className="py-3 px-4 text-center text-slate-700 font-bold">{unit.sessions}</td>
                                    <td className="py-3 px-4 text-center text-slate-700 font-bold">{completed}</td>
                                    <td className="py-3 px-4 text-center">
                                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusPill}`}>
                                        {statusText}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                      {isCarryForward ? (
                                        <span className="text-blue-600 font-extrabold text-[11px]">1 Session</span>
                                      ) : (
                                        <span className="text-slate-300 font-medium">-</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Carryover banner at bottom */}
                    {activeMlpMonth === 'September' && (
                      <div className="bg-[#000099]/5 border border-[#000099]/20 p-4 rounded-[10px] flex items-center gap-3 animate-fadeIn">
                        <div className="w-8 h-8 rounded-full bg-[#000099]/10 text-[#000099] flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">
                          <strong className="text-[#000099]">2 sessions carried forward from August</strong>: WS9 Personal Pronouns (1 session) + Writing (1 session)
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}

            </div>
          )}

          {/* ===================================================================
              SCREEN 4: Curriculum Tracker (CT)
              =================================================================== */}
          {currentScreen === 'ct' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Daily Tracker - September 2025 | Class 1A English | Priya R
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Day-by-day lesson execution log and attendance checklist.
                </p>
              </div>

              {/* Stat bar (Part F1) */}
              {(() => {
                const overdueCountVal = trackerDays.filter(d => d.type === 'Teaching' && getDayStatus(d.date, d.status) === 'overdue').length;
                return (
                  <div className="bg-white border border-[#E2E0D8] p-3 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex justify-between items-center text-xs font-bold flex-wrap gap-3">
                    <span className="text-[#000099]">Execution Stats:</span>
                    <div className="flex gap-4 items-center">
                      <span>Teaching: <strong className="text-slate-800">12</strong></span>
                      <span>Revision: <strong className="text-slate-800">4</strong></span>
                      <span>Holiday: <strong className="text-slate-800">3</strong></span>
                      <span>Exam: <strong className="text-slate-800">3</strong></span>
                      <span>No Bag Day: <strong className="text-slate-800">1</strong></span>
                      <span className="border-l border-slate-200 pl-3 text-red-600">
                        Overdue: <strong className="font-extrabold">{overdueCountVal}</strong>
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Week View (Expandable lists) */}
              <div className="space-y-4">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Exam Week'].map((weekName) => {
                  const isExpanded = expandedWeeks[weekName];
                  const weekDays = trackerDays.filter(d => d.week === weekName);

                  // Calculate complete count for this week's teaching sessions
                  const teachingDays = weekDays.filter(d => d.type === 'Teaching');
                  const completedTeachingCount = teachingDays.filter(d => d.status === 'Done').length;

                  return (
                    <div 
                      key={weekName} 
                      className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                      {/* Week Header */}
                      <div 
                         onClick={() => toggleWeek(weekName)}
                         className="px-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 cursor-pointer flex items-center justify-between border-b border-[#E2E0D8] select-none transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-[#000099]" /> : <ChevronDown className="w-4 h-4 text-[#000099]" />}
                          <span className="text-xs font-black text-[#000099] uppercase tracking-wider">{weekName}</span>
                        </div>
                        {teachingDays.length > 0 && (
                          <span className="text-[10px] text-slate-500 font-bold">
                            {completedTeachingCount} of {teachingDays.length} sessions completed
                          </span>
                        )}
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="divide-y divide-[#E2E0D8] animate-fadeIn">
                          {weekDays.map((day) => {
                            const isTeaching = day.type === 'Teaching';
                            
                            // Determine row styling (Part F1 & H1 & I1)
                            let bgClass = 'bg-white';
                            let borderClass = '';
                            let badgeEl = null;
                            let typeBadge = 'bg-slate-100 text-slate-600 border-slate-200';

                            if (isTeaching) {
                              typeBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                              const dayStatus = getDayStatus(day.date, day.status);
                              
                              if (dayStatus === 'completed') {
                                borderClass = 'border-l-[4px] border-l-emerald-500';
                                bgClass = 'bg-emerald-50/10';
                              } else if (dayStatus === 'overdue') {
                                borderClass = 'border-l-[4px] border-l-red-500';
                                bgClass = 'bg-[#FFF5F5]';
                                badgeEl = (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FEE2E2] text-red-600 border border-red-200">
                                    Overdue
                                  </span>
                                );
                              } else if (dayStatus === 'due-today') {
                                borderClass = 'border-l-[4px] border-l-amber-500';
                                bgClass = 'bg-[#FFFBEB]';
                                badgeEl = (
                                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#FEF9C3] text-amber-600 border border-amber-200">
                                    Due Today
                                  </span>
                                );
                              }
                            } else {
                              // Non-teaching days base bg and badges
                              if (day.type === 'Holiday') {
                                bgClass = 'bg-red-50/20';
                                typeBadge = 'bg-red-50 text-red-700 border-red-200';
                              } else if (day.type === 'Buffer') {
                                bgClass = 'bg-yellow-50/20';
                                typeBadge = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                              } else if (day.type === 'Revision') {
                                bgClass = 'bg-blue-50/20';
                                typeBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                              } else if (day.type === 'Exam') {
                                bgClass = 'bg-purple-50/20';
                                typeBadge = 'bg-purple-50 text-purple-700 border-purple-200';
                              } else if (day.type === 'No Bag Day') {
                                bgClass = 'bg-green-50/20';
                                typeBadge = 'bg-green-50 text-green-700 border-green-200';
                              } else if (day.type === 'Event') {
                                bgClass = 'bg-orange-50/20';
                                typeBadge = 'bg-orange-50 text-orange-700 border-orange-200';
                              }
                            }

                            // Slot lookup for Timetable chip (Part H1)
                            const slot = timetableSlots[day.day as keyof typeof timetableSlots];

                            return (
                              <div key={day.id} className="group border-b border-[#E2E0D8] last:border-b-0">
                                <div className={`p-4 flex items-center justify-between flex-wrap gap-4 transition-colors ${bgClass} ${borderClass}`}>
                                  
                                  <div className="flex items-center gap-4">
                                    {/* Date and Day Column */}
                                    <div className="w-16 shrink-0">
                                      <span className="text-xs font-bold text-slate-800 block">{day.date}</span>
                                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{day.day.substring(0, 3)}</span>
                                    </div>
                                    
                                    {/* Timetable Chip (Part H1) */}
                                    {isTeaching && slot && (
                                      <button
                                        onClick={() => setMiniTimetableOpen(true)}
                                        className="px-2 py-0.5 bg-[#F3F4F6] text-slate-500 rounded-[10px] text-[10px] font-bold border border-slate-200 hover:border-slate-300 hover:text-slate-700 transition-all flex items-center shrink-0 cursor-pointer"
                                      >
                                        P{slot.period} • {slot.time}
                                      </button>
                                    )}

                                    {/* Type Badge */}
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${typeBadge}`}>
                                      {day.type}
                                    </span>

                                    {/* Topic Name */}
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-slate-800 block">
                                          {day.topic}
                                        </span>
                                        {badgeEl}
                                      </div>
                                      {day.period && (
                                        <span className="text-[10px] text-slate-400 font-semibold">Period {day.period}</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions Column */}
                                  <div className="flex items-center gap-3">
                                    
                                    {isTeaching ? (
                                      <div className="flex items-center gap-3">
                                        
                                        {/* Done / Partial / Skipped Button Group */}
                                        <div className="flex items-center border border-[#E2E0D8] rounded-[8px] bg-white p-0.5 shadow-sm">
                                          <button
                                            onClick={() => handleTrackerStatus(day.id, 'Done')}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-[6px] transition-all cursor-pointer ${
                                              day.status === 'Done'
                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                          >
                                            Done
                                          </button>
                                          <button
                                            onClick={() => handleTrackerStatus(day.id, 'Partial')}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-[6px] transition-all cursor-pointer ${
                                              day.status === 'Partial'
                                                ? 'bg-[#FF9A01] text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                          >
                                            Partial
                                          </button>
                                          <button
                                            onClick={() => handleTrackerStatus(day.id, 'Skipped')}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-[6px] transition-all cursor-pointer ${
                                              day.status === 'Skipped'
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                          >
                                            Skipped
                                          </button>
                                        </div>

                                        {/* Conditional Partial Input */}
                                        {day.status === 'Partial' && (
                                          <div className="flex items-center gap-1 bg-white border border-[#E2E0D8] p-1 rounded-[6px] animate-fadeIn">
                                            <span className="text-[10px] text-slate-500 pl-1 font-bold">Covered:</span>
                                            <input
                                              type="number"
                                              value={day.inputVal}
                                              onChange={(e) => handleTrackerPartialInput(day.id, e.target.value)}
                                              className="w-10 text-center text-xs font-black focus:outline-none"
                                              min="1"
                                              max="6"
                                            />
                                          </div>
                                        )}

                                        {/* Conditional Skipped Reason Dropdown */}
                                        {day.status === 'Skipped' && (
                                          <select
                                            value={day.reason}
                                            onChange={(e) => handleTrackerSkippedReason(day.id, e.target.value)}
                                            className="text-xs border border-[#E2E0D8] bg-white rounded-[6px] p-1.5 focus:outline-none font-bold text-slate-600 animate-fadeIn"
                                          >
                                            <option value="Holiday">Holiday</option>
                                            <option value="Assembly">Assembly</option>
                                            <option value="Teacher Absent">Teacher Absent</option>
                                            <option value="Event">Event</option>
                                          </select>
                                        )}

                                        {/* Status display tick */}
                                        {day.status === 'Done' && (
                                          <div className="flex items-center gap-1 text-emerald-600 font-extrabold text-[11px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Done
                                          </div>
                                        )}

                                      </div>
                                    ) : (
                                      // Non-teaching days have read-only status labels
                                      <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-wider bg-slate-100/50 border border-slate-200 px-2 py-0.5 rounded-[4px]">
                                        {day.status}
                                      </span>
                                    )}

                                    {/* CT row log icon clock/history (Part I1) */}
                                    {isTeaching && (
                                      <button
                                        onClick={() => setOpenLogRowId(openLogRowId === day.id ? null : day.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-[#000099] rounded hover:bg-slate-100/50 cursor-pointer shrink-0"
                                        title="View execution logs"
                                      >
                                        <History className="w-4 h-4" />
                                      </button>
                                    )}

                                  </div>
                                </div>

                                {/* Completion Details and Evidence Form */}
                                {isTeaching && (day.status === 'Done' || day.status === 'Partial') && (
                                  <div className="px-12 pb-4 pt-3.5 border-t border-[#E2E0D8]/60 bg-slate-50/20 flex flex-col gap-3 animate-fadeIn">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-extrabold text-[#000099] uppercase tracking-wider">Lesson Execution Details</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Completion Notes */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Completion Notes</label>
                                        <textarea
                                          value={day.teacherComment || ''}
                                          onChange={(e) => handleTrackerComment(day.id, e.target.value)}
                                          placeholder="e.g. Explained personal pronouns, completed textbook exercises."
                                          className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2 bg-white focus:outline-none focus:border-[#000099] font-medium resize-none h-[54px] shadow-sm"
                                        />
                                      </div>
                                      
                                      {/* Evidence */}
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Evidence of Learning</label>
                                        <div className="flex flex-col gap-2">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 font-semibold shrink-0">Type:</span>
                                            <select
                                              value={day.evidenceType || 'None'}
                                              onChange={(e) => handleTrackerEvidenceType(day.id, e.target.value)}
                                              className="text-xs border border-[#E2E0D8] bg-white rounded-[6px] p-1.5 focus:outline-none focus:border-[#000099] font-bold text-slate-600 cursor-pointer shadow-sm flex-1"
                                            >
                                              <option value="None">None</option>
                                              <option value="Homework">Homework</option>
                                              <option value="Classwork">Classwork</option>
                                              <option value="Project">Project</option>
                                              <option value="Quiz">Quiz</option>
                                            </select>
                                          </div>
                                          
                                          {day.evidenceType && day.evidenceType !== 'None' && (
                                            <div className="flex items-center gap-2 animate-fadeIn">
                                              <span className="text-[10px] text-slate-400 font-semibold shrink-0">Details:</span>
                                              <input
                                                type="text"
                                                value={day.evidenceDetails || ''}
                                                onChange={(e) => handleTrackerEvidenceDetails(day.id, e.target.value)}
                                                placeholder={
                                                  day.evidenceType === 'Homework' 
                                                    ? "Workbook page 10, Q1-5" 
                                                    : day.evidenceType === 'Classwork'
                                                      ? "Grammar worksheet completed in class"
                                                      : day.evidenceType === 'Project'
                                                        ? "Create a noun scrapbook"
                                                        : "Vocabulary check-up test"
                                                }
                                                className="flex-1 text-xs border border-[#E2E0D8] rounded-[6px] p-1.5 bg-white focus:outline-none focus:border-[#000099] font-semibold shadow-sm"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Inline Log Panel (Part I1) */}
                                {isTeaching && openLogRowId === day.id && (
                                  <div className="px-12 pb-4 pt-1 bg-[#F8F8F6] border-t border-[#E2E0D8] animate-fadeIn">
                                    <div className="bg-[#F8F8F6] border border-[#E2E0D8] rounded-[10px] p-3.5 text-xs">
                                      <h4 className="font-bold text-[#000099] mb-3 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                        <History className="w-3.5 h-3.5 text-[#000099]" /> Execution Audit Logs
                                      </h4>
                                      <div className="relative border-l-2 border-slate-200 ml-2 pl-4 space-y-4">
                                        {(() => {
                                          const baseLogs = ctLogs[day.topic.replace(" (Carry Forward)", "")] || [
                                            { type: "system", action: "Created", date: "01 Sep 2025", time: "09:00 AM", by: "System" }
                                          ];
                                          const logs = [...baseLogs];
                                          
                                          if (day.status === 'Done' || day.status === 'Partial') {
                                            const evidenceStr = (day.evidenceType && day.evidenceType !== 'None') 
                                              ? ` [Evidence: ${day.evidenceType} - ${day.evidenceDetails || 'N/A'}]` 
                                              : '';
                                            logs.unshift({
                                              type: "teacher",
                                              action: day.status === 'Done' ? "Completed (Live)" : "Partial (Live)",
                                              date: "20 Sep 2025",
                                              time: "05:00 PM",
                                              by: "Priya R",
                                              note: (day.teacherComment || "No comment entered yet") + evidenceStr
                                            });
                                          }

                                          return logs.map((log, logIdx) => {
                                            let dotBg = 'bg-slate-400';
                                            if (log.action === 'Completed' || log.action === 'Updated' || log.action === 'Completed (Live)' || log.action === 'Partial (Live)') {
                                              dotBg = 'bg-emerald-500';
                                            } else if (log.type === 'teacher') {
                                              dotBg = 'bg-[#000099]';
                                            }
                                            
                                            return (
                                              <div key={logIdx} className="relative">
                                                {/* Dot */}
                                                <span className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#F8F8F6] ${dotBg}`} />
                                                <div className="space-y-0.5">
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">{log.action}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold">{log.date} at {log.time}</span>
                                                  </div>
                                                  <p className="text-[10px] text-slate-500 font-medium">
                                                    by {log.by} {log.note ? `- "${log.note}"` : ''}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          });
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                )}

                              </div>
                            );
                          })}

                          {/* Progress bar at the bottom of the week */}
                          <div className="p-3.5 bg-slate-50 border-t border-[#E2E0D8] text-xs font-extrabold text-slate-600 flex justify-between items-center">
                            <span>{weekName}: {completedTeachingCount} of {teachingDays.length} teaching sessions marked complete</span>
                            <div className="w-36 bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300/30">
                              <div 
                                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${teachingDays.length > 0 ? (completedTeachingCount / teachingDays.length) * 100 : 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ===================================================================
              SCREEN 5: Exam Check
              =================================================================== */}
          {currentScreen === 'exam_check' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  SA1 Readiness Check - Class 1A English
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  SA1 Exam: 30 Sep - 02 Oct 2025
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] grid grid-cols-4 gap-4 text-center">
                
                <div className="border-r border-[#E2E0D8] py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SA1 Readiness</span>
                  <span className={`text-2xl font-black block mt-1.5 ${
                    sa1Stats.readinessPercent > 80 
                      ? 'text-emerald-600' 
                      : sa1Stats.readinessPercent >= 60 
                        ? 'text-[#FF9A01]' 
                        : 'text-red-600'
                  }`}>
                    {sa1Stats.readinessPercent}%
                  </span>
                </div>

                <div className="border-r border-[#E2E0D8] py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Topics Complete</span>
                  <span className="text-2xl font-black text-slate-800 block mt-1.5">
                    {sa1Stats.completedSA1Topics} of {sa1Stats.totalSA1Topics}
                  </span>
                </div>

                <div className="border-r border-[#E2E0D8] py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sessions Remaining</span>
                  <span className="text-2xl font-black text-slate-800 block mt-1.5">
                    {sa1Stats.sessionsRemaining}
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Days Until SA1</span>
                  <span className="text-2xl font-black text-[#FF9A01] block mt-1.5">
                    {sa1Stats.daysUntilSA1}
                  </span>
                </div>

              </div>

              {/* Two-Column View */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Left Column: Completed before SA1 */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0_0,0.08)] overflow-hidden">
                  <div className="bg-emerald-600 p-4 text-white">
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      Completed Before SA1
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-[#E2E0D8] max-h-[350px] overflow-y-auto">
                    {sa1Stats.completedList.length === 0 ? (
                      <p className="p-6 text-center text-slate-400 text-xs font-semibold">No topics completed yet.</p>
                    ) : (
                      sa1Stats.completedList.map(unit => (
                        <div key={unit.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                            <span className="text-xs font-bold text-slate-800">{unit.name}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-[4px] font-bold text-slate-500 uppercase">
                            {unit.sessions} Sessions
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Column: Incomplete and At Risk */}
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                  <div className="bg-red-600 p-4 text-white">
                    <h3 className="text-xs font-black uppercase tracking-wider">
                      Not Yet Complete - At Risk
                    </h3>
                  </div>

                  <div className="divide-y divide-[#E2E0D8] max-h-[350px] overflow-y-auto">
                    {sa1Stats.incompleteList.length === 0 ? (
                      <p className="p-6 text-center text-[#000099] text-xs font-semibold">All SA1-tagged topics completed! Safe.</p>
                    ) : (
                      sa1Stats.incompleteList.map(({ unit, remaining }) => {
                        // Critical trigger condition: remaining sessions needed > 1 (threshold is 1.44)
                        const isCritical = remaining > 1;

                        return (
                          <div key={unit.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-slate-800 truncate">{unit.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] bg-red-50 border border-red-100 px-2 py-0.5 rounded-[4px] font-bold text-red-700">
                                {remaining} remaining
                              </span>
                              
                              {isCritical && (
                                <span className="bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider animate-pulse">
                                  CRITICAL
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* Alert banner if any CRITICAL items */}
              {sa1Stats.incompleteList.some(item => item.remaining > 1) && (
                <div className="bg-red-600 text-white p-4 rounded-[10px] flex items-center gap-3.5 shadow-lg animate-fadeIn">
                  <div className="p-1.5 bg-white/20 rounded-full shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold leading-normal">
                    {sa1Stats.incompleteList.filter(item => item.remaining > 1).length} topics may not be completed before SA1. Review with Academic Coordinator.
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ===================================================================
              SCREEN 3: Coverage (Coordinator Grid - Part M)
              =================================================================== */}
          {currentScreen === 'coverage' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Academic Coverage Status - Coordinator Grid
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Class 1 Sections Curriculum Compliance | Bengaluru
                </p>
              </div>

              {/* Coordinator grid table */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-[#E2E0D8] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#000099] uppercase tracking-wider">Class 1 Progress Grid</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold uppercase">
                    1 section behind
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                        <th className="py-3 px-4 font-bold">Class & Section</th>
                        <th className="py-3 px-4 font-bold">Subject</th>
                        <th className="py-3 px-4 font-bold">Teacher</th>
                        <th className="py-3 px-4 text-center font-bold">MLP Status</th>
                        <th className="py-3 px-4 text-center font-bold">Completions</th>
                        <th className="py-3 px-4 text-center font-bold">Progress</th>
                        <th className="py-3 px-4 text-center font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E0D8]">
                      <tr className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#000099]">Class 1A</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">English</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Priya R</td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full">Draft</span></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">10 of 14 units</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <span>73%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                              <div className="bg-amber-500 h-full" style={{ width: '73%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Behind</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#000099]">Class 1A</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">Mathematics</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Sunita K</td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full">Approved</span></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">12 of 14 units</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <span>85%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                              <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">On Track</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#000099]">Class 1A</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">EVS</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Meena L</td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full">Approved</span></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">13 of 14 units</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <span>90%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                              <div className="bg-emerald-500 h-full" style={{ width: '90%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">On Track</span></td>
                      </tr>
                      <tr className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#000099]">Class 1A</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">Hindi</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-500">Rekha S</td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-red-50 text-red-700 border-red-200 text-[9px] font-bold px-2 py-0.5 rounded-full">Draft</span></td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">8 of 14 units</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          <div className="flex items-center justify-center gap-2">
                            <span>60%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                              <div className="bg-red-500 h-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center"><span className="bg-red-50 text-red-700 border-red-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">At Risk</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
              SCREEN 8: Alerts (Screen 8 - Part G2)
              =================================================================== */}
          {currentScreen === 'alerts' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Academic Alerts and Escalations
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Real-time warnings, system auto-checks, and pending coordinator clearances.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Alert 4: 6 PM check (Part G2) */}
                <div className="bg-white border-l-[4px] border-l-red-500 border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between h-44">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      6 PM Check - 2 sessions unmarked today
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Priya R (Class 1A English) has not marked sessions for today (20 Sep). Notification sent to teacher at 6:00 PM.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                        Auto-triggered
                      </span>
                      <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        Notified
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setCurrentScreen('ct');
                        setExpandedWeeks(prev => ({ ...prev, 'Week 3': true }));
                      }}
                      className="text-[#FF9A01] hover:text-[#e08800] text-[10px] font-black underline cursor-pointer"
                    >
                      View Teacher's CT
                    </button>
                  </div>
                </div>

                {/* Alert 1: Syllabus Delay */}
                <div className="bg-white border-l-[4px] border-l-red-500 border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between h-44">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      Syllabus Delay - Class 1A English
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      WS9 Personal Pronouns is delayed by 3 sessions in September. SA1 exam is scheduled in 10 days (30 Sep).
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-black uppercase bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                        Delay Alert
                      </span>
                      <span className="text-[9px] font-black uppercase bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                        Critical
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setCurrentScreen('ct');
                        setExpandedWeeks(prev => ({ ...prev, 'Week 3': true }));
                      }}
                      className="text-[#FF9A01] hover:text-[#e08800] text-[10px] font-black underline cursor-pointer"
                    >
                      View CT Tracker
                    </button>
                  </div>
                </div>

                {/* Alert 2: Pending Approval */}
                <div className="bg-white border-l-[4px] border-l-amber-500 border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between h-44">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      Pending Approval - July MLP
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      July MLP submitted by Priya R has been pending coordinator approval for 4 working days.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">
                        Approval Pending
                      </span>
                      <span className="text-[9px] font-black uppercase bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                        Urgent
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setCurrentScreen('mlp')}
                      className="text-[#FF9A01] hover:text-[#e08800] text-[10px] font-black underline cursor-pointer"
                    >
                      Review MLP
                    </button>
                  </div>
                </div>

                {/* Alert 3: Calendar Change */}
                <div className="bg-white border-l-[4px] border-l-blue-500 border border-[#E2E0D8] p-5 rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col justify-between h-44">
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-blue-500 shrink-0" />
                      Calendar Change - School Holiday Added
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Ganesha Festival holiday on 16 Sep added to academic calendar. Working days for September reduced to 20.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-700 border-blue-100 px-2 py-0.5 rounded">
                        System Alert
                      </span>
                      <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded">
                        Info
                      </span>
                    </div>
                    
                    <span className="text-slate-300 text-[10px] font-semibold">
                      Synced
                    </span>
                  </div>
                </div>

              </div>

              {/* Dynamic Reminders & Escalations Panel */}
              <div className="space-y-4 pt-6 border-t border-[#E2E0D8]">
                <h2 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                  Configured Reminders & Escalation Actions
                </h2>
                
                {/* Reminders section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FF9A01]" />
                    Staff Reminders (Threshold: {reminderConfig.staffDaysThreshold} Days past Target)
                  </h3>
                  {activeReminders.length === 0 ? (
                    <div className="bg-slate-50 p-4 rounded-[10px] text-xs font-semibold text-slate-400 border border-[#E2E0D8]">
                      No active staff completion reminders at this time.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                      {activeReminders.map((rem, i) => (
                        <div key={i} className="bg-white border-l-[4px] border-l-amber-500 border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-amber-600 block">Staff Reminder</span>
                            <span className="text-xs font-bold text-slate-800 block">Syllabus Target Delay: {rem.chapterName}</span>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {rem.teacher} ({rem.subject}) is overdue on completing this chapter. Target Date was {rem.targetDate} ({rem.daysPast} days overdue).
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 text-[10px]">
                            <span className="font-bold text-slate-400">Notified via In-App / Email</span>
                            <button
                              onClick={() => {
                                setSelectedSyllabusSubject(rem.subject);
                                setSyllabusViewRole('teacher');
                                setTeacherSubView('marking');
                                setCurrentScreen('syllabus');
                              }}
                              className="text-[#000099] hover:underline font-black cursor-pointer"
                            >
                              Go to Lesson Marking
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Escalations section */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Multi-Level Escalations (Buffer Overruns)
                  </h3>
                  {activeEscalations.length === 0 ? (
                    <div className="bg-slate-50 p-4 rounded-[10px] text-xs font-semibold text-slate-400 border border-[#E2E0D8]">
                      No active escalations. All delayed lessons are within buffer periods.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                      {activeEscalations.map((esc, i) => {
                        let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                        if (esc.level === 2) badgeColor = "bg-orange-50 text-orange-700 border-orange-200";
                        if (esc.level === 3) badgeColor = "bg-red-50 text-red-700 border-red-200 animate-pulse";
                        
                        return (
                          <div key={i} className="bg-red-50/10 border-l-[4px] border-l-red-600 border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex justify-between items-start gap-1">
                                <span className={`text-[8px] font-black uppercase border px-1.5 py-0.2 rounded shrink-0 ${badgeColor}`}>
                                  Level {esc.level} Escalation
                                </span>
                                <span className="text-[10px] text-red-600 font-extrabold shrink-0">{esc.daysOverdue} days late</span>
                              </div>
                              <span className="text-xs font-bold text-slate-800 block">{esc.chapterName}</span>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Lesson overdue past buffer date ({esc.bufferDate}). Escalated to {esc.escalatedTo}.
                              </p>
                            </div>
                            <div className="flex justify-end mt-3 pt-2 border-t border-slate-100">
                              <button
                                onClick={() => showToast(`Escalated notification nudge re-sent to ${esc.escalatedTo}`)}
                                className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold px-2 py-1 rounded transition-colors cursor-pointer"
                              >
                                Send Nudge
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ===================================================================
              SCREEN: Syllabus Plan Manager (New)
              =================================================================== */}
          {currentScreen === 'syllabus' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E2E0D8] pb-4">
                <div>
                  <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                    Syllabus Plan Manager
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Configure, track, and manage subject curricula, chapters, and subtopic lists.
                  </p>
                </div>
                           {/* Role Toggle Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-[10px] border border-[#E2E0D8]">
                  <button
                    onClick={() => setSyllabusViewRole('teacher')}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                      syllabusViewRole === 'teacher'
                        ? 'bg-[#000099] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#000099]'
                    }`}
                  >
                    Teacher
                  </button>
                  <button
                    onClick={() => setSyllabusViewRole('coordinator')}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                      syllabusViewRole === 'coordinator'
                        ? 'bg-[#000099] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#000099]'
                    }`}
                  >
                    Coordinator
                  </button>
                  <button
                    onClick={() => setSyllabusViewRole('headmaster')}
                    className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                      syllabusViewRole === 'headmaster'
                        ? 'bg-[#000099] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#000099]'
                    }`}
                  >
                    Headmaster / Principal
                  </button>
                </div>
              </div>

              {/* HEADMASTER VIEW */}
              {(syllabusViewRole === 'headmaster' || syllabusViewRole === 'coordinator') && (() => {
                // Calculations for principal/HOD summary
                const totalSubjects = subjectPlans.length;
                const totalChapters = subjectPlans.reduce((acc, sp) => acc + sp.chapters.length, 0);
                const totalSubtopics = subjectPlans.reduce((acc, sp) => 
                  acc + sp.chapters.reduce((sum, ch) => sum + ch.subtopics.length, 0), 0
                );
                const avgSubtopics = totalChapters > 0 ? (totalSubtopics / totalChapters).toFixed(1) : "0.0";
                const totalPeriods = subjectPlans.reduce((acc, sp) => 
                  acc + sp.chapters.reduce((sum, ch) => sum + ch.plannedPeriods, 0), 0
                );

                return (
                  <div className="space-y-6">
                    {/* Headmaster Stat Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-white border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Subjects</span>
                        <span className="text-2xl font-black text-[#000099] block mt-1.5">{totalSubjects}</span>
                      </div>
                      <div className="bg-white border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Chapters</span>
                        <span className="text-2xl font-black text-[#000099] block mt-1.5">{totalChapters}</span>
                      </div>
                      <div className="bg-white border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Subtopics</span>
                        <span className="text-2xl font-black text-[#000099] block mt-1.5">{totalSubtopics}</span>
                      </div>
                      <div className="bg-white border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Subtopics / Chapter</span>
                        <span className="text-2xl font-black text-[#FF9A01] block mt-1.5">{avgSubtopics}</span>
                      </div>
                      <div className="bg-white border border-[#E2E0D8] p-4 rounded-[10px] shadow-sm text-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Planned Periods</span>
                        <span className="text-2xl font-black text-emerald-600 block mt-1.5">{totalPeriods}</span>
                      </div>
                    </div>

                    {/* Subject Wise Performance Table */}
                    <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                      <div className="p-4 border-b border-[#E2E0D8] bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-[#000099] uppercase tracking-wide">
                          Subject-wise Curriculum Breakdown & Progress
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                              <th className="py-3 px-4 font-bold">Subject</th>
                              <th className="py-3 px-4 font-bold">Assigned Teacher</th>
                              <th className="py-3 px-4 text-center font-bold">Total Chapters</th>
                              <th className="py-3 px-4 text-center font-bold">Total Subtopics</th>
                              <th className="py-3 px-4 text-center font-bold">Total Periods</th>
                              <th className="py-3 px-4 font-bold">Progress</th>
                              <th className="py-3 px-4 text-center font-bold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E2E0D8]">
                            {subjectPlans.map((sp, idx) => {
                              const sChapters = sp.chapters.length;
                              const sSubtopics = sp.chapters.reduce((sum, ch) => sum + ch.subtopics.length, 0);
                              const sPeriods = sp.chapters.reduce((sum, ch) => sum + ch.plannedPeriods, 0);
                              const spProgress = getSubjectProgress(sp);

                              let progressColor = "bg-emerald-600";
                              let statusText = "On Track";
                              let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

                              if (spProgress < 40) {
                                progressColor = "bg-red-600";
                                statusText = "Behind Schedule";
                                statusBadge = "bg-red-50 text-red-700 border-red-200";
                              } else if (spProgress < 65) {
                                progressColor = "bg-amber-500";
                                statusText = "At Risk";
                                statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                              }

                              return (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3.5 px-4 font-bold text-[#000099]">{sp.subject}</td>
                                  <td className="py-3.5 px-4 font-semibold text-slate-600">{sp.teacher}</td>
                                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{sChapters}</td>
                                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">{sSubtopics}</td>
                                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">{sPeriods}</td>
                                  <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                                        <div 
                                          className={`${progressColor} h-full rounded-full transition-all duration-300`} 
                                          style={{ width: `${spProgress}%` }}
                                        />
                                      </div>
                                      <span className="font-extrabold text-slate-700 text-[10px]">{spProgress}%</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 text-center">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                                      {statusText}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Teacher Workload Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-sm">
                        <h4 className="font-bold text-[#000099] text-xs uppercase tracking-wider mb-4">Teacher Content Compliance</h4>
                        <div className="space-y-4">
                          {subjectPlans.map((sp, idx) => {
                            const subtopicsComp = sp.chapters.reduce((sum, ch) => sum + ch.subtopics.filter(s => s.status === 'Completed').length, 0);
                            const subtopicsTotal = sp.chapters.reduce((sum, ch) => sum + ch.subtopics.length, 0);
                            return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                  <span>{sp.teacher} ({sp.subject})</span>
                                  <span>{subtopicsComp} of {subtopicsTotal} subtopics complete</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="bg-[#000099] h-full rounded-full transition-all duration-300"
                                    style={{ width: `${subtopicsTotal > 0 ? (subtopicsComp / subtopicsTotal) * 100 : 0}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-sm flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-[#000099] text-xs uppercase tracking-wider mb-2">Headmaster Review Console</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Overall curriculum coverage is currently pacing at <strong className="text-[#000099]">{Math.round(subjectPlans.reduce((acc, sp) => acc + getSubjectProgress(sp), 0) / subjectPlans.length)}%</strong> across Class 1. English is ahead of plan, while Social Studies is slightly lagging due to school holidays and event days.
                          </p>
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-[8px] text-xs text-amber-800 font-medium flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>Action Required: Follow up with Anjali M on Social Studies timeline mapping for SA2 syllabus topics.</span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast("Review notification sent to teachers")}
                          className="w-full bg-[#000099] hover:bg-blue-900 text-white text-xs font-bold py-2 rounded-[8px] mt-4 transition-colors cursor-pointer"
                        >
                          Request Syllabus Audit Update
                        </button>
                      </div>
                    </div>

                    {/* Headmaster / Coordinator Subject Target Editor */}
                    <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-sm space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#E2E0D8] pb-2 flex-wrap gap-2">
                        <h4 className="font-bold text-[#000099] text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Settings className="w-4 h-4 text-[#FF9A01]" />
                          Subject Curriculum Target Allocator (Authorized Access Only)
                        </h4>
                        <span className="text-[10px] text-slate-400 font-semibold">Select subject to manage target dates & buffer periods</span>
                      </div>

                      {/* Mini tab selector */}
                      <div className="flex border-b border-slate-100 overflow-x-auto whitespace-nowrap">
                        {subjectPlans.map(sp => (
                          <button
                            key={sp.subject}
                            onClick={() => setSelectedSyllabusSubject(sp.subject)}
                            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                              selectedSyllabusSubject === sp.subject
                                ? 'border-[#000099] text-[#000099]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {sp.subject}
                          </button>
                        ))}
                      </div>

                      {/* Chapters Targets Table */}
                      <div className="overflow-x-auto text-xs font-semibold">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                              <th className="py-2.5 px-3 font-bold">Chapter Name</th>
                              <th className="py-2.5 px-3 font-bold text-center">Periods</th>
                              <th className="py-2.5 px-3 font-bold">Target Date</th>
                              <th className="py-2.5 px-3 font-bold text-center">Target Days</th>
                              <th className="py-2.5 px-3 font-bold text-center">Buffer Days</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(() => {
                              const currentPlan = subjectPlans.find(p => p.subject === selectedSyllabusSubject)!;
                              return currentPlan.chapters.map((ch) => (
                                <tr key={ch.id} className="hover:bg-slate-50/20">
                                  <td className="py-2.5 px-3 font-bold text-slate-800">{ch.name}</td>
                                  <td className="py-2.5 px-3 text-center text-slate-600">{ch.plannedPeriods}</td>
                                  <td className="py-2.5 px-3">
                                    <input
                                      type="date"
                                      disabled={!authorizedRoles.includes(syllabusViewRole)}
                                      value={ch.targetDate || ""}
                                      onChange={(e) => handleUpdateChapterTargets(selectedSyllabusSubject, ch.id, { targetDate: e.target.value })}
                                      className="border border-[#E2E0D8] rounded p-1 text-xs font-bold focus:outline-none focus:border-[#000099] bg-white text-slate-700 shadow-sm"
                                    />
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <input
                                      type="number"
                                      min="1"
                                      disabled={!authorizedRoles.includes(syllabusViewRole)}
                                      value={ch.targetDays || 5}
                                      onChange={(e) => handleUpdateChapterTargets(selectedSyllabusSubject, ch.id, { targetDays: parseInt(e.target.value) || 5 })}
                                      className="border border-[#E2E0D8] rounded p-1 text-xs font-bold text-center w-16 focus:outline-none focus:border-[#000099] bg-white text-slate-700 shadow-sm"
                                    />
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <input
                                      type="number"
                                      min="0"
                                      disabled={!authorizedRoles.includes(syllabusViewRole)}
                                      value={ch.bufferDays !== undefined ? ch.bufferDays : 2}
                                      onChange={(e) => handleUpdateChapterTargets(selectedSyllabusSubject, ch.id, { bufferDays: parseInt(e.target.value) || 0 })}
                                      className="border border-[#E2E0D8] rounded p-1 text-xs font-bold text-center w-16 focus:outline-none focus:border-[#000099] bg-white text-slate-700 shadow-sm"
                                    />
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Curriculum Compliance & Active Escalations Desk */}
                    <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-sm space-y-4 animate-fadeIn">
                      <div className="flex justify-between items-center border-b border-[#E2E0D8] pb-2 flex-wrap gap-2">
                        <h4 className="font-bold text-[#000099] text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          Curriculum Escalations & Alerts Console
                        </h4>
                        <span className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-black">
                          {activeEscalations.length} Active Escalations
                        </span>
                      </div>

                      {activeEscalations.length === 0 ? (
                        <p className="text-xs text-slate-500 font-semibold italic">No active buffer overrun escalations across subjects.</p>
                      ) : (
                        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                          {activeEscalations.map((esc, i) => (
                            <div key={i} className="py-2.5 flex justify-between items-center gap-4 text-xs">
                              <div>
                                <span className="text-slate-800 font-bold block">{esc.chapterName} ({esc.subject})</span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  Teacher: {esc.teacher} • Buffer Expired: {esc.bufferDate} ({esc.daysOverdue} days overdue)
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 text-[9px] font-black uppercase">
                                  Level {esc.level} • {esc.escalatedTo} notified
                                </span>
                                <button
                                  onClick={() => showToast(`Audit details requested for ${esc.chapterName}`)}
                                  className="border border-[#000099] hover:bg-blue-50 text-[#000099] px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  Request Audit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()}

              {/* TEACHER VIEW */}
              {syllabusViewRole === 'teacher' && (() => {
                const currentPlan = subjectPlans.find(p => p.subject === selectedSyllabusSubject)!;
                return (
                  <div className="space-y-6">
                    {/* Subject selection & Sub-view tabs */}
                    <div className="flex justify-between items-center flex-wrap gap-4 border-b border-[#E2E0D8] pb-1">
                      <div className="flex overflow-x-auto whitespace-nowrap">
                        {subjectPlans.map(sp => (
                          <button
                            key={sp.subject}
                            onClick={() => setSelectedSyllabusSubject(sp.subject)}
                            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                              selectedSyllabusSubject === sp.subject
                                ? 'border-[#000099] text-[#000099]'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {sp.subject}
                          </button>
                        ))}
                      </div>

                      {/* Sub-view switcher for Teacher */}
                      <div className="flex bg-slate-100 p-0.5 rounded-[8px] border border-[#E2E0D8]">
                        <button
                          onClick={() => setTeacherSubView('builder')}
                          className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold transition-all cursor-pointer ${
                            teacherSubView === 'builder'
                              ? 'bg-[#000099] text-white shadow-sm'
                              : 'text-slate-600 hover:text-[#000099]'
                          }`}
                        >
                          Syllabus Builder
                        </button>
                        <button
                          onClick={() => setTeacherSubView('marking')}
                          className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold transition-all cursor-pointer ${
                            teacherSubView === 'marking'
                              ? 'bg-[#000099] text-white shadow-sm'
                              : 'text-slate-600 hover:text-[#000099]'
                          }`}
                        >
                          Mark Lesson Plan View
                        </button>
                      </div>
                    </div>

                    {teacherSubView === 'builder' ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fadeIn">
                        {/* Left: Chapters and Subtopics details */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                              {selectedSyllabusSubject} Syllabus Structure ({currentPlan.chapters.length} Chapters)
                            </h3>
                          </div>

                          {currentPlan.chapters.length === 0 ? (
                            <div className="bg-white border border-[#E2E0D8] p-8 rounded-[10px] text-center text-slate-400 font-semibold text-xs uppercase tracking-wider">
                              No chapters added to this subject yet.
                            </div>
                          ) : (
                            currentPlan.chapters.map((chapter) => (
                              <div key={chapter.id} className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
                                <div className="bg-slate-50/70 p-3.5 border-b border-[#E2E0D8] flex items-center justify-between flex-wrap gap-2">
                                  <div className="flex items-center gap-2.5 flex-wrap">
                                    <span className="text-xs font-bold text-slate-800">{chapter.name}</span>
                                    <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-bold">
                                      {chapter.plannedPeriods} Periods
                                    </span>
                                    {chapter.assessmentTag && (
                                      <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded font-black">
                                        {chapter.assessmentTag}
                                      </span>
                                    )}
                                    {chapter.targetDate && (
                                      <span className="text-[9px] bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.2 rounded font-bold">
                                        Target: {chapter.targetDate} ({chapter.targetDays} Days)
                                      </span>
                                    )}
                                    {chapter.bufferDays !== undefined && (
                                      <span className="text-[9px] bg-yellow-50 text-yellow-750 border border-yellow-200 px-1.5 py-0.2 rounded font-bold">
                                        Buffer: {chapter.bufferDays} Days
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleDeleteChapter(selectedSyllabusSubject, chapter.id)}
                                    className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                                    title="Delete Chapter"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Subtopics Section */}
                                <div className="p-4 space-y-3">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Subtopics</span>
                                  {chapter.subtopics.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 italic">No subtopics defined. Add one below.</p>
                                  ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {chapter.subtopics.map((sub) => {
                                        let statusDot = "bg-slate-300";
                                        let badgeColor = "bg-slate-50 text-slate-500 border-slate-200";
                                        if (sub.status === 'Completed') {
                                          statusDot = "bg-emerald-500";
                                          badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                                        } else if (sub.status === 'In Progress') {
                                          statusDot = "bg-amber-500";
                                          badgeColor = "bg-amber-50 text-amber-700 border-amber-100";
                                        }
                                        return (
                                          <div key={sub.id} className="flex items-center justify-between p-2 bg-slate-50/50 rounded-[6px] border border-slate-200/60 text-xs">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span 
                                                onClick={() => handleToggleSubtopicStatus(selectedSyllabusSubject, chapter.id, sub.id)}
                                                className={`w-2.5 h-2.5 rounded-full shrink-0 cursor-pointer ${statusDot}`}
                                                title={`Click to change status (Currently: ${sub.status})`}
                                              />
                                              <span className="font-semibold text-slate-700 truncate">{sub.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 pl-2">
                                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badgeColor}`}>
                                                {sub.status}
                                              </span>
                                              <button
                                                onClick={() => handleDeleteSubtopic(selectedSyllabusSubject, chapter.id, sub.id)}
                                                className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                                                title="Delete Subtopic"
                                              >
                                                <X className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Add Subtopic form */}
                                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                                    <input
                                      type="text"
                                      placeholder="Add subtopic name..."
                                      value={newSubtopicName[chapter.id] || ""}
                                      onChange={(e) => setNewSubtopicName(prev => ({ ...prev, [chapter.id]: e.target.value }))}
                                      className="flex-1 text-xs border border-[#E2E0D8] rounded-[6px] p-2 bg-white focus:outline-none focus:border-[#000099] font-medium shadow-sm"
                                    />
                                    <button
                                      onClick={() => handleAddSubtopic(selectedSyllabusSubject, chapter.id)}
                                      className="bg-[#000099] hover:bg-blue-900 text-white text-xs font-bold px-3.5 py-2 rounded-[6px] transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Right: Add new chapter form or Create with AI (Iris Mentor) */}
                        <div className="bg-white border border-[#E2E0D8] p-5 rounded-[10px] shadow-sm space-y-4">
                          {/* Tab Switcher inside the card */}
                          <div className="flex border border-[#E2E0D8] rounded-[8px] overflow-hidden bg-slate-50 shadow-inner">
                            <button
                              onClick={() => setSyllabusInputMode('manual')}
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all tracking-wider ${
                                syllabusInputMode === 'manual'
                                  ? 'bg-[#000099] text-white shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800 bg-transparent'
                              }`}
                            >
                              Manual Mode
                            </button>
                            <button
                              onClick={() => setSyllabusInputMode('ai')}
                              className={`flex-1 py-2 text-[10px] font-black uppercase transition-all tracking-wider flex items-center justify-center gap-1 ${
                                syllabusInputMode === 'ai'
                                  ? 'bg-purple-700 text-white shadow-sm'
                                  : 'text-slate-500 hover:text-purple-700 bg-transparent'
                              }`}
                            >
                              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" /> Iris Mentor AI
                            </button>
                          </div>

                          {syllabusInputMode === 'manual' ? (
                            <div className="space-y-3.5">
                              <div>
                                <h4 className="font-bold text-[#000099] text-xs uppercase tracking-wider">Create New Chapter</h4>
                                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Add a new unit to the {selectedSyllabusSubject} plan.</p>
                              </div>
                              <div className="space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chapter Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Chapter 5: Multiplication"
                                    value={newChapterName}
                                    onChange={(e) => setNewChapterName(e.target.value)}
                                    className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2.5 bg-white focus:outline-none focus:border-[#000099] font-medium shadow-sm"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Planned Periods</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={newChapterPeriods}
                                    onChange={(e) => setNewChapterPeriods(parseInt(e.target.value) || 1)}
                                    className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2.5 bg-white focus:outline-none focus:border-[#000099] font-medium shadow-sm"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assessment Tag</label>
                                  <select
                                    value={newChapterAssessment}
                                    onChange={(e) => setNewChapterAssessment(e.target.value)}
                                    className="w-full text-xs border border-[#E2E0D8] bg-white rounded-[8px] p-2.5 focus:outline-none focus:border-[#000099] font-bold text-slate-600 cursor-pointer shadow-sm"
                                  >
                                    <option value="FA1">FA1</option>
                                    <option value="SA1">SA1</option>
                                    <option value="FA3">FA3</option>
                                    <option value="SA2">SA2</option>
                                    <option value="Not Assessed">Not Assessed</option>
                                  </select>
                                </div>

                                <button
                                  onClick={() => handleAddChapter(selectedSyllabusSubject)}
                                  className="w-full bg-[#FF9A01] hover:bg-[#e08800] text-white text-xs font-bold py-2.5 rounded-[8px] shadow-sm transition-colors cursor-pointer mt-2"
                                >
                                  Create Chapter
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3.5">
                              <div className="border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-purple-800 text-xs uppercase tracking-wider flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  Iris Mentor AI Planner
                                </h4>
                                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Generate a complete structured plan based on core syllabus outline.</p>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Chapter List Outline (Optional)</label>
                                <textarea
                                  rows={4}
                                  placeholder="e.g. Fractions&#10;Decimals&#10;Ratio and Proportion&#10;Algebraic Expressions&#10;(Leave empty for Iris Mentor to suggest chapters)"
                                  value={aiOutlineText}
                                  onChange={(e) => setAiOutlineText(e.target.value)}
                                  className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2 bg-white focus:outline-none focus:border-purple-600 font-semibold shadow-sm resize-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Learning Focus & Flow</label>
                                <select
                                  value={aiFocusPath}
                                  onChange={(e) => setAiFocusPath(e.target.value)}
                                  className="w-full text-xs border border-[#E2E0D8] bg-white rounded-[8px] p-2 focus:outline-none focus:border-purple-600 font-bold text-slate-600 cursor-pointer shadow-sm animate-none"
                                >
                                  <option value="Standard Aligned">Standard Aligned (CBSE / NCERT)</option>
                                  <option value="Activity & NEP Compliant">Activity & NEP Compliant</option>
                                  <option value="Concept-First with Buffer">Concept-First with Buffer</option>
                                  <option value="Accelerated Fast-Track">Accelerated Fast-Track</option>
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Target Weeks</label>
                                  <input
                                    type="number"
                                    min="4"
                                    max="40"
                                    value={aiTotalWeeks}
                                    onChange={(e) => setAiTotalWeeks(parseInt(e.target.value) || 16)}
                                    className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2 bg-white focus:outline-none focus:border-purple-600 font-semibold shadow-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Periods / Week</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={aiPeriodsPerWeek}
                                    onChange={(e) => setAiPeriodsPerWeek(parseInt(e.target.value) || 5)}
                                    className="w-full text-xs border border-[#E2E0D8] rounded-[8px] p-2 bg-white focus:outline-none focus:border-purple-600 font-semibold shadow-sm"
                                  />
                                </div>
                              </div>

                              <div className="bg-slate-50 border p-2.5 rounded-lg text-[10.5px] font-semibold text-slate-500 flex flex-col gap-1 leading-normal">
                                <div className="flex justify-between">
                                  <span>Total Period Budget:</span>
                                  <strong className="text-purple-700">{aiTotalWeeks * aiPeriodsPerWeek} periods</strong>
                                </div>
                                <div className="flex justify-between border-t pt-1">
                                  <span>Subject Scope:</span>
                                  <strong>{selectedSyllabusSubject} Plan</strong>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="syncCal"
                                  checked={aiSyncCalendar}
                                  onChange={(e) => setAiSyncCalendar(e.target.checked)}
                                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                                />
                                <label htmlFor="syncCal" className="text-[11px] text-slate-500 font-semibold cursor-pointer">
                                  Sync buffer days dynamically
                                </label>
                              </div>

                              {isAiGenerating ? (
                                <div className="space-y-2 py-1">
                                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700 animate-pulse">
                                    <div className="w-3.5 h-3.5 border-2 border-purple-700 border-t-transparent rounded-full animate-spin shrink-0" />
                                    <span>{aiGenerationStep}</span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-purple-600 h-full rounded-full animate-pulse" style={{ width: '60%' }} />
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={handleTriggerIrisGeneration}
                                  className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white text-xs font-bold py-2.5 rounded-[8px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                                  Generate Plan with Iris Mentor
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-fadeIn text-xs">
                        {currentPlan.chapters.length === 0 ? (
                          <div className="bg-white border border-[#E2E0D8] p-8 rounded-[10px] text-center text-slate-400 font-semibold uppercase tracking-wider">
                            No chapters available to mark progress.
                          </div>
                        ) : (
                          currentPlan.chapters.map((chapter) => {
                            const status = getChapterStatus(chapter, TODAY);
                            
                            let statusBadge = "bg-slate-50 text-slate-500 border-slate-200";
                            let borderLeft = "border-l-[4px] border-l-slate-300";
                            let rowBg = "bg-white";
                            
                            if (status === 'completed') {
                              statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                              borderLeft = "border-l-[4px] border-l-emerald-500";
                              rowBg = "bg-emerald-50/5";
                            } else if (status === 'on-track') {
                              statusBadge = "bg-blue-50 text-blue-700 border-blue-200";
                              borderLeft = "border-l-[4px] border-l-blue-500";
                              rowBg = "bg-blue-50/5";
                            } else if (status === 'target-delay') {
                              statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                              borderLeft = "border-l-[4px] border-l-amber-500";
                              rowBg = "bg-amber-50/5";
                            } else if (status === 'overdue') {
                              statusBadge = "bg-red-50 text-red-700 border-red-200";
                              borderLeft = "border-l-[4px] border-l-red-500";
                              rowBg = "bg-[#FFF5F5]";
                            }

                            return (
                              <div key={chapter.id} className={`${rowBg} border border-[#E2E0D8] ${borderLeft} rounded-[10px] shadow-sm p-4 space-y-4 transition-all`}>
                                
                                {/* Header info */}
                                <div className="flex justify-between items-start gap-4 flex-wrap pb-2 border-b border-slate-100">
                                  <div>
                                    <span className="text-xs font-bold text-slate-800 block">{chapter.name}</span>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-slate-400">
                                      <span>Planned Periods: {chapter.plannedPeriods}</span>
                                      <span>•</span>
                                      <span>Target Date: {chapter.targetDate || "N/A"}</span>
                                      <span>•</span>
                                      <span>Buffer Days: {chapter.bufferDays !== undefined ? chapter.bufferDays : 0} days</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${statusBadge}`}>
                                      {status === 'target-delay' ? 'Target Delay' : status === 'overdue' ? 'Overdue (Past Buffer)' : status}
                                    </span>
                                  </div>
                                </div>

                                {/* Subtopics Checklist and Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  
                                  {/* Subtopics Checklist */}
                                  <div className="space-y-2">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Checklist Subtopics</span>
                                    {chapter.subtopics.length === 0 ? (
                                      <p className="text-[11px] text-slate-400 italic">No subtopics defined.</p>
                                    ) : (
                                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                        {chapter.subtopics.map(sub => (
                                          <label key={sub.id} className="flex items-center gap-2 text-xs text-slate-600 font-semibold cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={sub.status === 'Completed'}
                                              onChange={() => handleToggleSubtopicStatus(selectedSyllabusSubject, chapter.id, sub.id)}
                                              className="accent-[#000099]"
                                            />
                                            <span className={sub.status === 'Completed' ? 'line-through text-slate-400' : ''}>
                                              {sub.name}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Status and Notes Form */}
                                  <div className="space-y-3.5">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Chapter Status</label>
                                      <select
                                        value={chapter.completionStatus || 'Planned'}
                                        onChange={(e) => handleUpdateChapterStatus(selectedSyllabusSubject, chapter.id, e.target.value as any)}
                                        className="w-full border border-[#E2E0D8] rounded p-2 bg-white font-bold text-slate-600 focus:outline-none"
                                      >
                                        <option value="Planned">Planned</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Actual Days Spent</label>
                                      <input
                                        type="number"
                                        min="0"
                                        value={chapter.actualDaysSpent || 0}
                                        onChange={(e) => handleUpdateChapterProgressDetails(selectedSyllabusSubject, chapter.id, { actualDaysSpent: parseInt(e.target.value) || 0 })}
                                        className="w-full border border-[#E2E0D8] rounded p-2 focus:outline-none font-bold text-slate-700"
                                      />
                                    </div>
                                  </div>

                                  {/* Evidence Logging Form */}
                                  <div className="space-y-3.5">
                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Evidence Type</label>
                                      <select
                                        value={chapter.completionEvidence || 'None'}
                                        onChange={(e) => handleUpdateChapterProgressDetails(selectedSyllabusSubject, chapter.id, { completionEvidence: e.target.value })}
                                        className="w-full border border-[#E2E0D8] rounded p-2 bg-white font-bold text-slate-600 focus:outline-none"
                                      >
                                        <option value="None">None</option>
                                        <option value="Homework">Homework</option>
                                        <option value="Classwork">Classwork</option>
                                        <option value="Project">Project</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Assignment">Assignment</option>
                                      </select>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Log Details & Homework Notes</label>
                                      <textarea
                                        value={chapter.completionNotes || ""}
                                        onChange={(e) => handleUpdateChapterProgressDetails(selectedSyllabusSubject, chapter.id, { completionNotes: e.target.value })}
                                        placeholder="Enter completion details, evidence links..."
                                        className="w-full border border-[#E2E0D8] rounded p-2 focus:outline-none text-xs text-slate-700 font-semibold animate-fadeIn"
                                        rows={2}
                                      />
                                    </div>
                                  </div>

                                </div>
                                
                                {/* Save Row Button */}
                                <div className="flex justify-end pt-2">
                                  <button
                                    onClick={() => {
                                      showToast(`Progress logged for ${chapter.name}`);
                                    }}
                                    className="bg-[#000099] hover:bg-blue-900 text-white text-xs font-bold px-4 py-1.5 rounded-[6px] transition-colors cursor-pointer"
                                  >
                                    Save Chapter Progress
                                  </button>
                                </div>

                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ===================================================================
              SCREEN 9: Configuration (Screen 9 - Part K)
              =================================================================== */}
          {currentScreen === 'configuration' && (
            <div className="space-y-6 animate-fadeIn pb-12">
              <div>
                <h1 className="text-xl font-bold text-[#000099] tracking-tight">
                  Curriculum Configuration
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Navkis Educational Centre | 2025-26
                </p>
              </div>

              {/* CARD 1: Academic Setup */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 space-y-4">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider border-b border-[#E2E0D8] pb-2">
                  Academic Setup
                </h3>
                
                <div className="space-y-3">
                  {[
                    { key: 'academicYear', label: 'Academic Year', value: configSetup.academicYear },
                    { key: 'board', label: 'Board', value: configSetup.board },
                    { key: 'classVal', label: 'Class', value: configSetup.classVal },
                    { key: 'section', label: 'Section', value: configSetup.section },
                    { key: 'subject', label: 'Subject', value: configSetup.subject },
                    { key: 'teacher', label: 'Teacher', value: configSetup.teacher }
                  ].map((field) => {
                    const isEditing = editingConfigField === field.key;
                    return (
                      <div key={field.key} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-b-0 text-xs">
                        <span className="font-bold text-slate-500">{field.label}</span>
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="text"
                              value={tempConfigVal}
                              onChange={(e) => setTempConfigVal(e.target.value)}
                              className="border border-[#000099] px-2 py-0.5 rounded-[4px] text-xs font-bold focus:outline-none"
                            />
                            <button 
                              onClick={() => {
                                setConfigSetup(prev => ({ ...prev, [field.key]: tempConfigVal }));
                                setEditingConfigField(null);
                                showToast(`${field.label} updated`);
                              }}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <button 
                              onClick={() => setEditingConfigField(null)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{field.value}</span>
                            <button 
                              onClick={() => {
                                setEditingConfigField(field.key);
                                setTempConfigVal(field.value);
                              }}
                              className="p-1 text-slate-400 hover:text-[#000099] rounded cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD 2: Assessment Windows */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 space-y-4">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider border-b border-[#E2E0D8] pb-2">
                  Assessment Windows
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                        <th className="py-2.5 px-3 font-bold">Assessment</th>
                        <th className="py-2.5 px-3 font-bold">Start Date</th>
                        <th className="py-2.5 px-3 font-bold">End Date</th>
                        <th className="py-2.5 px-3 font-bold">Classes Applicable</th>
                        <th className="py-2.5 px-3 text-center font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E0D8]">
                      {assessments.map((a) => {
                        const isEditing = editingAssessmentId === a.id;
                        return (
                          <tr key={a.id} className="hover:bg-slate-50/20 text-xs">
                            <td className="py-2.5 px-3 font-bold text-slate-800">{a.name}</td>
                            
                            {isEditing ? (
                              <>
                                <td className="py-2.5 px-3">
                                  <input 
                                    type="date"
                                    value={tempAssessmentDates.startDate}
                                    onChange={(e) => setTempAssessmentDates(prev => ({ ...prev, startDate: e.target.value }))}
                                    className="border border-[#000099] px-2 py-0.5 rounded text-xs font-bold"
                                  />
                                </td>
                                <td className="py-2.5 px-3">
                                  <input 
                                    type="date"
                                    value={tempAssessmentDates.endDate}
                                    onChange={(e) => setTempAssessmentDates(prev => ({ ...prev, endDate: e.target.value }))}
                                    className="border border-[#000099] px-2 py-0.5 rounded text-xs font-bold"
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2.5 px-3 font-semibold text-slate-600">
                                  {new Date(a.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-slate-600">
                                  {new Date(a.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                              </>
                            )}
                            
                            <td className="py-2.5 px-3 font-semibold text-slate-600">{a.classes}</td>
                            <td className="py-2.5 px-3 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button 
                                    onClick={() => {
                                      setAssessments(prev => prev.map(item => item.id === a.id ? { ...item, startDate: tempAssessmentDates.startDate, endDate: tempAssessmentDates.endDate } : item));
                                      setEditingAssessmentId(null);
                                      showToast(`${a.name} dates updated`);
                                    }}
                                    className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                  <button 
                                    onClick={() => setEditingAssessmentId(null)}
                                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setEditingAssessmentId(a.id);
                                    setTempAssessmentDates({ startDate: a.startDate, endDate: a.endDate });
                                  }}
                                  className="p-1 text-slate-400 hover:text-[#000099] rounded inline-block cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => showToast("Add Assessment feature is a UI demonstration")}
                    className="border border-[#FF9A01] text-[#FF9A01] hover:bg-orange-50 text-xs font-bold px-4 py-2 rounded-[8px] transition-colors cursor-pointer"
                  >
                    Add Assessment
                  </button>
                </div>
              </div>

              {/* CARD 3: Buffer Days Policy */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 space-y-4">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider border-b border-[#E2E0D8] pb-2">
                  Buffer Days Policy
                </h3>
                
                <div className="flex items-center justify-between text-xs py-2 bg-slate-50 px-3 rounded-[8px] border border-[#E2E0D8]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Global Default:</span>
                    <div className="flex items-center gap-1 bg-white border border-[#E2E0D8] rounded-[6px] p-0.5">
                      <button 
                        onClick={() => setGlobalDefaultBuffer(Math.max(0, globalDefaultBuffer - 1))}
                        className="w-6 h-6 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-slate-800">{globalDefaultBuffer}</span>
                      <button 
                        onClick={() => setGlobalDefaultBuffer(globalDefaultBuffer + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-slate-500 font-semibold">days per month</span>
                  </div>

                  <button 
                    onClick={() => {
                      setBufferConfig(prev => {
                        const copy = { ...prev };
                        Object.keys(copy).forEach(k => {
                          copy[k] = globalDefaultBuffer;
                        });
                        return copy;
                      });
                      showToast(`Applied ${globalDefaultBuffer} days default globally`);
                    }}
                    className="border border-[#E2E0D8] hover:bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-[6px] text-[10px] transition-colors cursor-pointer"
                  >
                    Apply global default to all months
                  </button>
                </div>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-[#E2E0D8]">
                        <th className="py-2 px-3 font-bold">Month</th>
                        <th className="py-2 px-3 font-bold text-center">Working Days</th>
                        <th className="py-2 px-3 font-bold text-center">Configured Buffer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E0D8]">
                      {[
                        { month: 'June', days: 19 },
                        { month: 'July', days: 23 },
                        { month: 'August', days: 19 },
                        { month: 'September', days: 20 },
                        { month: 'October', days: 13 },
                        { month: 'November', days: 18 },
                        { month: 'December', days: 17 },
                        { month: 'January', days: 18 },
                        { month: 'February', days: 20 },
                        { month: 'March', days: 20 }
                      ].map((m) => {
                        const val = bufferConfig[m.month] !== undefined ? bufferConfig[m.month] : 2;
                        
                        // Stepper color based on configured buffer val
                        let stepperColor = 'text-slate-800 bg-white';
                        if (val === 0) {
                          stepperColor = 'text-red-700 bg-red-50 border-red-200';
                        } else if (val === 1) {
                          stepperColor = 'text-amber-700 bg-amber-50 border-amber-200';
                        } else if (val >= 2) {
                          stepperColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                        }

                        return (
                          <tr key={m.month} className="hover:bg-slate-50/20 text-xs">
                            <td className="py-2 px-3 font-bold text-slate-800">{m.month}</td>
                            <td className="py-2 px-3 text-center font-semibold text-slate-600">{m.days}</td>
                            <td className="py-2 px-3 flex justify-center">
                              <div className={`flex items-center gap-1 border border-[#E2E0D8] rounded-[6px] p-0.5 shadow-sm ${stepperColor}`}>
                                <button 
                                  onClick={() => {
                                    const newVal = Math.max(0, val - 1);
                                    setBufferConfig(prev => ({ ...prev, [m.month]: newVal }));
                                  }}
                                  className="w-5.5 h-5.5 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-black">{val}</span>
                                <button 
                                  onClick={() => {
                                    const newVal = val + 1;
                                    setBufferConfig(prev => ({ ...prev, [m.month]: newVal }));
                                  }}
                                  className="w-5.5 h-5.5 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-xs font-bold cursor-pointer"
                                >
                                  +
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

              {/* CARD 4: Notifications Setup (Part G3) */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 space-y-4">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider border-b border-[#E2E0D8] pb-2">
                  Notification Settings
                </h3>
                
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  
                  {/* Toggle 1: Daily 6 PM Check */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-800">Daily 6 PM check</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Auto-check teaching execution status daily.</span>
                    </div>
                    <button 
                      onClick={() => setDaily6PMToggle(!daily6PMToggle)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                        daily6PMToggle ? 'bg-[#000099]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        daily6PMToggle ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 2: Notify Teacher */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-800">Notify teacher</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Send push alerts and system triggers to teachers.</span>
                    </div>
                    <button 
                      onClick={() => setNotifyTeacherToggle(!notifyTeacherToggle)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                        notifyTeacherToggle ? 'bg-[#000099]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifyTeacherToggle ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 3: Notify Coordinator */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-800">Notify coordinator if unresolved after 24 hours</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Escalate unmarked status alerts.</span>
                    </div>
                    <button 
                      onClick={() => setNotifyCoordinator24h(!notifyCoordinator24h)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                        notifyCoordinator24h ? 'bg-[#000099]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifyCoordinator24h ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Toggle 4: Notify VP */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-bold text-slate-800">Notify VP if unresolved after 48 hours</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Final escalation policy level.</span>
                    </div>
                    <button 
                      onClick={() => setNotifyVP48h(!notifyVP48h)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer ${
                        notifyVP48h ? 'bg-[#000099]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                        notifyVP48h ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Checkboxes: Channels */}
                  <div className="pt-2 space-y-2">
                    <span className="block font-bold text-slate-800">Notification Channel</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={channelInApp}
                          onChange={(e) => setChannelInApp(e.target.checked)}
                          className="accent-[#000099]"
                        />
                        <span>In-app</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={channelEmail}
                          onChange={(e) => setChannelEmail(e.target.checked)}
                          className="accent-[#000099]"
                        />
                        <span>Email</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={channelWhatsApp}
                          onChange={(e) => setChannelWhatsApp(e.target.checked)}
                          className="accent-[#000099]"
                        />
                        <span>WhatsApp</span>
                      </label>
                    </div>
                  </div>

                </div>
              </div>

              {/* CARD 5: Reminders & Escalations Policy */}
              <div className="bg-white border border-[#E2E0D8] rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5 space-y-4">
                <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider border-b border-[#E2E0D8] pb-2">
                  Reminders & Escalations Policy
                </h3>
                
                <div className="space-y-4 text-xs">
                  {/* Authorized Target Modifiers */}
                  <div className="space-y-2">
                    <span className="block font-bold text-slate-800">Authorized Target Modifiers</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                      Select the roles permitted to modify target days, target dates, and buffer days in the syllabus plan.
                    </span>
                    <div className="flex gap-4 font-semibold text-slate-700">
                      {[
                        { key: 'teacher', label: 'Teacher' },
                        { key: 'coordinator', label: 'Coordinator' },
                        { key: 'headmaster', label: 'Headmaster' }
                      ].map((roleObj) => {
                        const isChecked = authorizedRoles.includes(roleObj.key);
                        return (
                          <label key={roleObj.key} className="flex items-center gap-1.5 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setAuthorizedRoles(prev => 
                                  prev.includes(roleObj.key) 
                                    ? prev.filter(r => r !== roleObj.key) 
                                    : [...prev, roleObj.key]
                                );
                                showToast(`${roleObj.label} authority updated`);
                              }}
                              className="accent-[#000099]"
                            />
                            <span>{roleObj.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Staff Reminder Threshold */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="block font-bold text-slate-800">Staff Reminder Threshold</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        Days past target date after which warnings are logged or sent to the teacher.
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-[#E2E0D8] rounded-[6px] p-0.5 shadow-sm">
                      <button 
                        type="button"
                        onClick={() => {
                          const newVal = Math.max(0, reminderConfig.staffDaysThreshold - 1);
                          setReminderConfig({ staffDaysThreshold: newVal });
                          showToast(`Reminder threshold set to ${newVal} days`);
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-black text-slate-800">{reminderConfig.staffDaysThreshold}</span>
                      <button 
                        type="button"
                        onClick={() => {
                          const newVal = reminderConfig.staffDaysThreshold + 1;
                          setReminderConfig({ staffDaysThreshold: newVal });
                          showToast(`Reminder threshold set to ${newVal} days`);
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Multi-Level Escalation Policy */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <span className="block font-bold text-slate-800">Multi-Level Escalation Policy</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                      Define levels of escalation when a chapter is delayed beyond its target date and buffer days.
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {escalationConfig.map((esc, index) => {
                        return (
                          <div key={esc.level} className="flex flex-col justify-between bg-slate-50/50 border border-[#E2E0D8] rounded-[8px] p-3 text-xs gap-3">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox"
                                checked={esc.active}
                                onChange={(e) => {
                                  const updated = escalationConfig.map((item, idx) => 
                                    idx === index ? { ...item, active: e.target.checked } : item
                                  );
                                  setEscalationConfig(updated);
                                  showToast(`Level ${esc.level} escalation ${e.target.checked ? 'enabled' : 'disabled'}`);
                                }}
                                className="accent-[#000099] cursor-pointer"
                              />
                              <span className="font-bold text-slate-800">L{esc.level}: {esc.role}</span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-1.5 mt-auto">
                              <span className="text-slate-500 font-semibold text-[10px]">Days post-buffer:</span>
                              <div className="flex items-center gap-1 bg-white border border-[#E2E0D8] rounded-[6px] p-0.5 shadow-sm">
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newVal = Math.max(0, esc.daysAfterBuffer - 1);
                                    const updated = escalationConfig.map((item, idx) => 
                                      idx === index ? { ...item, daysAfterBuffer: newVal } : item
                                    );
                                    setEscalationConfig(updated);
                                    showToast(`L${esc.level} threshold set to ${newVal} days`);
                                  }}
                                  className="w-5 h-5 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-bold text-slate-800">{esc.daysAfterBuffer}</span>
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newVal = esc.daysAfterBuffer + 1;
                                    const updated = escalationConfig.map((item, idx) => 
                                      idx === index ? { ...item, daysAfterBuffer: newVal } : item
                                    );
                                    setEscalationConfig(updated);
                                    showToast(`L${esc.level} threshold set to ${newVal} days`);
                                  }}
                                  className="w-5 h-5 flex items-center justify-center bg-slate-50 text-slate-700 hover:bg-slate-100 rounded text-xs font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Save Configuration Button */}
              <button 
                onClick={() => {
                  showToast("Configuration saved");
                }}
                className="w-full bg-[#000099] hover:bg-blue-900 text-white text-xs font-bold py-3 rounded-[10px] shadow-md transition-colors cursor-pointer animate-fadeIn"
              >
                Save Configuration
              </button>

            </div>
          )}

        </main>
      </div>

      {/* Footer component */}
      <footer className="bg-white border-t border-[#E2E0D8] py-4 mt-auto">
        <div className="max-w-[1048px] mx-auto px-6 text-center">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
            Navkis Educational Centre Academic Planner - Prototype demonstration
          </p>
          <p className="text-[9px] text-slate-300 font-semibold mt-1">
            Build with React + Tailwind CSS.
          </p>
        </div>
      </footer>

      {/* Mini Timetable Drawer (Part H2) */}
      {miniTimetableOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          {/* Click outside overlay */}
          <div className="fixed inset-0" onClick={() => setMiniTimetableOpen(false)} />
          
          <div className="w-80 bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#E2E0D8] relative z-50 animate-slideIn text-slate-800">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
                <h2 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                  Class 1A - English Timetable
                </h2>
                <button 
                  onClick={() => setMiniTimetableOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Weekly Grid */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-200 text-[10px] text-center">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2 border-r border-slate-200 font-bold">Slot</th>
                      <th className="py-2 border-r border-slate-200 font-bold">Mon</th>
                      <th className="py-2 border-r border-slate-200 font-bold">Tue</th>
                      <th className="py-2 border-r border-slate-200 font-bold">Wed</th>
                      <th className="py-2 border-r border-slate-200 font-bold">Thu</th>
                      <th className="py-2 border-r border-slate-200 font-bold">Fri</th>
                      <th className="py-2 font-bold">Sat</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-3.5 border-r border-slate-200 font-bold bg-slate-50">P1</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 bg-[#000099] text-white font-bold">ENG</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 bg-[#000099] text-white font-bold">ENG</td>
                      <td className="py-3.5 font-semibold text-slate-400">-</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-3.5 border-r border-slate-200 font-bold bg-slate-50">P2</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 bg-[#000099] text-white font-bold">ENG</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 font-semibold text-slate-400">-</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-3.5 border-r border-slate-200 font-bold bg-slate-50">P3</td>
                      <td className="py-3.5 border-r border-slate-200 bg-[#000099] text-white font-bold">ENG</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 bg-[#000099] text-white font-bold">ENG</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 border-r border-slate-200 font-bold bg-slate-50">P4</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 bg-[#000099] text-white font-bold">ENG</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 border-r border-slate-200 font-semibold text-slate-400">-</td>
                      <td className="py-3.5 font-semibold text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Timetable metadata */}
              <div className="space-y-2 bg-[#F8F8F6] p-3 rounded-[8px] border border-[#E2E0D8] text-[11px] font-bold text-slate-600 leading-normal">
                <p>Periods per week: 6 | Teacher: Priya R</p>
                <div className="flex items-center gap-1 text-slate-400">
                  <span>Source: Timetable Module</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setMiniTimetableOpen(false)}
              className="w-full bg-[#000099] hover:bg-blue-900 text-white font-bold py-2.5 rounded-[8px] text-xs transition-colors cursor-pointer"
            >
              Close Timetable
            </button>
          </div>
        </div>
      )}

      {/* ALP Change History Modal (Part I2) */}
      {alpLogOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          {/* Click outside overlay */}
          <div className="fixed inset-0" onClick={() => setAlpLogOpen(false)} />
          
          <div className="bg-white rounded-[10px] border border-[#E2E0D8] shadow-2xl max-w-md w-full p-6 space-y-5 relative z-50 text-slate-800">
            <div className="flex items-center justify-between border-b border-[#E2E0D8] pb-3">
              <h3 className="text-xs font-black text-[#000099] uppercase tracking-wider">
                ALP Change History - Class 1A English 2025-26
              </h3>
              <button 
                onClick={() => setAlpLogOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Timeline */}
            <div className="max-h-96 overflow-y-auto pl-2 pr-1">
              <div className="relative border-l-2 border-slate-200 ml-2.5 pl-5 space-y-4 text-xs">
                {alpLog.map((log, idx) => {
                  let dotBg = 'bg-[#000099]';
                  if (log.type === 'create' || log.type === 'approve') {
                    dotBg = 'bg-emerald-500';
                  } else if (log.type === 'return') {
                    dotBg = 'bg-[#FF9A01]';
                  }
                  
                  return (
                    <div key={idx} className="relative">
                      {/* Dot */}
                      <span className={`absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full border border-white ${dotBg}`} />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{log.action}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{log.date} at {log.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          by {log.by} {log.note ? `- "${log.note}"` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setAlpLogOpen(false)}
                className="bg-[#000099] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-[8px] text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: IRIS MENTOR AI GENERATED PREVIEW ──────────────────── */}
      {aiGeneratedChapters && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#E2E0D8] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[85vh]">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                Iris Mentor AI Syllabus Draft: {selectedSyllabusSubject}
              </h3>
              <button onClick={() => setAiGeneratedChapters(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">×</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Course Summary</span>
                  <span className="text-sm font-bold text-slate-800 block">
                    {selectedSyllabusSubject} Plan · {aiTotalWeeks} Weeks Plan
                  </span>
                  <span className="text-xs text-slate-500 block font-semibold">
                    Focus: <strong className="text-purple-700">{aiFocusPath}</strong> · {aiTotalWeeks * aiPeriodsPerWeek} Total Periods
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 bg-yellow-50 border border-yellow-250 text-yellow-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  Iris Mentor Optimized
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Proposed Chapter & Subtopic Breakdown</span>
                <div className="space-y-3">
                  {aiGeneratedChapters.map((ch, idx) => (
                    <div key={idx} className="border border-slate-250 rounded-xl p-3 bg-white space-y-2">
                      <div className="flex justify-between items-start gap-2 flex-wrap pb-1.5 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{ch.name}</span>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                            Target Date: {ch.targetDate} · Buffer: {ch.bufferDays} Days
                          </span>
                        </div>
                        <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-black uppercase">
                          {ch.plannedPeriods} Periods
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {ch.subtopics.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-700 shrink-0" />
                            <span className="truncate">{sub.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 py-3 px-6 flex gap-3 justify-end shrink-0">
              <button
                type="button"
                onClick={() => setAiGeneratedChapters(null)}
                className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Discard & Close
              </button>
              <button
                type="button"
                onClick={handleApplyAiGeneratedPlan}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Check className="w-4 h-4" />
                Approve & Apply Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification (Part J2 & K) */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 bg-[#000099] text-white py-3 px-5 rounded-[10px] shadow-2xl border border-white/10 text-xs font-bold z-[100] transition-opacity">
          {activeToast}
        </div>
      )}

    </div>
  );
}
