import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  FolderOpen, 
  HelpCircle, 
  BarChart2, 
  PlusCircle, 
  CheckCircle2, 
  Download, 
  Wand2, 
  ArrowLeft, 
  User, 
  Users, 
  Clock, 
  CheckSquare, 
  Calendar, 
  Brain,
  FileText,
  List,
  Compass,
  Presentation,
  AlertTriangle,
  Info,
  Trash2,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface RepositoryItem {
  subject: string;
  unit: string;
  topic: string;
  type: string;
  date: string;
  status: 'Approved' | 'Pending';
  faculty: string;
}

interface Question {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'MCQ' | 'Short Answer' | 'Long Answer';
  co: 'CO3' | 'CO4' | 'CO1' | 'CO2' | 'CO5';
  blooms: string;
  options?: string[];
  answerIdx?: number;
  explanation?: string;
  marks?: number;
  answer?: string;
}

interface SubjectMetadata {
  name: string;
  dept: string;
  hours: string;
  co: string;
  instructor: string;
  sem: string;
}

const contextMetadata: Record<string, SubjectMetadata> = {
  CS301: { name: "Data Structures", dept: "CSE Department", hours: "6 hrs", co: "CO3, CO4", instructor: "Dr. Anand Kumar", sem: "Semester 3" },
  CS401: { name: "Algorithms", dept: "CSE Department", hours: "8 hrs", co: "CO1, CO2", instructor: "Dr. Priya Nair", sem: "Semester 4" },
  CS501: { name: "Operating Systems", dept: "IT Department", hours: "6 hrs", co: "CO2, CO5", instructor: "Dr. Meena Sharma", sem: "Semester 5" },
  CS201: { name: "Database Systems", dept: "CSE Department", hours: "6 hrs", co: "CO1, CO3", instructor: "Dr. Rajesh Kumar", sem: "Semester 2" }
};

const unitTopics: Record<string, string[]> = {
  'Unit 1': ['Linked Lists', 'Stacks', 'Queues', 'Arrays'],
  'Unit 2': ['Binary Trees', 'BST Operations', 'AVL Trees', 'B-Trees'],
  'Unit 3': ['BFS Algorithm', 'DFS Algorithm', 'Dijkstra', 'MST (Minimum Spanning Tree)', 'Topological Sort'],
  'Unit 4': ['Fractional Knapsack', '0/1 Knapsack', 'LCS', 'Matrix Chain Multiplication'],
  'Unit 5': ['Quick Sort', 'Merge Sort', 'Chaining', 'Open Addressing']
};

export default function AcademicContentIntelligence() {
  const [activeScreen, setActiveScreen] = useState<'generate' | 'repository' | 'quiz-builder' | 'analytics'>('generate');
  const [subject, setSubject] = useState('CS301');
  const [unit, setUnit] = useState('Unit 3');
  const [topic, setTopic] = useState('BFS Algorithm');
  
  // Toasts
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const showToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Synchronize topics dropdown when unit shifts
  useEffect(() => {
    const topics = unitTopics[unit] || [];
    if (topics.length > 0 && !topics.includes(topic)) {
      setTopic(topics[0]);
    }
  }, [unit]);

  const activeSubjectMeta = useMemo(() => {
    return contextMetadata[subject] || { name: "", dept: "", hours: "6 hrs", co: "CO3, CO4", instructor: "", sem: "" };
  }, [subject]);

  // Generation Triggers
  const [isGenerating, setIsGenerating] = useState(false);
  const [genType, setGenType] = useState<string>('');
  const [loaderStep, setLoaderStep] = useState(0);
  const [generatedTypes, setGeneratedTypes] = useState<Record<string, boolean>>({
    notes: false,
    quiz: false,
    summary: false,
    guide: false,
    ppt: false
  });
  const [savedTypes, setSavedTypes] = useState<Record<string, boolean>>({
    notes: false,
    quiz: false,
    summary: false,
    guide: false,
    ppt: false
  });

  const startGeneration = (type: string) => {
    setIsGenerating(true);
    setGenType(type);
    setLoaderStep(0);
    
    // Reset generated and saved states immediately for refresh/regenerate
    if (type === 'all') {
      setGeneratedTypes({ notes: false, quiz: false, summary: false, guide: false, ppt: false });
      setSavedTypes({ notes: false, quiz: false, summary: false, guide: false, ppt: false });
      // Remove all 5 types from repository
      setRepository(prev => prev.filter(item => 
        !(item.subject === subject && item.unit === unit && item.topic === topic)
      ));
    } else {
      // Clear all generated blocks immediately to show only the loading type
      setGeneratedTypes({ notes: false, quiz: false, summary: false, guide: false, ppt: false });
      setSavedTypes(prev => ({ ...prev, [type]: false }));
      // Remove specific type from repository
      const typeLabel = type === 'notes' ? 'Notes' : type === 'quiz' ? 'Quiz Bank' : type === 'summary' ? 'Summary' : type === 'guide' ? 'Student Guide' : 'PPT Outline';
      setRepository(prev => prev.filter(item => 
        !(item.subject === subject && item.unit === unit && item.topic === topic && item.type === typeLabel)
      ));
    }
    
    // Simulate animated loading timeline steps
    const interval = setInterval(() => {
      setLoaderStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            if (type === 'all') {
              setGeneratedTypes({ notes: true, quiz: true, summary: true, guide: true, ppt: true });
            } else {
              // Only set the active type to true, keeping others false
              setGeneratedTypes({
                notes: type === 'notes',
                quiz: type === 'quiz',
                summary: type === 'summary',
                guide: type === 'guide',
                ppt: type === 'ppt'
              });
            }
          }, 400);
          return 5;
        }
        return prev + 1;
      });
    }, 300);
  };

  // Reset generated status when Context variables modify
  const handleContextChange = (newSubject: string, newUnit: string, newTopic: string) => {
    setSubject(newSubject);
    setUnit(newUnit);
    setTopic(newTopic);
    setGeneratedTypes({ notes: false, quiz: false, summary: false, guide: false, ppt: false });
    setSavedTypes({ notes: false, quiz: false, summary: false, guide: false, ppt: false });
    showToast(`Context updated — ready to generate for ${newTopic}`);
  };

  // Repository Database State
  const [repository, setRepository] = useState<RepositoryItem[]>([
    { subject: 'CS301', unit: 'Unit 3', topic: 'BFS Algorithm', type: 'Notes', date: '24 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 3', topic: 'BFS Algorithm', type: 'Quiz Bank', date: '24 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 3', topic: 'BFS Algorithm', type: 'Summary', date: '24 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 3', topic: 'BFS Algorithm', type: 'Student Guide', date: '24 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 3', topic: 'BFS Algorithm', type: 'PPT Outline', date: '24 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 2', topic: 'Binary Search Tree', type: 'Notes', date: '10 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 2', topic: 'Binary Search Tree', type: 'Quiz Bank', date: '10 May 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS301', unit: 'Unit 1', topic: 'Linked Lists', type: 'Notes', date: '02 Apr 2026', status: 'Approved', faculty: 'Dr. Anand K' },
    { subject: 'CS401', unit: 'Unit 1', topic: 'Dynamic Programming', type: 'Notes', date: '18 May 2026', status: 'Pending', faculty: 'Dr. Priya N' },
    { subject: 'CS401', unit: 'Unit 1', topic: 'Dynamic Programming', type: 'Quiz Bank', date: '18 May 2026', status: 'Pending', faculty: 'Dr. Priya N' },
    { subject: 'CS501', unit: 'Unit 2', topic: 'Process Scheduling', type: 'Summary', date: '05 May 2026', status: 'Approved', faculty: 'Dr. Meena S' },
    { subject: 'CS201', unit: 'Unit 3', topic: 'SQL Joins', type: 'PPT Outline', date: '28 Apr 2026', status: 'Approved', faculty: 'Dr. Rajesh K' }
  ]);

  // Repository Filters
  const [repoSubject, setRepoSubject] = useState('all');
  const [repoUnit, setRepoUnit] = useState('all');
  const [repoType, setRepoType] = useState('all');
  const [repoSearch, setRepoSearch] = useState('');

  const filteredRepository = useMemo(() => {
    return repository.filter(item => {
      if (repoSubject !== 'all' && item.subject !== repoSubject) return false;
      if (repoUnit !== 'all' && item.unit !== repoUnit) return false;
      if (repoType !== 'all' && item.type !== repoType) return false;
      if (repoSearch) {
        const query = repoSearch.toLowerCase();
        return (
          item.topic.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.faculty.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [repository, repoSubject, repoUnit, repoType, repoSearch]);

  const repoStats = useMemo(() => {
    let approved = 0;
    let pending = 0;
    repository.forEach(item => {
      if (item.status === 'Approved') approved++;
      else pending++;
    });
    return { total: repository.length, approved, pending };
  }, [repository]);

  // Repository item review modal
  const [reviewModalItem, setReviewModalItem] = useState<RepositoryItem | null>(null);

  const approvePendingItem = (itemToApprove: RepositoryItem) => {
    setRepository(prev => prev.map(item => {
      if (item.topic === itemToApprove.topic && item.type === itemToApprove.type) {
        return { ...item, status: 'Approved' };
      }
      return item;
    }));
    setReviewModalItem(null);
    showToast(`✓ Approved and released ${itemToApprove.topic} ${itemToApprove.type} to repository`);
  };

  // Quiz Builder Database
  const questionBank: Question[] = [
    { id: 1, text: "Which data structure does BFS use internally?", difficulty: "Easy", type: "MCQ", co: "CO3", blooms: "Remember", options: ["Stack", "Queue", "Priority Queue", "Linked List"], answerIdx: 1, explanation: "BFS uses Queue (FIFO) to process vertices level by level." },
    { id: 2, text: "Time complexity of BFS with V vertices and E edges?", difficulty: "Medium", type: "MCQ", co: "CO3", blooms: "Understand", options: ["O(V²)", "O(E log V)", "O(V+E)", "O(V×E)"], answerIdx: 2, explanation: "BFS visits each vertex once O(V) and each edge once O(E)." },
    { id: 3, text: "BFS is preferred for shortest path in unweighted graphs because:", difficulty: "Medium", type: "MCQ", co: "CO4", blooms: "Apply", options: ["It uses less memory", "It explores level by level, guaranteeing minimum hops", "It is always faster than DFS", "It handles negative weights correctly"], answerIdx: 1, explanation: "Exploring level by level ensures the first time we visit a node, it is through the path of minimum edges." },
    { id: 4, text: "Finding connections within 3 degrees in a 1-million-user social network. Most efficient approach:", difficulty: "Hard", type: "MCQ", co: "CO4", blooms: "Analyse", options: ["BFS limited to depth 3", "DFS with backtracking", "Dijkstra's algorithm", "Dynamic programming"], answerIdx: 0, explanation: "BFS will query level by level, stopping when depth reaches 3, which is highly efficient for degree expansion." },
    { id: 5, text: "When is a vertex added to the visited array in BFS?", difficulty: "Easy", type: "MCQ", co: "CO3", blooms: "Remember", options: ["When first discovered — before enqueuing", "When dequeued for processing", "When all its neighbours are visited", "When enqueued a second time"], answerIdx: 0, explanation: "Adding to visited before enqueuing prevents duplicate entries in the queue." },
    { id: 6, text: "Explain BFS with a suitable example. Trace execution step by step.", difficulty: "Medium", type: "Short Answer", co: "CO3", blooms: "Understand", marks: 5, answer: "BFS starts at source, marks visited, enqueues. Repeatedly dequeues, processes, enqueues unvisited neighbours. Award 2 marks for algorithm + 3 marks for correct trace with queue states." },
    { id: 7, text: "Compare BFS and DFS. When would you prefer BFS?", difficulty: "Medium", type: "Short Answer", co: "CO4", blooms: "Understand", marks: 5, answer: "4 key comparison points + 2 BFS use cases. 1 mark per valid comparison (max 3) + 2 marks for use cases." },
    { id: 8, text: "Implement BFS for an undirected graph as adjacency list. Trace for given graph. Draw BFS tree.", difficulty: "Hard", type: "Long Answer", co: "CO3", blooms: "Apply", marks: 10, answer: "Marking breakdown: Algorithm 4 marks · Adjacency list 2 marks · Trace 3 marks · Tree 1 mark." },
    { id: 9, text: "Can you trace BFS for a 6-vertex graph in under 5 minutes?", difficulty: "Easy", type: "Short Answer", co: "CO3", blooms: "Remember", marks: 5, answer: "Standard 6-vertex cycle and traversal path demonstration." },
    { id: 10, text: "Dijkstra's algorithm vs BFS for shortest paths in weighted graphs.", difficulty: "Hard", type: "Short Answer", co: "CO4", blooms: "Analyse", marks: 5, answer: "Explanation of priority queues vs FIFO queues. BFS failure modes on weighted edges." }
  ];

  // Quiz Builder Composer states
  const [qbDifficulty, setQbDifficulty] = useState('all');
  const [qbCo, setQbCo] = useState('all');
  const [composerQuestions, setComposerQuestions] = useState<Question[]>([]);
  const [compTitle, setCompTitle] = useState('Internal Assessment 1 — CS301');
  const [compDuration, setCompDuration] = useState('2 hours');
  const [compDate, setCompDate] = useState('2026-06-10');
  const [compSection, setCompSection] = useState('CSE-3A, CSE-3B, CSE-3C');
  const [isAutoComposing, setIsAutoComposing] = useState(false);
  const [isReportComposed, setIsReportComposed] = useState(false);

  const filteredQBank = useMemo(() => {
    return questionBank.filter(q => {
      if (qbDifficulty !== 'all' && q.difficulty !== qbDifficulty) return false;
      if (qbCo !== 'all' && q.co !== qbCo) return false;
      return true;
    });
  }, [qbDifficulty, qbCo]);

  const composerMarksTotal = useMemo(() => {
    return composerQuestions.reduce((acc, q) => {
      let marks = 2;
      if (q.type === 'Short Answer') marks = 5;
      if (q.type === 'Long Answer') marks = 10;
      return acc + marks;
    }, 0);
  }, [composerQuestions]);

  const addQuestion = (q: Question) => {
    if (!composerQuestions.some(item => item.id === q.id)) {
      setComposerQuestions(prev => [...prev, q]);
    }
  };

  const removeQuestion = (qId: number) => {
    setComposerQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const runAutoCompose = () => {
    setIsAutoComposing(true);
    setTimeout(() => {
      setIsAutoComposing(false);
      setComposerQuestions([
        questionBank[0],
        questionBank[1],
        questionBank[2],
        questionBank[3],
        questionBank[4],
        questionBank[5],
        questionBank[6],
        questionBank[7]
      ]);
      setIsReportComposed(true);
      showToast("✓ Assessment composed — 50 marks, balanced CO coverage");
    }, 1000);
  };

  // Generate Approve and Save Action
  const approveAndSaveSingle = (key: string, typeName: string) => {
    setSavedTypes(prev => ({ ...prev, [key]: true }));
    
    // Add to repository
    const facultyShort = activeSubjectMeta.instructor.replace('Kumar', 'K').replace('Sharma', 'S').replace('Nair', 'N');
    const typeLabel = typeName === 'Topic Notes' ? 'Notes' : typeName === 'Quiz Bank' ? 'Quiz Bank' : typeName === 'Summary' ? 'Summary' : typeName === 'Student Guide' ? 'Student Guide' : 'PPT Outline';
    
    const exists = repository.some(item => 
      item.subject === subject && 
      item.unit === unit && 
      item.topic === topic && 
      item.type === typeLabel
    );

    if (!exists) {
      setRepository(prev => [
        {
          subject: subject,
          unit: unit,
          topic: topic,
          type: typeLabel,
          date: '24 May 2026',
          status: 'Approved',
          faculty: facultyShort
        },
        ...prev
      ]);
    }

    showToast(`✓ ${typeName} saved to ${subject} repository`);
  };

  const approveAllAndSave = () => {
    setSavedTypes({ notes: true, quiz: true, summary: true, guide: true, ppt: true });
    
    const facultyShort = activeSubjectMeta.instructor.replace('Kumar', 'K').replace('Sharma', 'S').replace('Nair', 'N');
    const itemsToAdd: RepositoryItem[] = [
      { subject, unit, topic, type: 'Notes', date: '24 May 2026', status: 'Approved', faculty: facultyShort },
      { subject, unit, topic, type: 'Quiz Bank', date: '24 May 2026', status: 'Approved', faculty: facultyShort },
      { subject, unit, topic, type: 'Summary', date: '24 May 2026', status: 'Approved', faculty: facultyShort },
      { subject, unit, topic, type: 'Student Guide', date: '24 May 2026', status: 'Approved', faculty: facultyShort },
      { subject, unit, topic, type: 'PPT Outline', date: '24 May 2026', status: 'Approved', faculty: facultyShort }
    ];

    setRepository(prev => {
      const filteredPrev = prev.filter(item => 
        !(item.subject === subject && item.unit === unit && item.topic === topic)
      );
      return [...itemsToAdd, ...filteredPrev];
    });

    showToast("✓ All 5 items saved to repository");
  };

  const saveAssessment = () => {
    const facultyShort = activeSubjectMeta.instructor.replace('Kumar', 'K').replace('Sharma', 'S').replace('Nair', 'N');
    const exists = repository.some(item => 
      item.subject === subject && 
      item.unit === unit && 
      item.topic === (compTitle || 'Exam Paper Outline') && 
      item.type === 'Assessment'
    );

    if (!exists) {
      setRepository(prev => [
        {
          subject: subject,
          unit: unit,
          topic: compTitle || 'Exam Paper Outline',
          type: 'Assessment',
          date: '24 May 2026',
          status: 'Approved',
          faculty: facultyShort
        },
        ...prev
      ]);
    }
    showToast(`✓ Assessment "${compTitle || 'Exam Paper Outline'}" saved to repository`);
  };

  // Local state for generated quiz tabs
  const [activeQuizTab, setActiveQuizTab] = useState<'mcq' | 'sa' | 'la'>('mcq');

  // Chart data
  const chartData = [
    { name: 'CS301 (Data Structures)', 'Hours Saved': 44, 'Economic Value (₹)': 19.8 },
    { name: 'CS401 (Algorithms)', 'Hours Saved': 22, 'Economic Value (₹)': 9.9 },
    { name: 'CS501 (OS)', 'Hours Saved': 16, 'Economic Value (₹)': 7.2 },
    { name: 'CS201 (DBMS)', 'Hours Saved': 12, 'Economic Value (₹)': 5.4 }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F8F8] text-[#1A1A1A]">
      
      {/* Sidebar - fixed 220px */}
      <aside className="w-[220px] bg-white border-r border-[#E2E2E2] flex flex-col flex-shrink-0 z-10 h-full">
        <div className="p-4 border-b border-[#F1F1F1] leading-none">
          <div className="flex items-center text-lg">
            <span className="text-[#000099] font-bold">edu</span>
            <span className="text-[#FF9A01] font-bold">merge</span>
          </div>
          <div className="text-[10px] text-[#9E9E9E] font-semibold tracking-wider uppercase mt-1">Iris Guide</div>
        </div>

        {/* Active Context Card */}
        <div className="p-3 bg-[#F0F0FF] border border-[#E6E6FF] rounded-lg m-3">
          <div className="text-[10px] font-bold text-[#000066] uppercase tracking-wide mb-1">Active Context</div>
          <div className="font-semibold text-xs text-[#000099] leading-tight mb-0.5">
            {activeSubjectMeta.name} · {subject}
          </div>
          <div className="text-[11px] text-[#5F5F5F] mb-0.5">
            {activeSubjectMeta.instructor} · {activeSubjectMeta.sem}
          </div>
          <div className="text-[10px] text-[#9E9E9E] font-medium">
            {activeSubjectMeta.dept} · 42 students
          </div>
        </div>

        {/* Dropdowns Context Selectors */}
        <div className="px-3 flex flex-col gap-2.5 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Subject</label>
            <select 
              value={subject} 
              onChange={(e) => handleContextChange(e.target.value, unit, unitTopics[unit]?.[0] || '')}
              className="h-8 border border-[#E2E2E2] rounded px-2 text-xs bg-white focus:border-[#000099] outline-none"
            >
              <option value="CS301">CS301 Data Structures</option>
              <option value="CS401">CS401 Algorithms</option>
              <option value="CS501">CS501 OS</option>
              <option value="CS201">CS201 DBMS</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Unit</label>
            <select 
              value={unit} 
              onChange={(e) => handleContextChange(subject, e.target.value, unitTopics[e.target.value]?.[0] || '')}
              className="h-8 border border-[#E2E2E2] rounded px-2 text-xs bg-white focus:border-[#000099] outline-none"
            >
              <option value="Unit 1">Unit 1 — Linear Structures</option>
              <option value="Unit 2">Unit 2 — Binary & BST Trees</option>
              <option value="Unit 3">Unit 3 — Graph Algorithms</option>
              <option value="Unit 4">Unit 4 — Greedy & Dynamic</option>
              <option value="Unit 5">Unit 5 — Sort, Search & Hash</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Topic</label>
            <select 
              value={topic} 
              onChange={(e) => handleContextChange(subject, unit, e.target.value)}
              className="h-8 border border-[#E2E2E2] rounded px-2 text-xs bg-white focus:border-[#000099] outline-none"
            >
              {(unitTopics[unit] || []).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col pt-2 border-t border-[#F1F1F1] overflow-y-auto">
          <button 
            onClick={() => setActiveScreen('generate')}
            className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-all border-l-3 ${activeScreen === 'generate' ? 'bg-[#E6E6FF] text-[#000099] font-semibold border-[#000099]' : 'text-[#5F5F5F] hover:bg-slate-50 border-transparent'}`}
          >
            <Sparkles className="w-4 h-4 text-[#000099]" />
            <span>Generate</span>
          </button>
          <button 
            onClick={() => setActiveScreen('repository')}
            className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-all border-l-3 ${activeScreen === 'repository' ? 'bg-[#E6E6FF] text-[#000099] font-semibold border-[#000099]' : 'text-[#5F5F5F] hover:bg-slate-50 border-transparent'}`}
          >
            <FolderOpen className="w-4 h-4 text-[#000099]" />
            <span>Repository</span>
          </button>
          <button 
            onClick={() => setActiveScreen('quiz-builder')}
            className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-all border-l-3 ${activeScreen === 'quiz-builder' ? 'bg-[#E6E6FF] text-[#000099] font-semibold border-[#000099]' : 'text-[#5F5F5F] hover:bg-slate-50 border-transparent'}`}
          >
            <HelpCircle className="w-4 h-4 text-[#000099]" />
            <span>Quiz Builder</span>
          </button>
          <button 
            onClick={() => setActiveScreen('analytics')}
            className={`flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-all border-l-3 ${activeScreen === 'analytics' ? 'bg-[#E6E6FF] text-[#000099] font-semibold border-[#000099]' : 'text-[#5F5F5F] hover:bg-slate-50 border-transparent'}`}
          >
            <BarChart2 className="w-4 h-4 text-[#000099]" />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#F1F1F1] text-[11px] text-[#9E9E9E] text-center font-medium">
          Garden City University · FY 2026–27
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar inside page layout */}
        <header className="h-[52px] bg-white border-b border-[#E2E2E2] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#5F5F5F]">
              {activeScreen === 'generate' && 'Iris Guide'}
              {activeScreen === 'repository' && 'Curriculum Repository'}
              {activeScreen === 'quiz-builder' && 'Quiz & Assessment Builder'}
              {activeScreen === 'analytics' && 'Coverage & Impact Analytics'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E1F5EE] text-[#0F6E56] rounded-full text-[10px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] animate-pulse"></span>
              AI Connected
            </div>
            <div className="w-8 h-8 rounded-full bg-[#000099] text-white flex items-center justify-center text-xs font-semibold">
              AK
            </div>
          </div>
        </header>

        {/* Scrollable View Panel */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* 1. GENERATE SCREEN */}
          {activeScreen === 'generate' && (
            <div className="flex flex-col gap-6">
              
              {/* Context Bar */}
              <div className="bg-[#F0F0FF] border-l-4 border-[#000099] p-4 rounded-r-lg flex flex-col gap-2">
                <h2 className="font-bold text-base text-[#000099]">
                  Generating for: {topic} · {unit} · {subject} {activeSubjectMeta.name}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5F5F5F] font-medium">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#000099]" /> Faculty: {activeSubjectMeta.instructor}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#000099]" /> Section: CSE-3A · 42 students</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#000099]" /> AICTE contact hours: {activeSubjectMeta.hours}</span>
                  <span className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-[#000099]" /> CO mapped: {activeSubjectMeta.co}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#000099]" /> Internal Assessment: 18 days away</span>
                  <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-[#000099]" /> Bloom's level: Understand / Apply</span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Notes */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 flex flex-col justify-between h-[180px] shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F0F0FF] text-[#000099] rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">Topic Notes</h4>
                      <p className="text-[11px] text-[#5F5F5F] line-height-relaxed mt-1">Detailed notes with examples, definitions, and CO outcome mapping.</p>
                    </div>
                  </div>
                  <button onClick={() => startGeneration('notes')} className="w-full h-9 bg-[#000099] text-white hover:bg-[#000066] rounded-lg font-semibold text-xs transition-colors">
                    Generate Notes
                  </button>
                </div>

                {/* Quiz */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 flex flex-col justify-between h-[180px] shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F0F0FF] text-[#000099] rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">Quiz Bank</h4>
                      <p className="text-[11px] text-[#5F5F5F] line-height-relaxed mt-1">MCQs, short answer, and long answer questions tagged by Bloom's taxonomy.</p>
                    </div>
                  </div>
                  <button onClick={() => startGeneration('quiz')} className="w-full h-9 bg-[#000099] text-white hover:bg-[#000066] rounded-lg font-semibold text-xs transition-colors">
                    Generate Quiz
                  </button>
                </div>

                {/* Summary */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 flex flex-col justify-between h-[180px] shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F0F0FF] text-[#000099] rounded-lg flex items-center justify-center flex-shrink-0">
                      <List className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">Summary</h4>
                      <p className="text-[11px] text-[#5F5F5F] line-height-relaxed mt-1">One-page review and exam revision sheet containing takeaways.</p>
                    </div>
                  </div>
                  <button onClick={() => startGeneration('summary')} className="w-full h-9 bg-[#000099] text-white hover:bg-[#000066] rounded-lg font-semibold text-xs transition-colors">
                    Generate Summary
                  </button>
                </div>

                {/* Student Guide */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 flex flex-col justify-between h-[180px] shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F0F0FF] text-[#000099] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">Student Guide</h4>
                      <p className="text-[11px] text-[#5F5F5F] line-height-relaxed mt-1">Self-study guidance outlining pre-requisites and practice plans.</p>
                    </div>
                  </div>
                  <button onClick={() => startGeneration('guide')} className="w-full h-9 bg-[#000099] text-white hover:bg-[#000066] rounded-lg font-semibold text-xs transition-colors">
                    Generate Guide
                  </button>
                </div>

                {/* PPT Outline */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 flex flex-col justify-between h-[180px] shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#F0F0FF] text-[#000099] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Presentation className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1A1A1A] text-sm">PPT Outline</h4>
                      <p className="text-[11px] text-[#5F5F5F] line-height-relaxed mt-1">Slide-by-slide structure with cues and duration distributions.</p>
                    </div>
                  </div>
                  <button onClick={() => startGeneration('ppt')} className="w-full h-9 bg-[#000099] text-white hover:bg-[#000066] rounded-lg font-semibold text-xs transition-colors">
                    Generate PPT
                  </button>
                </div>

              </div>

              {/* Generate All Button */}
              <button 
                onClick={() => startGeneration('all')} 
                className="w-full py-3 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>⚡ Generate All Content for This Topic</span>
              </button>

              {/* Output Panel Container */}
              <div className="flex flex-col gap-5 min-h-[200px]">
                
                {/* 1. Loader simulation */}
                {isGenerating && (
                  <div className="bg-white border border-[#E2E2E2] rounded-xl p-6 flex flex-col gap-3 shadow-sm">
                    <div className="font-semibold text-[#1A1A1A] text-sm flex items-center gap-3 mb-2">
                      <span className="w-4 h-4 border-2 border-slate-200 border-t-[#000099] rounded-full animate-spin inline-block"></span>
                      <span>Iris Guide is compiling resources...</span>
                    </div>
                    <div className="flex flex-col gap-2 font-mono text-xs">
                      <div className={loaderStep >= 1 ? "text-[#0F6E56]" : "text-[#000099] font-medium"}>
                        {loaderStep >= 1 ? '✓' : '⟳'} Loaded syllabus structure for {subject} {unit}
                      </div>
                      <div className={loaderStep >= 2 ? "text-[#0F6E56]" : loaderStep === 1 ? "text-[#000099]" : "text-[#9E9E9E]"}>
                        {loaderStep >= 2 ? '✓' : '⟳'} Verified active Course Outcomes mapping
                      </div>
                      <div className={loaderStep >= 3 ? "text-[#0F6E56]" : loaderStep === 2 ? "text-[#000099]" : "text-[#9E9E9E]"}>
                        {loaderStep >= 3 ? '✓' : '⟳'} Calibrated contact hour depths
                      </div>
                      <div className={loaderStep >= 4 ? "text-[#0F6E56]" : loaderStep === 3 ? "text-[#000099]" : "text-[#9E9E9E]"}>
                        {loaderStep >= 4 ? '✓' : '⟳'} Scanned internal assessment timeline (18 days out)
                      </div>
                      <div className={loaderStep >= 5 ? "text-[#0F6E56]" : loaderStep === 4 ? "text-[#000099]" : "text-[#9E9E9E]"}>
                        {loaderStep >= 5 ? '✓' : '⟳'} Generated syllabus materials at Understand/Apply Bloom's level
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State before generation */}
                {!isGenerating && Object.values(generatedTypes).every(val => !val) && (
                  <div className="flex flex-col items-center justify-center py-16 px-5 border-2 border-dashed border-[#E2E2E2] bg-white rounded-xl text-[#9E9E9E] text-center">
                    <Sparkles className="w-10 h-10 text-[#E2E2E2] mb-4" />
                    <h3 className="font-semibold text-[#1A1A1A] text-sm">No Content Generated Yet</h3>
                    <p className="text-xs text-[#5F5F5F] max-w-[400px] mt-1">Select a content type above or click "Generate All" to begin compiling AI-driven syllabus materials.</p>
                  </div>
                )}

                {/* Bulk Approve All Header */}
                {!isGenerating && genType === 'all' && Object.values(generatedTypes).every(val => val) && (
                  <>
                    {Object.values(savedTypes).every(val => val) ? (
                      <div className="bg-[#E1F5EE] border border-[#0F6E56] rounded-xl p-4 text-[#0B5240] font-medium flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0F6E56]" />
                        <div>
                          <strong>✓ All 5 content items saved to {subject} / {unit} / {topic} repository.</strong><br/>
                          <span className="text-[11px] font-normal text-[#5F5F5F]">Available to: {activeSubjectMeta.instructor} (author) · HOD (review) · Students (after release)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-[#FF9A01] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                        <div className="text-sm font-medium">
                          ⚡ Generated <strong>all 5 content types</strong> for <strong>{topic}</strong>. Review and save them in bulk.
                        </div>
                        <button onClick={approveAllAndSave} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-bold text-xs transition-colors">
                          Approve All & Save to Repository
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Stack Output Blocks */}
                {!isGenerating && (
                  <div className="flex flex-col gap-6">
                    
                    {/* NOTES BLOCK */}
                    {generatedTypes.notes && (
                      <div className="bg-white border border-[#E2E2E2] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#F8F8F8] border-b border-[#F1F1F1] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${savedTypes.notes ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                              {savedTypes.notes ? 'Saved to Repository ✓' : 'AI Generated'}
                            </span>
                            <span className="font-semibold text-[#1A1A1A] text-xs">Topic Notes — {topic}</span>
                          </div>
                          <span className="text-[11px] text-[#9E9E9E] font-mono">Generated: 24 May 2026</span>
                        </div>
                        
                        <div className="p-5 text-[13px] leading-relaxed text-[#1A1A1A]">
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4 first:mt-0">TOPIC NOTES — {topic}</h3>
                          <p className="mb-3"><strong>Subject:</strong> {subject} · <strong>Unit:</strong> {unit}</p>
                          <p className="mb-3"><strong>Mapped Outcomes:</strong> {activeSubjectMeta.co} | <strong>Depth:</strong> Understand + Apply (Bloom's L2/L3)</p>
                          
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">1. CONCEPT OVERVIEW</h3>
                          <p className="mb-3">
                            {topic === 'BFS Algorithm' 
                              ? "Breadth-First Search (BFS) explores all vertices at the current depth level before moving to the next level. It uses a Queue (FIFO). Think of BFS like ripples in water — wide before deep." 
                              : `${topic} traversal process explores nodes systematically to visit every vertex in a graph structure. It operates according to syllabus standards and depth limits.`}
                          </p>
                          
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">2. KEY DEFINITIONS</h3>
                          <div className="bg-[#F0F0FF] border border-[#E6E6FF] rounded-lg p-3.5 my-3">
                            <p className="mb-2"><strong>Graph:</strong> Non-linear data structure consisting of vertices (nodes) and edges connecting them.</p>
                            <p className="mb-2"><strong>Traversal:</strong> The process of visiting every vertex in a graph exactly once.</p>
                            <p className="mb-2"><strong>{topic}:</strong> {topic === 'BFS Algorithm' ? 'Level-order traversal sequence utilizing a FIFO Queue to track frontier nodes.' : 'Systematic algorithm used to explore vertices in a graph structure.'}</p>
                            <p className="mb-0"><strong>Visited Array:</strong> A boolean tracker array to prevent visiting vertices multiple times, avoiding infinite loops.</p>
                          </div>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">3. ALGORITHM STEPS</h3>
                          <p className="mb-1"><strong>Step 1:</strong> Start at source vertex S. Mark S as visited and Enqueue S.</p>
                          <p className="mb-1"><strong>Step 2:</strong> While the queue is not empty:</p>
                          <p className="pl-4 mb-1">a. Dequeue a vertex V from the queue. Process V.</p>
                          <p className="pl-4 mb-1">b. For each unvisited neighbour W of V: mark W as visited, and Enqueue W.</p>
                          <p className="mb-3"><strong>Step 3:</strong> Repeat until the queue is empty.</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">4. WORKED EXAMPLE</h3>
                          <p className="mb-2">Graph: 5 vertices (0,1,2,3,4). Edges: 0-1, 0-2, 1-3, 2-4. Start vertex: 0.</p>
                          <p className="mb-2"><strong>Queue tracing steps:</strong></p>
                          <div className="font-mono bg-[#F8F8F8] border border-[#E2E2E2] p-2.5 rounded-lg mb-3">
                            Queue: [0] → process 0, enqueue 1, 2 → [1, 2]<br/>
                            Queue: [1, 2] → process 1, enqueue 3 → [2, 3]<br/>
                            Queue: [2, 3] → process 2, enqueue 4 → [3, 4]<br/>
                            Queue: [3, 4] → process 3 → [4]<br/>
                            Queue: [4] → process 4 → []
                          </div>
                          <p className="mb-3"><strong>Resulting Order:</strong> 0 → 1 → 2 → 3 → 4</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">5. TIME AND SPACE COMPLEXITY</h3>
                          <p className="mb-3"><strong>Time:</strong> O(V + E) where V is vertices, E is edges. <strong>Space:</strong> O(V) for queue storage.</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">6. COMMON MISCONCEPTIONS</h3>
                          <div className="bg-[#FFF4E0] border border-[#854F0B] text-[#663C07] text-xs rounded-lg p-3.5 my-3">
                            <strong className="text-[#854F0B] text-sm block mb-1">⚠ BFS finds shortest path only in UNWEIGHTED graphs.</strong>
                            For weighted graphs, use Dijkstra's algorithm.
                          </div>
                          <div className="bg-[#FFF4E0] border border-[#854F0B] text-[#663C07] text-xs rounded-lg p-3.5 my-3">
                            <strong className="text-[#854F0B] text-sm block mb-1">⚠ BFS and DFS do NOT produce the same traversal order.</strong>
                            BFS = level by level. DFS = one branch fully before backtracking.
                          </div>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">7. REAL WORLD APPLICATIONS</h3>
                          <p className="mb-3">• Social networks — connections within N degrees<br/>• GPS systems — finding nearest locations<br/>• Web crawlers — page discovery level by level</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">8. CONNECTS TO</h3>
                          <p className="mb-3">← Previous: Graph Representation (Adjacency Matrix/List)<br/>→ Next: DFS Algorithm</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">9. LIKELY EXAM QUESTIONS</h3>
                          <p className="mb-1">1. Trace BFS for a given graph (8 marks — most common)</p>
                          <p className="mb-1">2. Compare BFS and DFS with examples (5 marks)</p>
                          <p className="mb-3">3. Write BFS in pseudocode or C/Java (10 marks)</p>
                        </div>

                        <div className="border-t border-[#F1F1F1] px-5 py-3 bg-[#F8F8F8] flex justify-end gap-2.5 flex-wrap">
                          {savedTypes.notes ? (
                            <>
                              <button onClick={() => startGeneration('notes')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => setActiveScreen('repository')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">View in Repository</button>
                              <button onClick={() => showToast('✓ PDF download started for Topic Notes')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => showToast('✓ Editing mode enabled for Topic Notes')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors">Edit</button>
                              <button onClick={() => approveAndSaveSingle('notes', 'Topic Notes')} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-semibold text-xs transition-colors">Approve & Save</button>
                              <button onClick={() => startGeneration('notes')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => showToast('✓ PDF download started for Topic Notes')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* QUIZ BANK BLOCK */}
                    {generatedTypes.quiz && (
                      <div className="bg-white border border-[#E2E2E2] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#F8F8F8] border-b border-[#F1F1F1] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${savedTypes.quiz ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                              {savedTypes.quiz ? 'Saved to Repository ✓' : 'AI Generated'}
                            </span>
                            <span className="font-semibold text-[#1A1A1A] text-xs">Quiz Bank — {topic}</span>
                          </div>
                          <span className="text-[11px] text-[#9E9E9E] font-mono">Generated: 24 May 2026</span>
                        </div>

                        <div className="p-5 text-[13px] leading-relaxed text-[#1A1A1A]">
                          <div className="flex justify-between items-center text-xs font-semibold text-[#000099] border-b border-[#E2E2E2] pb-2 mb-3">
                            <span>10 MCQs · 5 Short Answer · 3 Long Answer · CO3: 6 questions · CO4: 4 questions</span>
                            <span className="text-[#854F0B] flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Q3 was used in Section B — Nov 2024. Safe for Section A.</span>
                          </div>

                          <div className="flex border-b border-[#E2E2E2] gap-1 mb-4">
                            <button onClick={() => setActiveQuizTab('mcq')} className={`px-4 py-2 font-semibold text-xs border-b-2 ${activeQuizTab === 'mcq' ? 'text-[#000099] border-[#000099]' : 'text-[#5F5F5F] border-transparent hover:text-[#000099]'}`}>MCQ</button>
                            <button onClick={() => setActiveQuizTab('sa')} className={`px-4 py-2 font-semibold text-xs border-b-2 ${activeQuizTab === 'sa' ? 'text-[#000099] border-[#000099]' : 'text-[#5F5F5F] border-transparent hover:text-[#000099]'}`}>Short Answer</button>
                            <button onClick={() => setActiveQuizTab('la')} className={`px-4 py-2 font-semibold text-xs border-b-2 ${activeQuizTab === 'la' ? 'text-[#000099] border-[#000099]' : 'text-[#5F5F5F] border-transparent hover:text-[#000099]'}`}>Long Answer</button>
                          </div>

                          {/* MCQ Tab content */}
                          {activeQuizTab === 'mcq' && (
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <div className="font-semibold">Q1 [Easy · CO3 · Bloom's: Remember] Which data structure does BFS use internally?</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> Stack</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#0F6E56] bg-[#E1F5EE] text-[#0B5240] font-semibold rounded"><span className="w-3 h-3 rounded-full bg-[#0F6E56]"></span> Queue</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> Priority Queue</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> Linked List</div>
                                </div>
                                <div className="text-[11px] text-[#5F5F5F] bg-[#F8F8F8] border-l-2 border-[#000099] p-2 mt-1"><strong>Explanation:</strong> BFS uses Queue (FIFO) to process vertices level by level.</div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="font-semibold">Q2 [Medium · CO3 · Bloom's: Understand] Time complexity of BFS with V vertices and E edges?</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> O(V²)</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> O(E log V)</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#0F6E56] bg-[#E1F5EE] text-[#0B5240] font-semibold rounded"><span className="w-3 h-3 rounded-full bg-[#0F6E56]"></span> O(V+E)</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> O(V×E)</div>
                                </div>
                                <div className="text-[11px] text-[#5F5F5F] bg-[#F8F8F8] border-l-2 border-[#000099] p-2 mt-1"><strong>Explanation:</strong> BFS visits each vertex once O(V) and each edge once O(E).</div>
                              </div>

                              <div className="flex flex-col gap-2">
                                <div className="font-semibold">Q3 [Medium · CO4 · Bloom's: Apply] BFS is preferred for shortest path in unweighted graphs because:</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> It uses less memory</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#0F6E56] bg-[#E1F5EE] text-[#0B5240] font-semibold rounded"><span className="w-3 h-3 rounded-full bg-[#0F6E56]"></span> It explores level by level, guaranteeing minimum hops</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> It is always faster than DFS</div>
                                  <div className="flex items-center gap-2 p-2 border border-[#E2E2E2] rounded"><span className="w-3 h-3 rounded-full border border-slate-400"></span> It handles negative weights correctly</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Short Answer Tab */}
                          {activeQuizTab === 'sa' && (
                            <div className="flex flex-col gap-4">
                              <div>
                                <div className="font-semibold">Q1 [5 marks · CO3] Explain BFS with a suitable example. Trace execution step by step.</div>
                                <div className="text-xs bg-[#F0F0FF] border border-[#E6E6FF] p-3 rounded-lg mt-2">
                                  <strong>Model Answer:</strong> BFS starts at source, marks visited, enqueues. Repeatedly dequeues, processes, enqueues unvisited neighbours. Award 2 marks for algorithm + 3 marks for correct trace with queue states.
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold">Q2 [5 marks · CO4] Compare BFS and DFS. When would you prefer BFS?</div>
                                <div className="text-xs bg-[#F0F0FF] border border-[#E6E6FF] p-3 rounded-lg mt-2">
                                  <strong>Model Answer:</strong> 4 key comparison points + 2 BFS use cases. 1 mark per valid comparison (max 3) + 2 marks for use cases.
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Long Answer Tab */}
                          {activeQuizTab === 'la' && (
                            <div>
                              <div className="font-semibold">Q1 [10 marks · CO3, CO4] Implement BFS for an undirected graph as adjacency list. Trace for given graph. Draw BFS tree.</div>
                              <div className="text-xs bg-[#F0F0FF] border border-[#E6E6FF] p-3 rounded-lg mt-2">
                                <strong>Model Answer:</strong> Marking breakdown: Algorithm 4 marks · Adjacency list 2 marks · Trace 3 marks · Tree 1 mark.
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t border-[#F1F1F1] px-5 py-3 bg-[#F8F8F8] flex justify-end gap-2.5 flex-wrap">
                          {savedTypes.quiz ? (
                            <>
                              <button onClick={() => startGeneration('quiz')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => setActiveScreen('repository')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">View in Repository</button>
                              <button onClick={() => showToast('✓ PDF download started for Quiz Bank')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => showToast('✓ Editing mode enabled for Quiz Bank')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors">Edit</button>
                              <button onClick={() => approveAndSaveSingle('quiz', 'Quiz Bank')} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-semibold text-xs transition-colors">Approve & Save</button>
                              <button onClick={() => startGeneration('quiz')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => showToast('✓ PDF download started for Quiz Bank')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SUMMARY BLOCK */}
                    {generatedTypes.summary && (
                      <div className="bg-white border border-[#E2E2E2] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#F8F8F8] border-b border-[#F1F1F1] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${savedTypes.summary ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                              {savedTypes.summary ? 'Saved to Repository ✓' : 'AI Generated'}
                            </span>
                            <span className="font-semibold text-[#1A1A1A] text-xs">Summary — {topic}</span>
                          </div>
                          <span className="text-[11px] text-[#9E9E9E] font-mono">Generated: 24 May 2026</span>
                        </div>

                        <div className="p-5 text-[13px] leading-relaxed text-[#1A1A1A]">
                          <div className="border-2 border-[#000099] rounded-xl overflow-hidden max-w-[500px] mx-auto bg-white">
                            <div className="bg-[#000099] text-white px-5 py-3 flex justify-between items-center">
                              <span className="font-bold">TOPIC SUMMARY</span>
                              <span className="font-mono text-[11px]">CS301 · Unit 3 · Revision Card</span>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                              <div>
                                <div className="text-[10px] font-bold text-[#000066] uppercase tracking-wider border-b border-[#E2E2E2] pb-1 mb-1.5">WHAT IS IT?</div>
                                <p className="text-xs text-[#5F5F5F]">BFS explores a graph level by level using a Queue. It visits all neighbours at depth N before depth N+1.</p>
                              </div>

                              <div>
                                <div className="text-[10px] font-bold text-[#000066] uppercase tracking-wider border-b border-[#E2E2E2] pb-1 mb-1.5">5 KEY POINTS</div>
                                <ul className="list-disc pl-4 text-xs text-[#5F5F5F] flex flex-col gap-1.5">
                                  <li>Uses Queue (FIFO) — NOT Stack</li>
                                  <li>Time O(V+E) · Space O(V)</li>
                                  <li>Shortest path in UNWEIGHTED graphs only</li>
                                  <li>Mark visited BEFORE enqueuing — not after</li>
                                  <li>BFS = level order · DFS = depth order</li>
                                </ul>
                              </div>

                              <div>
                                <div className="text-[10px] font-bold text-[#000066] uppercase tracking-wider border-b border-[#E2E2E2] pb-1 mb-1.5">ALGORITHM IN ONE LINE</div>
                                <div className="font-mono bg-[#F8F8F8] border border-[#E2E2E2] p-2.5 rounded text-[11px]">
                                  Enqueue start → while queue not empty: dequeue, process, enqueue unvisited neighbours → repeat
                                </div>
                              </div>

                              <div>
                                <div className="text-[10px] font-bold text-[#000066] uppercase tracking-wider border-b border-[#E2E2E2] pb-1 mb-1.5">LIKELY IN YOUR EXAM</div>
                                <ul className="text-xs text-[#5F5F5F] flex flex-col gap-1">
                                  <li>★ Trace BFS on a given graph (appears every year)</li>
                                  <li>★ Compare BFS vs DFS</li>
                                  <li>★ Write BFS code</li>
                                </ul>
                              </div>

                              <div className="bg-[#FFF4E0] text-[#CC7A00] p-2 rounded text-center font-bold text-[11px]">
                                REMEMBER THIS: BFS = Breadth = Wide before Deep = Queue
                              </div>

                              <div className="flex justify-center gap-2.5 text-[10px] text-[#5F5F5F] mt-2.5">
                                <span>CO3 ✓</span> · <span>CO4 ✓</span> · <span>AICTE: Understand/Apply</span> · <span>6 contact hrs</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#FFF4E0] border border-[#854F0B] text-[#663C07] text-xs rounded-lg p-3.5 mt-5 flex justify-between items-center">
                            <span><strong>⚠ 8 hours below AICTE requirement of 150 contact hours.</strong> Suggested fix: Add 2 tutorial sessions in weeks 7 and 12 (+8 hrs).</span>
                            <div className="flex gap-2 flex-shrink-0">
                              <span className="text-[#000099] font-bold cursor-pointer hover:underline" onClick={() => showToast('✓ Added tutorial contact hours')}>[Apply Fix]</span>
                              <span className="text-[#5F5F5F] font-bold cursor-pointer hover:underline" onClick={() => showToast('✓ Adjusting manual hour logs')}>[Adjust Manually]</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-[#F1F1F1] px-5 py-3 bg-[#F8F8F8] flex justify-end gap-2.5 flex-wrap">
                          {savedTypes.summary ? (
                            <>
                              <button onClick={() => startGeneration('summary')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => setActiveScreen('repository')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">View in Repository</button>
                              <button onClick={() => showToast('✓ PDF download started for Summary')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => showToast('✓ Editing mode enabled for Summary')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors">Edit</button>
                              <button onClick={() => approveAndSaveSingle('summary', 'Summary')} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-semibold text-xs transition-colors">Approve & Save</button>
                              <button onClick={() => startGeneration('summary')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => showToast('✓ PDF download started for Summary')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STUDENT GUIDE BLOCK */}
                    {generatedTypes.guide && (
                      <div className="bg-white border border-[#E2E2E2] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#F8F8F8] border-b border-[#F1F1F1] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${savedTypes.guide ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                              {savedTypes.guide ? 'Saved to Repository ✓' : 'AI Generated'}
                            </span>
                            <span className="font-semibold text-[#1A1A1A] text-xs">Student Guide — {topic}</span>
                          </div>
                          <span className="text-[11px] text-[#9E9E9E] font-mono">Generated: 24 May 2026</span>
                        </div>

                        <div className="p-5 text-[13px] leading-relaxed text-[#1A1A1A]">
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4 first:mt-0">STUDENT TOPIC GUIDE — {topic}</h3>
                          <p className="font-mono text-[11px] text-[#5F5F5F]">CS301 Data Structures · Unit 3 · Graph Algorithms</p>
                          
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">WHAT IS THIS TOPIC ABOUT?</h3>
                          <p className="mb-3">{topic} is a method to visit every vertex in a graph systematically, going wide before deep. Foundation of network, AI, and navigation algorithms.</p>
                          
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">BEFORE YOU START — PREREQUISITES</h3>
                          <div className="flex flex-col gap-1.5 mb-3 text-xs">
                            <div>✓ What a graph is (vertices and edges)</div>
                            <div>✓ How a Queue works (FIFO)</div>
                            <div>✓ Arrays and boolean flags</div>
                            <div className="text-[11px] text-[#9E9E9E]">If unsure about any of these — review Unit 1 (Queues) first.</div>
                          </div>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">WHAT YOU WILL BE ABLE TO DO AFTER THIS TOPIC</h3>
                          <p className="mb-1">→ <strong>CO3:</strong> Implement BFS for any given graph</p>
                          <p className="mb-1">→ <strong>CO4:</strong> Identify real problems where BFS is the right algorithm</p>
                          <p className="mb-1">→ Trace BFS manually and show queue states at each step</p>
                          <p className="mb-3">→ Write BFS code from memory</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">WHERE TO START</h3>
                          <p className="mb-3">1. Read Topic Notes — focus on sections 2 and 3 first<br/>2. Trace the worked example on paper before reading the answer<br/>3. Attempt Q1 from Quiz Bank (Easy MCQ) before moving on<br/>4. If queue states confuse you — re-read Algorithm Step 2 slowly</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">WHAT TO FOCUS ON FOR INTERNAL ASSESSMENT (18 days away)</h3>
                          <p className="mb-3">★ <strong>HIGH:</strong> Trace BFS on a given graph — appears every year<br/>★ <strong>HIGH:</strong> Time and space complexity with justification<br/>★ <strong>MEDIUM:</strong> BFS vs DFS comparison<br/>★ <strong>LOW:</strong> Implementation code</p>

                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-2 mt-4">SELF-CHECK — answer these before your exam:</h3>
                          <p className="mb-1">1. Can you trace BFS for a 6-vertex graph in under 5 minutes?</p>
                          <p className="mb-1">2. Can you explain why BFS finds shortest path in unweighted graphs?</p>
                          <p className="mb-1">3. Can you name 3 real-world applications of BFS?</p>
                          <p className="font-semibold text-[#0F6E56]">All yes → you are ready for this topic.</p>
                        </div>

                        <div className="border-t border-[#F1F1F1] px-5 py-3 bg-[#F8F8F8] flex justify-end gap-2.5 flex-wrap">
                          {savedTypes.guide ? (
                            <>
                              <button onClick={() => startGeneration('guide')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => setActiveScreen('repository')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">View in Repository</button>
                              <button onClick={() => showToast('✓ PDF download started for Student Guide')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => showToast('✓ Editing mode enabled for Student Guide')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors">Edit</button>
                              <button onClick={() => approveAndSaveSingle('guide', 'Student Guide')} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-semibold text-xs transition-colors">Approve & Save</button>
                              <button onClick={() => startGeneration('guide')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => showToast('✓ PDF download started for Student Guide')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PPT OUTLINE BLOCK */}
                    {generatedTypes.ppt && (
                      <div className="bg-white border border-[#E2E2E2] rounded-xl overflow-hidden shadow-sm flex flex-col">
                        <div className="bg-[#F8F8F8] border-b border-[#F1F1F1] px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${savedTypes.ppt ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                              {savedTypes.ppt ? 'Saved to Repository ✓' : 'AI Generated'}
                            </span>
                            <span className="font-semibold text-[#1A1A1A] text-xs">PPT Outline — {topic}</span>
                          </div>
                          <span className="text-[11px] text-[#9E9E9E] font-mono">Generated: 24 May 2026</span>
                        </div>

                        <div className="p-5 text-[13px] leading-relaxed text-[#1A1A1A]">
                          <h3 className="text-sm font-bold text-[#000099] border-b border-[#F1F1F1] pb-1 mb-3 mt-4 first:mt-0">PRESENTATION OUTLINE — {topic}</h3>
                          <p className="font-mono text-[11px] text-[#5F5F5F] mb-4">CS301 · Week 9 Tuesday · Dr. Anand Kumar · CSE-3A · 42 students</p>
                          
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">1</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Recap <span className="text-[#CC7A00] font-mono text-[10px]">2 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">Previous session: Graph Representation. Adjacency List vs Matrix. 2-bullet recap of last session.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">2</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Today's Agenda <span className="text-[#CC7A00] font-mono text-[10px]">1 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">Learning objectives: Understand how BFS traverses a graph, Trace traversal order, Identify applications. CO3 and CO4 shown.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">3</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">The Problem <span className="text-[#CC7A00] font-mono text-[10px]">3 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">"How do we visit every vertex without missing or repeating any?" Show unsolved graph visual. Poll class.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">4</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">BFS Intuition <span className="text-[#CC7A00] font-mono text-[10px]">3 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">Ripple in water analogy. BFS = Breadth first = Wide before Deep.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">5</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">The Algorithm <span className="text-[#CC7A00] font-mono text-[10px]">5 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">Step-by-step with queue visualization. Build the algorithm one click at a time.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">6</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Live Trace <span className="text-[#CC7A00] font-mono text-[10px]">8 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">5-vertex graph worked example. Graph and queue side by side. 5 steps, one click per step.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">7</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Complexity <span className="text-[#CC7A00] font-mono text-[10px]">3 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">Time O(V+E) — why? Space O(V) — why?</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">8</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Common Mistakes <span className="text-[#CC7A00] font-mono text-[10px]">3 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">⚠ Marking visited after dequeue not before enqueue. Confusing BFS with DFS. Weighted shortest paths.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">9</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Real World <span className="text-[#CC7A00] font-mono text-[10px]">3 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">4 applications (social network degrees, GPS locations, crawlers, broadcasting) with visuals.</p>
                              </div>
                            </div>

                            <div className="flex gap-4 p-3.5 bg-[#F8F8F8] border border-[#E2E2E2] rounded-lg items-start">
                              <span className="w-6 h-6 bg-[#000099] text-white text-xs font-semibold rounded-full flex items-center justify-center flex-shrink-0">10</span>
                              <div className="flex-1">
                                <div className="font-semibold text-xs flex justify-between">Summary & Next <span className="text-[#CC7A00] font-mono text-[10px]">2 min</span></div>
                                <p className="text-xs text-[#5F5F5F] mt-1">5-line recap. Next session: DFS Algorithm. Homework trace exercise 8.3.</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs font-bold text-[#000099] mt-4">
                            Total: 10 slides · 33 minutes · 12 min remaining for Q&A and quiz
                          </div>
                        </div>

                        <div className="border-t border-[#F1F1F1] px-5 py-3 bg-[#F8F8F8] flex justify-end gap-2.5 flex-wrap">
                          {savedTypes.ppt ? (
                            <>
                              <button onClick={() => startGeneration('ppt')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => setActiveScreen('repository')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">View in Repository</button>
                              <button onClick={() => showToast('✓ PDF download started for PPT Outline')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => showToast('✓ Editing mode enabled for PPT Outline')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs transition-colors">Edit</button>
                              <button onClick={() => approveAndSaveSingle('ppt', 'PPT Outline')} className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-semibold text-xs transition-colors">Approve & Save</button>
                              <button onClick={() => startGeneration('ppt')} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#F0F0FF] rounded-lg font-semibold text-xs transition-colors">Regenerate</button>
                              <button onClick={() => showToast('✓ PDF download started for PPT Outline')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors"><Download className="w-3.5 h-3.5" /> Download PDF</button>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          )}

          {/* 2. REPOSITORY SCREEN */}
          {activeScreen === 'repository' && (
            <div className="flex flex-col gap-6">
              
              {/* Filter Panel */}
              <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex flex-col gap-1 min-w-[150px] flex-1">
                  <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Subject</label>
                  <select 
                    value={repoSubject} 
                    onChange={(e) => setRepoSubject(e.target.value)}
                    className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white focus:border-[#000099] outline-none"
                  >
                    <option value="all">All Subjects</option>
                    <option value="CS301">CS301 Data Structures</option>
                    <option value="CS401">CS401 Algorithms</option>
                    <option value="CS501">CS501 OS</option>
                    <option value="CS201">CS201 DBMS</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[150px] flex-1">
                  <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Unit</label>
                  <select 
                    value={repoUnit} 
                    onChange={(e) => setRepoUnit(e.target.value)}
                    className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white focus:border-[#000099] outline-none"
                  >
                    <option value="all">All Units</option>
                    <option value="Unit 1">Unit 1</option>
                    <option value="Unit 2">Unit 2</option>
                    <option value="Unit 3">Unit 3</option>
                    <option value="Unit 4">Unit 4</option>
                    <option value="Unit 5">Unit 5</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[150px] flex-1">
                  <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Content Type</label>
                  <select 
                    value={repoType} 
                    onChange={(e) => setRepoType(e.target.value)}
                    className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white focus:border-[#000099] outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Notes">Notes</option>
                    <option value="Quiz Bank">Quiz Bank</option>
                    <option value="Summary">Summary</option>
                    <option value="Student Guide">Student Guide</option>
                    <option value="PPT Outline">PPT Outline</option>
                    <option value="Assessment">Assessment</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1 min-w-[200px] flex-[2]">
                  <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Search Repository</label>
                  <input 
                    type="text" 
                    value={repoSearch} 
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="Type to filter..." 
                    className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white focus:border-[#000099] outline-none w-full"
                  />
                </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#000099] font-mono">{repoStats.total}</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Total Items</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#0F6E56] font-mono">{repoStats.approved}</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Approved & Released</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#FF9A01] font-mono">{repoStats.pending}</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Pending HOD Review</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#000099] font-mono">4</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Active Subjects</span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto bg-white border border-[#E2E2E2] rounded-xl shadow-sm">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[#F8F8F8] border-b border-[#E2E2E2]">
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Subject</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Unit</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Topic</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Type</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Date</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Status</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Faculty</th>
                      <th className="p-3 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRepository.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-slate-50/50">
                        <td className="p-3.5 font-bold font-mono text-[#000099]">{item.subject}</td>
                        <td className="p-3.5 text-[#5F5F5F]">{item.unit}</td>
                        <td className="p-3.5 font-semibold text-[#1A1A1A]">{item.topic}</td>
                        <td className="p-3.5 text-[#5F5F5F]">{item.type}</td>
                        <td className="p-3.5 font-mono text-[#5F5F5F]">{item.date}</td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Approved' ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-[#FFF4E0] text-[#FF9A01]'}`}>
                            {item.status === 'Approved' ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#5F5F5F]">{item.faculty}</td>
                        <td className="p-3.5">
                          {item.status === 'Approved' ? (
                            <span 
                              onClick={() => showToast(`✓ Starting download for ${item.topic} ${item.type}`)} 
                              className="text-[#000099] font-bold hover:underline cursor-pointer"
                            >
                              View/Download
                            </span>
                          ) : (
                            <span 
                              onClick={() => setReviewModalItem(item)} 
                              className="text-[#FF9A01] font-bold hover:underline cursor-pointer"
                            >
                              Review
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 3. QUIZ BUILDER SCREEN */}
          {activeScreen === 'quiz-builder' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Explorer panel (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="flex justify-between items-center font-bold text-sm text-[#1A1A1A]">
                  <span>Question Bank</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E6E6FF] text-[#000099]" id="qbank-count">
                    {filteredQBank.length} Available
                  </span>
                </div>

                {/* Left Mini Filters */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-3 flex gap-2 shadow-sm">
                  <select 
                    value={qbDifficulty} 
                    onChange={(e) => setQbDifficulty(e.target.value)}
                    className="h-8 border border-[#E2E2E2] rounded px-2 text-[11px] bg-white outline-none flex-1"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <select 
                    value={qbCo} 
                    onChange={(e) => setQbCo(e.target.value)}
                    className="h-8 border border-[#E2E2E2] rounded px-2 text-[11px] bg-white outline-none flex-1"
                  >
                    <option value="all">All COs</option>
                    <option value="CO3">CO3</option>
                    <option value="CO4">CO4</option>
                  </select>
                </div>

                {/* Left Questions List */}
                <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {filteredQBank.map((q) => {
                    const isAdded = composerQuestions.some(item => item.id === q.id);
                    return (
                      <div key={q.id} className="p-3 bg-white border border-[#E2E2E2] hover:border-[#E6E6FF] hover:bg-[#F8F8F8] rounded-lg flex justify-between items-center gap-3 transition-all">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <span className="text-[11px] font-medium text-[#1A1A1A]">{q.text}</span>
                          <div className="flex gap-1.5 flex-wrap">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${q.difficulty === 'Easy' ? 'bg-[#E1F5EE] text-[#0F6E56]' : q.difficulty === 'Medium' ? 'bg-[#FFF4E0] text-[#FF9A01]' : 'bg-[#FAECE7] text-[#993C1D]'}`}>
                              {q.difficulty}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[#F1F1F1] text-[#5F5F5F]">{q.type}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[#E6E6FF] text-[#000099]">{q.co}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => addQuestion(q)}
                          disabled={isAdded}
                          className={`h-7 px-3 rounded text-[11px] font-semibold flex-shrink-0 transition-colors ${isAdded ? 'border border-[#E2E2E2] bg-transparent text-[#9E9E9E]' : 'bg-[#000099] text-white hover:bg-[#000066]'}`}
                        >
                          {isAdded ? 'Added' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Composer panel (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-sm text-[#1A1A1A]">Assessment Composer</h3>
                
                {/* Form fields */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Assessment Title</label>
                    <input 
                      type="text" 
                      value={compTitle} 
                      onChange={(e) => setCompTitle(e.target.value)}
                      className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Duration</label>
                    <input 
                      type="text" 
                      value={compDuration} 
                      onChange={(e) => setCompDuration(e.target.value)}
                      className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Assessment Date</label>
                    <input 
                      type="date" 
                      value={compDate} 
                      onChange={(e) => setCompDate(e.target.value)}
                      className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-[10px] font-semibold text-[#5F5F5F] uppercase tracking-wider">Assigned Section(s)</label>
                    <input 
                      type="text" 
                      value={compSection} 
                      onChange={(e) => setCompSection(e.target.value)}
                      className="h-9 border border-[#E2E2E2] rounded px-3 text-xs bg-white outline-none w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold text-[#000099] border-b border-[#E2E2E2] pb-2 mt-2">
                  <span>Selected Questions: {composerQuestions.length}</span>
                  <span>Total Marks: {composerMarksTotal} marks</span>
                </div>

                {/* Drop Zone */}
                <div className="border-2 border-dashed border-[#E2E2E2] rounded-lg p-6 bg-[#F8F8F8] min-h-[120px] flex flex-col items-center justify-center gap-2">
                  {composerQuestions.length === 0 ? (
                    <>
                      <PlusCircle className="w-6 h-6 text-[#9E9E9E]" />
                      <p className="text-xs text-[#5F5F5F] text-center max-w-[360px]">
                        Add questions from the left side panel to compose your exam paper, or click the button below to auto-compose.
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      {composerQuestions.map((q, idx) => {
                        let marksVal = q.type === 'MCQ' ? 2 : q.type === 'Short Answer' ? 5 : 10;
                        return (
                          <div key={q.id} className="p-3 bg-white border border-[#E2E2E2] rounded-lg flex justify-between items-center text-xs">
                            <div className="flex flex-col gap-1 items-start">
                              <span><strong>Q{idx + 1}:</strong> {q.text}</span>
                              <div className="flex gap-1.5 mt-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${q.difficulty === 'Easy' ? 'bg-[#E1F5EE] text-[#0F6E56]' : q.difficulty === 'Medium' ? 'bg-[#FFF4E0] text-[#FF9A01]' : 'bg-[#FAECE7] text-[#993C1D]'}`}>{q.difficulty}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase bg-[#F1F1F1] text-[#5F5F5F]">{q.type}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#F0F0FF] text-[#000099] font-semibold">{marksVal} Marks</span>
                              </div>
                            </div>
                            <button onClick={() => removeQuestion(q.id)} className="text-[#993C1D] text-lg font-bold hover:text-red-700 bg-none border-none p-1">&times;</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button 
                  onClick={runAutoCompose} 
                  disabled={isAutoComposing}
                  className="w-full py-3 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isAutoComposing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-[#FF9A01] rounded-full animate-spin"></span>
                      <span>Composing Exam Paper...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Auto-Compose Assessment</span>
                    </>
                  )}
                </button>

                {/* Simulated Auto-composed report */}
                {isReportComposed && (
                  <div className="bg-[#F0F0FF] border border-[#E6E6FF] rounded-xl p-5 text-xs text-[#000066] flex flex-col gap-3 leading-relaxed mt-2">
                    <div className="font-bold text-[13px] text-[#000099] border-b border-dashed border-[#E6E6FF] pb-2">
                      Auto-composed Paper: {compTitle}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong>Structure Breakdown:</strong>
                        <div className="mt-1">• 8 MCQs (Easy 3, Medium 3, Hard 2) = 16 marks</div>
                        <div>• 4 Short Answer (Medium 2, Hard 2) = 20 marks</div>
                        <div>• 1 Long Answer (Hard) = 14 marks</div>
                        <div className="mt-1 font-bold">Total: 50 marks · 2 hours</div>
                      </div>
                      <div>
                        <strong>Outcome Mapping (COs):</strong>
                        <div className="mt-1">• CO1: 20% · CO2: 20%</div>
                        <div>• CO3: 30% · CO4: 30%</div>
                        <strong className="block mt-2">Bloom's Taxonomy:</strong>
                        <div>• Remember: 20% · Understand: 30%</div>
                        <div>• Apply: 30% · Analyse: 20%</div>
                      </div>
                    </div>
                    <div className="mt-1">
                      <strong>Unit weights:</strong> Unit 1 (20%) · Unit 2 (30%) · Unit 3 (50%)
                    </div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex items-center gap-1.5 text-[#0F6E56] font-semibold">
                        <Check className="w-4 h-4" />
                        <span>No questions used in Section A before (safe for Section A/B)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0F6E56] font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Difficulty curve: Easy to Medium to Hard conforms to standards</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0F6E56] font-semibold">
                        <Check className="w-4 h-4" />
                        <span>AICTE outcome-based compliance: PASS</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={saveAssessment} className="h-9 px-4 bg-transparent border border-[#000099] text-[#000099] hover:bg-[#E6E6FF] rounded-lg font-semibold text-xs flex-1 transition-colors">Save Assessment</button>
                      <button onClick={() => showToast('✓ Exporting assessment paper as PDF')} className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex-1 transition-colors">Export as PDF</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* 4. ANALYTICS SCREEN */}
          {activeScreen === 'analytics' && (
            <div className="flex flex-col gap-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#000099] font-mono">47</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Content Generated This Semester</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#0F6E56] font-mono">94 hrs</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Faculty Hours Saved</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#000099] font-mono">284</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Quiz Questions in Bank</span>
                </div>
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-4 shadow-sm flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#000099] font-mono">128</span>
                  <span className="text-[11px] text-[#5F5F5F] font-semibold">Student Downloads This Week</span>
                </div>
              </div>

              {/* Flex grids */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Heatmap Grid */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-[#1A1A1A] mb-1">Syllabus Coverage Heatmap</h3>
                  <div className="text-[11px] text-[#5F5F5F] mb-4">Approved content mapped across subjects and units:</div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-1.5 text-center">
                      <thead>
                        <tr className="text-[10px] font-semibold text-[#5F5F5F] uppercase">
                          <th className="p-1.5 text-left">Subject</th>
                          <th className="p-1.5">Unit 1</th>
                          <th className="p-1.5">Unit 2</th>
                          <th className="p-1.5">Unit 3</th>
                          <th className="p-1.5">Unit 4</th>
                          <th className="p-1.5">Unit 5</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs font-semibold">
                        <tr>
                          <td className="p-2.5 bg-slate-100 text-[#1A1A1A] rounded text-left pl-3 font-semibold w-[150px]">CS301 Data Structures</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 bg-slate-100 text-[#1A1A1A] rounded text-left pl-3 font-semibold">CS401 Algorithms</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#FFF4E0] text-[#FF9A01] border border-amber-200/20 rounded">⏳</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 bg-slate-100 text-[#1A1A1A] rounded text-left pl-3 font-semibold">CS501 OS</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 bg-slate-100 text-[#1A1A1A] rounded text-left pl-3 font-semibold">CS201 DBMS</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#E1F5EE] text-[#0F6E56] border border-teal-200/20 rounded">✓</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                          <td className="p-2.5 bg-[#F1F1F1] text-[#9E9E9E] rounded">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 mt-4 justify-end text-[11px] font-semibold text-[#5F5F5F]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#E1F5EE] border border-[#0F6E56] inline-block"></span> Approved</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#FFF4E0] border border-[#FF9A01] inline-block"></span> Pending Approval</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#F1F1F1] inline-block"></span> Not Generated</span>
                  </div>
                </div>

                {/* Recharts Bar Chart */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-[#1A1A1A] mb-3">Faculty Hours Saved by Subject</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2E2" />
                        <XAxis dataKey="name" tick={{ fill: '#5F5F5F', fontSize: 10, fontFamily: 'Sora' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: '#5F5F5F', fontSize: 10, fontFamily: 'Sora' }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ fontFamily: 'Sora', fontSize: 11, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontFamily: 'Sora', fontSize: 11 }} />
                        <Bar dataKey="Hours Saved" fill="#000099" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Roster & Savings Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Contribution Roster */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-sm text-[#1A1A1A] mb-4">Faculty Contribution Roster</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="bg-[#F8F8F8] border-b border-[#E2E2E2]">
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Faculty Member</th>
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Subject</th>
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Generated</th>
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Approved</th>
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Pending</th>
                          <th className="p-2.5 font-semibold text-[#5F5F5F] uppercase text-[10px] tracking-wider">Avg Approval</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#F1F1F1] last:border-0">
                          <td className="p-3 font-semibold">Dr. Anand Kumar</td>
                          <td className="p-3 font-mono">CS301</td>
                          <td className="p-3">22 items</td>
                          <td className="p-3">20</td>
                          <td className="p-3 font-bold text-[#FF9A01]">2</td>
                          <td className="p-3">0.8 days</td>
                        </tr>
                        <tr className="border-b border-[#F1F1F1] last:border-0">
                          <td className="p-3 font-semibold">Dr. Priya Nair</td>
                          <td className="p-3 font-mono">CS401</td>
                          <td className="p-3">11 items</td>
                          <td className="p-3">7</td>
                          <td className="p-3 font-bold text-[#FF9A01]">4</td>
                          <td className="p-3">2.1 days</td>
                        </tr>
                        <tr className="border-b border-[#F1F1F1] last:border-0">
                          <td className="p-3 font-semibold">Dr. Meena Sharma</td>
                          <td className="p-3 font-mono">CS501</td>
                          <td className="p-3">8 items</td>
                          <td className="p-3">8</td>
                          <td className="p-3">0</td>
                          <td className="p-3">0.5 days</td>
                        </tr>
                        <tr className="border-b border-[#F1F1F1] last:border-0">
                          <td className="p-3 font-semibold">Dr. Rajesh Kumar</td>
                          <td className="p-3 font-mono">CS201</td>
                          <td className="p-3">6 items</td>
                          <td className="p-3">3</td>
                          <td className="p-3 font-bold text-[#FF9A01]">3</td>
                          <td className="p-3">3.4 days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cost/Economic Value saved */}
                <div className="bg-white border border-[#E2E2E2] rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <h3 className="font-bold text-sm text-[#1A1A1A]">Foresight & Economic Value</h3>
                  
                  <div className="flex flex-col gap-2.5 my-4 text-xs">
                    <div className="flex justify-between border-b border-dashed border-[#E2E2E2] pb-1.5">
                      <span className="text-[#5F5F5F] font-medium">Topic Notes (18 items × 3.0 hrs avg)</span>
                      <span className="font-semibold font-mono">54.0 hrs</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#E2E2E2] pb-1.5">
                      <span className="text-[#5F5F5F] font-medium">Quiz Banks (12 items × 1.5 hrs avg)</span>
                      <span className="font-semibold font-mono">18.0 hrs</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#E2E2E2] pb-1.5">
                      <span className="text-[#5F5F5F] font-medium">Revision Summaries (10 items × 0.5 hrs avg)</span>
                      <span className="font-semibold font-mono">5.0 hrs</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#E2E2E2] pb-1.5">
                      <span className="text-[#5F5F5F] font-medium">Student Guides (5 items × 1.0 hr avg)</span>
                      <span className="font-semibold font-mono">5.0 hrs</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#E2E2E2] pb-1.5">
                      <span className="text-[#5F5F5F] font-medium">PPT Lecture Outlines (2 items × 2.0 hrs avg)</span>
                      <span className="font-semibold font-mono">4.0 hrs</span>
                    </div>
                  </div>

                  <div className="bg-[#F0F0FF] border border-[#E6E6FF] rounded-lg p-3.5 mt-2">
                    <div className="flex justify-between font-bold text-xs text-[#000066] mb-1">
                      <span>Total Items Saved:</span>
                      <span>47 items · 86.0 hrs</span>
                    </div>
                    <div className="text-[10px] text-[#5F5F5F] mb-2">
                      Calculated at an institutional baseline of ₹450 per faculty hour:
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#000099]">Value Saved:</span>
                      <span className="text-xl font-bold text-[#000099]">₹38,700 <span className="text-[11px] font-normal text-[#5F5F5F]">this sem</span></span>
                    </div>
                    <div className="border-t border-dashed border-[#E6E6FF] mt-2.5 pt-2.5 flex justify-between items-center text-[10px] font-bold text-[#0F6E56]">
                      <span>Projected University Savings (6 Depts):</span>
                      <span>₹2.3 Lakh / Sem</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

      {/* TOASTS PANEL */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-[1000]">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="bg-[#000099] text-white px-5 py-3 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2.5 animate-bounce-short"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* REVIEW modal */}
      {reviewModalItem && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-[500px] flex flex-col overflow-hidden animate-scale-up">
            <div className="px-5 py-3 border-b border-[#E2E2E2] flex justify-between items-center bg-white">
              <h4 className="font-bold text-sm text-[#1A1A1A]">Review Pending Asset: {reviewModalItem.topic}</h4>
              <button 
                onClick={() => setReviewModalItem(null)} 
                className="text-[#9E9E9E] hover:text-[#1A1A1A] text-lg font-bold bg-none border-none p-1"
              >
                &times;
              </button>
            </div>
            <div className="p-5 text-xs flex flex-col gap-3 leading-relaxed">
              <p>Submitted by: <strong>{reviewModalItem.faculty}</strong> for HOD review approval cycles.</p>
              <div className="bg-[#FFF4E0] border border-[#854F0B] text-[#663C07] p-3.5 rounded-lg">
                <strong className="block mb-1 text-sm">Pending HOD Action:</strong>
                Please verify syllabus compliance alignment before releasing document scopes to course portals.
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => approvePendingItem(reviewModalItem)} 
                  className="h-9 px-4 bg-[#FF9A01] text-white hover:bg-[#CC7A00] rounded-lg font-bold text-xs transition-colors flex-1"
                >
                  Approve & Release
                </button>
                <button 
                  onClick={() => setReviewModalItem(null)} 
                  className="h-9 px-4 bg-transparent border border-[#E2E2E2] text-[#5F5F5F] hover:bg-slate-100 rounded-lg font-semibold text-xs flex-1 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
