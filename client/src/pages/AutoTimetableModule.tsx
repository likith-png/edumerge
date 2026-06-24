import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import {
  Calendar,
  Settings,
  GraduationCap,
  Brain,
  Users,
  Grid,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCcw,
  RefreshCw,
  CheckCircle,
  FileText,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Undo,
  Redo,
  ChevronRight,
  Microscope,
  Info,
  Clock,
  Building,
  UserCheck,
  Award,
  Layers
} from 'lucide-react';



interface Version {
  id: string;
  label: string;
  timestamp: string;
  author: string;
  score: number;
  active: boolean;
}

interface ElectivePool {
  id: string;
  groupName: string;
  sharedClasses: string;
  assignedTeacher: string;
  status: string;
}

interface Room {
  id: string;
  name: string;
  type: 'Regular Classroom' | 'Science Lab' | 'Computer Lab' | 'Language Lab' | 'Art Room' | 'Library' | 'Activity Hall';
  subjectEligibility: string;
  capacity: string;
  exclusivity: 'Exclusive Only' | 'Shared';
  availableDays: string[];
  exclusiveClass?: string;
}

interface PartTimeTeacher {
  id: string;
  name: string;
  days: string;
  val: boolean;
}

interface SubjectMaster {
  id: string;
  name: string;
  category: 'Academic' | 'Co-Scholastic' | 'Lab' | 'Language' | 'Elective';
  requiresLab: boolean;
  code: string;
  color: string;
}

interface ClassSubjectMapping {
  id: string;
  className: string;
  subjects: {
    subjectId: string;
    minPeriods: number;
    maxPeriods: number;
    overridePeriods?: number;
  }[];
}

interface TeacherProfile {
  id: string;
  name: string;
  empId: string;
  department: string;
  type: 'Full-Time' | 'Part-Time' | 'Guest' | 'Contract';
  subjectsCanTeach: string[];
  classesAssigned: string[];
  targetLoad: number;
  maxDaily: number;
  maxConsecutive: number;
  availableDays: string[];
  availableTimeStart: string;
  availableTimeEnd: string;
  preferredSlots: string[];
}

const AutoTimetableModule: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'setup' | 'autogen' | 'manual' | 'analytics'>('setup');
  
  // Institution Level (School vs College)
  const [institutionType, setInstitutionType] = useState<'School' | 'College'>('School');

  // Setup Subtabs within Setup
  const [setupSubTab, setSetupSubTab] = useState<'profile' | 'subjects' | 'teachers' | 'rooms' | 'rules'>('profile');

  // PCM / PCB stream mapping
  const [selectedStream, setSelectedStream] = useState<'PCM' | 'PCB' | 'Commerce' | 'Humanities'>('PCM');
  
  // 1.1 School Identity
  const [schoolName, setSchoolName] = useState('Navkis Educational Centre');
  const [boardType, setBoardType] = useState<'CBSE' | 'ICSE' | 'State Board'>('CBSE');
  const [academicYearStart, setAcademicYearStart] = useState('2026-06-01');
  const [academicYearEnd, setAcademicYearEnd] = useState('2027-03-31');
  const [schoolLevels, setSchoolLevels] = useState<string[]>(['Middle', 'Secondary', 'Senior Secondary']);
  const [saturdayWorking, setSaturdayWorking] = useState<'Full day' | 'Half day' | 'Holiday'>('Half day');
  const [schoolTimezone, setSchoolTimezone] = useState('IST');

  // 1.2 Daily Time Configuration
  const [schoolStartTime, setSchoolStartTime] = useState('08:00');
  const [schoolEndTime, setSchoolEndTime] = useState('15:00');
  const [periodDuration, setPeriodDuration] = useState<number>(45);
  const [saturdayEndTime, setSaturdayEndTime] = useState('12:30');
  const [saturdayPeriodDuration, setSaturdayPeriodDuration] = useState<number>(35);

  // 1.3 Break & Recess Configuration
  const [assemblyDuration, setAssemblyDuration] = useState<number>(15);
  const [assemblyDays, setAssemblyDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [breaks, setBreaks] = useState<{ id: string; label: string; startTime: string; duration: number }[]>([
    { id: 'brk-1', label: 'Recess', startTime: '10:30', duration: 20 },
    { id: 'brk-2', label: 'Lunch Break', startTime: '12:30', duration: 40 }
  ]);
  const [saturdayBreaks, setSaturdayBreaks] = useState<{ id: string; label: string; startTime: string; duration: number }[]>([
    { id: 'satbrk-1', label: 'Tea Break', startTime: '10:15', duration: 15 }
  ]);

  // 1.4 Period Count Configuration
  const [periodsCount, setPeriodsCount] = useState<number>(8);
  const [saturdayPeriodsCount, setSaturdayPeriodsCount] = useState<number>(5);
  const [labPeriodPairs, setLabPeriodPairs] = useState<string[]>(['P5+P6', 'P6+P7']);
  const [coScholasticSlots, setCoScholasticSlots] = useState<string[]>(['P7', 'P8']);
  const [libraryFreeToggle, setLibraryFreeToggle] = useState<boolean>(true);
  const [librarySlotPreference, setLibrarySlotPreference] = useState<string>('P8');

  // 2.1 Subject Master
  const [subjectsList, setSubjectsList] = useState<SubjectMaster[]>([
    { id: 'sub-m1', name: 'Mathematics', category: 'Academic', requiresLab: false, code: 'MATH', color: '#3b82f6' },
    { id: 'sub-m2', name: 'Physics', category: 'Lab', requiresLab: true, code: 'PHYS', color: '#6366f1' },
    { id: 'sub-m3', name: 'Chemistry', category: 'Lab', requiresLab: true, code: 'CHEM', color: '#10b981' },
    { id: 'sub-m4', name: 'English', category: 'Language', requiresLab: false, code: 'ENGL', color: '#ec4899' },
    { id: 'sub-m5', name: 'Biology', category: 'Lab', requiresLab: true, code: 'BIOL', color: '#14b8a6' },
    { id: 'sub-m6', name: 'History & Civics', category: 'Academic', requiresLab: false, code: 'HIST', color: '#f59e0b' },
    { id: 'sub-m7', name: 'Art / Craft', category: 'Co-Scholastic', requiresLab: false, code: 'ARTC', color: '#8b5cf6' }
  ]);

  // 2.2 Class-Subject Mapping
  const [classMappings, setClassMappings] = useState<ClassSubjectMapping[]>([
    {
      id: 'map-1',
      className: 'Std 11A',
      subjects: [
        { subjectId: 'sub-m1', minPeriods: 5, maxPeriods: 7 },
        { subjectId: 'sub-m2', minPeriods: 4, maxPeriods: 6 },
        { subjectId: 'sub-m3', minPeriods: 4, maxPeriods: 6 },
        { subjectId: 'sub-m4', minPeriods: 4, maxPeriods: 5 }
      ]
    },
    {
      id: 'map-2',
      className: 'Std 11B',
      subjects: [
        { subjectId: 'sub-m4', minPeriods: 4, maxPeriods: 5 },
        { subjectId: 'sub-m5', minPeriods: 4, maxPeriods: 6 },
        { subjectId: 'sub-m3', minPeriods: 4, maxPeriods: 6 }
      ]
    }
  ]);

  // 3.1 Teacher Profile
  const [teachers, setTeachers] = useState<TeacherProfile[]>([
    {
      id: 't-1',
      name: 'Dr. K. Sharma',
      empId: 'EM-402',
      department: 'Mathematics',
      type: 'Full-Time',
      subjectsCanTeach: ['Mathematics'],
      classesAssigned: ['Std 11A', 'Std 12A'],
      targetLoad: 24,
      maxDaily: 6,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00',
      preferredSlots: ['P1', 'P2', 'P3']
    },
    {
      id: 't-2',
      name: 'Mrs. A. Sen',
      empId: 'EM-108',
      department: 'Languages',
      type: 'Full-Time',
      subjectsCanTeach: ['English'],
      classesAssigned: ['Std 11A', 'Std 11B'],
      targetLoad: 18,
      maxDaily: 5,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00',
      preferredSlots: ['P3', 'P4', 'P5']
    },
    {
      id: 't-3',
      name: 'Prof. S. Jenkins',
      empId: 'EM-551',
      department: 'Science',
      type: 'Part-Time',
      subjectsCanTeach: ['Physics'],
      classesAssigned: ['Std 11A', 'Std 11B'],
      targetLoad: 16,
      maxDaily: 4,
      maxConsecutive: 2,
      availableDays: ['Mon', 'Wed', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '13:00',
      preferredSlots: ['P1', 'P2']
    },
    {
      id: 't-4',
      name: 'Dr. R. Prasad',
      empId: 'EM-331',
      department: 'Science',
      type: 'Full-Time',
      subjectsCanTeach: ['Chemistry'],
      classesAssigned: ['Std 11A', 'Std 11B'],
      targetLoad: 20,
      maxDaily: 5,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00',
      preferredSlots: ['P2', 'P3', 'P4']
    },
    {
      id: 't-5',
      name: 'Mrs. M. Ali',
      empId: 'EM-241',
      department: 'Science',
      type: 'Full-Time',
      subjectsCanTeach: ['Biology'],
      classesAssigned: ['Std 11B'],
      targetLoad: 18,
      maxDaily: 5,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00',
      preferredSlots: ['P4', 'P5']
    },
    {
      id: 't-6',
      name: 'Mr. V. Patel',
      empId: 'EM-504',
      department: 'Humanities',
      type: 'Full-Time',
      subjectsCanTeach: ['History & Civics'],
      classesAssigned: ['Std 11A', 'Std 11B'],
      targetLoad: 18,
      maxDaily: 5,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00',
      preferredSlots: ['P1', 'P2']
    },
    {
      id: 't-7',
      name: 'Ms. S. Roy',
      empId: 'EM-612',
      department: 'Arts',
      type: 'Part-Time',
      subjectsCanTeach: ['Art / Craft'],
      classesAssigned: ['Std 11A', 'Std 11B'],
      targetLoad: 12,
      maxDaily: 3,
      maxConsecutive: 2,
      availableDays: ['Tue', 'Thu'],
      availableTimeStart: '09:00',
      availableTimeEnd: '14:00',
      preferredSlots: ['P5', 'P6']
    }
  ]);

  // 3.3 HOD per Department
  const [hods, setHods] = useState<Record<string, string>>({
    'Mathematics': 'Dr. K. Sharma',
    'Science': 'Prof. S. Jenkins',
    'Languages': 'Mrs. A. Sen'
  });
  const [workloadEquity, setWorkloadEquity] = useState<boolean>(true);
  const [equityThreshold, setEquityThreshold] = useState<number>(3);

  // 4.1 Room Master & Registry
  const [rooms, setRooms] = useState<Room[]>([
    { id: 'r-1', name: 'Physics Lab', type: 'Science Lab', subjectEligibility: 'Physics', capacity: '35', exclusivity: 'Exclusive Only', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 'r-2', name: 'Chemistry Lab', type: 'Science Lab', subjectEligibility: 'Chemistry', capacity: '30', exclusivity: 'Exclusive Only', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { id: 'r-3', name: 'General Auditorium', type: 'Activity Hall', subjectEligibility: 'Art / Craft', capacity: '150', exclusivity: 'Shared', availableDays: ['Mon', 'Wed', 'Fri'] }
  ]);

  // 4.2 Lab Groups & Rotation Schedule
  const [labGroupSplit, setLabGroupSplit] = useState<boolean>(true);
  const [labGroupSize, setLabGroupSize] = useState<number>(20);

  // 1.1 Elective Pools (For backward compatibility / view logic)
  const [electivePools, setElectivePools] = useState<ElectivePool[]>([
    { id: 'ep-1', groupName: 'Physics Lab Group 1', sharedClasses: 'Std 11A, 11B', assignedTeacher: 'Prof. S. Jenkins', status: 'Synced' },
    { id: 'ep-2', groupName: 'PCM Maths Advanced', sharedClasses: 'Std 11A, 12A', assignedTeacher: 'Dr. K. Sharma', status: 'Conflicts Checked' },
    { id: 'ep-3', groupName: 'PCB Biotech Pool', sharedClasses: 'Std 11B, 11C', assignedTeacher: 'Dr. R. Prasad', status: 'Needs Teacher' }
  ]);

  const [partTimeTeachers, setPartTimeTeachers] = useState<PartTimeTeacher[]>([
    { id: 'pt-1', name: 'Dr. K. Sharma (Maths)', days: 'Mon, Wed, Fri (Morning Only)', val: true },
    { id: 'pt-2', name: 'Mrs. A. Sen (English)', days: 'Tue, Thu (Afternoon Only)', val: true },
    { id: 'pt-3', name: 'Prof. S. Jenkins (Physics)', days: 'Full Time', val: false }
  ]);

  // Modal Visibility States
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showAddPoolModal, setShowAddPoolModal] = useState(false);
  const [showAddPtTeacherModal, setShowAddPtTeacherModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showAddClassMapModal, setShowAddClassMapModal] = useState(false);

  // Form states for modals
  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'Regular Classroom' as Room['type'],
    subjectEligibility: '',
    capacity: '',
    exclusivity: 'Exclusive Only' as 'Exclusive Only' | 'Shared',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    exclusiveClass: ''
  });

  const [newPool, setNewPool] = useState({
    groupName: '',
    sharedClasses: '',
    assignedTeacher: '',
    status: 'Synced'
  });

  const [newPtTeacher, setNewPtTeacher] = useState({
    name: '',
    days: '',
    val: true
  });

  const [newSubject, setNewSubject] = useState({
    name: '',
    category: 'Academic' as SubjectMaster['category'],
    requiresLab: false,
    code: '',
    color: '#3b82f6'
  });

  const [newTeacherProfile, setNewTeacherProfile] = useState({
    name: '',
    empId: '',
    department: 'Science',
    type: 'Full-Time' as TeacherProfile['type'],
    subjectsCanTeach: [] as string[],
    classesAssigned: [] as string[],
    targetLoad: 24,
    maxDaily: 6,
    maxConsecutive: 3,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableTimeStart: '08:00',
    availableTimeEnd: '15:00'
  });

  const [newClassMap, setNewClassMap] = useState({
    className: '',
    subjectId: '',
    minPeriods: 4,
    maxPeriods: 6
  });

  // Constraints Weights & Settings (Hard / Soft / Auto-Rules)
  const [hardConstraints, setHardConstraints] = useState({
    doubleBooking: true,
    classDoubleAssignment: true,
    labDoublePeriod: true,
    roomCapacity: true,
    partTimeWindow: true
  });

  const [softConstraints, setSoftConstraints] = useState({
    consecutiveDays: true,
    morningPriority: true,
    maxConsecutive: 3,
    workloadSpread: true,
    seniorPreference: false,
    avoidLastPeriodHeavy: true,
    gapBetweenSameSubject: true,
    libraryPeriodLast: true,
    teacherFreePeriodGaps: true
  });
  const [softPriority, setSoftPriority] = useState<string[]>([
    'consecutiveDays',
    'morningPriority',
    'workloadSpread',
    'avoidLastPeriodHeavy',
    'gapBetweenSameSubject',
    'libraryPeriodLast',
    'seniorPreference',
    'teacherFreePeriodGaps'
  ]);
  const [softThresholds, setSoftThresholds] = useState<Record<string, number>>({
    consecutiveDays: 80,
    morningPriority: 90,
    workloadSpread: 75,
    avoidLastPeriodHeavy: 60,
    gapBetweenSameSubject: 85,
    libraryPeriodLast: 50,
    seniorPreference: 40,
    teacherFreePeriodGaps: 70
  });

  const [newBreak, setNewBreak] = useState({ label: 'Short Break', startTime: '10:30', duration: 15 });
  const [newSatBreak, setNewSatBreak] = useState({ label: 'Tea Break', startTime: '10:15', duration: 15 });

  const moveSoftPriority = (index: number, direction: 'up' | 'down') => {
    const nextPriority = [...softPriority];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= nextPriority.length) return;
    const temp = nextPriority[index];
    nextPriority[index] = nextPriority[targetIdx];
    nextPriority[targetIdx] = temp;
    setSoftPriority(nextPriority);
    triggerToast('Soft constraint priority adjusted.');
  };

  const [autoRules, setAutoRules] = useState({
    autoSubOnLeaveApproval: true,
    autoStandingRuleApplication: false,
    autoRegenerateOnMajorChange: true,
    autoLockAfterPublish: true,
    autoPeriodOverflowWarning: true,
    autoHolidaySync: true,
    autoNotifyOnTimetableChange: true
  });

  // Solver Simulation State
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(94);
  const [showFailureReport, setShowFailureReport] = useState(false);

  // Versions History
  const [versions, setVersions] = useState<Version[]>([
    { id: 'v1', label: 'v1.0 - Initial Draft', timestamp: '15 June 2026 10:30 AM', author: 'Principal (Trust)', score: 88, active: false },
    { id: 'v2', label: 'v2.0 - Constraint Corrected', timestamp: '16 June 2026 11:15 AM', author: 'Principal (Trust)', score: 94, active: true }
  ]);
  const [selectedVersion, setSelectedVersion] = useState<string>('v2');

  // Manual Override Grid Simulation (All periods populated by default in mockup)
  const [gridData, setGridData] = useState<Record<string, { subject: string; teacher: string; room: string; locked?: boolean }>>({
    // Monday
    'Mon-1': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Mon-2': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: true },
    'Mon-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: true },
    'Mon-4': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    'Mon-5': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    'Mon-6': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    'Mon-7': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302' },
    'Mon-8': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium' },
    // Tuesday
    'Tue-1': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab' },
    'Tue-2': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Tue-3': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    'Tue-4': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    'Tue-5': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab' },
    'Tue-6': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302' },
    'Tue-7': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium' },
    // Wednesday
    'Wed-1': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    'Wed-2': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab' },
    'Wed-3': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Wed-4': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab' },
    'Wed-5': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    'Wed-6': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302' },
    // Thursday
    'Thu-1': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302' },
    'Thu-2': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    'Thu-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab' },
    'Thu-4': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab' },
    'Thu-5': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Thu-6': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    // Friday
    'Fri-1': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab' },
    'Fri-2': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' },
    'Fri-3': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302' },
    'Fri-4': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Fri-5': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab' },
    'Fri-6': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    // Saturday
    'Sat-1': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301' },
    'Sat-2': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301' },
    'Sat-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab' },
    'Sat-4': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab' }
  });

  const [timetableGenerated, setTimetableGenerated] = useState<boolean>(true);
  const [timetableLocked, setTimetableLocked] = useState<boolean>(true);
  const [showEditCellModal, setShowEditCellModal] = useState(false);
  const [editingCellKey, setEditingCellKey] = useState<string | null>(null);
  const [editingCellData, setEditingCellData] = useState({ subject: '', teacher: '', room: '', locked: false });

  // Manual override history
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [draggedCell, setDraggedCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);



  // Notifications Log
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Run simulated AI engine generation solver
  const handleStartGeneration = () => {
    setGenerating(true);
    setGenerationProgress(5);
    setGenerationStep('Reading HRMS personal calendars & leave data...');
    setShowFailureReport(false);

    const steps = [
      { p: 20, text: 'Resolving PCM/PCB stream allocations...' },
      { p: 45, text: 'Evaluating part-time availability time window constraints...' },
      { p: 65, text: 'Mapping co-scholastic specialists & lab capacities...' },
      { p: 85, text: 'Running constraint resolution annealing cycles...' },
      { p: 95, text: 'Testing timetable version delta rules...' },
      { p: 100, text: 'Finalising conflict-free schedule grid structure!' }
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setGenerationProgress(steps[currentStepIndex].p);
        setGenerationStep(steps[currentStepIndex].text);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setGenerating(false);
        const nextId = `v${versions.length + 1}`;
        const newVersion: Version = {
          id: nextId,
          label: `v${versions.length}.0 - Auto Generated`,
          timestamp: new Date().toLocaleString(),
          author: 'Principal (AI Solver)',
          score: 96,
          active: true
        };
        const fullGeneratedGrid = {
          // Monday
          'Mon-1': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Mon-2': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Mon-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Mon-4': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Mon-5': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Mon-6': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Mon-7': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Mon-8': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium', locked: false },
          // Tuesday
          'Tue-1': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Tue-2': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Tue-3': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Tue-4': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Tue-5': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Tue-6': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Tue-7': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium', locked: false },
          'Tue-8': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          // Wednesday
          'Wed-1': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Wed-2': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Wed-3': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Wed-4': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Wed-5': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Wed-6': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Wed-7': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Wed-8': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium', locked: false },
          // Thursday
          'Thu-1': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Thu-2': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Thu-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Thu-4': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Thu-5': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Thu-6': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Thu-7': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Thu-8': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          // Friday
          'Fri-1': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Fri-2': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Fri-3': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Fri-4': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Fri-5': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Fri-6': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Fri-7': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Fri-8': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          // Saturday
          'Sat-1': { subject: 'Mathematics', teacher: 'Dr. K. Sharma', room: 'Room 301', locked: false },
          'Sat-2': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false },
          'Sat-3': { subject: 'Physics', teacher: 'Prof. S. Jenkins', room: 'Physics Lab', locked: false },
          'Sat-4': { subject: 'Chemistry', teacher: 'Dr. R. Prasad', room: 'Chemistry Lab', locked: false },
          'Sat-5': { subject: 'Biology', teacher: 'Mrs. M. Ali', room: 'Biology Lab', locked: false },
          'Sat-6': { subject: 'History & Civics', teacher: 'Mr. V. Patel', room: 'Room 302', locked: false },
          'Sat-7': { subject: 'Art / Craft', teacher: 'Ms. S. Roy', room: 'General Auditorium', locked: false },
          'Sat-8': { subject: 'English', teacher: 'Mrs. A. Sen', room: 'Room 301', locked: false }
        };
        setVersions(versions.map(v => ({ ...v, active: false })).concat(newVersion));
        setSelectedVersion(nextId);
        setTimetableGenerated(true);
        setTimetableLocked(true);
        setGridData(fullGeneratedGrid);
        triggerToast('Timetable auto-generated successfully and locked for editing!');
      }
    }, 1200);
  };

  // Drag and drop grid simulation helpers
  const handleDragStart = (cellKey: string) => {
    if (timetableLocked) {
      triggerToast('Timetable is locked! Unlock it from the toolbar first.');
      return;
    }
    if (gridData[cellKey]?.locked) {
      triggerToast('Cannot move a locked period! Unlock it first.');
      return;
    }
    setDraggedCell(cellKey);
  };

  const handleDragOver = (e: React.DragEvent, cellKey: string) => {
    e.preventDefault();
    setHoveredCell(cellKey);
  };

  const handleDrop = (cellKey: string) => {
    if (timetableLocked) {
      triggerToast('Timetable is locked! Unlock it from the toolbar first.');
      return;
    }
    if (!draggedCell || draggedCell === cellKey) return;
    
    // Check conflicts simulation
    const draggedItem = gridData[draggedCell];
    const targetItem = gridData[cellKey];

    if (targetItem?.locked) {
      triggerToast('Cannot drop onto a locked cell.');
      setDraggedCell(null);
      setHoveredCell(null);
      return;
    }

    // Save history for undo
    setUndoStack([{ ...gridData }, ...undoStack]);
    setRedoStack([]);

    // Perform swap
    const nextGrid = { ...gridData };
    if (draggedItem) {
      nextGrid[cellKey] = { ...draggedItem };
    } else {
      delete nextGrid[cellKey];
    }

    if (targetItem) {
      nextGrid[draggedCell] = { ...targetItem };
    } else {
      delete nextGrid[draggedCell];
    }

    setGridData(nextGrid);
    triggerToast(`Swapped ${draggedCell} and ${cellKey}. Real-time conflict checks verified.`);
    setDraggedCell(null);
    setHoveredCell(null);
  };

  const toggleCellLock = (cellKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (timetableLocked) {
      triggerToast('Timetable is locked! Unlock it from the toolbar first.');
      return;
    }
    if (!gridData[cellKey]) return;
    const nextGrid = { ...gridData };
    nextGrid[cellKey].locked = !nextGrid[cellKey].locked;
    setGridData(nextGrid);
    triggerToast(nextGrid[cellKey].locked ? `Locked cell ${cellKey}` : `Unlocked cell ${cellKey}`);
  };

  const handleCellClick = (cellKey: string) => {
    if (timetableLocked) {
      triggerToast('Timetable is locked! Unlock it from the toolbar first.');
      return;
    }
    const cell = gridData[cellKey];
    setEditingCellKey(cellKey);
    if (cell) {
      setEditingCellData({
        subject: cell.subject || '',
        teacher: cell.teacher || '',
        room: cell.room || '',
        locked: cell.locked || false
      });
    } else {
      setEditingCellData({
        subject: '',
        teacher: '',
        room: '',
        locked: false
      });
    }
    setShowEditCellModal(true);
  };

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCellKey) return;

    setUndoStack([{ ...gridData }, ...undoStack]);
    setRedoStack([]);

    const nextGrid = { ...gridData };
    if (editingCellData.subject === 'N/A' || !editingCellData.subject) {
      delete nextGrid[editingCellKey];
      triggerToast(`Cleared schedule for ${editingCellKey.split('-')[0]} Period ${editingCellKey.split('-')[1]} (set to N/A).`);
    } else {
      nextGrid[editingCellKey] = {
        subject: editingCellData.subject,
        teacher: editingCellData.teacher,
        room: editingCellData.room,
        locked: editingCellData.locked
      };
      triggerToast(`Updated schedule for ${editingCellKey.split('-')[0]} Period ${editingCellKey.split('-')[1]}.`);
    }
    setGridData(nextGrid);
    setShowEditCellModal(false);
    setEditingCellKey(null);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[0];
    setRedoStack([ { ...gridData }, ...redoStack]);
    setUndoStack(undoStack.slice(1));
    setGridData(prev);
    triggerToast('Undo performed.');
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setUndoStack([ { ...gridData }, ...undoStack]);
    setRedoStack(redoStack.slice(1));
    setGridData(next);
    triggerToast('Redo performed.');
  };



  // Setup CRUD handlers
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name.trim()) {
      triggerToast('Room name is required.');
      return;
    }
    const created: Room = {
      id: `r-${Date.now()}`,
      name: newRoom.name,
      type: newRoom.type,
      subjectEligibility: newRoom.subjectEligibility || 'General',
      capacity: newRoom.capacity ? `${newRoom.capacity} Students` : '30 Students',
      exclusivity: newRoom.exclusivity,
      availableDays: newRoom.availableDays,
      exclusiveClass: newRoom.exclusiveClass || undefined
    };
    setRooms([...rooms, created]);
    setNewRoom({
      name: '',
      type: 'Regular Classroom',
      subjectEligibility: '',
      capacity: '',
      exclusivity: 'Exclusive Only',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      exclusiveClass: ''
    });
    setShowAddRoomModal(false);
    triggerToast(`Room "${created.name}" registered successfully.`);
  };

  const handleDeleteRoom = (id: string) => {
    const target = rooms.find(r => r.id === id);
    setRooms(rooms.filter(r => r.id !== id));
    triggerToast(`Room "${target?.name || ''}" removed from registry.`);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name.trim()) {
      triggerToast('Subject name is required.');
      return;
    }
    if (subjectsList.some(s => s.name.toLowerCase() === newSubject.name.toLowerCase())) {
      triggerToast(`Subject "${newSubject.name}" already exists.`);
      return;
    }
    const created: SubjectMaster = {
      id: `sub-m${Date.now()}`,
      name: newSubject.name,
      category: newSubject.category,
      requiresLab: newSubject.requiresLab,
      code: newSubject.code.trim().toUpperCase() || newSubject.name.slice(0, 4).toUpperCase(),
      color: newSubject.color
    };
    setSubjectsList([...subjectsList, created]);
    setNewSubject({ name: '', category: 'Academic', requiresLab: false, code: '', color: '#3b82f6' });
    setShowAddSubjectModal(false);
    triggerToast(`Subject "${created.name}" added to master list.`);
  };

  const handleDeleteSubject = (id: string) => {
    const target = subjectsList.find(s => s.id === id);
    setSubjectsList(subjectsList.filter(s => s.id !== id));
    triggerToast(`Subject "${target?.name || ''}" removed.`);
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherProfile.name.trim()) {
      triggerToast('Teacher name is required.');
      return;
    }
    const created: TeacherProfile = {
      id: `t-${Date.now()}`,
      name: newTeacherProfile.name,
      empId: newTeacherProfile.empId || `EM-${Math.floor(100 + Math.random() * 900)}`,
      department: newTeacherProfile.department,
      type: newTeacherProfile.type,
      subjectsCanTeach: newTeacherProfile.subjectsCanTeach.length > 0 ? newTeacherProfile.subjectsCanTeach : ['General'],
      classesAssigned: newTeacherProfile.classesAssigned.length > 0 ? newTeacherProfile.classesAssigned : ['Std 11A'],
      targetLoad: newTeacherProfile.targetLoad,
      maxDaily: newTeacherProfile.maxDaily,
      maxConsecutive: newTeacherProfile.maxConsecutive,
      availableDays: newTeacherProfile.availableDays,
      availableTimeStart: newTeacherProfile.availableTimeStart,
      availableTimeEnd: newTeacherProfile.availableTimeEnd,
      preferredSlots: ['P1', 'P2', 'P3']
    };
    setTeachers([...teachers, created]);
    setNewTeacherProfile({
      name: '',
      empId: '',
      department: 'Science',
      type: 'Full-Time',
      subjectsCanTeach: [],
      classesAssigned: [],
      targetLoad: 24,
      maxDaily: 6,
      maxConsecutive: 3,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      availableTimeStart: '08:00',
      availableTimeEnd: '15:00'
    });
    setShowAddTeacherModal(false);
    triggerToast(`Teacher "${created.name}" profile added.`);
  };

  const handleDeleteTeacher = (id: string) => {
    const target = teachers.find(t => t.id === id);
    setTeachers(teachers.filter(t => t.id !== id));
    triggerToast(`Teacher "${target?.name || ''}" profile deleted.`);
  };

  const handleAddClassMap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassMap.className.trim() || !newClassMap.subjectId) {
      triggerToast('Class name and Subject are required.');
      return;
    }
    const targetClass = classMappings.find(c => c.className.toLowerCase() === newClassMap.className.toLowerCase());
    if (targetClass) {
      // Add subject to class mapping
      if (targetClass.subjects.some(s => s.subjectId === newClassMap.subjectId)) {
        triggerToast('Subject is mapped already to this class.');
        return;
      }
      setClassMappings(classMappings.map(m => {
        if (m.className.toLowerCase() === newClassMap.className.toLowerCase()) {
          return {
            ...m,
            subjects: [...m.subjects, { subjectId: newClassMap.subjectId, minPeriods: newClassMap.minPeriods, maxPeriods: newClassMap.maxPeriods }]
          };
        }
        return m;
      }));
    } else {
      // Create new class mapping
      const created: ClassSubjectMapping = {
        id: `map-${Date.now()}`,
        className: newClassMap.className,
        subjects: [{ subjectId: newClassMap.subjectId, minPeriods: newClassMap.minPeriods, maxPeriods: newClassMap.maxPeriods }]
      };
      setClassMappings([...classMappings, created]);
    }
    setNewClassMap({ className: '', subjectId: '', minPeriods: 4, maxPeriods: 6 });
    setShowAddClassMapModal(false);
    triggerToast(`Mapped subject to class successfully.`);
  };

  const handleDeleteClassMap = (classMapId: string, subjectId: string) => {
    setClassMappings(classMappings.map(m => {
      if (m.id === classMapId) {
        return {
          ...m,
          subjects: m.subjects.filter(s => s.subjectId !== subjectId)
        };
      }
      return m;
    }).filter(m => m.subjects.length > 0));
    triggerToast('Removed subject mapping.');
  };

  const handleUpdateClassPeriod = (classId: string, subjectId: string, field: 'minPeriods' | 'maxPeriods' | 'overridePeriods', val: number) => {
    setClassMappings(classMappings.map(m => {
      if (m.id === classId) {
        return {
          ...m,
          subjects: m.subjects.map(s => {
            if (s.subjectId === subjectId) {
              return { ...s, [field]: val };
            }
            return s;
          })
        };
      }
      return m;
    }));
  };

  const handleAddElectivePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPool.groupName.trim()) {
      triggerToast('Group name is required.');
      return;
    }
    const created: ElectivePool = {
      id: `ep-${Date.now()}`,
      groupName: newPool.groupName,
      sharedClasses: newPool.sharedClasses || 'Std 11A',
      assignedTeacher: newPool.assignedTeacher || 'TBD',
      status: newPool.status
    };
    setElectivePools([...electivePools, created]);
    setNewPool({ groupName: '', sharedClasses: '', assignedTeacher: '', status: 'Synced' });
    setShowAddPoolModal(false);
    triggerToast(`Elective Pool "${created.groupName}" created successfully.`);
  };

  const handleDeleteElectivePool = (id: string) => {
    const target = electivePools.find(p => p.id === id);
    setElectivePools(electivePools.filter(p => p.id !== id));
    triggerToast(`Elective Pool "${target?.groupName || ''}" deleted.`);
  };

  const handleAddPtTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtTeacher.name.trim()) {
      triggerToast('Teacher name is required.');
      return;
    }
    const created: PartTimeTeacher = {
      id: `pt-${Date.now()}`,
      name: newPtTeacher.name,
      days: newPtTeacher.days || 'Flexible Slots',
      val: newPtTeacher.val
    };
    setPartTimeTeachers([...partTimeTeachers, created]);
    setNewPtTeacher({ name: '', days: '', val: true });
    setShowAddPtTeacherModal(false);
    triggerToast(`Availability window added for ${created.name}.`);
  };

  const handleDeletePtTeacher = (id: string) => {
    const target = partTimeTeachers.find(t => t.id === id);
    setPartTimeTeachers(partTimeTeachers.filter(t => t.id !== id));
    triggerToast(`Availability window for ${target?.name || ''} removed.`);
  };

  const parseTimeToMins = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const formatMinsToTime = (mins: number) => {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const calculateWeekdayPeriods = () => {
    const startMins = parseTimeToMins(schoolStartTime);
    const endMins = parseTimeToMins(schoolEndTime);
    const totalMins = endMins - startMins;
    if (totalMins <= 0) return 0;
    const assemblyTotal = assemblyDays.length > 0 ? assemblyDuration : 0;
    const breaksTotal = breaks.reduce((acc, curr) => acc + curr.duration, 0);
    const instructionMins = totalMins - assemblyTotal - breaksTotal;
    return Math.max(0, Math.floor(instructionMins / (periodDuration || 45)));
  };

  const getTimelineBlocks = (isSaturday: boolean) => {
    const blocks: {
      type: 'assembly' | 'period' | 'break';
      label: string;
      startTime: string;
      endTime: string;
      duration: number;
      color: string;
    }[] = [];
    const startTimeStr = schoolStartTime || '08:00';
    const endTimeStr = isSaturday && saturdayWorking === 'Half day' ? saturdayEndTime || '12:30' : schoolEndTime || '15:00';
    const durationVal = isSaturday && saturdayWorking === 'Half day' ? saturdayPeriodDuration || 35 : periodDuration || 45;

    const startMins = parseTimeToMins(startTimeStr);
    const endMins = parseTimeToMins(endTimeStr);
    
    let curr = startMins;

    if (!isSaturday && assemblyDuration > 0) {
      const assemblyEnd = curr + assemblyDuration;
      blocks.push({
        type: 'assembly',
        label: 'Assembly',
        startTime: formatMinsToTime(curr),
        endTime: formatMinsToTime(assemblyEnd),
        duration: assemblyDuration,
        color: 'bg-purple-500/20 text-purple-700 border-purple-300'
      });
      curr = assemblyEnd;
    }

    const activeBreaks = [...(isSaturday ? saturdayBreaks : breaks)].sort(
      (a, b) => parseTimeToMins(a.startTime) - parseTimeToMins(b.startTime)
    );

    let periodIdx = 1;
    let loopCount = 0;
    const maxSafety = 40;

    while (curr < endMins && loopCount < maxSafety) {
      loopCount++;
      const nextBreak = activeBreaks.find((b) => {
        const bMins = parseTimeToMins(b.startTime);
        return bMins >= curr && bMins < curr + durationVal;
      });

      if (nextBreak) {
        const breakMins = parseTimeToMins(nextBreak.startTime);
        if (breakMins > curr) {
          blocks.push({
            type: 'period',
            label: `P${periodIdx}`,
            startTime: formatMinsToTime(curr),
            endTime: formatMinsToTime(breakMins),
            duration: breakMins - curr,
            color: 'bg-blue-500/10 text-blue-800 border-blue-200'
          });
          periodIdx++;
        }

        const breakEnd = breakMins + nextBreak.duration;
        blocks.push({
          type: 'break',
          label: nextBreak.label,
          startTime: nextBreak.startTime,
          endTime: formatMinsToTime(breakEnd),
          duration: nextBreak.duration,
          color: 'bg-amber-500/20 text-amber-800 border-amber-300'
        });
        curr = breakEnd;
        const idx = activeBreaks.indexOf(nextBreak);
        activeBreaks.splice(idx, 1);
      } else {
        const pEnd = Math.min(curr + durationVal, endMins);
        blocks.push({
          type: 'period',
          label: `P${periodIdx}`,
          startTime: formatMinsToTime(curr),
          endTime: formatMinsToTime(pEnd),
          duration: pEnd - curr,
          color: 'bg-blue-500/10 text-blue-800 border-blue-200 hover:bg-blue-500/20'
        });
        periodIdx++;
        curr = pEnd;
      }
    }

    return blocks;
  };

  const totalWeeklyPeriods = (periodsCount * 5) + (saturdayWorking === 'Full day' ? periodsCount : saturdayWorking === 'Half day' ? saturdayPeriodsCount : 0);

  const checklistItems = [
    { id: 'profile', label: 'School/College Profile Settings', done: schoolName.trim().length > 0 && schoolLevels.length > 0 },
    { id: 'time', label: 'Daily Time Grid Defined', done: schoolStartTime !== '' && schoolEndTime !== '' && periodDuration >= 30 },
    { id: 'assembly', label: 'Assembly Schedule Locked', done: assemblyDuration > 0 && assemblyDays.length > 0 },
    { id: 'breaks', label: 'Short Break & Lunch Configured', done: breaks.length > 0 },
    { id: 'subjects', label: 'Min 5 Subjects Registered', done: subjectsList.length >= 5 },
    { id: 'classMap', label: 'Classes Mapped with Subjects', done: classMappings.length > 0 && classMappings.every(m => m.subjects.length > 0) },
    { id: 'teachers', label: 'Teachers Assigned to All Subjects', done: teachers.length > 0 && subjectsList.every(sub => teachers.some(t => t.subjectsCanTeach.includes(sub.name))) },
    { id: 'rooms', label: 'Lab & Room Capacities Set', done: rooms.length > 0 },
    { id: 'softConstraints', label: 'Soft Constraints Prioritised', done: true },
    { id: 'autoRules', label: 'Auto Substitution & Sync reviewed', done: true }
  ];

  const completedCount = checklistItems.filter(item => item.done).length;
  const checklistPercent = Math.round((completedCount / checklistItems.length) * 100);
  const allRequiredDone = checklistItems.every(item => item.done);

  const isStepCompleted = (stepId: 'profile' | 'subjects' | 'teachers' | 'rooms' | 'rules') => {
    if (stepId === 'profile') {
      return !!(checklistItems.find(i => i.id === 'profile')?.done &&
             checklistItems.find(i => i.id === 'time')?.done &&
             checklistItems.find(i => i.id === 'assembly')?.done &&
             checklistItems.find(i => i.id === 'breaks')?.done);
    }
    if (stepId === 'subjects') {
      return !!(checklistItems.find(i => i.id === 'subjects')?.done &&
             checklistItems.find(i => i.id === 'classMap')?.done);
    }
    if (stepId === 'teachers') {
      return !!checklistItems.find(i => i.id === 'teachers')?.done;
    }
    if (stepId === 'rooms') {
      return !!checklistItems.find(i => i.id === 'rooms')?.done;
    }
    if (stepId === 'rules') {
      return !!(checklistItems.find(i => i.id === 'softConstraints')?.done &&
             checklistItems.find(i => i.id === 'autoRules')?.done);
    }
    return false;
  };

  return (
    <Layout
      title="Auto Timetable Module"
      description="Next-generation leave-aware algorithm engine, stream pooling matrix & integrated HRMS substitutions."
      icon={Calendar}
    >
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-10 z-[100] animate-bounce bg-slate-900 border border-emerald-500 text-white rounded-xl shadow-xl px-5 py-3.5 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-black uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6 pb-20">
        {/* Core Subtabs bar (Glassmorphism Styled) */}
        <div className="flex flex-wrap gap-2 bg-white/40 p-2 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg">
          {[
            { id: 'setup', label: 'Setup Wizard', icon: Settings },
            { id: 'autogen', label: 'AI Solver', icon: Brain },
            { id: 'manual', label: 'Manual Editor', icon: Grid },
            { id: 'analytics', label: 'Analytics & Fairness', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-350 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-200/50 scale-[1.03] border border-white/20'
                  : 'text-slate-650 hover:bg-white/40 hover:text-slate-900 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: SETUP & CONFIGURATION ────────────────────────────── */}
        {activeTab === 'setup' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {/* Left 3 Columns: Configuration Panel */}
            <div className="lg:col-span-3 space-y-6">
              {/* Setup Steps progression bar (Glassmorphism Styled) */}
              <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-md">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-450 select-none flex-wrap md:flex-nowrap gap-4">
                  {[
                    { step: 1, id: 'profile', label: '1. Identity & Time' },
                    { step: 2, id: 'subjects', label: '2. Subjects Map' },
                    { step: 3, id: 'teachers', label: '3. Teacher Registry' },
                    { step: 4, id: 'rooms', label: '4. Rooms & Labs' },
                    { step: 5, id: 'rules', label: '5. Rules & Weights' }
                  ].map((s) => {
                    const isActive = setupSubTab === s.id;
                    const isDone = isStepCompleted(s.id as any);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSetupSubTab(s.id as any)}
                        className={`flex items-center gap-2 pb-2 border-b-2 text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'border-[#000099] text-[#000099] font-black'
                            : 'border-transparent text-slate-450 hover:text-slate-850'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        ) : (
                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center text-[9px] font-bold shrink-0 transition-all ${
                            isActive ? 'border-[#000099] bg-[#000099] text-white' : 'border-slate-350 bg-white/40 text-slate-500'
                          }`}>
                            {s.step}
                          </div>
                        )}
                        <span>{s.label.split('. ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subtab 1: profile */}
              {setupSubTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Identity and Working Days */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                      <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">{institutionType === 'College' ? 'College Identity' : 'School Identity'}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400">{institutionType === 'College' ? 'College Name' : 'School Name'}</label>
                          <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="h-10 border-slate-200" />
                        </div>

                        {institutionType === 'School' && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 block">School Board</label>
                            <select
                              value={boardType}
                              onChange={(e: any) => setBoardType(e.target.value)}
                              className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                            >
                              <option value="CBSE">CBSE</option>
                              <option value="ICSE">ICSE</option>
                              <option value="State Board">State Board</option>
                            </select>
                          </div>
                        )}

                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="text-xs font-bold text-slate-700 uppercase">Institution Mode</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase ${institutionType === 'School' ? 'text-[#000099]' : 'text-slate-400'}`}>School</span>
                            <Switch checked={institutionType === 'College'} onCheckedChange={(checked) => setInstitutionType(checked ? 'College' : 'School')} />
                            <span className={`text-[10px] font-black uppercase ${institutionType === 'College' ? 'text-indigo-600' : 'text-slate-400'}`}>College</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Academic Year Start</label>
                            <Input type="date" value={academicYearStart} onChange={(e) => setAcademicYearStart(e.target.value)} className="h-10 border-slate-200" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Academic Year End</label>
                            <Input type="date" value={academicYearEnd} onChange={(e) => setAcademicYearEnd(e.target.value)} className="h-10 border-slate-200" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 block">{institutionType === 'College' ? 'College Levels' : 'School Levels'}</label>
                          <div className="flex flex-wrap gap-2">
                            {(institutionType === 'College' ? ['UG', 'PG', 'Diploma', 'Doctoral'] : ['Primary', 'Middle', 'Secondary', 'Senior Secondary']).map((level) => {
                              const active = schoolLevels.includes(level);
                              return (
                                <button
                                  key={level}
                                  type="button"
                                  onClick={() => {
                                    if (active) {
                                      setSchoolLevels(schoolLevels.filter(l => l !== level));
                                    } else {
                                      setSchoolLevels([...schoolLevels, level]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                    active
                                      ? 'bg-slate-900 border-slate-900 text-white'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {level}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 block">Saturday Working</label>
                            <select
                              value={saturdayWorking}
                              onChange={(e: any) => setSaturdayWorking(e.target.value)}
                              className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                            >
                              <option value="Holiday">Holiday</option>
                              <option value="Half day">Half day</option>
                              <option value="Full day">Full day</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400 block">Timezone</label>
                            <Input value={schoolTimezone} onChange={(e) => setSchoolTimezone(e.target.value)} className="h-10 border-slate-200" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Daily Time Configuration */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                      <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Daily Time Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">School Start Time</label>
                            <Input type="time" value={schoolStartTime} onChange={(e) => setSchoolStartTime(e.target.value)} className="h-10 border-slate-200" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">School End Time</label>
                            <Input type="time" value={schoolEndTime} onChange={(e) => setSchoolEndTime(e.target.value)} className="h-10 border-slate-200" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400">Weekday Period Duration (mins)</label>
                          <Input type="number" value={periodDuration} onChange={(e) => setPeriodDuration(Number(e.target.value))} className="h-10 border-slate-200" min={30} max={60} />
                        </div>

                        {saturdayWorking === 'Half day' && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-top-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-slate-400">Saturday End Time</label>
                              <Input type="time" value={saturdayEndTime} onChange={(e) => setSaturdayEndTime(e.target.value)} className="h-10 border-slate-200" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-slate-400">Saturday Period (mins)</label>
                              <Input type="number" value={saturdayPeriodDuration} onChange={(e) => setSaturdayPeriodDuration(Number(e.target.value))} className="h-10 border-slate-200" />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
                            <span className="text-[9px] font-black uppercase text-indigo-500 block">Weekday Periods (Calc: {calculateWeekdayPeriods()})</span>
                            <span className="text-2xl font-black text-indigo-950">{periodsCount} <span className="text-[10px] font-bold text-slate-400 uppercase">/ day</span></span>
                            <button
                              type="button"
                              onClick={() => {
                                const calc = calculateWeekdayPeriods();
                                setPeriodsCount(calc);
                                triggerToast(`Synced weekday periods to calculated: ${calc}`);
                              }}
                              className="text-[9px] text-indigo-700 hover:text-indigo-900 underline font-black block uppercase tracking-wider mt-1"
                            >
                              Sync Calculated Count
                            </button>
                          </div>
                          <div className="space-y-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                            <span className="text-[9px] font-black uppercase text-blue-500 block">Saturday Periods</span>
                            <span className="text-2xl font-black text-blue-950">{saturdayWorking === 'Half day' ? saturdayPeriodsCount : saturdayWorking === 'Full day' ? periodsCount : 0} <span className="text-[10px] font-bold text-slate-400 uppercase">/ day</span></span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Break & Recess Setup */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Break & Recess Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Assembly morning prayer */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-slate-50 rounded-xl border relative">
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[8px] font-black text-rose-700 uppercase">
                          <Lock className="w-2 h-2" /> Always Locked
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400">Morning Assembly Duration (mins)</label>
                          <Input type="number" value={assemblyDuration} onChange={(e) => setAssemblyDuration(Number(e.target.value))} className="h-10 border-slate-200 bg-white" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 block">Assembly Days</label>
                          <div className="flex flex-wrap gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => {
                              const active = assemblyDays.includes(day);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    if (active) {
                                      setAssemblyDays(assemblyDays.filter(d => d !== day));
                                    } else {
                                      setAssemblyDays([...assemblyDays, day]);
                                    }
                                  }}
                                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${
                                    active
                                      ? 'bg-purple-600 border-purple-600 text-white'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Recess/Lunch lists */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Weekday Breaks */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Weekday Recess & Lunch Breaks</h4>
                          <div className="border rounded-xl overflow-hidden text-xs bg-slate-50">
                            <div className="grid grid-cols-4 p-2.5 font-bold uppercase text-[9px] border-b text-slate-500">
                              <span>Label</span>
                              <span>Start Time</span>
                              <span>Duration</span>
                              <span className="text-right">Actions</span>
                            </div>
                            {breaks.length === 0 && (
                              <p className="p-4 text-center text-slate-400 font-bold uppercase tracking-wider text-[10px]">No breaks configured</p>
                            )}
                            {breaks.map((b) => (
                              <div key={b.id} className="grid grid-cols-4 p-2.5 bg-white border-b items-center font-medium">
                                <span className="font-bold text-slate-800">{b.label}</span>
                                <span>{b.startTime}</span>
                                <span>{b.duration} mins</span>
                                <div className="text-right">
                                  <button
                                    type="button"
                                    onClick={() => setBreaks(breaks.filter(item => item.id !== b.id))}
                                    className="text-rose-500 hover:text-rose-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 ml-auto" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border items-end">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Label</label>
                              <Input
                                value={newBreak.label}
                                onChange={(e) => setNewBreak({ ...newBreak, label: e.target.value })}
                                className="h-8 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Start Time</label>
                              <Input
                                type="time"
                                value={newBreak.startTime}
                                onChange={(e) => setNewBreak({ ...newBreak, startTime: e.target.value })}
                                className="h-8 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Duration (m)</label>
                              <div className="flex gap-1.5">
                                <Input
                                  type="number"
                                  value={newBreak.duration}
                                  onChange={(e) => setNewBreak({ ...newBreak, duration: Number(e.target.value) })}
                                  className="h-8 text-xs bg-white border-slate-200 w-16"
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setBreaks([...breaks, { id: `brk-${Date.now()}`, ...newBreak }]);
                                    triggerToast(`Break "${newBreak.label}" added.`);
                                  }}
                                  size="sm"
                                  className="h-8 bg-slate-900 text-white font-black text-[9px] px-2.5 rounded-lg animate-in fade-in"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Saturday Breaks */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Saturday Breaks</h4>
                          <div className="border rounded-xl overflow-hidden text-xs bg-slate-50">
                            <div className="grid grid-cols-4 p-2.5 font-bold uppercase text-[9px] border-b text-slate-500">
                              <span>Label</span>
                              <span>Start Time</span>
                              <span>Duration</span>
                              <span className="text-right">Actions</span>
                            </div>
                            {saturdayBreaks.length === 0 && (
                              <p className="p-4 text-center text-slate-400 font-bold uppercase tracking-wider text-[10px]">No Saturday breaks</p>
                            )}
                            {saturdayBreaks.map((b) => (
                              <div key={b.id} className="grid grid-cols-4 p-2.5 bg-white border-b items-center font-medium">
                                <span className="font-bold text-slate-800">{b.label}</span>
                                <span>{b.startTime}</span>
                                <span>{b.duration} mins</span>
                                <div className="text-right">
                                  <button
                                    type="button"
                                    onClick={() => setSaturdayBreaks(saturdayBreaks.filter(item => item.id !== b.id))}
                                    className="text-rose-500 hover:text-rose-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 ml-auto" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border items-end">
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Label</label>
                              <Input
                                value={newSatBreak.label}
                                onChange={(e) => setNewSatBreak({ ...newSatBreak, label: e.target.value })}
                                className="h-8 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Start Time</label>
                              <Input
                                type="time"
                                value={newSatBreak.startTime}
                                onChange={(e) => setNewSatBreak({ ...newSatBreak, startTime: e.target.value })}
                                className="h-8 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-slate-400">Duration (m)</label>
                              <div className="flex gap-1.5">
                                <Input
                                  type="number"
                                  value={newSatBreak.duration}
                                  onChange={(e) => setNewSatBreak({ ...newSatBreak, duration: Number(e.target.value) })}
                                  className="h-8 text-xs bg-white border-slate-200 w-16"
                                />
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setSaturdayBreaks([...saturdayBreaks, { id: `satbrk-${Date.now()}`, ...newSatBreak }]);
                                    triggerToast(`Saturday break "${newSatBreak.label}" added.`);
                                  }}
                                  size="sm"
                                  className="h-8 bg-slate-900 text-white font-black text-[9px] px-2.5 rounded-lg animate-in fade-in"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Live Proportional Timeline Builder Visualizer */}
                      <div className="space-y-3.5 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Live Daily Timeline Block Builder</h4>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">Proportional blocks layout based on duration (mins)</span>
                        </div>

                        {/* Weekday Timeline */}
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">Weekday Daily Timeline View:</div>
                          <div className="w-full flex bg-slate-100 rounded-xl overflow-hidden border p-1 gap-1 h-16 relative">
                            {getTimelineBlocks(false).map((block, index) => {
                              const startVal = parseTimeToMins(schoolStartTime);
                              const endVal = parseTimeToMins(schoolEndTime);
                              const totalVal = endVal - startVal || 1;
                              const blockStart = parseTimeToMins(block.startTime);
                              const blockEnd = parseTimeToMins(block.endTime);
                              const blockDur = blockEnd - blockStart;
                              const wPercent = (blockDur / totalVal) * 100;
                              return (
                                <div
                                  key={index}
                                  className={`h-full rounded-lg border flex flex-col justify-center px-2 text-[10px] font-semibold transition-all relative overflow-hidden group shadow-inner ${block.color}`}
                                  style={{ width: `${Math.max(8, wPercent)}%` }}
                                >
                                  <div className="font-black truncate uppercase text-[9px]">{block.label}</div>
                                  <div className="text-[8px] opacity-75 truncate">{block.startTime} - {block.endTime}</div>
                                  <div className="absolute inset-0 bg-slate-900/5 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 font-bold transition-opacity text-[9px]">
                                    {block.duration}m
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Saturday Timeline */}
                        {saturdayWorking === 'Half day' && (
                          <div className="space-y-1.5 pt-2">
                            <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">Saturday Daily Timeline View (Half Day):</div>
                            <div className="w-full flex bg-slate-100 rounded-xl overflow-hidden border p-1 gap-1 h-16 relative">
                              {getTimelineBlocks(true).map((block, index) => {
                                const startVal = parseTimeToMins(schoolStartTime);
                                const endVal = parseTimeToMins(saturdayEndTime);
                                const totalVal = endVal - startVal || 1;
                                const blockStart = parseTimeToMins(block.startTime);
                                const blockEnd = parseTimeToMins(block.endTime);
                                const blockDur = blockEnd - blockStart;
                                const wPercent = (blockDur / totalVal) * 100;
                                return (
                                  <div
                                    key={index}
                                    className={`h-full rounded-lg border flex flex-col justify-center px-2 text-[10px] font-semibold transition-all relative overflow-hidden group shadow-inner ${block.color}`}
                                    style={{ width: `${Math.max(8, wPercent)}%` }}
                                  >
                                    <div className="font-black truncate uppercase text-[9px]">{block.label}</div>
                                    <div className="text-[8px] opacity-75 truncate">{block.startTime} - {block.endTime}</div>
                                    <div className="absolute inset-0 bg-slate-900/5 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 font-bold transition-opacity text-[9px]">
                                      {block.duration}m
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Period Counts / Lab slots */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Double Period, Co-Scholastic & Library Slots</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lab Double Period Slots */}
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-400 block">Lab / Double Period Eligible Pairs</label>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Only consecutive period slots selected here can host double periods or laboratory subjects.</p>
                          <div className="flex flex-wrap gap-2.5">
                            {['P1+P2', 'P2+P3', 'P3+P4', 'P4+P5', 'P5+P6', 'P6+P7', 'P7+P8'].map((pair) => {
                              const active = labPeriodPairs.includes(pair);
                              return (
                                <button
                                  key={pair}
                                  type="button"
                                  onClick={() => {
                                    if (active) {
                                      setLabPeriodPairs(labPeriodPairs.filter(p => p !== pair));
                                    } else {
                                      setLabPeriodPairs([...labPeriodPairs, pair]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all border ${
                                    active
                                      ? 'bg-[#000099] border-[#000099] text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {pair}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Co-Scholastic slots */}
                        <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-400 block">Co-Scholastic Slots (Art / Music / PT)</label>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Select slots designated for co-scholastic modules. The main academic generator skips scheduling subjects in these.</p>
                          <div className="flex flex-wrap gap-2.5">
                            {['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map((slot) => {
                              const active = coScholasticSlots.includes(slot);
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => {
                                    if (active) {
                                      setCoScholasticSlots(coScholasticSlots.filter(s => s !== slot));
                                    } else {
                                      setCoScholasticSlots([...coScholasticSlots, slot]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all border ${
                                    active
                                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Library free periods */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-50 border rounded-xl gap-4">
                        <div className="space-y-1">
                          <div className="text-xs font-black uppercase text-slate-800">Weekly Library / Free Period Reservation</div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Enforces soft constraints to leave one period open per week for library reading</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-600 uppercase">Reserve slot:</span>
                            <select
                              value={librarySlotPreference}
                              onChange={(e) => setLibrarySlotPreference(e.target.value)}
                              className="h-9 w-24 border border-slate-200 rounded-lg px-2 bg-white text-xs font-semibold text-slate-700"
                            >
                              <option value="P1">Period 1</option>
                              <option value="P4">Period 4</option>
                              <option value="P7">Period 7</option>
                              <option value="P8">Period 8</option>
                            </select>
                          </div>
                          <Switch checked={libraryFreeToggle} onCheckedChange={(val) => setLibraryFreeToggle(val)} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Next Step Nav Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        setSetupSubTab('subjects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#000099] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg shadow-sm"
                    >
                      Next Step: Subject Mapping →
                    </Button>
                  </div>
                </div>
              )}

              {/* Subtab 2: subjects (Subjects and Mapping) */}
              {setupSubTab === 'subjects' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Subject Registry Card */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 flex flex-row justify-between items-center">
                      <div className="space-y-0.5">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Subject Master Registry</CardTitle>
                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase">Define subjects taught in the system and colors assigned in grids</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowAddSubjectModal(true)}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider h-8 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Subject
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px]">
                              <th className="p-3">Subject Name</th>
                              <th className="p-3">Code</th>
                              <th className="p-3">Category</th>
                              <th className="p-3 text-center">Requires Lab</th>
                              <th className="p-3">Grid Color</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subjectsList.map((sub) => (
                              <tr key={sub.id} className="border-b hover:bg-slate-50/50 transition-colors font-medium">
                                <td className="p-3 font-bold text-slate-800">{sub.name}</td>
                                <td className="p-3"><code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-black text-[10px]">{sub.code}</code></td>
                                <td className="p-3"><Badge variant="outline" className="bg-slate-50 text-slate-600 text-[8px] font-bold uppercase">{sub.category}</Badge></td>
                                <td className="p-3 text-center">{sub.requiresLab ? <span className="text-emerald-600 font-bold uppercase text-[10px]">Yes (2x Period)</span> : <span className="text-slate-400">No</span>}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: sub.color }} />
                                    <span className="text-[10px] font-mono">{sub.color}</span>
                                  </div>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubject(sub.id)}
                                    className="text-rose-600 hover:text-rose-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Class-Subject Mapping Mapping Matrix Card */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 flex flex-row justify-between items-center">
                      <div className="space-y-0.5">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">{institutionType === 'College' ? 'Semester-Subject Mapping Matrix' : 'Class-Subject Mapping Matrix'}</CardTitle>
                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase">Assign subjects to classes and define weekly periods targets</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowAddClassMapModal(true)}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider h-8 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Map New Subject
                      </Button>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                        {classMappings.map((cls) => {
                          const totalClassMinPeriods = cls.subjects.reduce((sum, s) => sum + s.minPeriods, 0);
                          const isOverload = totalClassMinPeriods > totalWeeklyPeriods;

                          return (
                            <div key={cls.id} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                              <div className="flex justify-between items-center border-b pb-2">
                                <h4 className="text-xs font-black uppercase text-slate-800">{cls.className} Subject Loads</h4>
                                <div className="flex items-center gap-3">
                                  <span className={`text-[10px] font-black uppercase ${isOverload ? 'text-rose-600' : 'text-slate-500'}`}>
                                    Total Min: {totalClassMinPeriods} / {totalWeeklyPeriods} periods/week
                                  </span>
                                  {isOverload && (
                                    <Badge className="bg-rose-100 text-rose-700 border border-rose-200 text-[8px] font-black uppercase">
                                      ⚠️ Period Deficit Alert
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {cls.subjects.map((subMap) => {
                                  const subDetails = subjectsList.find(s => s.id === subMap.subjectId);
                                  if (!subDetails) return null;
                                  return (
                                    <div key={subMap.subjectId} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-inner">
                                      <div>
                                        <div className="text-xs font-bold text-slate-800">{subDetails.name}</div>
                                        <div className="text-[9px] text-slate-400 font-bold uppercase">{subDetails.code} · {subDetails.category}</div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2.5">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[9px] font-black text-slate-400 uppercase">Min:</span>
                                          <input
                                            type="number"
                                            value={subMap.minPeriods}
                                            onChange={(e) => handleUpdateClassPeriod(cls.id, subMap.subjectId, 'minPeriods', Number(e.target.value))}
                                            className="w-10 h-7 border rounded text-center text-[11px] font-bold text-slate-700 bg-slate-50"
                                            min={1}
                                            max={12}
                                          />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-[9px] font-black text-slate-400 uppercase">Max:</span>
                                          <input
                                            type="number"
                                            value={subMap.maxPeriods}
                                            onChange={(e) => handleUpdateClassPeriod(cls.id, subMap.subjectId, 'maxPeriods', Number(e.target.value))}
                                            className="w-10 h-7 border rounded text-center text-[11px] font-bold text-slate-700 bg-slate-50"
                                            min={1}
                                            max={12}
                                          />
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <span className="text-[9px] font-black text-slate-400 uppercase">Override:</span>
                                          <input
                                            type="number"
                                            value={subMap.overridePeriods || ''}
                                            onChange={(e) => handleUpdateClassPeriod(cls.id, subMap.subjectId, 'overridePeriods', Number(e.target.value))}
                                            placeholder="N/A"
                                            className="w-10 h-7 border rounded text-center text-[11px] font-bold text-slate-700 bg-slate-50"
                                            min={0}
                                            max={12}
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteClassMap(cls.id, subMap.subjectId)}
                                          className="text-rose-500 hover:text-rose-700"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 ml-1" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Stream mapping builder for PCM/PCB */}
                      <div className="border-t pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Streams Config & Elective Pooling</h4>
                          <Button
                            type="button"
                            onClick={() => setShowAddPoolModal(true)}
                            className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider h-8 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Elective Pool
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl border space-y-3">
                            <h5 className="text-[10px] font-black uppercase text-slate-600 tracking-wider">High School Stream Combinator</h5>
                            <div className="flex gap-2">
                              {['PCM', 'PCB', 'Commerce', 'Humanities'].map((stream) => (
                                <button
                                  key={stream}
                                  onClick={() => setSelectedStream(stream as any)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border ${
                                    selectedStream === stream
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                  }`}
                                >
                                  {stream}
                                </button>
                              ))}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                              Stream <strong>{selectedStream}</strong> preloads Maths, Physics, Chemistry for elective pools. Students from different sections share specialized instructors for these stream slots automatically.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-[10px] font-black uppercase text-slate-600 tracking-wider">Elective Pools Registry</h5>
                            <div className="space-y-2">
                              {electivePools.map((pool) => (
                                <div key={pool.id} className="flex justify-between items-center text-xs p-3 bg-white border rounded-xl">
                                  <div>
                                    <div className="font-bold text-slate-800">{pool.groupName}</div>
                                    <div className="text-[9px] text-slate-400 font-bold uppercase">Classes: {pool.sharedClasses} · Teacher: {pool.assignedTeacher}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-50 text-blue-700 border-none font-bold text-[8px] uppercase">{pool.status}</Badge>
                                    <button onClick={() => handleDeleteElectivePool(pool.id)} className="text-rose-500 hover:text-rose-700">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupSubTab('profile');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 border-slate-200 text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => {
                        setSetupSubTab('teachers');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#000099] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg shadow-sm"
                    >
                      Next Step: Teacher Registry →
                    </Button>
                  </div>
                </div>
              )}

              {/* Subtab 3: teachers (Teacher Registry) */}
              {setupSubTab === 'teachers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 flex flex-row justify-between items-center">
                      <div className="space-y-0.5">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">HRMS Teachers Registry</CardTitle>
                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase">Timetable specific settings layered on top of core HRMS records</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowAddTeacherModal(true)}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider h-8 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Teacher Profile
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px]">
                              <th className="p-3">Teacher Name</th>
                              <th className="p-3">Emp ID</th>
                              <th className="p-3">Department</th>
                              <th className="p-3">Type</th>
                              <th className="p-3">Subjects Mapped</th>
                              <th className="p-3 text-center">Max Load / Day</th>
                              <th className="p-3 text-center">Max Consecutive</th>
                              <th className="p-3">Weekly Target</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {teachers.map((teacher) => (
                              <tr key={teacher.id} className="border-b hover:bg-slate-50/50 transition-colors font-medium">
                                <td className="p-3 font-bold text-slate-800">{teacher.name}</td>
                                <td className="p-3 font-mono">{teacher.empId}</td>
                                <td className="p-3">{teacher.department}</td>
                                <td className="p-3"><Badge variant="outline" className="bg-slate-50 text-slate-600 text-[8px] font-bold uppercase">{teacher.type}</Badge></td>
                                <td className="p-3">
                                  <div className="flex flex-wrap gap-1">
                                    {teacher.subjectsCanTeach.map((sub) => (
                                      <Badge key={sub} className="bg-blue-50 text-blue-700 text-[8px] border-none font-bold uppercase">{sub}</Badge>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-3 text-center font-bold text-slate-700">{teacher.maxDaily || 6} / day</td>
                                <td className="p-3 text-center font-bold text-slate-700">{teacher.maxConsecutive || 3} slots</td>
                                <td className="p-3 font-bold text-slate-700">{teacher.targetLoad} periods</td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTeacher(teacher.id)}
                                    className="text-rose-600 hover:text-rose-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Availability Windows and target workloads */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Teacher Scheduling Constraints & Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* HOD mapping */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Head of Department (HOD) Registry</h4>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">HODs receive scheduling preferences and are the default substitution cover authority.</p>
                          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            {Object.keys(hods).map((dept) => (
                              <div key={dept} className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700 uppercase text-[9px]">{dept} HOD:</span>
                                <select
                                  value={hods[dept]}
                                  onChange={(e) => setHods({ ...hods, [dept]: e.target.value })}
                                  className="h-8 w-48 border border-slate-200 rounded-lg px-2 bg-white text-xs font-semibold text-slate-700"
                                >
                                  {teachers.map(t => (
                                    <option key={t.id} value={t.name}>{t.name}</option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Workload Equity */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Department Workload Equity Rules</h4>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Ensures workload distribution remains balanced across staff in the same department.</p>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 uppercase text-[10px]">Enable Workload Equity</span>
                              <Switch checked={workloadEquity} onCheckedChange={(val) => setWorkloadEquity(val)} />
                            </div>
                            {workloadEquity && (
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400">Equity Threshold (Max difference in periods)</label>
                                <Input
                                  type="number"
                                  value={equityThreshold}
                                  onChange={(e) => setEquityThreshold(Number(e.target.value))}
                                  className="h-9 bg-white border-slate-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Part time/Guest teacher windows */}
                      <div className="border-t pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Availability Windows (Part-Time / Guest Teachers)</h4>
                          <Button
                            type="button"
                            onClick={() => setShowAddPtTeacherModal(true)}
                            className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-wider h-8 rounded-lg"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Availability Window
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {partTimeTeachers.map((pt) => (
                            <div key={pt.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 relative group shadow-sm">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-xs font-black text-slate-800">{pt.name}</h5>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase">Time Window restrictions</p>
                                </div>
                                <button onClick={() => handleDeletePtTeacher(pt.id)} className="text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <code className="block bg-slate-50 border p-2 rounded text-[10px] text-slate-600 font-semibold">{pt.days}</code>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* HRMS Synced Active Leaves (Blocks) */}
                      <div className="border-t pt-6 space-y-4">
                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">HRMS Live Leave-Linked Blocks</h4>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                          Active leaves approved in the HRMS Leave Module automatically sync to create hard scheduling blockouts.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'Prof. S. Jenkins', date: 'Wednesday, 17 June 2026', duration: 'Periods 4-8 Blocked', type: 'Casual Leave' },
                            { name: 'Dr. R. Prasad', date: 'Friday, 19 June 2026', duration: 'Full Day Blocked', type: 'Sick Leave' }
                          ].map((leave, idx) => (
                            <div key={idx} className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between shadow-sm">
                              <div>
                                <h5 className="text-xs font-black text-slate-800">{leave.name}</h5>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">{leave.date} · {leave.type}</p>
                              </div>
                              <Badge className="bg-rose-100 text-rose-800 border-none font-bold text-[9px] uppercase">{leave.duration}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupSubTab('subjects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 border-slate-200 text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => {
                        setSetupSubTab('rooms');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#000099] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg shadow-sm"
                    >
                      Next Step: Rooms & Labs →
                    </Button>
                  </div>
                </div>
              )}

              {/* Subtab 4: rooms (Rooms and Labs) */}
              {setupSubTab === 'rooms' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Room Master Card */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6 flex flex-row justify-between items-center">
                      <div className="space-y-0.5">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Physical Classrooms & Laboratories Registry</CardTitle>
                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase">Define physical rooms, eligible subjects, and capacity locks</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowAddRoomModal(true)}
                        className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider h-8 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Room
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px]">
                              <th className="p-3">Room Name / No</th>
                              <th className="p-3">Room Type</th>
                              <th className="p-3">Eligible Subjects</th>
                              <th className="p-3">Capacity limit</th>
                              <th className="p-3">Exclusivity Lock</th>
                              <th className="p-3">Exclusive Assignment</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rooms.map((room) => (
                              <tr key={room.id} className="border-b hover:bg-slate-50/50 transition-colors font-medium">
                                <td className="p-3 font-bold text-slate-800">{room.name}</td>
                                <td className="p-3"><Badge variant="outline" className="bg-slate-50 text-slate-600 text-[8px] font-bold uppercase">{room.type}</Badge></td>
                                <td className="p-3 font-bold text-indigo-700">{room.subjectEligibility}</td>
                                <td className="p-3 font-bold text-slate-700">{room.capacity}</td>
                                <td className="p-3"><Badge className="bg-blue-50 text-blue-700 text-[8px] border-none font-bold uppercase">{room.exclusivity}</Badge></td>
                                <td className="p-3 font-bold text-slate-600">{room.exclusiveClass || 'N/A'}</td>
                                <td className="p-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="text-rose-600 hover:text-rose-800"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lab scheduling rotation and splits */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Laboratory Scheduling & Splitting Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lab groups split */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Class Split Groups Configuration</h4>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Splits large classes into parallel lab subgroups (e.g. Group A/B) attending different labs simultaneously.</p>
                          <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700 uppercase text-[10px]">Enable Lab Class Split</span>
                              <Switch checked={labGroupSplit} onCheckedChange={(val) => setLabGroupSplit(val)} />
                            </div>
                            {labGroupSplit && (
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase text-slate-400">Max Subgroup Capacity Limit</label>
                                <Input
                                  type="number"
                                  value={labGroupSize}
                                  onChange={(e) => setLabGroupSize(Number(e.target.value))}
                                  className="h-9 bg-white border-slate-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Lab pairs reference info */}
                        <div className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Eligible Lab Scheduling Slots</h4>
                          <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">The generator engine restricts laboratory subjects to these consecutive period pairs only.</p>
                          <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            {labPeriodPairs.map(pair => (
                              <Badge key={pair} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black py-1 px-3">
                                {pair}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Lab rotation grid */}
                      <div className="border-t pt-6 space-y-4">
                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Laboratory Sharing Rotation Matrix</h4>
                        <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">Calculates and tracks rotation offsets to ensure labs aren't double allocated across departments.</p>
                        <div className="border rounded-xl overflow-hidden text-xs">
                          <div className="grid grid-cols-6 bg-slate-50 p-2.5 border-b font-bold uppercase text-[9px] text-slate-500">
                            <span>Laboratory Space</span>
                            <span>Monday</span>
                            <span>Tuesday</span>
                            <span>Wednesday</span>
                            <span>Thursday</span>
                            <span>Friday</span>
                          </div>
                          {[
                            { name: 'Physics Lab', mon: 'Std 11A', tue: 'Std 11B', wed: 'Std 12A', thu: 'Std 12B', fri: 'Maintenance' },
                            { name: 'Chemistry Lab', mon: 'Std 12B', tue: 'Std 12A', wed: 'Std 11B', thu: 'Std 11A', fri: 'Exam Hall' }
                          ].map((row, idx) => (
                            <div key={idx} className="grid grid-cols-6 p-2.5 bg-white border-b last:border-b-0 items-center font-medium">
                              <span className="font-bold text-slate-800">{row.name}</span>
                              <span className="text-slate-600">{row.mon}</span>
                              <span className="text-slate-600">{row.tue}</span>
                              <span className="text-slate-600">{row.wed}</span>
                              <span className="text-slate-600">{row.thu}</span>
                              <span className="font-bold text-indigo-600">{row.fri}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupSubTab('teachers');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 border-slate-200 text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => {
                        setSetupSubTab('rules');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#000099] hover:bg-blue-800 text-white text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg shadow-sm"
                    >
                      Next Step: Auto Rules & Guardrails →
                    </Button>
                  </div>
                </div>
              )}

              {/* Subtab 5: rules (Auto Rules and Guardrails) */}
              {setupSubTab === 'rules' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Hard Constraints Card */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Hard Constraints (Non-Negotiable Rules)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        These constraints are core mathematical invariants. The engine will refuse to generate any timetable that violates these rules.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {[
                          { label: 'No Teacher Double-Booking', desc: 'A teacher cannot teach multiple classes simultaneously.' },
                          { label: 'No Class Double-Assignment', desc: 'A class section cannot have multiple subjects scheduled at the same time.' },
                          { label: 'Lab = Double Period Only', desc: 'Lab subjects must be scheduled in consecutive double slots.' },
                          { label: 'Room Capacity Respect', desc: 'Class enrollment strength must not exceed room seat capacities.' },
                          { label: 'Part-Time Availability Strict Fit', desc: 'Staff must not be assigned to periods outside their availabilities.' },
                          { label: 'Locked Periods Protected', desc: 'Protected slots (e.g. assemblies) are preserved across revisions.' },
                          { label: 'Leave-Blocked Days Treated Absent', desc: 'Dates on approved leave from HRMS are auto-blocked.' }
                        ].map((rule, idx) => (
                          <div key={idx} className="p-3.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl flex items-start gap-3 animate-in zoom-in-95">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs font-black text-emerald-900">{rule.label}</div>
                              <p className="text-[10px] text-emerald-700/80 font-medium mt-0.5">{rule.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Soft Constraints Weights Card */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <div className="space-y-0.5">
                        <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Soft Constraints & priority settings</CardTitle>
                        <CardDescription className="text-[9px] text-slate-400 font-bold uppercase">Toggle switches and adjust priority weight order using buttons</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                        The engine optimizes schedules to satisfy these constraints. In case of conflicts, higher ranked constraints in the list are resolved first.
                      </p>

                      <div className="space-y-2">
                        {softPriority.map((key, index) => {
                          const labelMap: Record<string, string> = {
                            consecutiveDays: 'Spread Subjects Across Week (Avoid same subject on back-to-back days)',
                            morningPriority: 'Prioritize Core Subjects in Morning Slots (Maths, Science in P1-P4)',
                            workloadSpread: 'Balance Teacher Workloads Evenly (Avoid front-loading Mon/Tue)',
                            avoidLastPeriodHeavy: 'Avoid Late Slots for Core Subjects (No Maths/Science in P7/P8)',
                            gapBetweenSameSubject: 'Enforce Gap Between Same Subject in a Single Day (No double periods)',
                            libraryPeriodLast: 'Schedule Library/Free Periods in Last Slot of Day',
                            seniorPreference: 'Senior Teacher Slot Preference (Priority for preferred periods)',
                            teacherFreePeriodGaps: 'Minimize Teacher Free Slot Gaps (Avoid sparse teaching slot maps)'
                          };

                          const active = softConstraints[key as keyof typeof softConstraints] !== false;

                          return (
                            <div key={key} className="flex justify-between items-center text-xs p-3.5 bg-slate-50 border rounded-xl hover:border-slate-300 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">
                                  {index + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-slate-800">{labelMap[key] || key}</div>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Priority Weight Rank: #{index + 1}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 font-semibold">
                                <div className="flex items-center gap-1.5 border-r pr-4">
                                  <span className="text-[9px] font-black uppercase text-slate-400">Threshold:</span>
                                  <input
                                    type="number"
                                    value={softThresholds[key] || 70}
                                    onChange={(e) => {
                                      setSoftThresholds({ ...softThresholds, [key]: Math.min(100, Math.max(0, Number(e.target.value))) });
                                    }}
                                    className="w-12 h-7 border rounded text-center text-xs font-bold text-slate-700 bg-white"
                                    min={0}
                                    max={100}
                                  />
                                  <span className="text-[10px] text-slate-400 font-bold">%</span>
                                </div>
                                <div className="flex items-center gap-1.5 border-r pr-4">
                                  <Button
                                    type="button"
                                    onClick={() => moveSoftPriority(index, 'up')}
                                    disabled={index === 0}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 border-slate-200"
                                  >
                                    ▲
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={() => moveSoftPriority(index, 'down')}
                                    disabled={index === softPriority.length - 1}
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 border-slate-200"
                                  >
                                    ▼
                                  </Button>
                                </div>
                                <Switch
                                  checked={active}
                                  onCheckedChange={(val) => {
                                    setSoftConstraints({ ...softConstraints, [key]: val });
                                    triggerToast(`Soft constraint toggled.`);
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Auto-rule configuration */}
                  <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    <CardHeader className="bg-slate-50 border-b border-slate-200 py-3.5 px-6">
                      <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">Automated Event-Triggered Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { key: 'autoSubOnLeaveApproval', label: 'Auto Substitution on Leave Approval', desc: 'Syncs live leaves from HRMS and generates substitution cover requests.' },
                          { key: 'autoStandingRuleApplication', label: 'Auto Standing Rule Application', desc: 'Automatically assigns standing substitutes on approved leave dates without HOD approval.' },
                          { key: 'autoRegenerateOnMajorChange', label: 'Partial Regeneration on Allocation Updates', desc: 'Prompts only affected classes for regeneration if subject maps change.' },
                          { key: 'autoLockAfterPublish', label: 'Lock Published Timetable Periods', desc: 'Freezes all slots upon publication to prevent accidental adjustments.' },
                          { key: 'autoPeriodOverflowWarning', label: 'Period Deficit Pre-Check Warning', desc: 'Warns and blocks generation if subjects periods exceed capacity.' },
                          { key: 'autoHolidaySync', label: 'Sync Calendar Holidays on Load', desc: 'Auto blocks holiday dates from the institution calendar before run.' },
                          { key: 'autoNotifyOnTimetableChange', label: 'Instant Push Notification Dispatches', desc: 'Dispatches changes to affected teachers and students instantly.' }
                        ].map((rule) => (
                          <div key={rule.key} className="flex justify-between items-start p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="space-y-1 pr-4">
                              <span className="text-xs font-bold text-slate-800 block">{rule.label}</span>
                              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{rule.desc}</p>
                            </div>
                            <Switch
                              checked={autoRules[rule.key as keyof typeof autoRules]}
                              onCheckedChange={(val) => {
                                setAutoRules({ ...autoRules, [rule.key]: val });
                                triggerToast(`Auto rule adjusted.`);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System guardrails */}
                  <Card className="bg-rose-50 border-rose-200 text-rose-950 rounded-xl p-6 space-y-3">
                    <h4 className="text-xs font-black uppercase text-rose-700 tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Critical Guardrails Enforcement Summary
                    </h4>
                    <ul className="text-xs leading-relaxed font-semibold space-y-2 list-disc pl-5 text-rose-900/90">
                      <li><strong>Period Deficit Check:</strong> Prevents scheduling runs if the sum of mapped min periods exceeds weekly slot capacity.</li>
                      <li><strong>Lab Pair Integrity:</strong> Lab double periods cannot span breaks, recess times, or end of day boundaries.</li>
                      <li><strong>Cross-Section Instructor Conflicts:</strong> Hard blocks double-assigning teachers to multiple class groups during a slot.</li>
                      <li><strong>Elective Stream Overlaps:</strong> Elective stream subjects must not conflict with core subject periods for students in those sections.</li>
                      <li><strong>HOD Protection Guard:</strong> HOD designated staff classes are preserved and shielded from automatic substitution alterations.</li>
                      <li><strong>Daily Load Limits Guard:</strong> Strictly blocks any generation that exceeds the defined maximum daily and consecutive periods per teacher.</li>
                    </ul>
                  </Card>

                  {/* Step Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSetupSubTab('rooms');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-slate-600 border-slate-200 text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (allRequiredDone) {
                          setActiveTab('autogen');
                          triggerToast('Loading Auto-Generation Solver tab...');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          triggerToast('Please complete remaining checklist setups first!');
                        }
                      }}
                      className={`text-white text-xs font-black uppercase tracking-wider h-10 px-6 rounded-lg shadow-sm transition-all ${
                        allRequiredDone
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Finish & Open AI Solver →
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 1 Column: Setup Completion Checklist */}
            <div className="space-y-6">
              <Card className="bg-white border-slate-200 shadow-lg rounded-2xl overflow-hidden sticky top-6">
                <CardHeader className="bg-slate-900 text-white py-5 px-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-200">Setup Checklist Progress</CardTitle>
                    <Badge className="bg-slate-800 text-white font-black text-[9px]">{checklistPercent}% Done</Badge>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-800/80 mt-3.5">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300" style={{ width: `${checklistPercent}%` }}></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div className="space-y-3.5">
                    {checklistItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs font-semibold">
                        <span className={item.done ? 'text-slate-700' : 'text-slate-400 italic'}>{item.label}</span>
                        {item.done ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-dashed border-slate-300 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-slate-200"></div>

                  <div className="space-y-3 text-center">
                    {allRequiredDone ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-bold uppercase tracking-wide">
                        🎉 Setup Complete! Ready to Generate
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-bold uppercase tracking-wide">
                        ⚠️ Incomplete Configurations
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        if (allRequiredDone) {
                          setActiveTab('autogen');
                          triggerToast('Loading Auto-Generation Solver tab...');
                        } else {
                          triggerToast('Please complete remaining checklist setups first!');
                        }
                      }}
                      className={`w-full h-11 font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all ${
                        allRequiredDone
                          ? 'bg-[#000099] hover:bg-blue-800 text-white hover:scale-105'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Proceed to Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── TAB 2: AUTO-GEN SOLVER ────────────────────────────────────── */}
        {activeTab === 'autogen' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              {/* Generation Controls */}
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">One-Click AI Scheduler Solver</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Triggers conflict-free simulated genetic algorithm schedule</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8 text-center">
                  {!generating && (
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="mx-auto w-16 h-16 bg-blue-50 border border-blue-200 rounded-full flex items-center justify-center text-blue-600">
                        <Brain className="w-8 h-8 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-800 uppercase tracking-wide">Ready for Auto Generation</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Locks active manual selections. Imports calendars, institutional parameters, teacher time windows, and lab capacities to build a conflict-free roster.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          onClick={handleStartGeneration}
                          disabled={!allRequiredDone}
                          className={`w-full h-12 font-black uppercase tracking-wider text-xs rounded-xl shadow-md ${
                            allRequiredDone
                              ? 'bg-[#000099] hover:bg-blue-800 text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {timetableGenerated ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-2 inline" /> Regenerate Timetable
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 fill-current mr-2 inline" /> Start Timetable Generation
                            </>
                          )}
                        </Button>
                        {timetableGenerated && (
                          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lock Status:</span>
                              {timetableLocked ? (
                                <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase py-0.5 px-2 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-rose-400 fill-rose-400" /> Locked
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black uppercase py-0.5 px-2 flex items-center gap-1">
                                  <Unlock className="w-3 h-3 text-emerald-600" /> Unlocked
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 font-black uppercase text-[9px] text-[#000099] hover:bg-slate-100"
                              onClick={() => {
                                setTimetableLocked(!timetableLocked);
                                triggerToast(timetableLocked ? 'Timetable unlocked for manual overrides.' : 'Timetable locked.');
                              }}
                            >
                              {timetableLocked ? 'Unlock for edits' : 'Lock Timetable'}
                            </Button>
                          </div>
                        )}
                        {!allRequiredDone && (
                          <div className="text-[10px] text-rose-500 font-black uppercase tracking-wider flex items-center justify-center gap-1.5 p-2 bg-rose-50 rounded-lg border border-rose-100">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Complete Setup checklist to unlock auto-generation solver!
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {generating && (
                    <div className="max-w-md mx-auto space-y-6 py-6">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-black text-blue-600">{generationProgress}%</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Solver Status</h4>
                        <p className="text-sm font-black text-slate-700 uppercase tracking-wide animate-pulse">{generationStep}</p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${generationProgress}%` }}></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Constraint Satisfaction Scorecard */}
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Satisfaction RAG Scorecard</CardTitle>
                    <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Breakdown of criteria weights met by scheduler</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-black">{satisfactionScore}/100</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Hard Rules Check (100% Target)</h5>
                      {[
                        { label: 'Double Booking Collision', check: true },
                        { label: 'Lab Single Block Allocation', check: true },
                        { label: 'Part-Time Window Strict Fit', check: true }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>{item.label}: <strong className="text-emerald-600 uppercase">Satisfied</strong></span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Soft Rules Check (Score Optimization)</h5>
                      {[
                        { label: 'Morning Core Priority', check: true, details: '100% matched' },
                        { label: 'Same-Subject Gap Day Rule', check: false, details: '92% match (2 overlaps in Std 11A)' },
                        { label: 'Teacher Workload Fairness', check: true, details: '95% balance spread' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                          <CheckCircle className={item.check ? "w-4 h-4 text-emerald-500" : "w-4 h-4 text-amber-500"} />
                          <span>{item.label}: <strong className={item.check ? "text-emerald-600" : "text-amber-600"}>{item.details}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Timetable has minor soft conflicts. Would you like to inspect?</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 font-black uppercase text-[9px] text-amber-700 hover:bg-amber-100" onClick={() => setShowFailureReport(!showFailureReport)}>
                      {showFailureReport ? 'Hide Logs' : 'Inspect Failure Logs'}
                    </Button>
                  </div>

                  {showFailureReport && (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2.5 font-mono text-[11px] text-rose-400">
                      <p className="text-white font-bold border-b border-white/10 pb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-500" /> TIMETABLE GENERATION SOLVER EXCEPTION REPORT</p>
                      <p>[CONFLICT] Wednesday Period 4: Maths conflict for Std 11A. Dr. K. Sharma exceeds max consecutive periods rules (3 consecutive periods already scheduled).</p>
                      <p>[REMEDIAL ACTION] Change gap penalty constraints, or use manual editor overrides to split periods.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Version History & Comparison */}
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Version History Control</CardTitle>
                    <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Compare generation variations & rollback checkpoints</CardDescription>
                  </div>
                  <Badge className="bg-slate-900 text-white text-[8px] font-black uppercase">v2.0 Active</Badge>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    {versions.map((ver) => (
                      <div
                        key={ver.id}
                        onClick={() => { setSelectedVersion(ver.id); triggerToast(`Loaded version ${ver.id} logs.`); }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex justify-between items-start ${
                          selectedVersion === ver.id
                            ? 'bg-slate-50 border-slate-900'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-black text-slate-800">{ver.label}</h5>
                            {ver.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          </div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{ver.timestamp}</p>
                          <p className="text-[9px] text-slate-500 font-medium">Author: {ver.author}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 text-[8px] font-black uppercase">Score: {ver.score}</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 text-[9px] uppercase font-black" onClick={() => triggerToast('Side-by-side diff matrix comparing v1 vs v2 opened.')}>Compare Versions</Button>
                    <Button className="h-9 bg-slate-900 hover:bg-slate-800 text-white text-[9px] uppercase font-black" onClick={() => triggerToast('Successfully restored v1.0 checkpoint.')}>Restore Version</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Differentiators indicator */}
              <Card className="bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-xl border-none shadow-lg overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2"><Sparkles className="w-4 h-4 animate-bounce" /> edumerge Differentiator</h4>
                  <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>
                      <strong>Leave-Aware Generation</strong> runs automatically. The solver imports approved leave applications directly from HRMS leave module before running.
                    </p>
                    <p>
                      <strong>Mid-Year Revision Mode</strong> is active. Solves and replaces only changed class segments without rebuilding the whole master timetable.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── TAB 3: MANUAL EDITOR ────────────────────────────────────── */}
        {activeTab === 'manual' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Toolbar */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-slate-700 uppercase">Interactive Class Selection:</div>
                  <Select defaultValue="Std 11A">
                    <SelectTrigger className="w-40 h-9 border-slate-200 rounded-lg">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Std 11A">Std 11A (PCM)</SelectItem>
                      <SelectItem value="Std 11B">Std 11B (PCB)</SelectItem>
                      <SelectItem value="Std 12A">Std 12A (PCM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2.5">
                  <button onClick={handleUndo} className="p-2 border rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50" disabled={undoStack.length === 0} title="Undo">
                    <Undo className="w-4 h-4" />
                  </button>
                  <button onClick={handleRedo} className="p-2 border rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-50" disabled={redoStack.length === 0} title="Redo">
                    <Redo className="w-4 h-4" />
                  </button>
                  <span className="w-px h-6 bg-slate-200 mx-1"></span>
                  <Button
                    variant={timetableLocked ? "default" : "outline"}
                    size="sm"
                    className={`h-9 text-[9px] uppercase font-black gap-1.5 ${
                      timetableLocked 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      setTimetableLocked(!timetableLocked);
                      triggerToast(timetableLocked ? 'Timetable unlocked for manual overrides.' : 'Timetable locked.');
                    }}
                  >
                    {timetableLocked ? (
                      <>
                        <Lock className="w-3 h-3 text-rose-400 fill-rose-400" /> Locked
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-emerald-500" /> Unlocked
                      </>
                    )}
                  </Button>
                  <span className="w-px h-6 bg-slate-200 mx-1"></span>
                  <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 text-[9px] uppercase font-black" onClick={() => triggerToast('Bulk Edit matrix: Shift Maths Tuesday P1 -> P2 for Std 11A, 11B.')}>
                    Bulk Shifts Override
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Timetable Grid swap simulator */}
            <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Drag-and-Drop Period Editor</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Drag modules cards to swap periods. Red grids highlight teacher or room double-booking conflicts instantly.</CardDescription>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] uppercase font-black">All Conflicts Solved</Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider w-28 text-center border-r border-slate-200">Day</th>
                        {Array.from({ length: 8 }).map((_, i) => (
                          <th key={i} className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center border-r last:border-r-0 border-slate-200">
                            Period {i + 1}
                            <span className="block text-[8px] text-slate-400 font-medium lowercase">{(9 + i) % 12 || 12}:00 - {(10 + i) % 12 || 12}:00</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                        <tr key={day} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-xs font-black text-slate-800 uppercase tracking-wide text-center border-r border-slate-200 bg-slate-50/50">
                            {day.slice(0, 3)}
                          </td>
                          {Array.from({ length: 8 }).map((_, i) => {
                            const cellKey = `${day.slice(0, 3)}-${i + 1}`;
                            const cell = gridData[cellKey];
                            const isDragged = draggedCell === cellKey;
                            const isHovered = hoveredCell === cellKey;
                            
                            // Check simulated conflict alert
                            const isConflict = cellKey === 'Mon-4' && hoveredCell === 'Mon-4';

                            return (
                              <td
                                key={i}
                                onDragOver={(e) => handleDragOver(e, cellKey)}
                                onDrop={() => handleDrop(cellKey)}
                                className={`p-2.5 text-center border-r last:border-r-0 border-slate-200 min-w-[120px] transition-all relative ${
                                  isHovered ? 'bg-indigo-50 border-indigo-400 scale-105 z-10' : ''
                                } ${isConflict ? 'bg-rose-50 border-rose-400 border-2' : ''}`}
                              >
                                {cell ? (
                                  <div
                                    draggable={!timetableLocked}
                                    onDragStart={() => handleDragStart(cellKey)}
                                    onClick={() => handleCellClick(cellKey)}
                                    className={`p-3 rounded-lg border text-left transition-all space-y-1 relative group ${
                                      timetableLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                                    } ${
                                      cell.locked
                                        ? 'bg-slate-100 border-slate-200 opacity-80'
                                        : 'bg-indigo-50/50 border-indigo-100 hover:border-indigo-300 hover:shadow-sm'
                                    } ${isDragged ? 'opacity-30' : ''}`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">{cell.subject}</span>
                                      <button onClick={(e) => toggleCellLock(cellKey, e)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                        {cell.locked ? <Lock className="w-3 h-3 text-slate-600" /> : <Unlock className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" />}
                                      </button>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-800">{cell.teacher}</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase">{cell.room}</p>
                                  </div>
                                ) : (
                                  <div 
                                    onClick={() => handleCellClick(cellKey)}
                                    className={`p-3 border border-dashed border-slate-200 rounded-lg text-slate-400 text-[10px] uppercase font-bold italic tracking-wider transition-all ${
                                      timetableLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:border-indigo-300 hover:bg-slate-50'
                                    }`}
                                  >
                                    Free Period
                                  </div>
                                )}

                                {/* Simulated double booking overlay tooltips */}
                                {isConflict && (
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-30 bg-rose-950 text-white rounded-lg p-2.5 shadow-xl text-[9px] font-mono text-left w-48 border border-rose-800">
                                    <p className="text-rose-400 font-bold">⚠️ OVERBOOK CLASH</p>
                                    <p>Prof. S. Jenkins already assigned to Physics Lab during Period 4.</p>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* ── TAB 6: ANALYTICS & FAIRNESS ────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {/* Workload Fairness & Heatmaps */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Teacher Workload Fairness Scorecard</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Actual periods assigned vs department averages</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    {[
                      { name: 'Dr. K. Sharma (Maths)', current: 24, target: 24, score: 98 },
                      { name: 'Mrs. A. Sen (English)', current: 18, target: 20, score: 90 },
                      { name: 'Prof. S. Jenkins (Physics)', current: 22, target: 22, score: 96 }
                    ].map((teacher, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                          <span>{teacher.name}</span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {teacher.current} / {teacher.target} periods ({teacher.score}% fairness)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border">
                          <div className="bg-[#000099] h-full rounded-full transition-all duration-300" style={{ width: `${(teacher.current / 24) * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Room Occupancy Heatmap */}
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Lab Room Occupancy Registry</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Occupancy utilization heat percentage</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: 'Physics Lab', u: 82, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { name: 'Chemistry Lab', u: 78, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                      { name: 'Central Auditorium', u: 35, color: 'text-blue-600 bg-blue-50 border-blue-200' }
                    ].map((room, idx) => (
                      <div key={idx} className={`p-4 border rounded-xl flex flex-col items-center justify-center space-y-2 ${room.color}`}>
                        <span className="text-xs font-black uppercase tracking-wide">{room.name}</span>
                        <span className="text-3xl font-black">{room.u}%</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">Avg Occupancy</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Group Governance Completion status */}
            <div className="space-y-6">
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
                  <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">GOI Group Governance View</CardTitle>
                  <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Timetable publication completeness across the school group</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Navkis Educational Centre', status: 'Published', p: 100, color: 'bg-emerald-500' },
                      { name: 'Navkis Engineering College', status: 'Drafting', p: 75, color: 'bg-amber-500' },
                      { name: 'Navkis CBSE High School', status: 'Pending Config', p: 40, color: 'bg-rose-500' }
                    ].map((school, idx) => (
                      <div key={idx} className="space-y-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="font-bold text-slate-800">{school.name}</span>
                          <span className="text-[9px] font-black uppercase text-slate-500">{school.status}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${school.color}`} style={{ width: `${school.p}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL: ADD ROOM ────────────────────────────────────────── */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                Register New Lab / Room
              </h3>
              <button onClick={() => setShowAddRoomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddRoom} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Room Name</label>
                <Input
                  required
                  placeholder="e.g. Biology Lab, Room 402"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Subject Eligibility</label>
                <Input
                  placeholder="e.g. Biology, Chemistry, Maths"
                  value={newRoom.subjectEligibility}
                  onChange={(e) => setNewRoom({ ...newRoom, subjectEligibility: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Capacity limits</label>
                <Input
                  type="number"
                  placeholder="e.g. 35"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Exclusivity Lock</label>
                <Select
                  value={newRoom.exclusivity}
                  onValueChange={(val: any) => setNewRoom({ ...newRoom, exclusivity: val })}
                >
                  <SelectTrigger className="h-10 border-slate-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Exclusive Only">Exclusive Only (Labs/Exclusives)</SelectItem>
                    <SelectItem value="Shared">Shared (General Auditoriums / Classes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Exclusive Section Assignment</label>
                <select
                  value={newRoom.exclusiveClass}
                  onChange={(e: any) => setNewRoom({ ...newRoom, exclusiveClass: e.target.value })}
                  className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                >
                  <option value="">N/A (Shared Room / No exclusive section)</option>
                  <option value="Std 11A">Std 11A</option>
                  <option value="Std 11B">Std 11B</option>
                  <option value="Std 12A">Std 12A</option>
                  <option value="Std 12B">Std 12B</option>
                  <option value="Std 8A">Std 8A</option>
                  <option value="Std 8B">Std 8B</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddRoomModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Register Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD ELECTIVE POOL ─────────────────────────────────── */}
      {showAddPoolModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Create Elective Pool Group
              </h3>
              <button onClick={() => setShowAddPoolModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddElectivePool} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Elective Pool Group Name</label>
                <Input
                  required
                  placeholder="e.g. PCM Maths Advanced, PCB Biotech"
                  value={newPool.groupName}
                  onChange={(e) => setNewPool({ ...newPool, groupName: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Shared Classes / Semesters</label>
                <Input
                  placeholder="e.g. Std 11A, 11B or Sem 3 CSE"
                  value={newPool.sharedClasses}
                  onChange={(e) => setNewPool({ ...newPool, sharedClasses: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Assigned Specialist Teacher</label>
                <Input
                  placeholder="e.g. Dr. K. Sharma"
                  value={newPool.assignedTeacher}
                  onChange={(e) => setNewPool({ ...newPool, assignedTeacher: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status</label>
                <Select
                  value={newPool.status}
                  onValueChange={(val: any) => setNewPool({ ...newPool, status: val })}
                >
                  <SelectTrigger className="h-10 border-slate-200 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Synced">Synced</SelectItem>
                    <SelectItem value="Conflicts Checked">Conflicts Checked</SelectItem>
                    <SelectItem value="Needs Teacher">Needs Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddPoolModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Create Pool
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD PART-TIME TEACHER ─────────────────────────────── */}
      {showAddPtTeacherModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Add Part-Time Availability
              </h3>
              <button onClick={() => setShowAddPtTeacherModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddPtTeacher} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Teacher Name & Subject</label>
                <Input
                  required
                  placeholder="e.g. Dr. K. Sharma (Maths)"
                  value={newPtTeacher.name}
                  onChange={(e) => setNewPtTeacher({ ...newPtTeacher, name: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Unavailable/Available Slots Details</label>
                <Input
                  placeholder="e.g. Mon, Wed, Fri (Morning Only)"
                  value={newPtTeacher.days}
                  onChange={(e) => setNewPtTeacher({ ...newPtTeacher, days: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 py-2">
                <span>Part-Time Flag Constraint</span>
                <Switch
                  checked={newPtTeacher.val}
                  onCheckedChange={(val) => setNewPtTeacher({ ...newPtTeacher, val })}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddPtTeacherModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Add Window
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD SUBJECT ──────────────────────────────────────── */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Add New Subject Master
              </h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddSubject} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject Name</label>
                <Input
                  required
                  placeholder="e.g. History & Civics, Social Studies"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject Code</label>
                  <Input
                    placeholder="e.g. HIST, CIV"
                    value={newSubject.code}
                    onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Category</label>
                  <select
                    value={newSubject.category}
                    onChange={(e: any) => setNewSubject({ ...newSubject, category: e.target.value })}
                    className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Co-Scholastic">Co-Scholastic</option>
                    <option value="Lab">Lab Space</option>
                    <option value="Language">Language</option>
                    <option value="Elective">Elective</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 py-2 border-y">
                <span>Requires Dedicated Lab Block</span>
                <Switch
                  checked={newSubject.requiresLab}
                  onCheckedChange={(val) => setNewSubject({ ...newSubject, requiresLab: val })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Display Color</label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    className="h-10 w-16 p-1 border-slate-200 cursor-pointer rounded-lg shadow-sm"
                  />
                  <Input
                    type="text"
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    className="h-10 border-slate-200 font-mono text-xs w-full"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddSubjectModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Add Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD TEACHER ───────────────────────────────────────── */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Add Teacher Registry Profile
              </h3>
              <button onClick={() => setShowAddTeacherModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddTeacher} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Teacher Name</label>
                <Input
                  required
                  placeholder="e.g. Dr. Ramesh Prasad"
                  value={newTeacherProfile.name}
                  onChange={(e) => setNewTeacherProfile({ ...newTeacherProfile, name: e.target.value })}
                  className="h-10 border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Employee ID</label>
                  <Input
                    placeholder="e.g. EM-102"
                    value={newTeacherProfile.empId}
                    onChange={(e) => setNewTeacherProfile({ ...newTeacherProfile, empId: e.target.value })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Department</label>
                  <select
                    value={newTeacherProfile.department}
                    onChange={(e: any) => setNewTeacherProfile({ ...newTeacherProfile, department: e.target.value })}
                    className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Languages">Languages</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Art / Activities">Art / Activities</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Teacher Type</label>
                  <select
                    value={newTeacherProfile.type}
                    onChange={(e: any) => setNewTeacherProfile({ ...newTeacherProfile, type: e.target.value })}
                    className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Guest">Guest</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Weekly Target Load</label>
                  <Input
                    type="number"
                    value={newTeacherProfile.targetLoad}
                    onChange={(e) => setNewTeacherProfile({ ...newTeacherProfile, targetLoad: Number(e.target.value) })}
                    className="h-10 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Subjects Eligible to Teach</label>
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-lg max-h-24 overflow-y-auto bg-slate-50 shadow-inner">
                  {subjectsList.map((sub) => {
                    const checked = newTeacherProfile.subjectsCanTeach.includes(sub.name);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          const updated = checked
                            ? newTeacherProfile.subjectsCanTeach.filter(s => s !== sub.name)
                            : [...newTeacherProfile.subjectsCanTeach, sub.name];
                          setNewTeacherProfile({ ...newTeacherProfile, subjectsCanTeach: updated });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase border transition-all ${
                          checked
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Classes Assigned</label>
                <div className="flex flex-wrap gap-1.5 p-2 border rounded-lg max-h-24 overflow-y-auto bg-slate-50 shadow-inner">
                  {['Std 11A', 'Std 11B', 'Std 12A', 'Std 12B', 'Std 8A', 'Std 8B'].map((cls) => {
                    const checked = newTeacherProfile.classesAssigned.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          const updated = checked
                            ? newTeacherProfile.classesAssigned.filter(c => c !== cls)
                            : [...newTeacherProfile.classesAssigned, cls];
                          setNewTeacherProfile({ ...newTeacherProfile, classesAssigned: updated });
                        }}
                        className={`px-2 py-1 rounded text-[10px] font-black uppercase border transition-all ${
                          checked
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Max Periods / Day</label>
                  <Input
                    type="number"
                    value={newTeacherProfile.maxDaily}
                    onChange={(e) => setNewTeacherProfile({ ...newTeacherProfile, maxDaily: Number(e.target.value) })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Max Consecutive Periods</label>
                  <Input
                    type="number"
                    value={newTeacherProfile.maxConsecutive}
                    onChange={(e) => setNewTeacherProfile({ ...newTeacherProfile, maxConsecutive: Number(e.target.value) })}
                    className="h-10 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddTeacherModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Add Teacher
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: MAP SUBJECT TO CLASS ──────────────────────────────── */}
      {showAddClassMapModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Map Subject to Class Loads
              </h3>
              <button onClick={() => setShowAddClassMapModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleAddClassMap} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Class Section Name</label>
                <select
                  value={newClassMap.className}
                  onChange={(e: any) => setNewClassMap({ ...newClassMap, className: e.target.value })}
                  className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                >
                  <option value="">-- Choose Class --</option>
                  <option value="Std 11A">Std 11A</option>
                  <option value="Std 11B">Std 11B</option>
                  <option value="Std 12A">Std 12A</option>
                  <option value="Std 12B">Std 12B</option>
                  <option value="Std 8A">Std 8A</option>
                  <option value="Std 8B">Std 8B</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Subject</label>
                <select
                  value={newClassMap.subjectId}
                  onChange={(e: any) => setNewClassMap({ ...newClassMap, subjectId: e.target.value })}
                  className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjectsList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Min Periods / Week</label>
                  <Input
                    type="number"
                    value={newClassMap.minPeriods}
                    onChange={(e) => setNewClassMap({ ...newClassMap, minPeriods: Number(e.target.value) })}
                    className="h-10 border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Max Periods / Week</label>
                  <Input
                    type="number"
                    value={newClassMap.maxPeriods}
                    onChange={(e) => setNewClassMap({ ...newClassMap, maxPeriods: Number(e.target.value) })}
                    className="h-10 border-slate-200"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddClassMapModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                  Map Subject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT CELL ────────────────────────────────────────── */}
      {showEditCellModal && editingCellKey && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Edit Period Schedule: {editingCellKey.split('-')[0]} Period {editingCellKey.split('-')[1]}
              </h3>
              <button onClick={() => setShowEditCellModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleSaveCell} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject</label>
                <select
                  value={editingCellData.subject || 'N/A'}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isNA = val === 'N/A';
                    let defaultTeacher = '';
                    let defaultRoom = '';
                    if (!isNA) {
                      const matchedTeacher = teachers.find(t => t.subjectsCanTeach.includes(val));
                      if (matchedTeacher) defaultTeacher = matchedTeacher.name;
                      
                      if (val === 'Physics') defaultRoom = 'Physics Lab';
                      else if (val === 'Chemistry') defaultRoom = 'Chemistry Lab';
                      else if (val === 'Biology') defaultRoom = 'Biology Lab';
                      else if (val === 'Art / Craft') defaultRoom = 'General Auditorium';
                      else defaultRoom = 'Room 301';
                    }
                    setEditingCellData({
                      ...editingCellData,
                      subject: val,
                      teacher: isNA ? '' : (editingCellData.teacher || defaultTeacher),
                      room: isNA ? '' : (editingCellData.room || defaultRoom)
                    });
                  }}
                  className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                >
                  <option value="N/A">N/A (Free Period / No Schedule)</option>
                  {subjectsList.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              {editingCellData.subject !== 'N/A' && editingCellData.subject !== '' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Teacher</label>
                    <select
                      value={editingCellData.teacher}
                      onChange={(e) => setEditingCellData({ ...editingCellData, teacher: e.target.value })}
                      className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value="">-- Choose Teacher --</option>
                      {teachers.map((t, idx) => (
                        <option key={idx} value={t.name}>{t.name} ({t.subjectsCanTeach.join(', ')})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Classroom / Laboratory</label>
                    <select
                      value={editingCellData.room}
                      onChange={(e) => setEditingCellData({ ...editingCellData, room: e.target.value })}
                      className="h-10 w-full border border-slate-200 rounded-lg px-3 bg-white text-xs font-semibold text-slate-700"
                    >
                      <option value="">-- Choose Room --</option>
                      <option value="Room 301">Room 301 (General)</option>
                      <option value="Room 302">Room 302 (General)</option>
                      <option value="Physics Lab">Physics Lab</option>
                      <option value="Chemistry Lab">Chemistry Lab</option>
                      <option value="Biology Lab">Biology Lab</option>
                      <option value="General Auditorium">General Auditorium</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lock Period</span>
                      <p className="text-[8px] text-slate-400 font-bold uppercase">Locks this slot against AI regenerations</p>
                    </div>
                    <Switch
                      checked={editingCellData.locked}
                      onCheckedChange={(val) => setEditingCellData({ ...editingCellData, locked: val })}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 justify-between pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingCellData({ subject: 'N/A', teacher: '', room: '', locked: false });
                  }}
                  className="uppercase font-black text-[9px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  Make N/A (Clear Period)
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowEditCellModal(false)} className="uppercase font-black text-[9px] border-slate-200">
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-[#000099] hover:bg-blue-800 text-white uppercase font-black text-[9px]">
                    Save Period
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AutoTimetableModule;
