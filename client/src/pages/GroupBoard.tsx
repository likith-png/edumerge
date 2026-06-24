import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { 
  Building2, GraduationCap, BookOpen, AlertTriangle, ShieldAlert, CheckCircle2,
  TrendingUp, Users, ArrowUpRight, Search, Check, X, Send, Calendar, Settings,
  MapPin, Sparkles, RefreshCw, BarChart2, Laptop, Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Institution {
  name: string;
  location: string;
  status: 'Active' | 'Pilot' | 'Prospect' | 'High-Priority';
  university?: string; // Grouping parent university
  details?: string;
}

interface SegmentData {
  id: string;
  title: string;
  subtitle: string;
  count: string;
  countVal: number;
  percentage: string;
  supportStatus: 'Fully Supported' | 'NOT Supported';
  avgStudents: string;
  gradStart: string;
  gradEnd: string;
  characteristics: { label: string; value: string }[];
  features: { name: string; type: 'yes' | 'partial' | 'no' }[];
  institutions: Institution[];
}

export default function GroupBoard() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'current' | 'gap'>('all');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('affiliated');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Dialog States
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [proposalInstName, setProposalInstName] = useState('');
  const [proposalConfig, setProposalConfig] = useState({
    multiCampus: true,
    customDegree: true,
    flexibleId: true,
    arrBid: '5.5 Lakhs/yr'
  });

  const [showMeetingDialog, setShowMeetingDialog] = useState(false);
  const [meetingInstName, setMeetingInstName] = useState('');
  const [meetingDate, setMeetingDate] = useState('2026-06-25');
  const [meetingNotes, setMeetingNotes] = useState('Discussing multi-campus database architecture and UGC Section 3 regulatory requirements.');

  // RoadMap Simulator state
  const [simulatedGapsSolved, setSimulatedGapsSolved] = useState({
    studentId: false,
    degreeAuthority: false,
    examBoard: false,
    multiCampus: false,
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Initialise Higher-Ed Segments Data (Schools K-12 completely removed)
  const segments: Record<string, SegmentData> = {
    affiliated: {
      id: 'affiliated',
      title: 'Affiliated Colleges',
      subtitle: 'Colleges affiliated to regional public universities',
      count: '40',
      countVal: 40,
      percentage: '29.6%',
      supportStatus: 'Fully Supported',
      avgStudents: '1,000 - 3,000',
      gradStart: 'from-indigo-500',
      gradEnd: 'to-purple-600',
      characteristics: [
        { label: 'Degree Authority', value: 'Parent University (e.g. VTU, AKTU, Pune University)' },
        { label: 'Typical Structure', value: 'Bachelor\'s (UG) + Master\'s (PG) degrees' },
        { label: 'Governance', value: 'Principal + College Management + Board' },
        { label: 'Exams & Assessment', value: 'University term-end exams, local internal assessments' },
        { label: 'Affiliation Regulation', value: 'Governed by Parent University Rules & UGC norms' },
        { label: 'Student ID Model', value: 'Parent University USN/Registration format enforced' }
      ],
      features: [
        { name: 'Student Lifecycle Enrollment & DigiLocker transfers', type: 'yes' },
        { name: 'Exam Mark Entry mapped to parent university schedules', type: 'yes' },
        { name: 'Transcript Template generation (University authorized)', type: 'yes' },
        { name: 'LMS course authoring & syllabus management', type: 'yes' },
        { name: 'College Fee Ledger & hostel billing structure', type: 'yes' },
        { name: 'Staff HR & Faculty workload tracking', type: 'yes' },
        { name: 'NAAC Criteria 5 mentoring and Criterion 6 governance audits', type: 'partial' }
      ],
      institutions: [
        { name: 'Sir M. Visvesvaraya Institute of Tech', location: 'Bengaluru, Karnataka', status: 'Active', university: 'Visvesvaraya Technological University (VTU)' },
        { name: 'Nitte Meenakshi Inst of Tech (Affiliated Era)', location: 'Bengaluru, Karnataka', status: 'Active', university: 'Visvesvaraya Technological University (VTU)' },
        { name: 'Sambhram Institute of Technology', location: 'Chikbanavara, Karnataka', status: 'Active', university: 'Visvesvaraya Technological University (VTU)' },
        { name: 'Acharya Institute of Graduate Studies', location: 'Bengaluru, Karnataka', status: 'Active', university: 'Bangalore University (BU)' },
        { name: 'RNS Institute of Technology', location: 'Rajarajeshwari Nagar, Bengaluru', status: 'Pilot', university: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)' }
      ]
    },
    autonomous: {
      id: 'autonomous',
      title: 'Autonomous Colleges',
      subtitle: 'Colleges with academic autonomy but degrees issued by parent university',
      count: '35',
      countVal: 35,
      percentage: '25.9%',
      supportStatus: 'Fully Supported',
      avgStudents: '2,000 - 4,000',
      gradStart: 'from-cyan-500',
      gradEnd: 'to-teal-600',
      characteristics: [
        { label: 'Autonomy Status', value: 'Syllabus design, custom exam timetables & internal grading freedom' },
        { label: 'Degree Authority', value: 'Still parent university (not independent degree awarding)' },
        { label: 'Governance', value: 'Governing Board + Academic Council + HOD reviews' },
        { label: 'Accreditation', value: 'NAAC assessment mandatory to retain autonomy status' },
        { label: 'Syllabus Mappings', value: 'Supports NEP-compliant credit structures' },
        { label: 'Student ID Model', value: 'Uses parent university format prefix' }
      ],
      features: [
        { name: 'Custom autonomous curriculum structure & syllabus designer', type: 'yes' },
        { name: 'Independent exam setting, valuation, & rubrics registry', type: 'yes' },
        { name: 'Marks card and GPA calculations (autonomy scales)', type: 'yes' },
        { name: 'NEP credit bank transfers & DigiLocker sync', type: 'yes' },
        { name: 'NAAC Criterion-wise compliance tracker & gap predictor', type: 'yes' },
        { name: 'Research publication and grant allocation dashboards', type: 'yes' },
        { name: 'Multi-campus registration and shared databases', type: 'partial' }
      ],
      institutions: [
        { name: 'New Horizon College of Engineering', location: 'Outer Ring Road, Bengaluru', status: 'Active', university: 'Visvesvaraya Technological University (VTU)', details: 'Contact: Manjula' },
        { name: 'Nitte Meenakshi Inst of Tech (Autonomous)', location: 'Yelahanka, Bengaluru', status: 'Active', university: 'Visvesvaraya Technological University (VTU)' },
        { name: 'PES College of Engineering (Autonomous)', location: 'Mandya, Karnataka', status: 'Active', university: 'Visvesvaraya Technological University (VTU)' },
        { name: 'Garden City College (Autonomous)', location: 'K R Puram, Bengaluru', status: 'Active', university: 'Bangalore University (BU)' },
        { name: 'Acharya Bangalore B-School (ABBS)', location: 'Magadi Road, Bengaluru', status: 'Active', university: 'Bangalore University (BU)' },
        { name: 'Jain College (Autonomous Centers)', location: 'Jayanagar, Karnataka', status: 'Active', university: 'Jain University' }
      ]
    },
    deemed: {
      id: 'deemed',
      title: 'Deemed Universities',
      subtitle: 'Self-degree-awarding universities recognized under UGC Section 3',
      count: '40+',
      countVal: 40,
      percentage: '29.6% TAM',
      supportStatus: 'NOT Supported',
      avgStudents: '5,000 - 15,000',
      gradStart: 'from-orange-500',
      gradEnd: 'to-amber-600',
      characteristics: [
        { label: 'Degree Authority', value: 'SELF (issues and prints independent degree certificates)' },
        { label: 'Legal Foundation', value: 'Declared under Section 3 of UGC Act 1956' },
        { label: 'Multi-Campus footprint', value: 'Often have 2-5+ campuses across states (e.g. BITS, Manipal)' },
        { label: 'Governance', value: 'Board of Management + Academic Syndicate + Finance Committee' },
        { label: 'Exam Board', value: 'Internal Board of Examinations reporting to Vice-Chancellor' },
        { label: 'Roster Scale', value: 'Extremely high volume. Requires multi-tenancy configurations' }
      ],
      features: [
        { name: 'Independent student ID generation (assumes parent structure)', type: 'no' },
        { name: 'Self-degree award modeling (assumes parent university authority)', type: 'no' },
        { name: 'Autonomous multi-campus student records segregation', type: 'no' },
        { name: 'UGC-compliant syllabus credit schemes and evaluation', type: 'partial' },
        { name: 'Multi-campus database isolation & shared administrative roles', type: 'no' },
        { name: 'Independent Transcript and Provisional Certificate layouts', type: 'no' },
        { name: 'AISHE classification registry (registers as university status)', type: 'no' }
      ],
      institutions: [
        { name: 'BITS Pilani (Pilani, Goa, Hyd, Dubai)', location: 'Rajasthan / Goa / Telangana / UAE', status: 'High-Priority' },
        { name: 'Manipal Academy of Higher Education (MAHE)', location: 'Manipal / Bengaluru / Dubai', status: 'Prospect' },
        { name: 'Vellore Institute of Technology (VIT)', location: 'Vellore / Chennai / Bhopal / AP', status: 'Prospect' },
        { name: 'Nirma University', location: 'Ahmedabad, Gujarat', status: 'Prospect' },
        { name: 'SRM Institute of Science and Tech', location: 'Chennai, Tamil Nadu', status: 'Prospect' },
        { name: 'Gangubai University (Gandosava)', location: 'Karnataka (State Deemed Project)', status: 'High-Priority' }
      ]
    },
    private: {
      id: 'private',
      title: 'Private Universities',
      subtitle: 'Unitary universities established under state private university acts',
      count: '20+',
      countVal: 20,
      percentage: '14.8% TAM',
      supportStatus: 'NOT Supported',
      avgStudents: '3,000 - 10,000',
      gradStart: 'from-rose-500',
      gradEnd: 'to-red-600',
      characteristics: [
        { label: 'Degree Authority', value: 'SELF (awards state-approved independent degrees)' },
        { label: 'Regulatory Enactment', value: 'State Legislature Act, UGC Private University Rules' },
        { label: 'Governance', value: 'Chancellor + Governing Body + Board of Management' },
        { label: 'Exams & Valuation', value: 'Own Controller of Examinations (CoE) framework' },
        { label: 'Credit Structuring', value: 'Fully autonomous CBCS and program choices' },
        { label: 'Tenancy Requirement', value: 'Unified software with distinct sub-school registries' }
      ],
      features: [
        { name: 'Self-degree award workflows & ledger configurations', type: 'no' },
        { name: 'Student ID customization without parent university code', type: 'no' },
        { name: 'Controller of Examinations (CoE) workflow isolation', type: 'no' },
        { name: 'Multi-school support (School of Law, School of Eng, etc.)', type: 'partial' },
        { name: 'UGC compliant graduation templates & transcript models', type: 'no' },
        { name: 'NAAC SSR audit reporting for University level assessments', type: 'partial' }
      ],
      institutions: [
        { name: 'Lovely Professional University (LPU)', location: 'Phagwara, Punjab', status: 'Prospect' },
        { name: 'OP Jindal Global University', location: 'Sonipat, Haryana', status: 'Prospect' },
        { name: 'Symbiosis International University', location: 'Pune, Maharashtra', status: 'Prospect' },
        { name: 'FLAME University', location: 'Pune, Maharashtra', status: 'Prospect' },
        { name: 'Alliance University', location: 'Anekal, Bengaluru', status: 'Prospect' }
      ]
    }
  };

  // 2. Filter logic for the horizontal funnel rows
  const filteredSegmentIds = useMemo(() => {
    if (activeFilter === 'all') return Object.keys(segments);
    if (activeFilter === 'current') return ['affiliated', 'autonomous'];
    if (activeFilter === 'gap') return ['deemed', 'private'];
    return Object.keys(segments);
  }, [activeFilter]);

  // Keep selected segment updated if the filter excludes it
  React.useEffect(() => {
    if (!filteredSegmentIds.includes(selectedSegmentId)) {
      setSelectedSegmentId(filteredSegmentIds[0] || 'affiliated');
    }
  }, [filteredSegmentIds, selectedSegmentId]);

  const selectedSegment = segments[selectedSegmentId];

  // 3. Group institutions by parent university (UGC Governing bodies) for college segments
  const groupedInstitutions = useMemo(() => {
    if (!selectedSegment) return {};
    
    // Colleges have parent universities; Deemed and Private universities are independent
    const isCollegeSegment = selectedSegment.id === 'affiliated' || selectedSegment.id === 'autonomous';
    
    const matched = selectedSegment.institutions.filter(inst => {
      const q = searchTerm.toLowerCase();
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.location.toLowerCase().includes(q) ||
        (inst.university && inst.university.toLowerCase().includes(q))
      );
    });

    if (!isCollegeSegment) {
      return { "": matched }; // Group all under single empty key for flat view
    }

    // Group colleges by parent university
    const groups: Record<string, Institution[]> = {};
    matched.forEach(inst => {
      const uni = inst.university || 'Other Parent Universities';
      if (!groups[uni]) {
        groups[uni] = [];
      }
      groups[uni].push(inst);
    });
    return groups;
  }, [selectedSegment, searchTerm]);

  // 4. Calculate simulated metrics based on what gaps are marked as "solved" in the roadmap simulator
  const simOpportunityGap = useMemo(() => {
    let baseGap = 60; // 40 Deemed + 20 Private
    let baseARRMin = 1.5; // Rs. 1.5 Cr
    let baseARRMax = 3.0; // Rs. 3.0 Cr
    let baseSupported = 75; // 40 Affiliated + 35 Autonomous

    let pctSolved = 0;
    if (simulatedGapsSolved.studentId) pctSolved += 25;
    if (simulatedGapsSolved.degreeAuthority) pctSolved += 30;
    if (simulatedGapsSolved.examBoard) pctSolved += 20;
    if (simulatedGapsSolved.multiCampus) pctSolved += 25;

    const countSolved = Math.round((baseGap * pctSolved) / 100);
    
    return {
      gapCount: baseGap - countSolved,
      supportedCount: baseSupported + countSolved,
      arrOpened: ((baseARRMax * pctSolved) / 100).toFixed(1),
      arrRemaining: (baseARRMax - (baseARRMax * pctSolved) / 100).toFixed(1)
    };
  }, [simulatedGapsSolved]);

  // Data for Recharts TAM distribution
  const chartData = useMemo(() => {
    return Object.values(segments).map(seg => ({
      name: seg.title,
      value: seg.countVal,
      color: seg.id === 'affiliated' ? '#8b5cf6' :
             seg.id === 'autonomous' ? '#06b6d4' :
             seg.id === 'deemed' ? '#f59e0b' : '#f43f5e'
    }));
  }, []);

  const handleSendProposal = (instName: string) => {
    setProposalInstName(instName);
    setShowProposalDialog(true);
  };

  const handleConfirmProposal = () => {
    setShowProposalDialog(false);
    triggerToast(`Custom Proposal & Technical Architecture documents dispatched to ${proposalInstName}`);
  };

  const handleConveneMeeting = (instName: string) => {
    setMeetingInstName(instName);
    setShowMeetingDialog(true);
  };

  const handleConfirmMeeting = () => {
    setShowMeetingDialog(false);
    triggerToast(`Statutory integration consultation scheduled with ${meetingInstName} for ${new Date(meetingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`);
  };

  const resetSimulator = () => {
    setSimulatedGapsSolved({
      studentId: false,
      degreeAuthority: false,
      examBoard: false,
      multiCampus: false,
    });
    triggerToast("Roadmap simulation reset to platform baseline.");
  };

  return (
    <Layout
      title="Institution Funnel View"
      description="Higher Ed Market Segmentation, Support Gaps & University Roster"
      icon={Building2}
      showHome={true}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border border-white/10 text-white text-xs font-semibold py-3 px-5 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner Control Header */}
      <div className="mb-6 p-6 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            GOI Executive Group Board
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing market capitalization and architectural alignment across 135 target higher education institutions.
          </p>
        </div>

        {/* Filters buttons */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl text-xs font-semibold border border-slate-200/40 w-full md:w-auto overflow-x-auto shrink-0 no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all shrink-0 whitespace-nowrap ${activeFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Higher Ed (135)
          </button>
          <button
            onClick={() => setActiveFilter('current')}
            className={`px-4 py-2 rounded-lg transition-all shrink-0 whitespace-nowrap ${activeFilter === 'current' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Supported Colleges (75)
          </button>
          <button
            onClick={() => setActiveFilter('gap')}
            className={`px-4 py-2 rounded-lg transition-all shrink-0 whitespace-nowrap ${activeFilter === 'gap' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Market Gap (60)
          </button>
        </div>
      </div>

      {/* Grid 1: Total Market Opportunity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Total TAM Box */}
        <Card className="border-slate-200/80 bg-white/80 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-emerald-500/10 transition-colors pointer-events-none">
            <Building2 className="w-16 h-16" />
          </div>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Higher Ed TAM</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">135</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Colleges & Universities</span>
              <span className="font-semibold text-slate-700">100% of TAM</span>
            </div>
          </CardContent>
        </Card>

        {/* Supported Roster Box */}
        <Card className="border-slate-200/80 bg-white/80 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-indigo-500/10 transition-colors pointer-events-none">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supported Colleges</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">
                {simOpportunityGap.supportedCount}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Affiliated & Autonomous</span>
              <span className="font-bold text-emerald-600">
                {Math.round((simOpportunityGap.supportedCount / 135) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Market Gap Box */}
        <Card className="border-slate-200/80 bg-white/80 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-amber-500/10 transition-colors pointer-events-none">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Gap</p>
              <h3 className="text-3xl font-black text-rose-500 mt-2">
                {simOpportunityGap.gapCount}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Deemed & Private Universities</span>
              <span className="font-bold text-rose-500">
                {Math.round((simOpportunityGap.gapCount / 135) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Opportunity ARR Box */}
        <Card className="border-slate-200/80 bg-white/80 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-rose-500/10 transition-colors pointer-events-none">
            <TrendingUp className="w-16 h-16" />
          </div>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opportunity ARR</p>
              <h3 className="text-3xl font-black text-indigo-600 mt-2">
                Rs. {simOpportunityGap.arrRemaining} Cr
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <span>Roadmap ARR Opened</span>
              <span className="font-bold text-indigo-600">Rs. {simOpportunityGap.arrOpened} Cr</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid 2: Interactive Funnel & Charting split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Visual Funnel Container (2 Columns wide) */}
        <Card className="lg:col-span-2 border-slate-200/80 bg-white/80 shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base text-slate-800">Visual Higher Ed Funnel by Type</CardTitle>
              <CardDescription className="text-xs">Select a segment row to inspect characteristics and university networks</CardDescription>
            </div>
            <Badge className="bg-indigo-50 border-indigo-200 text-indigo-700 py-1 px-2.5 font-bold uppercase tracking-wider text-[9px] border">
              Interactive
            </Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-3">
              {Object.values(segments).map((seg) => {
                const isSelected = selectedSegmentId === seg.id;
                const isAvailable = filteredSegmentIds.includes(seg.id);
                
                // Calculate width factor for funnel aesthetics
                let widthClass = 'w-full';
                if (seg.id === 'affiliated') widthClass = 'w-full';
                if (seg.id === 'autonomous') widthClass = 'w-[85%]';
                if (seg.id === 'deemed') widthClass = 'w-[45%]';
                if (seg.id === 'private') widthClass = 'w-[30%]';

                return (
                  <div
                    key={seg.id}
                    onClick={() => {
                      if (isAvailable) setSelectedSegmentId(seg.id);
                    }}
                    className={`group relative p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                      !isAvailable ? 'opacity-20 pointer-events-none' : ''
                    } ${
                      isSelected
                        ? `bg-gradient-to-r ${seg.gradStart} ${seg.gradEnd} text-white border-transparent shadow-lg scale-[1.01] -translate-y-0.5`
                        : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/80 hover:border-slate-300'
                    } ${widthClass}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl text-xs font-black ${isSelected ? 'bg-white/20' : 'bg-slate-200/60 text-slate-600'}`}>
                          {seg.id === 'affiliated' && '🎓'}
                          {seg.id === 'autonomous' && '📚'}
                          {seg.id === 'deemed' && '🏛️'}
                          {seg.id === 'private' && '🌟'}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                            {seg.title}
                          </h4>
                          <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                            {seg.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/40">
                        <span className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {seg.count}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                          {seg.percentage} roster
                        </span>
                        <Badge
                          className={`mt-1 py-0.5 px-2 text-[9px] border font-bold ${
                            seg.supportStatus === 'Fully Supported'
                              ? isSelected ? 'bg-white/20 border-white/30 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : isSelected ? 'bg-red-500/20 border-red-400/30 text-white' : 'bg-rose-50 border-rose-200 text-rose-700'
                          }`}
                        >
                          {seg.supportStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Market TAM Breakdown Mini-Chart */}
        <Card className="border-slate-200/80 bg-white/80 shadow-sm">
          <CardHeader className="py-4 px-6 border-b border-slate-100">
            <CardTitle className="text-base text-slate-800">TAM Distribution Chart</CardTitle>
            <CardDescription className="text-xs">Sectors mapping out the total 135 higher education roster</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col justify-between items-center h-[300px]">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(226,232,240,0.3)' }} contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={14}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/50">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/60 pb-1 mb-1">
                <span>Segment</span>
                <span>Count</span>
              </div>
              {chartData.map((d) => (
                <div key={d.name} className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-bold text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid 3: Selected Segment Deep-Dive */}
      {selectedSegment && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Characteristics and Features Gaps Checklists (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Characteristics Card */}
            <Card className="border-slate-200/80 bg-white/80 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-slate-100">
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" />
                  {selectedSegment.title} - Operational Characteristics
                </CardTitle>
                <CardDescription className="text-xs">Functional boundaries, authority rules, and regulatory environments</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSegment.characteristics.map((char, index) => (
                    <div key={index} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/40 hover:border-slate-300/60 transition-colors">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                        {char.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 leading-relaxed">
                        {char.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Compatibility and Gaps List */}
            <Card className="border-slate-200/80 bg-white/80 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-slate-100">
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  {selectedSegment.supportStatus === 'Fully Supported' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                  )}
                  Platform Compatibility Matrix & Technical Gaps
                </CardTitle>
                <CardDescription className="text-xs">
                  Detailed check on edumerge features against structural requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {selectedSegment.supportStatus === 'NOT Supported' && (
                  <div className="mb-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs text-rose-700 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block mb-1">Critical Roadmap Gap identified:</strong>
                      edumerge cannot serve {selectedSegment.title} in the baseline build because the core schemas assume degrees, transcripts, and exam rules are issued by a parent university. Self-degree-awarding universities lack a parent.
                    </div>
                  </div>
                )}
                
                <div className="space-y-2.5">
                  {selectedSegment.features.map((feat, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                        feat.type === 'yes'
                          ? 'bg-emerald-50/20 border-emerald-200/50 text-slate-700'
                          : feat.type === 'partial'
                          ? 'bg-amber-50/20 border-amber-200/50 text-slate-700'
                          : 'bg-rose-50/20 border-rose-200/50 text-rose-800'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {feat.type === 'yes' && <Check className="w-4 h-4 text-emerald-600 font-black" />}
                        {feat.type === 'partial' && <AlertTriangle className="w-4 h-4 text-amber-500 font-bold" />}
                        {feat.type === 'no' && <X className="w-4 h-4 text-rose-600 font-bold" />}
                      </div>
                      <div className="flex-1">
                        <span className={`text-xs ${feat.type === 'no' ? 'font-semibold text-rose-700' : 'font-medium'}`}>
                          {feat.name}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          {feat.type === 'yes' && 'Supported'}
                          {feat.type === 'partial' && 'Partially Supported - Workaround Config Required'}
                          {feat.type === 'no' && 'Platform Gap - Blocks Deployment'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Clients / Prospect Registry (1 Col) - Grouped by Top Universities */}
          <div className="space-y-6">
            
            {/* Prospects Roster */}
            <Card className="border-slate-200/80 bg-white/80 shadow-sm h-full flex flex-col">
              <CardHeader className="py-4 px-6 border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base text-slate-800">
                    {selectedSegment.supportStatus === 'Fully Supported' ? 'Active Clients' : 'Prospect Registry'}
                  </CardTitle>
                  <Badge className="bg-slate-100 text-slate-600 font-bold border border-slate-200 text-[10px]">
                    {selectedSegment.institutions.length} Total
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  {selectedSegment.id === 'affiliated' || selectedSegment.id === 'autonomous'
                    ? 'Colleges grouped under Parent Universities'
                    : 'Self-degree-awarding universities'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex-grow overflow-y-auto no-scrollbar flex flex-col">
                
                {/* Search bar */}
                <div className="relative mb-3 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search roster..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-8 border-slate-200 focus:ring-indigo-500 rounded-lg text-xs"
                  />
                </div>

                {/* List items grouped by university */}
                <div className="space-y-4 flex-grow overflow-y-auto max-h-[300px] pr-1">
                  {Object.keys(groupedInstitutions).length === 0 || 
                   (Object.keys(groupedInstitutions).length === 1 && Object.values(groupedInstitutions)[0].length === 0) ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No matching records found.
                    </div>
                  ) : (
                    Object.entries(groupedInstitutions).map(([uni, insts]) => (
                      <div key={uni} className="space-y-2">
                        {uni && (
                          <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-indigo-100/30 flex items-center gap-1.5 uppercase tracking-wider shrink-0 mt-2">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>{uni}</span>
                          </div>
                        )}
                        <div className="space-y-2">
                          {insts.map((inst, index) => (
                            <div
                              key={index}
                              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-colors flex flex-col justify-between gap-3 ml-1"
                            >
                              <div className="min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-slate-800 text-xs leading-normal truncate">
                                    {inst.name}
                                  </span>
                                  <Badge
                                    className={`text-[8px] py-0 px-1.5 uppercase font-bold shrink-0 ${
                                      inst.status === 'Active' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                                      inst.status === 'Pilot' ? 'bg-amber-50 border border-amber-200 text-amber-700' :
                                      inst.status === 'Prospect' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
                                      'bg-rose-50 border border-rose-200 text-rose-700'
                                    }`}
                                  >
                                    {inst.status}
                                  </Badge>
                                </div>
                                
                                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {inst.location}
                                </div>
                                {inst.details && (
                                  <div className="text-[9px] bg-slate-50 border border-slate-200/50 rounded-md p-1 mt-1.5 text-slate-500">
                                    {inst.details}
                                  </div>
                                )}
                              </div>

                              {/* Roster actions */}
                              <div className="flex items-center gap-1.5 border-t border-slate-100 pt-2 shrink-0">
                                {selectedSegment.supportStatus === 'Fully Supported' ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] px-2 flex-1 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                                      onClick={() => handleConveneMeeting(inst.name)}
                                    >
                                      <Calendar className="w-3.5 h-3.5 mr-1" />
                                      Sync Consult
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-7 text-[10px] px-2 flex-1 bg-slate-900 text-white hover:bg-slate-800"
                                      onClick={() => triggerToast(`Navigating to dashboard instance of ${inst.name}`)}
                                    >
                                      Manage
                                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-[10px] px-2 flex-1 border-slate-200 hover:bg-rose-50 hover:text-rose-700"
                                      onClick={() => handleConveneMeeting(inst.name)}
                                    >
                                      Schedule Demo
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-7 text-[10px] px-2 flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                                      onClick={() => handleSendProposal(inst.name)}
                                    >
                                      <Send className="w-3.5 h-3.5 mr-1" />
                                      Proposal
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </CardContent>
            </Card>

          </div>
        </div>
      )}

      {/* Section 4: Roadmap Gap Simulator Dashboard Widget */}
      <Card className="mt-6 border-slate-200/80 bg-white/80 shadow-sm relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
        
        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-500" />
              P0 Platform Roadmap Solver Simulation
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate bridging key gaps to calculate open market ARR and increase platform compatibility.
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetSimulator}
              className="h-8 text-xs border-slate-200 hover:bg-slate-50 text-slate-600"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Reset Baseline
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Interactive sliders checklist */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-3">Gap Categories to Resolve</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ID Flexibility */}
                <div
                  onClick={() => setSimulatedGapsSolved(prev => ({ ...prev, studentId: !prev.studentId }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    simulatedGapsSolved.studentId
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Student ID Flexibility</span>
                    <input
                      type="checkbox"
                      checked={simulatedGapsSolved.studentId}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                    Remove parent university structure constraint. Models institution-specific student USN profiles.
                  </p>
                  <Badge className="mt-2 text-[8px] bg-slate-100 text-indigo-700 font-bold">
                    Opens 25% of Gap
                  </Badge>
                </div>

                {/* Degree Awarding workflows */}
                <div
                  onClick={() => setSimulatedGapsSolved(prev => ({ ...prev, degreeAuthority: !prev.degreeAuthority }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    simulatedGapsSolved.degreeAuthority
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Independent Degree Workflows</span>
                    <input
                      type="checkbox"
                      checked={simulatedGapsSolved.degreeAuthority}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                    Customizable degree certificates and academic syndicate signature hierarchies.
                  </p>
                  <Badge className="mt-2 text-[8px] bg-slate-100 text-indigo-700 font-bold">
                    Opens 30% of Gap
                  </Badge>
                </div>

                {/* Exam Board */}
                <div
                  onClick={() => setSimulatedGapsSolved(prev => ({ ...prev, examBoard: !prev.examBoard }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    simulatedGapsSolved.examBoard
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Controller of Exams Isolation</span>
                    <input
                      type="checkbox"
                      checked={simulatedGapsSolved.examBoard}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                    Allows colleges to act as their own exam board, scheduling grading periods without parent USN feeds.
                  </p>
                  <Badge className="mt-2 text-[8px] bg-slate-100 text-indigo-700 font-bold">
                    Opens 20% of Gap
                  </Badge>
                </div>

                {/* Multi campus isolation */}
                <div
                  onClick={() => setSimulatedGapsSolved(prev => ({ ...prev, multiCampus: !prev.multiCampus }))}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    simulatedGapsSolved.multiCampus
                      ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Multi-Campus Tenant isolation</span>
                    <input
                      type="checkbox"
                      checked={simulatedGapsSolved.multiCampus}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                    Shared central admin tenant with independent databases for campus nodes (BITS Goa vs BITS Pilani).
                  </p>
                  <Badge className="mt-2 text-[8px] bg-slate-100 text-indigo-700 font-bold">
                    Opens 25% of Gap
                  </Badge>
                </div>

              </div>
            </div>

            {/* Simulated output metrics */}
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-indigo-100 pb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-500" />
                  Simulated Platform Output
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Platform Compatibility Rate:</span>
                    <span className="font-bold text-indigo-600">
                      {Math.round((simOpportunityGap.supportedCount / 135) * 100)}%
                    </span>
                  </div>
                  <Progress value={(simOpportunityGap.supportedCount / 135) * 100} className="h-2 bg-slate-200/80 [&>div]:bg-indigo-600" />
                  
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-500 font-medium">Gap Remaining:</span>
                    <span className="font-bold text-slate-700">{simOpportunityGap.gapCount} Institutions</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Opened Roster TAM:</span>
                    <span className="font-bold text-emerald-600">+{simOpportunityGap.supportedCount - 75} Institutions</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Unlocked Opportunity ARR</span>
                  <span className="text-base font-black text-indigo-700">Rs. {simOpportunityGap.arrOpened} Cr / yr</span>
                </div>
                <Badge className="bg-emerald-500 text-white font-black uppercase text-[8px] animate-pulse">
                  Ready
                </Badge>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* DIALOG 1: Proposal dispatch */}
      {showProposalDialog && (
        <Dialog open={true} onOpenChange={() => setShowProposalDialog(false)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Dispatch Custom Platform Integration Proposal
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Verify custom roadmap overrides for {proposalInstName}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Target Institution:</span>
                <span className="font-semibold text-slate-600">{proposalInstName}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included Roadmap Features</Label>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 bg-indigo-50/30 rounded-lg border border-indigo-100/50">
                    <span className="font-medium text-slate-700">Multi-Campus Tenant Isolator</span>
                    <input
                      type="checkbox"
                      checked={proposalConfig.multiCampus}
                      onChange={(e) => setProposalConfig(prev => ({ ...prev, multiCampus: e.target.checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-indigo-50/30 rounded-lg border border-indigo-100/50">
                    <span className="font-medium text-slate-700">Custom self-degree Template print layouts</span>
                    <input
                      type="checkbox"
                      checked={proposalConfig.customDegree}
                      onChange={(e) => setProposalConfig(prev => ({ ...prev, customDegree: e.target.checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-indigo-50/30 rounded-lg border border-indigo-100/50">
                    <span className="font-medium text-slate-700">Flexible independent student ID modelers</span>
                    <input
                      type="checkbox"
                      checked={proposalConfig.flexibleId}
                      onChange={(e) => setProposalConfig(prev => ({ ...prev, flexibleId: e.target.checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Bid ARR (Projected)</Label>
                <Input
                  value={proposalConfig.arrBid}
                  onChange={(e) => setProposalConfig(prev => ({ ...prev, arrBid: e.target.value }))}
                  className="h-9 text-xs border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProposalDialog(false)}
                className="h-8 text-xs border-slate-200 text-slate-600 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                onClick={handleConfirmProposal}
              >
                Dispatch Proposal Pack
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG 2: Meeting schedule */}
      {showMeetingDialog && (
        <Dialog open={true} onOpenChange={() => setShowMeetingDialog(false)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Schedule Statutory Integration Consultation
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Setup coordination session with executive board of {meetingInstName}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity</Label>
                <p className="font-semibold text-slate-800 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  {meetingInstName}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Date</Label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full h-9 border border-slate-200 rounded-lg px-2.5 bg-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agendas / Notes</Label>
                <textarea
                  value={meetingNotes}
                  rows={3}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMeetingDialog(false)}
                className="h-8 text-xs border-slate-200 text-slate-600 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
                onClick={handleConfirmMeeting}
              >
                Schedule Circular Notice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </Layout>
  );
}
