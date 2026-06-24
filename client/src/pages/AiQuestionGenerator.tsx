import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { usePersona } from '../contexts/PersonaContext';
import {
  Sparkles,
  Brain,
  GraduationCap,
  Sliders,
  Check,
  RefreshCw,
  Edit2,
  Trash2,
  X,
  FileText,
  Download,
  Send,
  Eye,
  EyeOff,
  CheckCircle2,
  Plus,
  ArrowRight,
  Info,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

// =============================================================================
// INTERFACES & MOCK DATABASE
// =============================================================================

interface Question {
  id: string;
  qNo: string;
  type: 'MCQ' | 'SAQ' | 'LAQ';
  text: string;
  marks: number;
  bloomLevel: string;
  coCode?: string; // For College Outcome mapping
  options?: string[]; // For MCQs
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SyllabusDatabase {
  grades: string[];
  subjects: Record<string, string[]>;
  chapters: Record<string, string[]>;
}

// School mock database
const schoolSyllabus: SyllabusDatabase = {
  grades: ['Class 10', 'Class 11', 'Class 12'],
  subjects: {
    'Class 10': ['Mathematics', 'Science', 'English'],
    'Class 11': ['Physics', 'Chemistry', 'Mathematics', 'English'],
    'Class 12': ['Physics', 'Chemistry', 'Mathematics', 'English']
  },
  chapters: {
    'Mathematics': ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'Trigonometry', 'Probability'],
    'Science': ['Chemical Reactions', 'Life Processes', 'Light: Reflection & Refraction', 'Electricity'],
    'English': ['A Letter to God', 'Long Walk to Freedom', 'The Midnight Visitor', 'Footprints without Feet'],
    'Physics': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Laws of Motion'],
    'Chemistry': ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements']
  }
};

// College mock database
const collegeSyllabus: SyllabusDatabase = {
  grades: ['Semester 3', 'Semester 5', 'Semester 7'],
  subjects: {
    'Semester 3': ['Database Management Systems', 'Data Structures', 'Discrete Mathematics'],
    'Semester 5': ['Computer Networks', 'Analysis & Design of Algorithms', 'Software Engineering'],
    'Semester 7': ['Cloud Computing', 'Artificial Intelligence', 'Information Security']
  },
  chapters: {
    'Database Management Systems': ['Unit 1: ER Modeling', 'Unit 2: Normalization (3NF/BCNF)', 'Unit 3: Transaction & ACID', 'Unit 4: SQL Queries'],
    'Data Structures': ['Unit 1: Arrays & Lists', 'Unit 2: Stacks & Queues', 'Unit 3: Binary Trees', 'Unit 4: Graph Traversals'],
    'Discrete Mathematics': ['Unit 1: Set Theory', 'Unit 2: Mathematical Induction', 'Unit 3: Graph Theory'],
    'Computer Networks': ['Unit 1: Physical Link Layer', 'Unit 2: Routing Protocols (DV/LS)', 'Unit 3: TCP Congestion Control', 'Unit 4: Application Protocols'],
    'Analysis & Design of Algorithms': ['Unit 1: Divide & Conquer', 'Unit 2: Greedy Kruskal\'s MST', 'Unit 3: Dynamic Programming', 'Unit 4: NP-Completeness'],
    'Software Engineering': ['Unit 1: Agile Methods', 'Unit 2: Requirement Engineering', 'Unit 3: System Testing']
  }
};

// Question Paper mock database
const mockQuestionPapers: Record<string, Question[]> = {
  'Mathematics': [
    {
      id: 'math-q1',
      qNo: 'Q1',
      type: 'MCQ',
      text: 'If the HCF of 65 and 117 is expressible in the form 65m - 117, then the value of m is:',
      marks: 1,
      bloomLevel: 'Applying',
      options: ['1', '2', '3', '4'],
      answer: '2',
      explanation: 'HCF of 65 and 117 is 13. Given 65m - 117 = 13 => 65m = 130 => m = 2.',
      difficulty: 'Easy'
    },
    {
      id: 'math-q2',
      qNo: 'Q2',
      type: 'MCQ',
      text: 'The value of k for which the system of equations kx - y = 2 and 6x - 2y = 3 has a unique solution is:',
      marks: 1,
      bloomLevel: 'Understanding',
      options: ['k = 3', 'k != 3', 'k != 0', 'k = 0'],
      answer: 'k != 3',
      explanation: 'For unique solution, a1/a2 != b1/b2 => k/6 != -1/-2 => k/6 != 1/2 => k != 3.',
      difficulty: 'Medium'
    },
    {
      id: 'math-q3',
      qNo: 'Q3',
      type: 'SAQ',
      text: 'Find the quadratic polynomial whose zeroes are 3 + sqrt(2) and 3 - sqrt(2).',
      marks: 3,
      bloomLevel: 'Applying',
      answer: 'x^2 - 6x + 7',
      explanation: 'Sum of zeroes = (3 + sqrt(2)) + (3 - sqrt(2)) = 6. Product of zeroes = (3 + sqrt(2))(3 - sqrt(2)) = 9 - 2 = 7. Quadratic equation is x^2 - (sum)x + product = x^2 - 6x + 7.',
      difficulty: 'Medium'
    },
    {
      id: 'math-q4',
      qNo: 'Q4',
      type: 'SAQ',
      text: 'Prove that sqrt(5) is an irrational number.',
      marks: 3,
      bloomLevel: 'Analyzing',
      answer: 'Proof by contradiction (detailed steps).',
      explanation: 'Assume sqrt(5) is rational, sqrt(5) = a/b where a and b are co-prime integers. Squaring gives 5 = a^2/b^2 => a^2 = 5b^2. Thus, 5 divides a^2, which means 5 divides a. Let a = 5c => 25c^2 = 5b^2 => b^2 = 5c^2. Thus, 5 divides b. This contradicts that a and b are co-prime.',
      difficulty: 'Hard'
    },
    {
      id: 'math-q5',
      qNo: 'Q5',
      type: 'LAQ',
      text: 'State and prove Basic Proportionality Theorem (Thales Theorem).',
      marks: 5,
      bloomLevel: 'Evaluating',
      answer: 'Detailed proof with triangle diagrams.',
      explanation: 'If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio. In triangle ABC, line DE || BC. Area of ADE/Area of BDE = AD/DB. Area of ADE/Area of CDE = AE/EC. Since BDE and CDE share same base DE and lie between parallel lines DE and BC, Area(BDE) = Area(CDE). Thus, AD/DB = AE/EC.',
      difficulty: 'Hard'
    }
  ],
  'Computer Networks': [
    {
      id: 'cn-q1',
      qNo: 'Q1',
      type: 'MCQ',
      text: 'Which of the following routing algorithms uses the Bellman-Ford algorithm to compute the shortest paths?',
      marks: 2,
      bloomLevel: 'Remembering',
      coCode: 'CO2',
      options: ['Link State Routing', 'Distance Vector Routing', 'Path Vector Routing', 'Flooding'],
      answer: 'Distance Vector Routing',
      explanation: 'Distance Vector Routing protocols (like RIP) use the Bellman-Ford equation to calculate optimal routes in a distributed manner.',
      difficulty: 'Easy'
    },
    {
      id: 'cn-q2',
      qNo: 'Q2',
      type: 'MCQ',
      text: 'In IPv4 subnetting, how many usable host addresses are available in a network block with a subnet prefix of /26?',
      marks: 2,
      bloomLevel: 'Applying',
      coCode: 'CO1',
      options: ['64', '62', '30', '32'],
      answer: '62',
      explanation: 'A /26 mask leaves 32 - 26 = 6 host bits. Total addresses = 2^6 = 64. Subtracting 2 for the network and broadcast addresses leaves 62 usable hosts.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-q3',
      qNo: 'Q3',
      type: 'SAQ',
      text: 'Differentiate between Distance Vector and Link State routing protocols. Identify how the count-to-infinity problem is mitigated in DV.',
      marks: 5,
      bloomLevel: 'Analyzing',
      coCode: 'CO2',
      answer: 'Tabular difference with split-horizon explanation.',
      explanation: 'DV shares routing tables with neighbors periodically (Bellman-Ford); LS floods links updates globally (Dijkstra). Count-to-infinity is mitigated using Split Horizon, Route Poisoning, and Hold-Down timers.',
      difficulty: 'Medium'
    },
    {
      id: 'cn-q4',
      qNo: 'Q4',
      type: 'LAQ',
      text: 'Explain the TCP congestion control mechanism in detail. Discuss Slow Start, Congestion Avoidance, and Fast Recovery phases with a dynamic threshold graph.',
      marks: 10,
      bloomLevel: 'Evaluating',
      coCode: 'CO3',
      answer: 'Explanation of cwnd adjustments and phases.',
      explanation: 'Slow Start: cwnd doubles every RTT until ssthresh. Congestion Avoidance: cwnd grows linearly (+1 MSS per RTT). Fast Recovery: triggered by triple duplicate ACKs, cwnd set to ssthresh + 3 MSS instead of dropping to 1.',
      difficulty: 'Hard'
    }
  ]
};

// Alternative questions for swapping
const alternativeQuestionsDb: Record<string, Question[]> = {
  'math-q1': [
    {
      id: 'alt-math-q1-1',
      qNo: 'Q1',
      type: 'MCQ',
      text: 'The decimal expansion of the rational number 14587/1250 will terminate after:',
      marks: 1,
      bloomLevel: 'Applying',
      options: ['one decimal place', 'two decimal places', 'three decimal places', 'four decimal places'],
      answer: 'four decimal places',
      explanation: '1250 = 2 * 5^4. The termination count is the highest power of 2 or 5, which is 4.',
      difficulty: 'Easy'
    },
    {
      id: 'alt-math-q1-2',
      qNo: 'Q1',
      type: 'MCQ',
      text: 'If two positive integers a and b are written as a = x^3y^2 and b = xy^3; where x, y are prime numbers, then HCF(a,b) is:',
      marks: 1,
      bloomLevel: 'Understanding',
      options: ['xy', 'xy^2', 'x^3y^3', 'x^2y^2'],
      answer: 'xy^2',
      explanation: 'HCF is the product of common terms with lowest power => x^1 * y^2 = xy^2.',
      difficulty: 'Easy'
    }
  ],
  'math-q3': [
    {
      id: 'alt-math-q3-1',
      qNo: 'Q3',
      type: 'SAQ',
      text: 'Find the zeroes of the quadratic polynomial 6x^2 - 3 - 7x and verify the relationship between the zeroes and the coefficients.',
      marks: 3,
      bloomLevel: 'Applying',
      answer: 'Zeroes are 3/2 and -1/3.',
      explanation: '6x^2 - 7x - 3 = 0 => (2x - 3)(3x + 1) = 0 => x = 3/2, -1/3. Sum = 3/2 - 1/3 = 7/6 (-b/a). Product = (3/2)(-1/3) = -1/2 (c/a). Both verified.',
      difficulty: 'Medium'
    }
  ],
  'cn-q1': [
    {
      id: 'alt-cn-q1-1',
      qNo: 'Q1',
      type: 'MCQ',
      text: 'Which layer of the OSI model is responsible for logical addressing and packet routing across multiple networks?',
      marks: 2,
      bloomLevel: 'Remembering',
      coCode: 'CO1',
      options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
      answer: 'Network Layer',
      explanation: 'The Network Layer handles packet delivery, logical addressing (IP), routing decisions, and path determination.',
      difficulty: 'Easy'
    }
  ],
  'cn-q2': [
    {
      id: 'alt-cn-q2-1',
      qNo: 'Q2',
      type: 'MCQ',
      text: 'In a class C network block 192.168.1.0, you need to configure 5 subnets. Which subnet mask will satisfy this requirement with maximum hosts?',
      marks: 2,
      bloomLevel: 'Applying',
      coCode: 'CO1',
      options: ['255.255.255.224 (/27)', '255.255.255.240 (/28)', '255.255.255.192 (/26)', '255.255.255.248 (/29)'],
      answer: '255.255.255.224 (/27)',
      explanation: 'To get 5 subnets, we need to borrow 3 bits (2^3 = 8 subnets). /27 borrows 3 bits, leaving 5 host bits (30 usable hosts per subnet).',
      difficulty: 'Medium'
    }
  ]
};

const defaultAlternative: Question = {
  id: 'alt-fallback',
  qNo: 'Q',
  type: 'MCQ',
  text: 'Alternative query: Describe the key elements of the subject and detail their applications.',
  marks: 2,
  bloomLevel: 'Understanding',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  answer: 'Option A',
  explanation: 'AI generated fallback explanation.',
  difficulty: 'Medium'
};

const generationSteps = [
  'Reading syllabus units and mapping learning objectives...',
  'Checking Course Outcomes (CO) alignment & Bloom\'s levels...',
  'Ingesting difficulty parameters (balancing easy vs hard ratios)...',
  'Drafting Multiple Choice and Short Answer question items...',
  'Formulating long description scenarios and coding tasks...',
  'Generating corresponding model answer keys and step evaluation rubrics...',
  'Finalizing document formatting and preparing printing layouts...'
];

export default function AiQuestionGenerator() {
  const { role } = usePersona();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings states
  const [instType, setInstType] = useState<'school' | 'college'>('school');
  const [grade, setGrade] = useState<string>('Class 10');
  const [subject, setSubject] = useState<string>('Mathematics');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  
  // Slider states
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 });
  const [blooms, setBlooms] = useState({
    remembering: 20,
    understanding: 30,
    applying: 20,
    analyzing: 15,
    evaluating: 10,
    creating: 5
  });

  // Paper settings
  const [totalMarks, setTotalMarks] = useState<number>(80);
  const [duration, setDuration] = useState<number>(180);
  const [mcqCount, setMcqCount] = useState<number>(10);
  const [saqCount, setSaqCount] = useState<number>(5);
  const [laqCount, setLaqCount] = useState<number>(3);

  // Layout steps: 'setup' | 'generating' | 'preview'
  const [step, setStep] = useState<'setup' | 'generating' | 'preview'>('setup');
  const [genProgress, setGenProgress] = useState(0);
  const [genStatusText, setGenStatusText] = useState('');

  // Loaded paper states
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Alternative modal states
  const [swapTargetQId, setSwapTargetQId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync selectors on institution type change
  useEffect(() => {
    const db = instType === 'school' ? schoolSyllabus : collegeSyllabus;
    const firstGrade = db.grades[0];
    setGrade(firstGrade);
    const firstSubject = db.subjects[firstGrade][0];
    setSubject(firstSubject);
    const chaptersList = db.chapters[firstSubject] || [];
    setSelectedChapters(chaptersList);
  }, [instType]);

  // Sync subjects when grade changes
  const handleGradeChange = (newGrade: string) => {
    setGrade(newGrade);
    const db = instType === 'school' ? schoolSyllabus : collegeSyllabus;
    const firstSubject = db.subjects[newGrade][0];
    setSubject(firstSubject);
    const chaptersList = db.chapters[firstSubject] || [];
    setSelectedChapters(chaptersList);
  };

  // Sync chapters when subject changes
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const db = instType === 'school' ? schoolSyllabus : collegeSyllabus;
    const chaptersList = db.chapters[newSubject] || [];
    setSelectedChapters(chaptersList);
  };

  // Toggle chapter check
  const toggleChapter = (chapterName: string) => {
    setSelectedChapters(prev =>
      prev.includes(chapterName)
        ? prev.filter(c => c !== chapterName)
        : [...prev, chapterName]
    );
  };

  // Auto-balance functions to make totals equal 100%
  const autoBalanceBlooms = () => {
    const total = blooms.remembering + blooms.understanding + blooms.applying + blooms.analyzing + blooms.evaluating + blooms.creating;
    if (total === 0) {
      setBlooms({ remembering: 20, understanding: 20, applying: 20, analyzing: 20, evaluating: 20, creating: 0 });
      showToast('Balanced Bloom\'s distribution equally');
      return;
    }
    const factor = 100 / total;
    setBlooms({
      remembering: Math.min(100, Math.max(0, Math.round(blooms.remembering * factor))),
      understanding: Math.min(100, Math.max(0, Math.round(blooms.understanding * factor))),
      applying: Math.min(100, Math.max(0, Math.round(blooms.applying * factor))),
      analyzing: Math.min(100, Math.max(0, Math.round(blooms.analyzing * factor))),
      evaluating: Math.min(100, Math.max(0, Math.round(blooms.evaluating * factor))),
      creating: Math.min(100, Math.max(0, Math.round(blooms.creating * factor)))
    });
    showToast('Balanced Bloom\'s level weights to total 100%');
  };

  const autoBalanceDifficulty = () => {
    const total = difficulty.easy + difficulty.medium + difficulty.hard;
    if (total === 0) {
      setDifficulty({ easy: 30, medium: 40, hard: 30 });
      showToast('Balanced difficulty equally');
      return;
    }
    const factor = 100 / total;
    setDifficulty({
      easy: Math.min(100, Math.max(0, Math.round(difficulty.easy * factor))),
      medium: Math.min(100, Math.max(0, Math.round(difficulty.medium * factor))),
      hard: Math.min(100, Math.max(0, Math.round(difficulty.hard * factor)))
    });
    showToast('Balanced difficulty weights to total 100%');
  };

  // Calculations for balance states
  const bloomsSum = blooms.remembering + blooms.understanding + blooms.applying + blooms.analyzing + blooms.evaluating + blooms.creating;
  const diffSum = difficulty.easy + difficulty.medium + difficulty.hard;

  // Run simulated AI question generation
  const handleStartGeneration = () => {
    if (selectedChapters.length === 0) {
      showToast('Please select at least one chapter/unit to cover.');
      return;
    }
    setStep('generating');
    setGenProgress(0);
    setGenStatusText(generationSteps[0]);

    // Fast loading loop simulating deep AI processing steps
    const timer = setInterval(() => {
      setGenProgress(prev => {
        const next = prev + 5;
        // Map progress to steps text
        const stepIdx = Math.min(generationSteps.length - 1, Math.floor((next / 100) * generationSteps.length));
        setGenStatusText(generationSteps[stepIdx]);

        if (next >= 100) {
          clearInterval(timer);
          // Load pre-configured mock template depending on subject selection, fallback to standard mock
          const targetKey = mockQuestionPapers[subject] ? subject : 'Mathematics';
          const loadedQs = mockQuestionPapers[targetKey] || mockQuestionPapers['Mathematics'];
          setQuestions(JSON.parse(JSON.stringify(loadedQs))); // Deep copy
          setStep('preview');
          showToast('Question paper generated successfully!');
          return 100;
        }
        return next;
      });
    }, 150);
  };

  // Inline editing question details
  const startEditing = (id: string, currentText: string) => {
    setEditingQId(id);
    setEditingText(currentText);
  };

  const saveEditedText = () => {
    if (!editingQId) return;
    setQuestions(prev => prev.map(q => 
      q.id === editingQId ? { ...q, text: editingText } : q
    ));
    setEditingQId(null);
    showToast('Question text updated.');
  };

  // Swapping questions with alternatives
  const handleOpenSwapModal = (qId: string) => {
    setSwapTargetQId(qId);
  };

  const handleExecuteSwap = (newQuestion: Question) => {
    if (!swapTargetQId) return;
    setQuestions(prev => prev.map(q => {
      if (q.id === swapTargetQId) {
        return {
          ...newQuestion,
          qNo: q.qNo, // Preserve original index
          type: q.type, // Preserve original section type
          marks: q.marks // Preserve original marks allotment
        };
      }
      return q;
    }));
    setSwapTargetQId(null);
    showToast('Question swapped with AI alternate suggestion.');
  };

  // Mock export triggers
  const handleExportPdf = () => {
    showToast('Compiling document styles and font libraries...');
    setTimeout(() => {
      showToast(`PDF generated! Downloaded: ${subject.replace(/\s+/g, '_')}_Question_Paper.pdf`);
    }, 1200);
  };

  const handleSyncLms = () => {
    showToast('Connecting to edumerge LMS Assessment server...');
    setTimeout(() => {
      showToast(`Sync complete! Published to active ${grade} ${subject} class assessments.`);
    }, 1500);
  };

  const syllabus = instType === 'school' ? schoolSyllabus : collegeSyllabus;

  return (
    <Layout
      title="AI Question Paper Generator"
      description="Design curriculum-aligned test sheets and exam banks for schools and colleges mapped to cognitive weights."
      icon={Brain}
      showHome={true}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000099] text-white border border-blue-400/20 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slideIn">
          <Sparkles className="w-4 h-4 text-[#FF9A01] animate-pulse" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* SETUP STAGE */}
      {step === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
          
          {/* Left Controls Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-[#E2E0D8] bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-[#E2E0D8] bg-slate-50/50 p-5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#000099] text-base font-extrabold">Paper Parameters Setup</CardTitle>
                  <CardDescription className="text-[11px] text-slate-400 font-semibold mt-0.5">Select syllabus and define evaluation guidelines</CardDescription>
                </div>
                
                {/* Institution Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setInstType('school')}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${instType === 'school' ? 'bg-[#000099] text-white' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    School
                  </button>
                  <button
                    onClick={() => setInstType('college')}
                    className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${instType === 'college' ? 'bg-[#000099] text-white' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    College
                  </button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                
                {/* Academic Context Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">
                      {instType === 'school' ? 'Class / Grade' : 'Course Semester'}
                    </Label>
                    <select
                      value={grade}
                      onChange={(e) => handleGradeChange(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-white border border-[#E2E0D8] rounded-lg p-2.5 focus:outline-none focus:border-[#000099] cursor-pointer"
                    >
                      {syllabus.grades.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Subject Course</Label>
                    <select
                      value={subject}
                      onChange={(e) => handleSubjectChange(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-white border border-[#E2E0D8] rounded-lg p-2.5 focus:outline-none focus:border-[#000099] cursor-pointer"
                    >
                      {(syllabus.subjects[grade] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Syllabus Chapters Checklist */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Units / Chapters to Cover</Label>
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                      {selectedChapters.length} Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50/50 border border-[#E2E0D8] p-3 rounded-lg max-h-36 overflow-y-auto no-scrollbar">
                    {(syllabus.chapters[subject] || []).map(ch => {
                      const checked = selectedChapters.includes(ch);
                      return (
                        <label key={ch} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100/50 p-1.5 rounded">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleChapter(ch)}
                            className="accent-[#000099] rounded"
                          />
                          <span className="truncate">{ch}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Weights Sliders */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Difficulty Distribution</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${diffSum === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        Total: {diffSum}%
                      </span>
                      {diffSum !== 100 && (
                        <button
                          onClick={autoBalanceDifficulty}
                          className="text-[#FF9A01] text-[10px] font-black underline uppercase hover:text-[#e08800]"
                        >
                          Auto-Balance
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'easy', label: 'Easy (Recall)', val: difficulty.easy },
                      { key: 'medium', label: 'Medium (Apply)', val: difficulty.medium },
                      { key: 'hard', label: 'Hard (Evaluate)', val: difficulty.hard }
                    ].map(d => (
                      <div key={d.key} className="space-y-1 bg-slate-50/40 border border-slate-200/60 p-2.5 rounded-lg text-xs">
                        <div className="flex justify-between font-bold text-slate-600">
                          <span>{d.label}</span>
                          <span className="text-slate-800">{d.val}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={d.val}
                          onChange={(e) => setDifficulty(prev => ({ ...prev, [d.key]: parseInt(e.target.value) || 0 }))}
                          className="w-full accent-[#000099]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloom's Taxonomy Weights */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Bloom's Taxonomy Alignment</Label>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${bloomsSum === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        Total: {bloomsSum}%
                      </span>
                      {bloomsSum !== 100 && (
                        <button
                          onClick={autoBalanceBlooms}
                          className="text-[#FF9A01] text-[10px] font-black underline uppercase hover:text-[#e08800]"
                        >
                          Auto-Balance
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { key: 'remembering', label: 'L1: Remembering', val: blooms.remembering },
                      { key: 'understanding', label: 'L2: Understanding', val: blooms.understanding },
                      { key: 'applying', label: 'L3: Applying', val: blooms.applying },
                      { key: 'analyzing', label: 'L4: Analyzing', val: blooms.analyzing },
                      { key: 'evaluating', label: 'L5: Evaluating', val: blooms.evaluating },
                      { key: 'creating', label: 'L6: Creating', val: blooms.creating }
                    ].map(b => (
                      <div key={b.key} className="space-y-1 bg-slate-50/40 border border-slate-200/60 p-2.5 rounded-lg text-[11px]">
                        <div className="flex justify-between font-bold text-slate-600">
                          <span className="truncate">{b.label}</span>
                          <span className="text-slate-800 shrink-0 ml-1">{b.val}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={b.val}
                          onChange={(e) => setBlooms(prev => ({ ...prev, [b.key]: parseInt(e.target.value) || 0 }))}
                          className="w-full accent-[#000099]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Parameters Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-[#E2E0D8] bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-[#E2E0D8] bg-slate-50/50 p-5">
                <CardTitle className="text-[#000099] text-base font-extrabold">Exam Format Settings</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 font-semibold mt-0.5">Configure template properties and question layout</CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 space-y-5">
                
                {/* Paper Marks and time limits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Total Marks Allotted</Label>
                    <Input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
                      className="border-[#E2E0D8] focus:ring-[#000099] focus:border-[#000099] text-xs font-bold"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-slate-400 uppercase font-black">Duration (Minutes)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      className="border-[#E2E0D8] focus:ring-[#000099] focus:border-[#000099] text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Section layout distribution counts */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <Label className="text-[10px] text-slate-400 uppercase font-black block">Question Section Distribution</Label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                      <span className="font-bold text-slate-700">Section A: MCQs (1-2 Marks)</span>
                      <input
                        type="number"
                        min="0"
                        value={mcqCount}
                        onChange={(e) => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 border border-[#E2E0D8] rounded px-2 py-1 text-center font-bold text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                      <span className="font-bold text-slate-700">Section B: Short Answers (3-5 Marks)</span>
                      <input
                        type="number"
                        min="0"
                        value={saqCount}
                        onChange={(e) => setSaqCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 border border-[#E2E0D8] rounded px-2 py-1 text-center font-bold text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="font-bold text-slate-700">Section C: Long Answers (5-10 Marks)</span>
                      <input
                        type="number"
                        min="0"
                        value={laqCount}
                        onChange={(e) => setLaqCount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 border border-[#E2E0D8] rounded px-2 py-1 text-center font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-xs text-blue-700 leading-normal">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Outcome & Standards Alignment</span>
                    <p className="text-[11px] text-blue-600/80 font-semibold">
                      The generator checks the active topic database and outcomes mapping table for {subject} before creating questions.
                    </p>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleStartGeneration}
                  disabled={bloomsSum !== 100 || diffSum !== 100}
                  className="w-full bg-[#000099] hover:bg-blue-900 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
                >
                  <Brain className="w-4 h-4 text-[#FF9A01]" />
                  Generate Question Paper with AI
                </button>
                {(bloomsSum !== 100 || diffSum !== 100) && (
                  <p className="text-[10px] text-rose-500 font-bold text-center mt-1">
                    * Make sure Bloom's and Difficulty percentages sum to exactly 100%.
                  </p>
                )}

              </CardContent>
            </Card>
          </div>

        </div>
      )}

      {/* GENERATION IN PROGRESS SCREEN */}
      {step === 'generating' && (
        <div className="max-w-xl mx-auto py-20 text-center space-y-8">
          <div className="w-24 h-24 bg-blue-50 text-[#000099] rounded-full flex items-center justify-center mx-auto shadow-inner relative">
            <Brain className="w-12 h-12 text-[#000099]" />
            <div className="absolute inset-0 rounded-full border-4 border-t-[#FF9A01] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-black text-slate-800">Generating Cognitive Assessment</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{genStatusText}</p>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#000099] to-[#FF9A01] h-full transition-all duration-300"
                style={{ width: `${genProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-black text-[#000099]">{genProgress}% Complete</span>
          </div>
        </div>
      )}

      {/* PREVIEW & EDIT STAGE */}
      {step === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-16">
          
          {/* Main Question Paper layout (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 bg-white border border-[#E2E0D8] p-3 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] font-black uppercase">Ready</Badge>
                <span className="text-[11px] text-slate-400 font-bold uppercase">{grade} | {subject}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="h-8 text-xs font-bold gap-1.5 border-slate-200 text-slate-600 cursor-pointer"
                >
                  {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showAnswers ? 'Hide Answer Key' : 'Show Answer Key'}
                </Button>
                <Button
                  onClick={handleExportPdf}
                  className="h-8 text-xs font-bold gap-1.5 bg-[#FF9A01] hover:bg-[#e08800] text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </Button>
              </div>
            </div>

            {/* Simulated Exam Sheet Document */}
            <div className="bg-white border-2 border-[#E2E0D8] rounded-2xl shadow-md p-10 font-serif relative">
              
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-double border-slate-300 pb-5 space-y-1 mb-8">
                <h2 className="text-[#000099] text-base font-extrabold uppercase font-sans tracking-wider">
                  {instType === 'school' ? 'Navkis Educational Centre' : 'Navkis Engineering College'}
                </h2>
                <p className="text-[11px] text-slate-400 font-sans font-bold uppercase tracking-widest">
                  Academic Year 2025-26 | Internal Assessment Exam
                </p>
                <div className="grid grid-cols-3 text-[11px] font-sans font-bold text-slate-600 pt-4 max-w-lg mx-auto">
                  <span>Subject: {subject}</span>
                  <span>Max Marks: {totalMarks}</span>
                  <span>Duration: {duration} Mins</span>
                </div>
              </div>

              {/* Instructions Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 font-sans text-xs text-slate-600 space-y-1.5 leading-normal">
                <span className="font-bold text-slate-800 block">General Instructions:</span>
                <p>1. All questions are compulsory. Read instructions carefully before writing.</p>
                <p>2. Section A contains Multiple Choice Questions. Section B contains Short Answers. Section C contains Detailed Answers.</p>
                <p>3. Do not make any scratch/pen marks in the questionnaire sheet.</p>
              </div>

              {/* Sections Generation */}
              <div className="space-y-8 font-sans">
                
                {/* Section A: MCQs */}
                <div className="space-y-4">
                  <h3 className="text-[#000099] font-black uppercase text-sm border-b border-slate-200 pb-1 tracking-wider">Section A: Objective Type (MCQs)</h3>
                  
                  {questions.filter(q => q.type === 'MCQ').map((q, idx) => {
                    const isEditing = editingQId === q.id;
                    return (
                      <div key={q.id} className="group relative bg-slate-50/25 hover:bg-slate-50/70 p-3 rounded-lg border border-transparent hover:border-slate-200/50 transition-colors">
                        
                        {/* Hover Tools block */}
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                          <button
                            onClick={() => startEditing(q.id, q.text)}
                            className="p-1 text-slate-400 hover:text-[#000099] hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenSwapModal(q.id)}
                            className="p-1 text-slate-400 hover:text-[#FF9A01] hover:bg-slate-100 rounded cursor-pointer"
                            title="Swap with AI Alternative"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Question */}
                        <div className="flex gap-2">
                          <span className="font-black text-[#000099]">{idx + 1}.</span>
                          <div className="flex-grow space-y-3">
                            
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-[#000099] p-2 rounded focus:outline-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEditedText} className="h-7 text-[10px] bg-[#000099] text-white">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingQId(null)} className="h-7 text-[10px] text-slate-500">Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <span className="font-semibold text-slate-800 leading-normal block pr-14">{q.text}</span>
                            )}
                            
                            {/* MCQ Options list */}
                            {q.options && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 font-semibold pl-2">
                                {q.options.map((opt, oIdx) => (
                                  <div key={opt} className="flex items-center gap-1.5">
                                    <span className="text-[#000099] font-black">{String.fromCharCode(65 + oIdx)})</span>
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Tags list */}
                            <div className="flex gap-2 pt-1">
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white">{q.bloomLevel}</Badge>
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-amber-700 border-amber-200">{q.difficulty}</Badge>
                              {q.coCode && (
                                <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-indigo-700 border-indigo-200">{q.coCode}</Badge>
                              )}
                              <span className="text-[10px] text-slate-400 font-semibold ml-auto">[{q.marks} Mark]</span>
                            </div>

                            {/* Answer Scheme details */}
                            {showAnswers && (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-xs mt-3 space-y-1">
                                <span className="font-black text-emerald-800 block">Correct Option: {q.answer}</span>
                                <p className="text-slate-600 font-semibold leading-normal"><strong>Explanation:</strong> {q.explanation}</p>
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Section B: Short Answers */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-[#000099] font-black uppercase text-sm border-b border-slate-200 pb-1 tracking-wider">Section B: Short Answer Questions</h3>
                  
                  {questions.filter(q => q.type === 'SAQ').map((q, idx) => {
                    const isEditing = editingQId === q.id;
                    return (
                      <div key={q.id} className="group relative bg-slate-50/25 hover:bg-slate-50/70 p-3 rounded-lg border border-transparent hover:border-slate-200/50 transition-colors">
                        
                        {/* Hover Tools block */}
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                          <button
                            onClick={() => startEditing(q.id, q.text)}
                            className="p-1 text-slate-400 hover:text-[#000099] hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenSwapModal(q.id)}
                            className="p-1 text-slate-400 hover:text-[#FF9A01] hover:bg-slate-100 rounded cursor-pointer"
                            title="Swap with AI Alternative"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Question */}
                        <div className="flex gap-2">
                          <span className="font-black text-[#000099]">{idx + 1 + questions.filter(x => x.type === 'MCQ').length}.</span>
                          <div className="flex-grow space-y-3">
                            
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-[#000099] p-2 rounded focus:outline-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEditedText} className="h-7 text-[10px] bg-[#000099] text-white">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingQId(null)} className="h-7 text-[10px] text-slate-500">Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <span className="font-semibold text-slate-800 leading-normal block pr-14">{q.text}</span>
                            )}

                            {/* Tags list */}
                            <div className="flex gap-2 pt-1">
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white">{q.bloomLevel}</Badge>
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-amber-700 border-amber-200">{q.difficulty}</Badge>
                              {q.coCode && (
                                <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-indigo-700 border-indigo-200">{q.coCode}</Badge>
                              )}
                              <span className="text-[10px] text-slate-400 font-semibold ml-auto">[{q.marks} Marks]</span>
                            </div>

                            {/* Answer Scheme details */}
                            {showAnswers && (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-xs mt-3 space-y-1">
                                <span className="font-black text-emerald-800 block">Marking Rubric:</span>
                                <p className="text-slate-600 font-semibold leading-normal"><strong>Key Points:</strong> {q.explanation}</p>
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Section C: Long Answers */}
                <div className="space-y-4 pt-4">
                  <h3 className="text-[#000099] font-black uppercase text-sm border-b border-slate-200 pb-1 tracking-wider">Section C: Long Answer Questions</h3>
                  
                  {questions.filter(q => q.type === 'LAQ').map((q, idx) => {
                    const isEditing = editingQId === q.id;
                    return (
                      <div key={q.id} className="group relative bg-slate-50/25 hover:bg-slate-50/70 p-3 rounded-lg border border-transparent hover:border-slate-200/50 transition-colors">
                        
                        {/* Hover Tools block */}
                        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-opacity">
                          <button
                            onClick={() => startEditing(q.id, q.text)}
                            className="p-1 text-slate-400 hover:text-[#000099] hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenSwapModal(q.id)}
                            className="p-1 text-slate-400 hover:text-[#FF9A01] hover:bg-slate-100 rounded cursor-pointer"
                            title="Swap with AI Alternative"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title & Question */}
                        <div className="flex gap-2">
                          <span className="font-black text-[#000099]">{idx + 1 + questions.filter(x => x.type === 'MCQ' || x.type === 'SAQ').length}.</span>
                          <div className="flex-grow space-y-3">
                            
                            {isEditing ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-[#000099] p-2 rounded focus:outline-none"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={saveEditedText} className="h-7 text-[10px] bg-[#000099] text-white">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingQId(null)} className="h-7 text-[10px] text-slate-500">Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <span className="font-semibold text-slate-800 leading-normal block pr-14">{q.text}</span>
                            )}

                            {/* Tags list */}
                            <div className="flex gap-2 pt-1">
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white">{q.bloomLevel}</Badge>
                              <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-amber-700 border-amber-200">{q.difficulty}</Badge>
                              {q.coCode && (
                                <Badge variant="outline" className="text-[9px] font-bold py-0 bg-white text-indigo-700 border-indigo-200">{q.coCode}</Badge>
                              )}
                              <span className="text-[10px] text-slate-400 font-semibold ml-auto">[{q.marks} Marks]</span>
                            </div>

                            {/* Answer Scheme details */}
                            {showAnswers && (
                              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg text-xs mt-3 space-y-1">
                                <span className="font-black text-emerald-800 block">Grading Rubrics Scheme:</span>
                                <p className="text-slate-600 font-semibold leading-normal"><strong>Detailed Steps:</strong> {q.explanation}</p>
                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

          </div>

          {/* Right Statistics & Review tools (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Paper alignment summary */}
            <Card className="border-[#E2E0D8] bg-white shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-[#E2E0D8] bg-slate-50/50 p-5">
                <CardTitle className="text-[#000099] text-base font-extrabold font-sans">Cognitive Alignment Audit</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 font-semibold mt-0.5">Bloom's Taxonomy distribution in active paper</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                
                {/* Bloom's levels bar checks */}
                <div className="space-y-3">
                  {[
                    { label: 'Remembering / Understanding', percent: blooms.remembering + blooms.understanding, color: 'bg-blue-600' },
                    { label: 'Applying / Analyzing', percent: blooms.applying + blooms.analyzing, color: 'bg-[#FF9A01]' },
                    { label: 'Evaluating / Creating', percent: blooms.evaluating + blooms.creating, color: 'bg-[#000099]' }
                  ].map(lvl => (
                    <div key={lvl.label} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-600">
                        <span>{lvl.label}</span>
                        <span className="text-slate-800">{lvl.percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`${lvl.color} h-full`} style={{ width: `${lvl.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Difficulty alignment bar checks */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <span className="block text-[10px] text-slate-400 uppercase font-black">Difficulty Alignment</span>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Easy Level', val: difficulty.easy, color: 'bg-emerald-500' },
                      { label: 'Medium Level', val: difficulty.medium, color: 'bg-amber-500' },
                      { label: 'Hard Level', val: difficulty.hard, color: 'bg-red-500' }
                    ].map(diff => (
                      <div key={diff.label} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-600">
                          <span>{diff.label}</span>
                          <span className="text-slate-800">{diff.val}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`${diff.color} h-full`} style={{ width: `${diff.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Publishing controls */}
            <Card className="border-[#E2E0D8] bg-[#000099] text-white shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Send className="w-5 h-5 text-[#FF9A01]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm block">Publish Assessment</span>
                    <span className="text-[10px] text-white/60 font-semibold block">Push to students or online classes</span>
                  </div>
                </div>
                
                <p className="text-[11px] text-white/80 leading-normal font-semibold">
                  Publish this generated question paper to active LMS classes for students to access on their schedule.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleSyncLms}
                    className="w-full bg-white hover:bg-slate-100 text-[#000099] font-black text-xs py-2.5 rounded-xl shadow transition-colors cursor-pointer text-center block"
                  >
                    Sync to edumerge LMS
                  </button>
                  
                  <button
                    onClick={() => {
                      setStep('setup');
                      showToast('Returned to parameter setup');
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer text-center block"
                  >
                    Re-configure parameters
                  </button>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}

      {/* SWAPPING ALTERNATIVES OVERLAY MODAL */}
      {swapTargetQId && (() => {
        const altList = alternativeQuestionsDb[swapTargetQId] || [defaultAlternative];
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white border border-[#E2E0D8] rounded-2xl shadow-2xl p-6 space-y-6 animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#000099]" />
                  <h3 className="font-black text-slate-800 text-sm">AI Suggested Alternative Questions</h3>
                </div>
                <button
                  onClick={() => setSwapTargetQId(null)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {altList.map((alt, altIdx) => (
                  <div 
                    key={alt.id}
                    onClick={() => handleExecuteSwap(alt)}
                    className="bg-slate-50 hover:bg-blue-50/30 border border-slate-200 hover:border-blue-200 p-4 rounded-xl cursor-pointer transition-all space-y-3 text-xs leading-normal group"
                  >
                    <div className="flex justify-between items-start font-bold">
                      <span className="text-[#000099]">Alternative Option {altIdx + 1}</span>
                      <span className="text-slate-400">[{alt.marks} Marks]</span>
                    </div>
                    
                    <p className="text-slate-700 font-semibold group-hover:text-slate-900">{alt.text}</p>
                    
                    {alt.options && (
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold pl-2 pt-1">
                        {alt.options.map((opt, oIdx) => (
                          <div key={opt}>
                            <span className="text-[#000099] font-black">{String.fromCharCode(65 + oIdx)}) </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <Badge className="bg-white text-slate-500 border border-slate-200 hover:bg-white text-[9px] py-0">{alt.bloomLevel}</Badge>
                      <Badge className="bg-white text-amber-700 border border-amber-200 hover:bg-white text-[9px] py-0">{alt.difficulty}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setSwapTargetQId(null)}
                  className="h-8 text-xs font-bold border-slate-200 text-slate-600 cursor-pointer"
                >
                  Cancel Swap
                </Button>
              </div>

            </div>
          </div>
        );
      })()}

    </Layout>
  );
}
