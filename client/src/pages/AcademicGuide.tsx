import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import {
  BookOpen, Send, Paperclip, RefreshCw, Check, CheckCircle2,
  AlertTriangle, Calendar, Award, AlertCircle, Trash2, Sparkles, X, FileText
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  isParsing?: boolean;
  parsingSteps?: { label: string; status: 'pending' | 'running' | 'done' }[];
}

export default function AcademicGuide() {
  const [activeTab, setActiveTab] = useState<'lesson-plans' | 'timetable' | 'exams' | 'compliance'>('lesson-plans');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your Academic co-pilot AI. I can help you configure your upcoming semester, including lesson plans, timetables, exam schedules, and checking UGC/AICTE workload compliance. Choose a suggestion below or upload a syllabus to begin!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSyllabusUploaded, setHasSyllabusUploaded] = useState(false);
  const [isLessonPlanFixed, setIsLessonPlanFixed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable objects states
  const [lessonPlans, setLessonPlans] = useState([
    { id: '1', unit: 'Unit 1', topics: 'Arrays, Linked Lists, Stacks, Queue operations and implementations', weeks: 'Week 1–3', hours: 24, status: 'Verified' },
    { id: '2', unit: 'Unit 2', topics: 'Queues, Trees, Binary Search Tree (BST) traversals', weeks: 'Week 4–6', hours: 28, status: 'Verified' },
    { id: '3', unit: 'Unit 3', topics: 'Heaps structure, Priority Queues, Hashing algorithms and collisions', weeks: 'Week 7–8', hours: 18, status: 'Verified' },
    { id: '4', unit: 'Unit 4', topics: 'Graph Algorithms (BFS, DFS, Dijkstra\'s algorithm, Spanning Trees)', weeks: 'Week 9–11', hours: 32, status: '+18% Buffer' },
    { id: '5', unit: 'Unit 5', topics: 'Sorting & Searching (QuickSort, MergeSort, Binary Search)', weeks: 'Week 12–13', hours: 22, status: 'Verified' },
    { id: '6', unit: 'Unit 6', topics: 'Dynamic Programming basics, Greedy method strategies', weeks: 'Week 14–15', hours: 18, status: 'Verified' },
  ]);

  const [timetable, setTimetable] = useState<Record<string, { course: string; faculty: string; room?: string; warning?: boolean }>>({
    mon_08: { course: 'CS301', faculty: 'Anand K', room: 'Block A-302' },
    tue_08: { course: 'CS401', faculty: 'Priya N', room: 'Block A-302' },
    wed_08: { course: 'CS301', faculty: 'Anand K', room: 'Block A-302' },
    thu_08: { course: 'CS401', faculty: 'Priya N', room: 'Block A-302' },
    fri_08: { course: 'CS501', faculty: 'Meena S', room: 'Block A-302' },
    sat_08: { course: '—', faculty: '', room: '' },

    mon_09: { course: 'CS201', faculty: 'Rajesh K ⚠', room: 'Block A-302', warning: true },
    tue_09: { course: 'CS301', faculty: 'Anand K', room: 'Block A-302' },
    wed_09: { course: 'CS501', faculty: 'Meena S', room: 'Block A-302' },
    thu_09: { course: 'CS201', faculty: 'Rajesh K ⚠', room: 'Block A-302', warning: true },
    fri_09: { course: 'CS301', faculty: 'Anand K', room: 'Block A-302' },
    sat_09: { course: 'CS401', faculty: 'Priya N', room: 'Block A-302' },

    mon_tue_lab: { course: 'CS401-L (Algorithms Lab)', faculty: 'Lab Room 204', room: '' },
    wed_10: { course: 'CS201', faculty: 'Rajesh K ⚠', room: 'Block A-302', warning: true },
    thu_10: { course: 'CS501', faculty: 'Meena S', room: 'Block A-302' },
    fri_sat_lab: { course: 'CS201-L (DBMS Lab)', faculty: 'Lab Room 108', room: '' },

    mon_11: { course: 'CS501', faculty: 'Meena S', room: 'Block A-302' },
    tue_11: { course: 'CS201', faculty: 'Rajesh K ⚠', room: 'Block A-302', warning: true },
    wed_11: { course: 'CS401', faculty: 'Priya N', room: 'Block A-302' },
    thu_11: { course: 'CS301', faculty: 'Anand K', room: 'Block A-302' },
    fri_11: { course: 'CS401', faculty: 'Priya N', room: 'Block A-302' },
    sat_11: { course: '—', faculty: '', room: '' },

    mon_14: { course: 'CS301-T (Tutorial)', faculty: 'Anand K', room: 'Block A-302' },
    tue_14: { course: 'CS501', faculty: 'Meena S', room: 'Block A-302' },
    wed_14: { course: 'CS401-T (Tutorial)', faculty: 'Priya N', room: 'Block A-302' },
    thu_14: { course: 'CS201', faculty: 'Rajesh K ⚠', room: 'Block A-302', warning: true },
    fri_14: { course: 'CS501-T (Tutorial)', faculty: 'Meena S', room: 'Block A-302' },
    sat_14: { course: '—', faculty: '', room: '' }
  });

  const [exams, setExams] = useState([
    { id: 'e1', name: 'Data Structures', code: 'CS301', date: '20 Nov 2026', time: '09:00 AM - 12:00 PM', hall: 'Hall A', invigilator: 'Dr. Anand Kumar' },
    { id: 'e2', name: 'Analysis of Algorithms', code: 'CS401', date: '22 Nov 2026', time: '09:00 AM - 12:00 PM', hall: 'Hall B', invigilator: 'Dr. Priya Nair' },
    { id: 'e3', name: 'Operating Systems', code: 'CS501', date: '24 Nov 2026', time: '09:00 AM - 12:00 PM', hall: 'Hall A', invigilator: 'Dr. Meena Iyer' },
    { id: 'e4', name: 'Database Management System', code: 'CS201', date: '26 Nov 2026', time: '09:00 AM - 12:00 PM', hall: 'Hall C', invigilator: 'Dr. Rajesh Kumar' },
    { id: 'e5', name: 'Computer Networks', code: 'CS601', date: '28 Nov 2026', time: '09:00 AM - 12:00 PM', hall: 'Hall B', invigilator: 'Dr. Arun Shetty' },
  ]);

  // Modals state management
  const [editingUnit, setEditingUnit] = useState<any | null>(null);
  const [editingCellKey, setEditingCellKey] = useState<string | null>(null);
  const [editingCellData, setEditingCellData] = useState<{ course: string, faculty: string, room?: string, warning?: boolean } | null>(null);
  const [editingExam, setEditingExam] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendChat = (text = inputText) => {
    if (!text.trim()) return;

    // Add user message
    const userMsgId = Date.now().toString();
    const newMessages = [...messages, { id: userMsgId, sender: 'user' as const, text }];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "I have received your request. Let me analyze that for you.";
      
      const query = text.toLowerCase().trim();
      
      // Greetings check
      if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/.test(query)) {
        replyText = "Hello! I am your Academic co-pilot AI. How can I assist you with your curriculum, timetable, or compliance checks today?";
      } 
      // 20+ Custom Q&As
      else if (query.includes('aicte workload limit') || query.includes('workload limit for a professor') || query.includes('workload norms')) {
        replyText = "According to AICTE norms, the maximum teaching workload is 18 hours/week for Assistant Professors, and 14 hours/week for Associate Professors and Professors. Currently, we have 2 faculty members exceeding this limit.";
        setActiveTab('compliance');
      } 
      else if (query.includes('resolve the workload violation') || query.includes('fix rajesh kumar') || query.includes('fix vikas rao')) {
        replyText = "To resolve workload violations: you can either click the 'Run Smart Re-balancer' button in the Timetable tab, or edit the timetable slot directly to assign a less loaded faculty member (e.g., swapping CS201 with Dr. Priya Nair).";
        setActiveTab('timetable');
      }
      else if (query.includes('course codes') || query.includes('odd semester codes') || query.includes('subject codes')) {
        replyText = "The CSE Odd Semester course codes are: CS301 (Data Structures), CS401 (Analysis of Algorithms), CS501 (Operating Systems), CS201 (Database Management Systems), and CS601 (Computer Networks).";
      }
      else if (query.includes('buffer hours') || query.includes('unit 4 buffer') || query.includes('buffer limit')) {
        replyText = "Unit 4 (Graph Algorithms) has 32 hours allocated, including a +18% buffer to accommodate complex topics (Dijkstra, Spanning Trees) and potential holiday disruptions.";
        setActiveTab('lesson-plans');
      }
      else if (query.includes('change the exam hall') || query.includes('change hall for cs301') || query.includes('move exam')) {
        replyText = "You can change exam halls by clicking the 'Edit' button next to the subject in the 'Exam Schedule' tab and selecting/entering the new Hall name (e.g., Hall D instead of Hall A).";
        setActiveTab('exams');
      }
      else if (query.includes('minimum gap') || query.includes('revision buffer') || query.includes('exam gap constraint')) {
        replyText = "AICTE rules require a minimum revision buffer of 48 hours between core subject exams. The CSE schedule has been verified to respect this gap for all students.";
        setActiveTab('exams');
      }
      else if (query.includes('lab supervision ratio') || query.includes('student to teacher ratio') || query.includes('lab ratio')) {
        replyText = "The UGC/AICTE standard dictates a maximum student-to-teacher ratio of 15:1 for lab sessions. Our database verifies that Lab Room 204 and Lab Room 108 have multiple supervisors assigned, ensuring 100% compliance.";
        setActiveTab('compliance');
      }
      else if (query.includes('invigilator for cs501') || query.includes('who invigilates cs501')) {
        replyText = "Dr. Meena Iyer is scheduled as the primary invigilator for CS501 Operating Systems, conducting the exam in Hall A.";
        setActiveTab('exams');
      }
      else if (query.includes('total credits') || query.includes('cs301 credits') || query.includes('credit weight')) {
        replyText = "CS301 (Data Structures) is a 4-credit course, structured as 3 Lecture hours and 1 Tutorial hour per week.";
      }
      else if (query.includes('schedule exams on sundays') || query.includes('exam sunday') || query.includes('sunday policy')) {
        replyText = "Per institutional policy, regular end-semester exams are not scheduled on Sundays or gazetted public holidays.";
        setActiveTab('exams');
      }
      else if (query.includes('syllabus components for unit 1') || query.includes('unit 1 topics') || query.includes('unit 1 coverage')) {
        replyText = "Unit 1 covers: Arrays, Linked Lists, Stacks, Queue operations, and their respective performance implementations.";
        setActiveTab('lesson-plans');
      }
      else if (query.includes('workload compliance grade') || query.includes('overall compliance score') || query.includes('compliance level')) {
        replyText = "The overall workload compliance score for the CSE department stands at 91%. The score is restricted from 100% due to the 2 flagged faculty overload violations.";
        setActiveTab('compliance');
      }
      else if (query.includes('highest workload') || query.includes('most loaded faculty') || query.includes('max hours allocated')) {
        replyText = "Dr. Vikas Rao (Mechanical Engineering Lead) has the highest teaching workload of 26 hours/week, which exceeds the AICTE recommendation by 8 hours.";
        setActiveTab('compliance');
      }
      else if (query.includes('how many weeks') || query.includes('semester duration') || query.includes('teaching weeks')) {
        replyText = "The Odd Semester is scheduled to run for exactly 15 active academic teaching weeks, excluding exam schedules.";
      }
      else if (query.includes('capacity of hall a') || query.includes('hall a size') || query.includes('hall a capacity')) {
        replyText = "Hall A has a standard exam seating capacity of 60 students, conforming to mandatory physical distancing guidelines.";
        setActiveTab('exams');
      }
      else if (query.includes('assign a new tutor') || query.includes('change tutor') || query.includes('assign faculty')) {
        replyText = "You can re-assign or swap course faculty in the ERP by editing the specific day/time cell under the 'Timetable' tab or by using the 'Smart Re-balancer'.";
        setActiveTab('timetable');
      }
      else if (query.includes('prerequisites for cs301') || query.includes('prerequisites of data structures')) {
        replyText = "The prerequisites for CS301 (Data Structures) are CS101 (Introduction to Programming) and CS102 (Discrete Mathematics).";
      }
      else if (query.includes('fix the 8-hour short') || query.includes('short lesson plan') || query.includes('lesson plan short')) {
        replyText = "To resolve the 8-hour gap, you can click the 'Apply Suggestion' button at the bottom of the 'Lesson Plans' tab. This inserts tutorial sessions to reach the AICTE-mandated 150 hours.";
        setActiveTab('lesson-plans');
      }
      else if (query.includes('dbms lab located') || query.includes('where is the dbms lab') || query.includes('room 108')) {
        replyText = "The DBMS Lab is located in Lab Room 108, which is on the Ground Floor of the IT Block.";
      }
      else if (query.includes('enrolled in cse section a') || query.includes('section a count') || query.includes('section a enrollment')) {
        replyText = "There are 58 students enrolled in CSE Section A for the current academic session.";
      }
      else if (query.includes('last date to upload') || query.includes('lesson plan deadline') || query.includes('upload deadline')) {
        replyText = "All draft lesson plans must be finalized and submitted in the ERP by July 15, 2026, to allow for department review before the August 1st semester start.";
      }
      else if (query.includes('handwritten papers tool') || query.includes('scan tool') || query.includes('ocr pipeline')) {
        replyText = "The Online Paper Evaluation module uses a secure OCR engine to ingest handwritten student exam papers and match their transcripts against AI-generated grading rubrics.";
      }
      // Standard prompts fallback
      else if (query.includes('odd semester') || query.includes('cse department')) {
        replyText = "Odd Semester 2026-27 config successfully loaded for the Computer Science Department. The lesson plan drafts, exam schedules, and initial timetables are ready for inspection in the tabs on the right.";
        setActiveTab('lesson-plans');
      } else if (query.includes('workload') || query.includes('compliance') || query.includes('aicte')) {
        replyText = "AICTE Workload Compliance audit complete. I identified 2 faculty workload limit breaches: Dr. Vikas Rao (26 hrs/week) and Dr. Rajesh Kumar (22 hrs/week). Both overloads are highlighted in the 'Timetable' and 'Compliance' tabs.";
        setActiveTab('compliance');
      } else if (query.includes('lesson plan') || query.includes('structures') || query.includes('ds')) {
        replyText = "Generated the week-by-week lesson plan for Data Structures (CS301). It appears to be 8 hours short of the mandatory AICTE contact hours. Recommended tutorial allocations are detailed in the 'Lesson Plans' tab.";
        setActiveTab('lesson-plans');
      } else if (query.includes('start date') || query.includes('august')) {
        replyText = "Adjusted semester start date to 1st August 2026. All timetable dates, calendar periods, and lesson plan weeks have been refactored dynamically.";
        showToast("Semester schedule refactored for Aug 1st start");
      } else if (query.includes('exam') || query.includes('schedule')) {
        replyText = "Generated optimal Exam Schedule for the CSE Department. Double-checked constraints: 0 overlap cases, and a minimum 48-hour revision buffer is maintained between papers.";
        setActiveTab('exams');
      } else {
        replyText = "Understood. I've updated the academic parameters and loaded the relevant metrics in the workspace dashboard. Let me know if you would like me to adjust lesson hours, faculty assignments, or room configurations.";
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText
      }]);
    }, 1500);
  };

  const handleSyllabusUploadTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Insert user upload log
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: `Uploaded syllabus: ${file.name}`
    }]);

    // Insert parser step message
    const parserMsgId = (Date.now() + 1).toString();
    const initialSteps = [
      { label: 'Ingesting syllabus document structure...', status: 'running' as const },
      { label: 'Extracting course units and learning goals...', status: 'pending' as const },
      { label: 'Cross-checking with AICTE guidelines & compliance rules...', status: 'pending' as const }
    ];

    setMessages(prev => [...prev, {
      id: parserMsgId,
      sender: 'ai',
      text: 'Syllabus processing initiated...',
      isParsing: true,
      parsingSteps: initialSteps
    }]);

    // Simulate stepping through the parsing process
    setTimeout(() => {
      // Step 2 starts
      setMessages(prev => prev.map(m => m.id === parserMsgId ? {
        ...m,
        parsingSteps: [
          { label: 'Ingesting syllabus document structure...', status: 'done' as const },
          { label: 'Extracting course units and learning goals...', status: 'running' as const },
          { label: 'Cross-checking with AICTE guidelines & compliance rules...', status: 'pending' as const }
        ]
      } : m));

      setTimeout(() => {
        // Step 3 starts
        setMessages(prev => prev.map(m => m.id === parserMsgId ? {
          ...m,
          parsingSteps: [
            { label: 'Ingesting syllabus document structure...', status: 'done' as const },
            { label: 'Extracting course units and learning goals...', status: 'done' as const },
            { label: 'Cross-checking with AICTE guidelines & compliance rules...', status: 'running' as const }
          ]
        } : m));

        setTimeout(() => {
          // All done
          setMessages(prev => prev.map(m => m.id === parserMsgId ? {
            ...m,
            text: `Successfully parsed "${file.name}"! I have generated a lesson plan draft for CS301 (Data Structures) and mapped it to the Odd Semester 2026-27 curriculum. See details on the right panel.`,
            isParsing: false,
            parsingSteps: undefined
          } : m));
          setHasSyllabusUploaded(true);
          setActiveTab('lesson-plans');
          showToast(`Syllabus "${file.name}" parsed and compiled!`);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: 'Hello! I am your Academic co-pilot AI. I can help you configure your upcoming semester, including lesson plans, timetables, exam schedules, and checking UGC/AICTE workload compliance. Choose a suggestion below or upload a syllabus to begin!'
      }
    ]);
    setHasSyllabusUploaded(false);
    setIsLessonPlanFixed(false);
    
    // Reset lesson plan hours
    setLessonPlans(prev => prev.map(u => {
      if (u.unit === 'Unit 3') return { ...u, hours: 18 };
      if (u.unit === 'Unit 5') return { ...u, hours: 22 };
      return u;
    }));
    
    showToast("Chat sessions and settings reset.");
  };

  const applyLessonPlanFix = () => {
    setIsLessonPlanFixed(true);
    setLessonPlans(prev => prev.map(u => {
      if (u.unit === 'Unit 3') return { ...u, hours: 22 };
      if (u.unit === 'Unit 5') return { ...u, hours: 26 };
      return u;
    }));
    
    showToast("AI suggestion applied: +8 tutorial hours scheduled successfully.");
    // Append AI confirmation to chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'ai',
      text: "Applied lesson plan fix: I added 2 tutorial slots (2 hours each) in Week 7 and Week 12. Contact hours are now 150 hours, fully meeting AICTE guidelines."
    }]);
  };

  // Modal Saving Handlers
  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;
    setLessonPlans(prev => prev.map(u => u.id === editingUnit.id ? editingUnit : u));
    setEditingUnit(null);
    showToast(`Updated ${editingUnit.unit} details.`);
  };

  const handleSaveCell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCellKey || !editingCellData) return;
    
    const updatedCell = { ...editingCellData };
    // Auto-clear warnings if they re-assign away from Rajesh K or Vikas
    if (updatedCell.faculty && !updatedCell.faculty.includes('Rajesh K') && !updatedCell.faculty.includes('Vikas')) {
      updatedCell.warning = false;
      updatedCell.faculty = updatedCell.faculty.replace(' ⚠', '');
    }
    
    setTimetable(prev => ({
      ...prev,
      [editingCellKey]: updatedCell
    }));
    setEditingCellKey(null);
    setEditingCellData(null);
    showToast("Timetable cell updated successfully.");
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setExams(prev => prev.map(ex => ex.id === editingExam.id ? editingExam : ex));
    setEditingExam(null);
    showToast(`Updated exam for ${editingExam.name}.`);
  };

  // Workload and Compliance Calculations
  const rajeshOccurrences = Object.values(timetable).filter(cell => cell.faculty && cell.faculty.includes('Rajesh K')).length;
  const rajeshWorkload = 17 + rajeshOccurrences;
  const isRajeshOverloaded = rajeshWorkload > 18;

  const vikasOccurrences = Object.values(timetable).filter(cell => cell.faculty && cell.faculty.includes('Vikas')).length;
  const vikasWorkload = 26 + vikasOccurrences;
  const isVikasOverloaded = vikasWorkload > 18;

  const totalContactHours = lessonPlans.reduce((sum, item) => sum + Number(item.hours || 0), 0);
  const isPlanCompliant = totalContactHours >= 150;

  const workloadRestrictionProgress = (isRajeshOverloaded || isVikasOverloaded) ? (isRajeshOverloaded && isVikasOverloaded ? 72 : 86) : 100;
  const overallComplianceScore = Math.round((94.7 + 100 + 100 + workloadRestrictionProgress + 100) / 5);

  const applyWorkloadBalancer = () => {
    setTimetable(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        const cell = updated[k as keyof typeof timetable];
        if (cell.faculty && cell.faculty.includes('Rajesh K')) {
          updated[k as keyof typeof timetable] = {
            ...cell,
            faculty: 'Priya N',
            warning: false
          };
        }
      });
      return updated;
    });
    showToast("Re-balancing complete. Overloaded slots re-allocated to available compliant faculty.");
  };

  // Helper for timetable cell rendering
  const renderCell = (key: keyof typeof timetable) => {
    const cell = timetable[key];
    if (!cell) return null;
    const isWarning = cell.warning || (cell.faculty && (cell.faculty.includes('Rajesh K') || cell.faculty.includes('Vikas')));
    const bgClass = isWarning 
      ? 'bg-rose-50/40 border-l-2 border-l-rose-500 text-slate-800' 
      : cell.course === '—' 
        ? 'text-slate-400 font-medium' 
        : cell.course.includes('-T') 
          ? 'bg-indigo-50/20 text-slate-800' 
          : cell.course.includes('CS301') 
            ? 'bg-indigo-50/40 text-slate-800'
            : cell.course.includes('CS401') 
              ? 'bg-sky-50/40 text-slate-800'
              : cell.course.includes('CS501')
                ? 'bg-amber-50/40 text-slate-800'
                : 'bg-indigo-50/40 text-slate-800';

    return (
      <td 
        className={`px-2 py-3 border-r border-slate-100 font-medium cursor-pointer hover:bg-slate-100 transition-all ${bgClass}`}
        onClick={() => {
          setEditingCellKey(key);
          setEditingCellData({ course: cell.course, faculty: cell.faculty, room: cell.room, warning: cell.warning });
        }}
      >
        {cell.course}
        {cell.faculty && (
          <>
            <br/>
            <span className={`text-[9px] font-normal ${isWarning ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
              {cell.faculty}
            </span>
          </>
        )}
      </td>
    );
  };

  const renderLabCell = (key: keyof typeof timetable, colSpan: number) => {
    const cell = timetable[key];
    if (!cell) return null;
    return (
      <td 
        colSpan={colSpan} 
        className="px-2 py-3 border-r border-slate-100 bg-slate-50 text-slate-600 font-bold italic cursor-pointer hover:bg-slate-100 transition-all"
        onClick={() => {
          setEditingCellKey(key);
          setEditingCellData({ course: cell.course, faculty: cell.faculty, room: cell.room, warning: cell.warning });
        }}
      >
        {cell.course}
        <br/>
        <span className="text-[9px] text-slate-500 font-normal">{cell.faculty}</span>
      </td>
    );
  };

  return (
    <Layout
      title="Academic co-pilot"
      description="AI-driven syllabus parser, lesson plan builder, and academic compliance engine"
      icon={BookOpen}
      showHome={true}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Main Split-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-9rem)]">
        
        {/* LEFT COLUMN: Chat Assistant (5/12 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-[600px] lg:h-auto">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-600 rounded-md text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Academic Assistant</h3>
                <p className="text-[10px] text-slate-500 font-medium">Semester Configurator Core</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="h-7 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Reset
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-slate-50/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2.5 text-xs leading-relaxed shadow-sm border ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 border-blue-600 text-white shadow-blue-600/5'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-1.5 mb-1 font-bold text-blue-600 uppercase tracking-wider text-[9px]">
                      <Sparkles className="w-2.5 h-2.5" />
                      edumerge AI
                    </div>
                  )}
                  <p>{msg.text}</p>

                  {/* Parsing checklist visualization */}
                  {msg.isParsing && msg.parsingSteps && (
                    <div className="mt-3 p-2 bg-slate-50 border border-slate-100 rounded-md space-y-2">
                      {msg.parsingSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                          {step.status === 'done' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : step.status === 'running' ? (
                            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 shrink-0"></div>
                          )}
                          <span className={step.status === 'done' ? 'text-slate-400 line-through' : 'font-medium'}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-500 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  Analyzing syllabus model...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chips suggestions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Suggested Prompts</p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {[
                'Configure Odd Semester 2026-27 for CSE Department',
                'Check faculty workload compliance — AICTE norms',
                'Generate lesson plan for Data Structures',
                'Adjust semester start date to 1st August 2026',
                'Audit classroom & infrastructure capacity allocations',
                'Verify faculty qualification & specialization mapping'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(chip)}
                  className="text-[10px] text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/20 py-1 px-2.5 rounded-full transition-all text-left truncate max-w-full font-medium"
                >
                  "{chip}"
                </button>
              ))}
            </div>
          </div>

          {/* Input block */}
          <div className="p-3 border-t border-slate-200 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSyllabusUploadTrigger}
              className="h-9 w-9 shrink-0 border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Upload syllabus file"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder="Type message or ask about curriculum..."
              className="flex-1 text-xs border-slate-200 focus-visible:ring-blue-600 rounded-md h-9"
            />
            <Button
              size="icon"
              onClick={() => handleSendChat()}
              disabled={!inputText.trim()}
              className="h-9 w-9 shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output display workbench (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-2 pt-2 shrink-0">
            {[
              { id: 'lesson-plans', label: 'Lesson Plans' },
              { id: 'timetable', label: 'Timetable' },
              { id: 'exams', label: 'Exam Schedule' },
              { id: 'compliance', label: 'Compliance' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-4 text-xs font-semibold border-t-2 -mb-px transition-all rounded-t-md ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white border-l border-r border-slate-200 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Workbench Body */}
          <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
            
            {/* 1. LESSON PLANS TAB */}
            {activeTab === 'lesson-plans' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Lesson Plan: Data Structures (CS301)</h3>
                    <p className="text-[10px] text-slate-500">Odd Semester 2026-27 — Faculty: Dr. Anand Kumar</p>
                  </div>
                  <Badge variant={isPlanCompliant ? 'emerald' : 'warning'}>
                    {isPlanCompliant ? '✓ Fully Compliant' : 'Adjustment Recommended'}
                  </Badge>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-16">Unit</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Topics Covered</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-24">Weeks</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-28">Contact Hours</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lessonPlans.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 font-semibold text-slate-900 mono">{item.unit}</td>
                          <td className="px-3 py-2 text-slate-600">{item.topics}</td>
                          <td className="px-3 py-2 text-slate-600">{item.weeks}</td>
                          <td className="px-3 py-2 text-slate-900 font-medium">{item.hours} hrs</td>
                          <td className="px-3 py-2 flex items-center justify-between gap-1.5">
                            <Badge variant={item.status === 'Verified' ? 'emerald' : 'warning'} className="py-0">
                              {item.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[10px] text-blue-600 hover:text-blue-700 px-1.5 animate-in fade-in"
                              onClick={() => setEditingUnit(item)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-200">
                        <td colSpan={2} className="px-3 py-2.5 text-slate-700">Total Contact Hours</td>
                        <td className="px-3 py-2.5 text-slate-700">15 Weeks</td>
                        <td className="px-3 py-2.5 text-slate-900">{totalContactHours} hrs</td>
                        <td className="px-3 py-2.5">
                          {isPlanCompliant ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Compliant
                            </span>
                          ) : (
                            <span className="text-rose-600 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> {150 - totalContactHours} hrs Short
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {!isPlanCompliant && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-800">AI compliance alert: Contact hours below threshold</strong>
                        <p className="text-amber-700 mt-0.5">Lesson plan covers {totalContactHours} hours, failing the AICTE 150-hour curriculum mandate for CS301. AI recommends adding two 4-hour tutorial modules in Week 7 and 12.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                      <Button size="sm" onClick={applyLessonPlanFix} className="bg-blue-600 hover:bg-blue-700 h-8 text-[11px]">
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                )}

                {isPlanCompliant && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong>Success: Lesson plan meets regulatory minimums</strong>
                      <p className="text-emerald-700 mt-0.5">Contact hours corrected to {totalContactHours} hours. Adjusted lesson plan has been saved to the ERP catalog.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. TIMETABLE TAB */}
            {activeTab === 'timetable' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Class Timetable: CSE Section A</h3>
                    <p className="text-[10px] text-slate-500">Odd Semester 2026-27 — Regular Room: Block A-302</p>
                  </div>
                  <Badge variant={isRajeshOverloaded || isVikasOverloaded ? "destructive" : "emerald"}>
                    {isRajeshOverloaded || isVikasOverloaded 
                      ? `${(isRajeshOverloaded ? 1 : 0) + (isVikasOverloaded ? 1 : 0)} Overload Conflicts` 
                      : '✓ Compliant'}
                  </Badge>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-center text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500 w-24">Time</th>
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500">MON</th>
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500">TUE</th>
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500">WED</th>
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500">THU</th>
                          <th className="px-2 py-2 border-r border-slate-200 font-bold text-slate-500">FRI</th>
                          <th className="px-2 py-2 font-bold text-slate-500">SAT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-2 py-3 bg-slate-50/50 font-medium border-r border-slate-200 text-slate-500">08:00 - 09:00</td>
                          {renderCell('mon_08')}
                          {renderCell('tue_08')}
                          {renderCell('wed_08')}
                          {renderCell('thu_08')}
                          {renderCell('fri_08')}
                          {renderCell('sat_08')}
                        </tr>
                        <tr>
                          <td className="px-2 py-3 bg-slate-50/50 font-medium border-r border-slate-200 text-slate-500">09:00 - 10:00</td>
                          {renderCell('mon_09')}
                          {renderCell('tue_09')}
                          {renderCell('wed_09')}
                          {renderCell('thu_09')}
                          {renderCell('fri_09')}
                          {renderCell('sat_09')}
                        </tr>
                        <tr>
                          <td className="px-2 py-3 bg-slate-50/50 font-medium border-r border-slate-200 text-slate-500">10:00 - 11:00</td>
                          {renderLabCell('mon_tue_lab', 2)}
                          {renderCell('wed_10')}
                          {renderCell('thu_10')}
                          {renderLabCell('fri_sat_lab', 2)}
                        </tr>
                        <tr>
                          <td className="px-2 py-3 bg-slate-50/50 font-medium border-r border-slate-200 text-slate-500">11:00 - 12:00</td>
                          {renderCell('mon_11')}
                          {renderCell('tue_11')}
                          {renderCell('wed_11')}
                          {renderCell('thu_11')}
                          {renderCell('fri_11')}
                          {renderCell('sat_11')}
                        </tr>
                        <tr className="bg-slate-50 text-[10px] text-slate-500 font-bold">
                          <td colSpan={7} className="py-1">LUNCH BREAK (12:00 - 14:00)</td>
                        </tr>
                        <tr>
                          <td className="px-2 py-3 bg-slate-50/50 font-medium border-r border-slate-200 text-slate-500">14:00 - 15:00</td>
                          {renderCell('mon_14')}
                          {renderCell('tue_14')}
                          {renderCell('wed_14')}
                          {renderCell('thu_14')}
                          {renderCell('fri_14')}
                          {renderCell('sat_14')}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {(isRajeshOverloaded || isVikasOverloaded) && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs space-y-2 animate-in fade-in">
                    <div className="flex gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-red-800">Critical Workload Limit Infringement (AICTE Norm Section 4.2)</strong>
                        <p className="text-red-700 mt-0.5">Faculty weekly teaching load exceeds statutory thresholds:</p>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 text-red-700 space-y-1 ml-1.5">
                      {isRajeshOverloaded && (
                        <li><strong>Dr. Rajesh Kumar (CSE HOD):</strong> Allocated {rajeshWorkload} hours/week. AICTE Maximum Limit: 18 hours. ({Math.round(((rajeshWorkload - 18) / 18) * 100)}% Overloaded)</li>
                      )}
                      {isVikasOverloaded && (
                        <li><strong>Dr. Vikas Rao (MECH Lead):</strong> Allocated {vikasWorkload} hours/week. AICTE Maximum Limit: 18 hours. ({Math.round(((vikasWorkload - 18) / 18) * 100)}% Overloaded)</li>
                      )}
                    </ul>
                    <div className="pt-2 flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-[10px] text-slate-600 border-slate-200" onClick={() => showToast('Escalated workload allocation report to Dean.')}>
                        Escalate to Dean
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 h-7 text-[10px] text-white" onClick={applyWorkloadBalancer}>
                        Run Smart Re-balancer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. EXAM SCHEDULE TAB */}
            {activeTab === 'exams' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Exam Schedule: CSE Department</h3>
                    <p className="text-[10px] text-slate-500">Odd Semester End Examinations (November 2026)</p>
                  </div>
                  <Badge variant="emerald">Verified Compliant</Badge>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Subject Name</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-24">Code</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-28">Date</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-28">Time Slot</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider w-24">Hall</th>
                        <th className="px-3 py-2.5 font-bold text-slate-500 uppercase tracking-wider">Invigilator</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {exams.map((ex) => (
                        <tr key={ex.id}>
                          <td className="px-3 py-2 text-slate-900 font-medium">{ex.name}</td>
                          <td className="px-3 py-2 text-slate-600 font-semibold mono">{ex.code}</td>
                          <td className="px-3 py-2 text-slate-600">{ex.date}</td>
                          <td className="px-3 py-2 text-slate-600">{ex.time}</td>
                          <td className="px-3 py-2 text-slate-600">{ex.hall}</td>
                          <td className="px-3 py-2 text-slate-600 font-medium flex items-center justify-between gap-1.5">
                            <span>{ex.invigilator}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[10px] text-blue-600 hover:text-blue-700 px-1.5 animate-in fade-in"
                              onClick={() => setEditingExam(ex)}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="emerald" className="py-1 px-2.5 text-[10px] font-bold">
                    ✓ 0 exam schedule overlaps detected
                  </Badge>
                  <Badge variant="emerald" className="py-1 px-2.5 text-[10px] font-bold">
                    ✓ 48-hour gap constraint met for all students
                  </Badge>
                  <Badge variant="emerald" className="py-1 px-2.5 text-[10px] font-bold">
                    ✓ Invigilator allocation limits validated
                  </Badge>
                </div>
              </div>
            )}

            {/* 4. COMPLIANCE TAB */}
            {activeTab === 'compliance' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Regulatory Workload Compliance</h3>
                    <p className="text-[10px] text-slate-500">AICTE Faculty & Coursework Allocation Standards</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500">Overall Grade:</span>
                    <Badge variant={overallComplianceScore < 100 ? "warning" : "emerald"} className="text-xs">
                      {overallComplianceScore}% Compliance
                    </Badge>
                  </div>
                </div>

                <Card className="shadow-sm border-slate-200">
                  <CardContent className="p-4 space-y-4">
                    
                    {/* Compliance Progress bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Syllabus Hours Allocation</span>
                          <span className="text-slate-900">{totalContactHours >= 150 ? '100%' : '94.7%'}</span>
                        </div>
                        <Progress value={totalContactHours >= 150 ? 100 : 94.7} className="h-2 bg-slate-100" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Lab Supervision Ratio (1:15)</span>
                          <span className="text-slate-900">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-slate-100" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Tutorial Session Allocation</span>
                          <span className="text-slate-900">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-slate-100" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Faculty Workload Restriction</span>
                          <span className={workloadRestrictionProgress < 100 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                            {workloadRestrictionProgress.toFixed(1)}% {workloadRestrictionProgress < 100 ? '(Warning)' : '(Compliant)'}
                          </span>
                        </div>
                        <Progress value={workloadRestrictionProgress} className={`h-2 bg-slate-100 ${workloadRestrictionProgress < 100 ? '[&>div]:bg-rose-500' : ''}`} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700">Holiday Exclusions Matching</span>
                          <span className="text-slate-900">100%</span>
                        </div>
                        <Progress value={100} className="h-2 bg-slate-100" />
                      </div>
                    </div>

                    {(isRajeshOverloaded || isVikasOverloaded) ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1 text-rose-800">
                        <strong className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          Flagged Overload Violations ({(isRajeshOverloaded ? 1 : 0) + (isVikasOverloaded ? 1 : 0)})
                        </strong>
                        <div className="pl-5 space-y-1 font-medium mt-1">
                          {isVikasOverloaded && (
                            <p>• <strong>Dr. Vikas Rao (MECH):</strong> {vikasWorkload} hrs/week (Overloaded by +{vikasWorkload - 18} hrs relative to maximum regular limit of 18)</p>
                          )}
                          {isRajeshOverloaded && (
                            <p>• <strong>Dr. Rajesh Kumar (CSE):</strong> {rajeshWorkload} hrs/week (Overloaded by +{rajeshWorkload - 18} hrs relative to maximum regular limit of 18)</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-800">
                        <strong className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          All Faculty Workloads Within AICTE Limits
                        </strong>
                        <p className="pl-5 font-medium mt-1">No workload limit violations detected in this department.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* MODALS */}
      {/* 1. Unit Edit Modal */}
      <Dialog open={editingUnit !== null} onOpenChange={(open) => !open && setEditingUnit(null)}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">Edit Unit - {editingUnit?.unit}</DialogTitle>
            <DialogDescription className="text-[10px]">Update topics covered, weeks range, and contact hours allocation.</DialogDescription>
          </DialogHeader>
          {editingUnit && (
            <form onSubmit={handleSaveUnit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="topics" className="text-[10px] font-bold text-slate-500 uppercase">Topics Covered</Label>
                <textarea
                  id="topics"
                  value={editingUnit.topics}
                  onChange={e => setEditingUnit({ ...editingUnit, topics: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="weeks" className="text-[10px] font-bold text-slate-500 uppercase">Weeks</Label>
                  <Input
                    id="weeks"
                    type="text"
                    value={editingUnit.weeks}
                    onChange={e => setEditingUnit({ ...editingUnit, weeks: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="hours" className="text-[10px] font-bold text-slate-500 uppercase">Contact Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={editingUnit.hours}
                    onChange={e => setEditingUnit({ ...editingUnit, hours: parseInt(e.target.value) || 0 })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingUnit(null)} className="h-8 text-xs border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. Timetable Cell Edit Modal */}
      <Dialog open={editingCellKey !== null} onOpenChange={(open) => !open && setEditingCellKey(null)}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">Edit Timetable Slot</DialogTitle>
            <DialogDescription className="text-[10px]">Modify class details for timetable slot {editingCellKey?.replace('_', ' ').toUpperCase()}.</DialogDescription>
          </DialogHeader>
          {editingCellKey && editingCellData && (
            <form onSubmit={handleSaveCell} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label htmlFor="course" className="text-[10px] font-bold text-slate-500 uppercase">Course Code / Name</Label>
                <Input
                  id="course"
                  type="text"
                  value={editingCellData.course}
                  onChange={e => setEditingCellData({ ...editingCellData, course: e.target.value })}
                  className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="faculty" className="text-[10px] font-bold text-slate-500 uppercase">Faculty Name</Label>
                <Input
                  id="faculty"
                  type="text"
                  value={editingCellData.faculty}
                  onChange={e => setEditingCellData({ ...editingCellData, faculty: e.target.value })}
                  className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="room" className="text-[10px] font-bold text-slate-500 uppercase">Classroom / Location</Label>
                <Input
                  id="room"
                  type="text"
                  value={editingCellData.room || ''}
                  onChange={e => setEditingCellData({ ...editingCellData, room: e.target.value })}
                  className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingCellKey(null)} className="h-8 text-xs border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Save Slot
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 3. Exam Schedule Edit Modal */}
      <Dialog open={editingExam !== null} onOpenChange={(open) => !open && setEditingExam(null)}>
        <DialogContent className="bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">Edit Exam Details</DialogTitle>
            <DialogDescription className="text-[10px]">Modify core exam details, venues, and assigned invigilator.</DialogDescription>
          </DialogHeader>
          {editingExam && (
            <form onSubmit={handleSaveExam} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="examName" className="text-[10px] font-bold text-slate-500 uppercase">Subject Name</Label>
                  <Input
                    id="examName"
                    type="text"
                    value={editingExam.name}
                    onChange={e => setEditingExam({ ...editingExam, name: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="examCode" className="text-[10px] font-bold text-slate-500 uppercase">Course Code</Label>
                  <Input
                    id="examCode"
                    type="text"
                    value={editingExam.code}
                    onChange={e => setEditingExam({ ...editingExam, code: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="examDate" className="text-[10px] font-bold text-slate-500 uppercase">Exam Date</Label>
                  <Input
                    id="examDate"
                    type="text"
                    value={editingExam.date}
                    onChange={e => setEditingExam({ ...editingExam, date: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="examTime" className="text-[10px] font-bold text-slate-500 uppercase">Time Slot</Label>
                  <Input
                    id="examTime"
                    type="text"
                    value={editingExam.time}
                    onChange={e => setEditingExam({ ...editingExam, time: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="examHall" className="text-[10px] font-bold text-slate-500 uppercase">Venue Hall</Label>
                  <Input
                    id="examHall"
                    type="text"
                    value={editingExam.hall}
                    onChange={e => setEditingExam({ ...editingExam, hall: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="examInvigilator" className="text-[10px] font-bold text-slate-500 uppercase">Invigilator</Label>
                  <Input
                    id="examInvigilator"
                    type="text"
                    value={editingExam.invigilator}
                    onChange={e => setEditingExam({ ...editingExam, invigilator: e.target.value })}
                    className="text-xs border-slate-200 focus-visible:ring-blue-500 h-8"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingExam(null)} className="h-8 text-xs border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  Save Exam
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
