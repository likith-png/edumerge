import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
    MessageSquare,
    Brain,
    Users,
    GraduationCap,
    Star,
    CheckCircle2,
    TrendingUp,
    AlertTriangle,
    Search,
    ChevronRight,
    Download,
    Send,
    Award,
    ShieldCheck,
    Zap,
    Sparkles,
    ChevronLeft,
    TrendingDown,
    Activity,
    Compass,
    User
} from 'lucide-react';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell
} from 'recharts';

interface Candidate {
    id: string;
    name: string;
    dept: string;
    photo: string;
    selfScore: number;
    peerScore: number;
    studentScore: number;
    managerScore: number;
    overallScore: number;
    kpiScore: number;
    kraScore: number;
    complianceScore: number;
    radarData: any[];
    peerComments: { positive: string[]; constructive: string[] };
    studentComments: { positive: string[]; constructive: string[] };
    studentMetrics: { category: string; score: number }[];
    aiAnalysis: {
        strengths: string[];
        weaknesses: string[];
        roadmap: string[];
        generalSummary: string;
    };
    prebuiltAnswers: Record<string, string>;
}

const CANDIDATES: Record<string, Candidate> = {
    'reshma': {
        id: 'reshma',
        name: 'Ms. Reshma Binu Prasad',
        dept: 'Computer Science',
        photo: 'RP',
        selfScore: 4.2,
        peerScore: 4.6,
        studentScore: 4.5,
        managerScore: 4.7,
        overallScore: 4.6,
        kpiScore: 92,
        kraScore: 95,
        complianceScore: 100,
        radarData: [
            { subject: 'Pedagogical Precision', Self: 4.0, Peer: 4.5, Manager: 4.7 },
            { subject: 'Strategic Communication', Self: 3.5, Peer: 4.2, Manager: 4.0 },
            { subject: 'Teamwork Synergy', Self: 4.0, Peer: 4.8, Manager: 4.5 },
            { subject: 'Creative Innovation', Self: 4.5, Peer: 4.6, Manager: 4.8 },
            { subject: 'Conduct Integrity', Self: 5.0, Peer: 4.9, Manager: 5.0 }
        ],
        peerComments: {
            positive: [
                "Highly collaborative and always shares curriculum material. A great mentor for junior colleagues.",
                "Pioneered our LMS integration which led to a 15% increase in online student test completions."
            ],
            constructive: [
                "Can sometimes over-commit to multiple institutional committees, leading to minor bottleneck delays in exam grading sheets."
            ]
        },
        studentComments: {
            positive: [
                "Her coding lectures are incredibly clear. She relates every data structure concept to real-world apps.",
                "Extremely approachable. She hosted special weekend doubt-clearing sessions before finals."
            ],
            constructive: [
                "Paced the curriculum very fast in the last month to cover the final modules."
            ]
        },
        studentMetrics: [
            { category: 'Clarity of Concept', score: 4.7 },
            { category: 'Accessibility / Doubts', score: 4.8 },
            { category: 'Syllabus Coverage', score: 4.2 },
            { category: 'Evaluation Fairness', score: 4.5 }
        ],
        aiAnalysis: {
            strengths: [
                "Outstanding collaboration quotient (4.8/5.0 Peer rating).",
                "Advanced pedagogical execution via LMS digitization.",
                "Strong student relationship and out-of-class mentorship support."
            ],
            weaknesses: [
                "Time-management under heavy administrative load.",
                "Uneven curriculum delivery pacing toward the end of semester."
            ],
            roadmap: [
                "Attend Workshop: 'Effective Workload Delegation for Academic Leads' (July 2026).",
                "Utilize curriculum planning tools to space out syllabus deliverables evenly.",
                "Nominate for 'Best Digital Educator Award' in the upcoming annual cycle."
            ],
            generalSummary: "Ms. Reshma Binu Prasad is an exceptional educator displaying strong peer synergy and student approval ratings. Her performance indicators are highly aligned across all channels, demonstrating a high-trust baseline. Primary area of optimization is workload balancing."
        },
        prebuiltAnswers: {
            'peer': "According to peer observations, Ms. Reshma is recognized as a highly collaborative team player who excels in curriculum sharing and mentoring junior faculty. Peer rating sits at 4.6/5.0. The primary constructive comment suggests she tends to over-commit to administrative tasks, which can sometimes delay exam grading processing.",
            'roadmap': "AI recommends the following developmental steps for Ms. Reshma:\n1. Attend a Workload Management and Delegation seminar (July 2026) to manage administrative demands.\n2. Leverage automated scheduling calendars in the Edumerge LMS to distribute homework deliverables more evenly.\n3. Appoint her to lead the Digital Pedagogy FDP given her 4.8 Manager score in Creative Innovation.",
            'student': "Students rate Ms. Reshma highly at 4.5/5.0. Key strengths include outstanding concept clarity in computer science lectures and high accessibility during doubt sessions. The primary area for improvement is syllabus pacing, as several students noted that the final modules were rushed in the last three weeks."
        }
    },
    'sedhunivas': {
        id: 'sedhunivas',
        name: 'Dr. Sedhunivas',
        dept: 'Electronics',
        photo: 'SN',
        selfScore: 4.5,
        peerScore: 3.5,
        studentScore: 3.8,
        managerScore: 3.9,
        overallScore: 3.8,
        kpiScore: 78,
        kraScore: 82,
        complianceScore: 90,
        radarData: [
            { subject: 'Pedagogical Precision', Self: 4.5, Peer: 4.0, Manager: 4.1 },
            { subject: 'Strategic Communication', Self: 4.0, Peer: 3.8, Manager: 3.9 },
            { subject: 'Teamwork Synergy', Self: 3.0, Peer: 3.4, Manager: 3.5 },
            { subject: 'Creative Innovation', Self: 4.0, Peer: 3.5, Manager: 3.8 },
            { subject: 'Conduct Integrity', Self: 4.5, Peer: 4.4, Manager: 4.5 }
        ],
        peerComments: {
            positive: [
                "Dr. Sedhunivas exhibits deep subject matter expertise in VLSI design and microcontrollers.",
                "Maintains high standards of professional conduct and absolute punctuality."
            ],
            constructive: [
                "Hesitant to participate in departmental curriculum development committees or join interdisciplinary research pods."
            ]
        },
        studentComments: {
            positive: [
                "Extremely knowledgeable in semiconductor physics. You will learn a lot if you pay close attention.",
                "His class starts exactly on time and has zero disruptions."
            ],
            constructive: [
                "Very strict grading policies with minimal partial marks.",
                "Lecture slides are text-heavy and feel outdated. Doesn't use digital circuit simulators during class."
            ]
        },
        studentMetrics: [
            { category: 'Clarity of Concept', score: 4.2 },
            { category: 'Accessibility / Doubts', score: 3.4 },
            { category: 'Syllabus Coverage', score: 4.6 },
            { category: 'Evaluation Fairness', score: 3.1 }
        ],
        aiAnalysis: {
            strengths: [
                "Exemplary subject expertise (VLSI/Semiconductor physics).",
                "High professional discipline and punctuality (4.5/5.0 Conduct).",
                "Structured and complete syllabus coverage."
            ],
            weaknesses: [
                "Low teamwork synergy and collaborative alignment with department (3.4/5.0).",
                "Rigid evaluation methods and perceived lack of empathy by students.",
                "Outdated lecture slides with low digital interactive media adoption."
            ],
            roadmap: [
                "Enroll in 'Collaborative Research Design' interdisciplinary program (August 2026).",
                "Update lecture presentation templates to integrate active circuit simulations (Multisim).",
                "Establish clear, rubrics-based grading rules to alleviate student anxiety about grading fairness."
            ],
            generalSummary: "Dr. Sedhunivas is a disciplined scholar with strong core domain knowledge. However, there is a clear self-perception gap (Self rating: 4.5 vs Peer: 3.5). The assessment recommends fostering active teamwork and modernizing lecture delivery modes."
        },
        prebuiltAnswers: {
            'peer': "Peer feedback reveals that while Dr. Sedhunivas possesses high domain knowledge, his collaboration score is a low 3.4/5.0. Peers indicate he keeps to himself and rarely contributes to shared curriculum enhancements or inter-departmental research projects.",
            'roadmap': "AI recommends the following developmental roadmap for Dr. Sedhunivas:\n1. Formally join at least one departmental event organization committee in the upcoming semester.\n2. Participate in professional training on modern pedagogical simulator tools (like Multisim/Proteus).\n3. Revise course evaluation guidelines with transparent rubrics to increase student scoring clarity.",
            'student': "Students rate Dr. Sedhunivas at 3.8/5.0. While appreciating his subject expertise and punctuality, students consistently raise concerns about strict grading (Evaluation Fairness: 3.1) and outdated, text-heavy slide lectures. He is encouraged to introduce interactive digital media into class."
        }
    }
};

const Feedback360Analysis: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCand, setSelectedCand] = useState<string>('reshma');
    const cand = CANDIDATES[selectedCand];

    // AI Analysis simulation state
    const [aiRunState, setAiRunState] = useState<'idle' | 'running' | 'completed'>('idle');
    const [aiProgress, setAiProgress] = useState(0);
    const [aiLogs, setAiLogs] = useState<string[]>([]);
    
    // Chat window states
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState<any[]>([
        { id: '1', role: 'bot', text: 'Hello! I am the Edumerge AI feedback analyst. Click any preset questions below or type a query about Reshma\'s feedback profile to begin.', time: '11:26 AM' }
    ]);
    
    // Active tabs: 'staff' | 'student' | 'appraisal'
    const [activeTab, setActiveTab] = useState<'staff' | 'student' | 'appraisal'>('staff');

    // Action plan feedback trigger
    const [addedPlans, setAddedPlans] = useState<string[]>([]);

    const terminalRef = useRef<HTMLDivElement>(null);

    // Auto-scroll AI logs terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [aiLogs]);

    // Reset Chat whenever candidate changes
    useEffect(() => {
        setChatMessages([
            {
                id: '1',
                role: 'bot',
                text: `Hello! I am the Edumerge AI feedback analyst. Click any preset questions below or type a query to analyze ${cand.name}'s 360 feedback profile.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        setAiRunState('idle');
        setAiLogs([]);
        setAiProgress(0);
    }, [selectedCand]);

    const runAiAnalysis = () => {
        if (aiRunState === 'running') return;
        setAiRunState('running');
        setAiProgress(0);
        setAiLogs([]);

        const steps = [
            `Importing multi-rater datasets for ${cand.name}...`,
            'Cross-analyzing self-reflections (Self Score) vs. peer logs...',
            'Calculating student sentiment metrics across 4 semesters...',
            'Mining qualitative feedback texts for key recurring themes...',
            'Evaluating manager audit directives & appraisal integrations...',
            'Formulating developmental roadmap plan items...',
            'Analysis complete. AI Synthesis locked.'
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < steps.length) {
                const now = new Date();
                const timeStr = now.toLocaleTimeString([], { hour12: false });
                setAiLogs(prev => [...prev, `[${timeStr}] ${steps[index]}`]);
                setAiProgress(Math.round(((index + 1) / steps.length) * 100));
                index++;
            } else {
                clearInterval(interval);
                setAiRunState('completed');
            }
        }, 500);
    };

    // Chat presets click handler
    const handlePresetClick = (type: 'peer' | 'student' | 'roadmap') => {
        const questionText = type === 'peer' ? "Summarize peer suggestions"
                            : type === 'student' ? "Analyze student feedback concerns"
                            : "Draft professional development roadmap";
        
        const answerText = cand.prebuiltAnswers[type];

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: questionText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, userMsg]);

        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: answerText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    // Custom chat submit handler
    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, userMsg]);
        const query = chatInput.toLowerCase();
        setChatInput('');

        setTimeout(() => {
            let botText = `I have analyzed the 360 feedback database for ${cand.name}. `;
            if (query.includes('peer') || query.includes('colleague') || query.includes('staff')) {
                botText += cand.prebuiltAnswers['peer'];
            } else if (query.includes('student') || query.includes('teach') || query.includes('class')) {
                botText += cand.prebuiltAnswers['student'];
            } else if (query.includes('roadmap') || query.includes('grow') || query.includes('improve') || query.includes('development')) {
                botText += cand.prebuiltAnswers['roadmap'];
            } else {
                botText += `Based on the records, ${cand.name} holds an overall 360 feedback rating of ${cand.overallScore}/5.0 (Self: ${cand.selfScore}, Peer: ${cand.peerScore}, Student: ${cand.studentScore}, Manager: ${cand.managerScore}). Please ask specifically about peer alignment, student surveys, or her developmental roadmap.`;
            }

            const botMsg = {
                id: (Date.now() + 1).toString(),
                role: 'bot',
                text: botText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, botMsg]);
        }, 800);
    };

    // Add action item to plan handler
    const addToDevelopmentPlan = (item: string) => {
        if (addedPlans.includes(item)) return;
        setAddedPlans(prev => [...prev, item]);
        alert(`🎯 "${item}" has been pushed to Reshma's Active Professional Development Plan.`);
    };

    return (
        <Layout
            title="360° Feedback AI Intelligence"
            description="Neural multi-channel feedback summaries mapping peer review, student surveys, and performance appraisals."
            icon={Brain}
            showBack={true}
            headerActions={
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:inline">Select Candidate Profile</span>
                    <select
                        value={selectedCand}
                        onChange={(e) => setSelectedCand(e.target.value)}
                        className="h-10 border border-slate-200 bg-white rounded-xl text-slate-700 text-xs px-3 font-extrabold focus:outline-none"
                    >
                        <option value="reshma">Ms. Reshma Binu Prasad (CS)</option>
                        <option value="sedhunivas">Dr. Sedhunivas (ECE)</option>
                    </select>
                </div>
            }
        >
            <div className="space-y-8 pb-20 animate-in fade-in duration-500">
                {/* Candidate Overview Card */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-950 rounded-2xl p-6 md:p-8 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-extrabold text-2xl shadow-inner">
                                {cand.photo}
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-extrabold tracking-tight">{cand.name}</h2>
                                    <Badge className="bg-indigo-500 text-white border-none text-[8px] font-bold uppercase tracking-wider py-0.5 px-2">FACULTY</Badge>
                                </div>
                                <p className="text-indigo-200 text-xs font-semibold">Department of {cand.dept} • AY 2024-2025 Cycle</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/5 shrink-0 text-center">
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Self Score</span>
                                <span className="text-lg font-bold text-slate-200">{cand.selfScore} <span className="text-[10px] text-slate-400">/5</span></span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Peer Avg</span>
                                <span className="text-lg font-bold text-slate-200">{cand.peerScore} <span className="text-[10px] text-slate-400">/5</span></span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Student Survey</span>
                                <span className="text-lg font-bold text-slate-200">{cand.studentScore} <span className="text-[10px] text-slate-400">/5</span></span>
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Manager Score</span>
                                <span className="text-lg font-bold text-indigo-400">{cand.managerScore} <span className="text-[10px] text-slate-400">/5</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Core Synthesis Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Simulator Control & Terminal */}
                    <Card className="rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[420px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4 text-indigo-600" />
                                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">AI Feedback Aggregator</h3>
                            </div>
                            {aiRunState === 'running' && (
                                <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[8px] uppercase tracking-wider animate-pulse rounded-full">
                                    Synthesizing...
                                </Badge>
                            )}
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                                    Aggregate raw student surveys, peer assessments, self reviews, and HOD notes. Running the engine outputs structured insights and developmental paths.
                                </p>

                                <div
                                    ref={terminalRef}
                                    className="h-44 bg-slate-950 rounded-xl p-3 font-mono text-[9px] text-indigo-300 overflow-y-auto space-y-2 border border-slate-900 shadow-inner no-scrollbar"
                                >
                                    {aiLogs.length === 0 ? (
                                        <div className="text-slate-500 flex flex-col items-center justify-center h-full gap-2 text-center">
                                            <Sparkles className="w-8 h-8 opacity-20 text-indigo-400" />
                                            <span className="font-bold text-[10px] uppercase tracking-wider animate-pulse">Awaiting Synthesis Command</span>
                                        </div>
                                    ) : (
                                        aiLogs.map((log, i) => (
                                            <div key={i} className="leading-relaxed border-l-2 border-indigo-500/30 pl-2">
                                                {log}
                                            </div>
                                        ))
                                    )}
                                    {aiRunState === 'running' && (
                                        <div className="text-emerald-400 animate-pulse flex items-center gap-1 mt-2 pl-2">
                                            <span>&gt; Processing dataset nodes...</span>
                                            <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-[ping_1s_infinite]"></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                onClick={runAiAnalysis}
                                disabled={aiRunState === 'running'}
                                className={`w-full mt-4 h-11 font-bold rounded-xl gap-2 shadow-sm text-xs uppercase tracking-wider transition-all ${
                                    aiRunState === 'running' ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800'
                                }`}
                            >
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                {aiRunState === 'running' ? `Analyzing (${aiProgress}%)` : aiRunState === 'completed' ? 'Re-Run AI Analysis' : 'Run AI 360 Analysis'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Chatbot Console */}
                    <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col h-[420px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-indigo-600" />
                            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Ask AI Feedback Assistant</h3>
                        </div>
                        <CardContent className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
                            {/* Messages display */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 no-scrollbar">
                                {chatMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                                            msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'
                                        }`}>
                                            {msg.role === 'user' ? 'U' : <Brain className="w-4 h-4" />}
                                        </div>
                                        <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                                            msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none whitespace-pre-line leading-relaxed'
                                        }`}>
                                            <p className="font-semibold">{msg.text}</p>
                                            <span className={`text-[8px] font-bold block text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {msg.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Preset triggers & Custom input */}
                            <div className="space-y-3 pt-3 border-t border-slate-100 bg-white">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handlePresetClick('peer')}
                                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all"
                                    >
                                        Peer Summary
                                    </button>
                                    <button
                                        onClick={() => handlePresetClick('student')}
                                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all"
                                    >
                                        Student Highlights
                                    </button>
                                    <button
                                        onClick={() => handlePresetClick('roadmap')}
                                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[9px] uppercase tracking-wider transition-all"
                                    >
                                        AI Growth Plan
                                    </button>
                                </div>

                                <form onSubmit={handleChatSubmit} className="flex gap-2">
                                    <Input
                                        placeholder={`Ask about ${cand.name.split(' ').slice(-1)[0]}'s feedback trends...`}
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        className="h-10 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-indigo-500/20"
                                    />
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-4">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sub-tab selection */}
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                    <button
                        onClick={() => setActiveTab('staff')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                            activeTab === 'staff'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                        <Users className="w-4 h-4" /> Staff & Peer Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('student')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                            activeTab === 'student'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4" /> Student Pulse Analysis
                    </button>
                    <button
                        onClick={() => setActiveTab('appraisal')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                            activeTab === 'appraisal'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                        <Star className="w-4 h-4" /> Appraisal Integration
                    </button>
                </div>

                {/* TAB CONTENTS */}
                {activeTab === 'staff' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        {/* Radar competency chart */}
                        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex flex-col h-[400px]">
                            <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Competency Alignment Grid</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Comparing ratings across peers, self, and manager</p>
                            </div>
                            
                            <div className="flex-1 min-h-0 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={cand.radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} tickLine={false} />
                                        <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#cbd5e1" fontSize={8} />
                                        
                                        <Radar name="Self Assessment" dataKey="Self" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                        <Radar name="Peer Review Avg" dataKey="Peer" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} />
                                        <Radar name="Manager Audit" dataKey="Manager" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                                        
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                                        <Tooltip 
                                            contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Peer Comments summary */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex flex-col justify-between h-[400px]">
                            <div className="space-y-4 overflow-y-auto no-scrollbar">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Staff & Peer Qualitative Echo</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Anonymized comments collected from colleagues</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Strengths & Synergy Highlights</span>
                                        {cand.peerComments.positive.map((comment, i) => (
                                            <div key={i} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[11px] text-slate-700 italic font-medium leading-relaxed">
                                                "{comment}"
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">Constructive Growth Observations</span>
                                        {cand.peerComments.constructive.map((comment, i) => (
                                            <div key={i} className="p-3 bg-amber-50/40 border border-amber-100/70 rounded-xl text-[11px] text-slate-700 italic font-medium leading-relaxed">
                                                "{comment}"
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mt-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Identity Protected under HR policy
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'student' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        {/* Student Metrics chart */}
                        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex flex-col h-[400px]">
                            <div className="mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Student Survey Performance Metrics</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Average score per class evaluation parameter</p>
                            </div>

                            <div className="flex-grow min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cand.studentMetrics} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 5 }}>
                                        <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <YAxis type="category" dataKey="category" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            contentStyle={{ background: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }}
                                            cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }}
                                            formatter={(value) => [`${value} / 5.0`, 'Rating']}
                                        />
                                        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={20}>
                                            {cand.studentMetrics.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.score >= 4.5 ? '#10b981' : entry.score >= 4.0 ? '#6366f1' : '#f59e0b'} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Student Comments */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 flex flex-col justify-between h-[400px]">
                            <div className="space-y-4 overflow-y-auto no-scrollbar">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Classroom Survey Sentiment</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Aggregated student opinions and concerns</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">Positive Highlights</span>
                                        {cand.studentComments.positive.map((comment, i) => (
                                            <div key={i} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[11px] text-slate-700 italic font-medium leading-relaxed">
                                                "{comment}"
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">Areas of Concern</span>
                                        {cand.studentComments.constructive.map((comment, i) => (
                                            <div key={i} className="p-3 bg-amber-50/40 border border-amber-100/70 rounded-xl text-[11px] text-slate-700 italic font-medium leading-relaxed">
                                                "{comment}"
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5 mt-2">
                                <GraduationCap className="w-4 h-4 text-indigo-500" /> Stakeholder Survey Verification
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'appraisal' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        {/* Appraisal breakdown formula */}
                        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm bg-white p-6 space-y-6 flex flex-col justify-between">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-sm">Appraisal Index Builder</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Calculated total contribution based on institutional weightages</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">KRA Score (40%)</span>
                                    <span className="text-2xl font-bold text-slate-900">{cand.kraScore}%</span>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">+38.0 Pts Contribution</span>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">KPI Score (30%)</span>
                                    <span className="text-2xl font-bold text-slate-900">{cand.kpiScore}%</span>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">+27.6 Pts Contribution</span>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">360° Feedback (20%)</span>
                                    <span className="text-2xl font-bold text-indigo-600">{(cand.overallScore * 20).toFixed(0)}%</span>
                                    <span className="text-[9px] font-bold text-indigo-400 block mt-1">+18.4 Pts Contribution</span>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-1">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Compliance (10%)</span>
                                    <span className="text-2xl font-bold text-slate-900">{cand.complianceScore}%</span>
                                    <span className="text-[9px] font-bold text-slate-400 block mt-1">+10.0 Pts Contribution</span>
                                </div>
                            </div>

                            <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-indigo-900 text-sm uppercase">Total Appraisal Index Score</h4>
                                    <p className="text-[10px] text-indigo-700 font-semibold leading-relaxed">Sum total of KRA, KPI, Multi-Rater Sentiment, and NAAC/AICTE statutory compliance.</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-3xl font-extrabold text-indigo-900 tracking-tight">{(38.0 + 27.6 + 18.4 + 10.0).toFixed(1)} / 100</div>
                                    <Badge className="bg-indigo-600 text-white text-[9px] font-bold mt-1.5 uppercase tracking-wider">OUTSTANDING (A+)</Badge>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => alert("Report exported!")} variant="outline" className="flex-1 h-11 font-bold text-[10px] uppercase tracking-widest border-slate-200 text-slate-600 gap-2">
                                    <Download className="w-4 h-4" /> Export Appraisal Summary
                                </Button>
                                <Button onClick={() => alert("Index committed to server!")} className="flex-1 h-11 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 shadow-md">
                                    Commit Appraisal Score
                                </Button>
                            </div>
                        </Card>

                        {/* AI Growth Action Plan */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6 space-y-6 flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-sm">AI Developmental Blueprint</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Personalized recommendations for growth</p>
                                </div>

                                <div className="space-y-3">
                                    {cand.aiAnalysis.roadmap.map((item, idx) => {
                                        const isAdded = addedPlans.includes(item);
                                        return (
                                            <div key={idx} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between gap-3">
                                                <div className="flex items-start gap-2.5">
                                                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-[10px] text-indigo-600 shrink-0 mt-0.5">
                                                        {idx + 1}
                                                    </span>
                                                    <p className="text-[11px] text-slate-700 leading-relaxed font-semibold">{item}</p>
                                                </div>
                                                <button
                                                    onClick={() => addToDevelopmentPlan(item)}
                                                    disabled={isAdded}
                                                    className={`h-8 w-full rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 ${
                                                        isAdded 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                            : 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100'
                                                    }`}
                                                >
                                                    {isAdded ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Added to Dev Plan
                                                        </>
                                                    ) : (
                                                        'Add to Development Plan'
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-950 font-medium text-[10px] leading-relaxed flex items-start gap-2.5">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block uppercase tracking-wider text-amber-800">Compliance Warning</strong>
                                    All Growth items must be scheduled within 30 days to stay compliant with NAAC Criterion 6 (Faculty Development).
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Feedback360Analysis;
