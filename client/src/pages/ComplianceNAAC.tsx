import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  ShieldCheck, Award, AlertTriangle, CheckCircle2, AlertCircle,
  Calendar, Users, BookOpen, Building, Check, ArrowUpRight, Plus, HelpCircle
} from 'lucide-react';

interface CriteriaDetail {
  number: number;
  name: string;
  weightage: number;
  score: number; // out of 4.00
  percentage: number;
  status: 'Compliant' | 'Review Needed' | 'Critical Gap';
}

interface GapItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  metric: string;
  current: string;
  target: string;
  estGain: number;
  cost: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export default function ComplianceNAAC() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [targetGrade, setTargetGrade] = useState<'A+' | 'A++'>('A+');
  const [selectedCriteria, setSelectedCriteria] = useState<CriteriaDetail | null>(null);
  const [showConveneDialog, setShowConveneDialog] = useState(false);
  const [activeCommittee, setActiveCommittee] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState('2026-05-28');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Stats / NAAC Dial Data
  const currentCGPA = 3.24;
  const targetCGPA = targetGrade === 'A+' ? 3.51 : 3.76;
  const cgpDiff = (targetCGPA - currentCGPA).toFixed(2);

  // Criteria Data
  const [criteria, setCriteria] = useState<CriteriaDetail[]>([
    { number: 1, name: 'Curricular Aspects', weightage: 100, score: 3.40, percentage: 85, status: 'Compliant' },
    { number: 2, name: 'Teaching-Learning and Evaluation', weightage: 350, score: 3.12, percentage: 78, status: 'Review Needed' },
    { number: 3, name: 'Research, Innovations and Extension', weightage: 120, score: 2.56, percentage: 64, status: 'Critical Gap' },
    { number: 4, name: 'Infrastructure and Learning Resources', weightage: 100, score: 3.60, percentage: 90, status: 'Compliant' },
    { number: 5, name: 'Student Support and Progression', weightage: 130, score: 2.88, percentage: 72, status: 'Review Needed' },
    { number: 6, name: 'Governance, Leadership and Management', weightage: 100, score: 3.20, percentage: 80, status: 'Compliant' },
    { number: 7, name: 'Institutional Values and Best Practices', weightage: 100, score: 3.52, percentage: 88, status: 'Compliant' }
  ]);

  // Priority Gaps
  const [gaps, setGaps] = useState<GapItem[]>([
    {
      id: 'GAP-001',
      priority: 'High',
      action: 'Increase Ph.D. Faculty Ratio in Engineering',
      metric: 'Ph.D. Faculty percentage',
      current: '42%',
      target: '60%',
      estGain: 0.15,
      cost: 'Recruitment Overhead',
      status: 'In Progress'
    },
    {
      id: 'GAP-002',
      priority: 'High',
      action: 'Boost SCOPUS & Web of Science Publications',
      metric: 'Publications per faculty per year',
      current: '1.2',
      target: '2.5',
      estGain: 0.12,
      cost: '₹12 Lakhs (Incentive)',
      status: 'Open'
    },
    {
      id: 'GAP-003',
      priority: 'Medium',
      action: 'Upgrade classrooms to Smart ICT-enabled setups',
      metric: 'Percentage of ICT Classrooms',
      current: '37.5% (15/40)',
      target: '75.0% (30/40)',
      estGain: 0.08,
      cost: '₹18 Lakhs (CAPEX)',
      status: 'Open'
    },
    {
      id: 'GAP-004',
      priority: 'Low',
      action: 'Establish Institutional Incubation Cell',
      metric: 'Registered start-ups incubated',
      current: '1',
      target: '5',
      estGain: 0.05,
      cost: '₹5 Lakhs (OPEX)',
      status: 'In Progress'
    }
  ]);

  // Mandatory Committees
  const [committees, setCommittees] = useState([
    {
      name: 'POSH Internal Complaints Committee (ICC)',
      status: 'Compliant',
      lastMet: '12 Feb 2026',
      nextScheduled: '28 May 2026',
      minFrequency: 'Bi-annually',
      legalReference: 'Section 4, POSH Act 2013',
      severity: 'high'
    },
    {
      name: 'SC/ST Committee',
      status: 'Action Required',
      lastMet: '14 Dec 2025',
      nextScheduled: 'Overdue (Target: April 2026)',
      minFrequency: 'Once per semester',
      legalReference: 'Scheduled Castes & Scheduled Tribes Prevention of Atrocities Act',
      severity: 'high'
    },
    {
      name: 'Anti-Ragging Committee',
      status: 'Compliant',
      lastMet: '02 Apr 2026',
      nextScheduled: '18 Aug 2026',
      minFrequency: 'Annually + Start of Term',
      legalReference: 'UGC Regulations 2009 / Sec 26(1)(g)',
      severity: 'high'
    },
    {
      name: 'Internal Quality Assurance Cell (IQAC)',
      status: 'Compliant',
      lastMet: '10 Mar 2026',
      nextScheduled: '10 Jun 2026',
      minFrequency: 'Quarterly',
      legalReference: 'NAAC Accreditation Mandate',
      severity: 'medium'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInitiateAction = (gapId: string, actionName: string) => {
    setGaps(prev => prev.map(g => g.id === gapId ? { ...g, status: 'In Progress' } : g));
    showToast(`Action Plan initiated: "${actionName}". Tasks assigned to respective HODs.`);
  };

  const handleOpenConvene = (committeeName: string) => {
    setActiveCommittee(committeeName);
    setMeetingNotes('');
    setShowConveneDialog(true);
  };

  const handleConfirmConvene = () => {
    setShowConveneDialog(false);
    // Update local committee meeting schedule
    setCommittees(prev => prev.map(c => c.name === activeCommittee ? {
      ...c,
      status: 'Compliant',
      lastMet: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextScheduled: meetingDate ? new Date(meetingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Scheduled'
    } : c));
    showToast(`Statutory meeting for "${activeCommittee}" successfully scheduled and notice circular sent.`);
  };

  return (
    <Layout
      title="Compliance & NAAC Intelligence"
      description="Track NAAC accreditation readiness, identify criteria gaps, and monitor mandatory committees compliance"
      icon={ShieldCheck}
      showHome={true}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        
        {/* Left Column: NAAC Readiness profile (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Top Panel: Readiness Dial and Overview */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  NAAC Cycle-3 Readiness Overview
                </CardTitle>
                <CardDescription className="text-xs">Current Institutional Score vs Target Projection</CardDescription>
              </div>

              {/* Target Grade Selector */}
              <div className="flex bg-slate-100 p-0.5 rounded-md text-xs font-semibold">
                <button
                  onClick={() => setTargetGrade('A+')}
                  className={`px-3 py-1 rounded-sm transition-all ${targetGrade === 'A+' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Target A+ (3.51+)
                </button>
                <button
                  onClick={() => setTargetGrade('A++')}
                  className={`px-3 py-1 rounded-sm transition-all ${targetGrade === 'A++' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Target A++ (3.76+)
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                
                {/* SVG Semi-Circle Score Dial */}
                <div className="relative flex flex-col items-center">
                  <svg className="w-40 h-24" viewBox="0 0 100 60">
                    {/* Background path */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Progress path representing 3.24 out of 4.00 (which is 81% of the semicircle) */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="url(#gradient-naac)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 * (1 - (currentCGPA / 4.0))}
                    />
                    <defs>
                      <linearGradient id="gradient-naac" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Inside dial text */}
                  <div className="absolute top-10 flex flex-col items-center">
                    <span className="text-2xl font-black text-slate-900">{currentCGPA.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current CGPA</span>
                  </div>
                  {/* Min / Max labels */}
                  <div className="w-44 flex justify-between text-[10px] font-bold text-slate-400 px-3 -mt-2">
                    <span>0.00</span>
                    <span>4.00</span>
                  </div>
                </div>

                {/* Score Summary Metrics */}
                <div className="flex-1 space-y-3 max-w-sm">
                  <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Institutional Status</p>
                      <p className="text-sm font-bold text-slate-800">Grade A (Accredited)</p>
                    </div>
                    <Badge className="bg-blue-600 text-white py-0.5 px-2">Cycle 2</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target CGPA</p>
                      <p className="text-sm font-bold text-slate-900">{targetCGPA.toFixed(2)}</p>
                    </div>
                    <div className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-100">
                      <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Current Gap</p>
                      <p className="text-sm font-bold text-rose-700">-{cgpDiff} CGPA</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    <span className="font-semibold text-slate-700">AI Estimate:</span> To reach Grade {targetGrade}, institutional scores must improve by {cgpDiff} CGPA across remaining Self Study Report (SSR) metrics. Priority action points are outlined in the gaps panel.
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* 7 NAAC Criteria checklist progress */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-base text-slate-800">Criteria-Wise Score Card</CardTitle>
              <CardDescription className="text-xs">Performance breakdown across the 7 mandatory NAAC parameters</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {criteria.map((c) => (
                  <div
                    key={c.number}
                    className="p-3 hover:bg-slate-50/50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setSelectedCriteria(c)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        C{c.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">{c.name}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">Weight: {c.weightage}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={c.percentage} className="h-2 flex-1 bg-slate-100 [&>div]:bg-blue-600" />
                          <span className="text-[10px] font-bold text-slate-700 w-8 text-right">{c.percentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 shrink-0 text-right">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{c.score.toFixed(2)} / 4.00</p>
                        <p className="text-[9px] text-slate-400 font-medium">Criterion Score</p>
                      </div>
                      <Badge
                        variant={c.status === 'Compliant' ? 'emerald' : c.status === 'Review Needed' ? 'warning' : 'destructive'}
                        className="py-0.5 px-2 text-[9px] min-w-[75px] text-center justify-center"
                      >
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Gap Analysis & Action Projection */}
        <div className="space-y-4">
          
          <Card className="shadow-sm border-slate-200">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 py-3 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Priority Gap Analysis
              </h3>
            </div>
            <CardContent className="px-4 py-3">
              <div className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                Action items recommended by the AI audit to resolve the target grade gap of <strong className="text-rose-600">-{cgpDiff} CGPA</strong>.
              </div>

              <div className="space-y-3">
                {gaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-slate-800 text-[11px] leading-tight">{gap.action}</span>
                        <Badge
                          variant={gap.priority === 'High' ? 'destructive' : gap.priority === 'Medium' ? 'warning' : 'secondary'}
                          className="py-0 px-1.5 text-[8px] tracking-wide uppercase shrink-0"
                        >
                          {gap.priority}
                        </Badge>
                      </div>
                      
                      <div className="text-[10px] text-slate-500 space-y-0.5 mb-2.5 leading-relaxed">
                        <p><strong>Metric:</strong> {gap.metric}</p>
                        <p><strong>Current:</strong> <span className="text-red-500 font-medium">{gap.current}</span> | <strong>Target:</strong> <span className="text-emerald-600 font-semibold">{gap.target}</span></p>
                        <p><strong>Est. Impact:</strong> <span className="text-blue-600 font-bold">+{gap.estGain.toFixed(2)} CGPA</span></p>
                        <p className="text-[9px] text-slate-400"><strong>Est. Cost:</strong> {gap.cost}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 mt-1">
                      <span className="text-[9px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${gap.status === 'Resolved' ? 'bg-emerald-500' : gap.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        {gap.status}
                      </span>
                      {gap.status === 'Open' ? (
                        <Button
                          size="sm"
                          className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white py-0.5 px-2"
                          onClick={() => handleInitiateAction(gap.id, gap.action)}
                        >
                          Initiate Drive
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          className="h-7 text-[10px] py-0.5 px-2 text-slate-400 hover:bg-transparent"
                        >
                          Active Plan
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Bottom Panel: Statutory Committee Checklist */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-blue-600" />
              Statutory Committee Compliance Checklist
            </CardTitle>
            <CardDescription className="text-xs">Verify regulatory schedules, agendas, and composition requirements for mandatory committees</CardDescription>
          </div>
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Severe compliance audit warning: SC/ST statutory committee meeting is overdue.</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider">Committee Name</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-36">Status</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-32">Last Convened</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-44">Next Schedule</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-32">Min. Frequency</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider">Legal / Statutory Mandate</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {committees.map((com) => (
                  <tr key={com.name} className="hover:bg-blue-50/20 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-900 leading-normal">{com.name}</td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={com.status === 'Compliant' ? 'emerald' : 'destructive'}
                        className="py-0.5 px-2 text-[9px] font-semibold"
                      >
                        {com.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 mono text-slate-600">{com.lastMet}</td>
                    <td className="px-4 py-2.5">
                      <span className={`mono font-semibold ${com.status === 'Action Required' ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                        {com.nextScheduled}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-medium">{com.minFrequency}</td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500 leading-normal">{com.legalReference}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="sm"
                        className={`h-7 text-[10px] ${com.status === 'Action Required' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                        onClick={() => handleOpenConvene(com.name)}
                      >
                        {com.status === 'Action Required' ? 'Convene Now' : 'Schedule'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog: Detail of Criteria Score */}
      {selectedCriteria && (
        <Dialog open={true} onOpenChange={() => setSelectedCriteria(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  C{selectedCriteria.number}
                </div>
                <div>
                  <DialogTitle className="text-sm font-bold text-slate-900">{selectedCriteria.name}</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">Weightage: {selectedCriteria.weightage} points</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Criterion CGPA</p>
                  <p className="text-base font-black text-slate-800 mt-0.5">{selectedCriteria.score.toFixed(2)} / 4.00</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right">Compliance Level</p>
                  <Badge variant={selectedCriteria.status === 'Compliant' ? 'emerald' : selectedCriteria.status === 'Review Needed' ? 'warning' : 'destructive'} className="mt-1">
                    {selectedCriteria.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-800 text-[11px] mb-1.5">Identified Compliance Gaps</p>
                <ul className="space-y-2 list-none p-0">
                  {selectedCriteria.number === 3 && (
                    <>
                      <li className="flex gap-2 text-slate-600 bg-red-50/30 p-2 rounded border border-red-100/50">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>Low citation indexes and active research grants per department. <strong>Impact: Critical.</strong></span>
                      </li>
                      <li className="flex gap-2 text-slate-600 bg-amber-50/30 p-2 rounded border border-amber-100/50">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>Incubation cell activity limited to 1 start-up (Required: 5).</span>
                      </li>
                    </>
                  )}
                  {selectedCriteria.number === 2 && (
                    <>
                      <li className="flex gap-2 text-slate-600 bg-amber-50/30 p-2 rounded border border-amber-100/50">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>Ph.D. faculty ratio is 42% (Required for A++ is 60%+). <strong>Impact: High.</strong></span>
                      </li>
                    </>
                  )}
                  {selectedCriteria.status === 'Compliant' && (
                    <li className="flex gap-2 text-slate-600 bg-emerald-50/30 p-2 rounded border border-emerald-100/50">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>All sub-criteria met or exceeded target benchmarks. Keep monitoring periodic reporting.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedCriteria(null)} className="h-8 text-xs border-slate-200 text-slate-600">
                Dismiss
              </Button>
              {selectedCriteria.status !== 'Compliant' && (
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setSelectedCriteria(null); showToast(`Gap resolution plan initiated for Criterion ${selectedCriteria.number}`); }}>
                  Create Resolution Plan
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog: Convene Committee Form */}
      {showConveneDialog && (
        <Dialog open={true} onOpenChange={() => setShowConveneDialog(false)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900">Schedule Statutory Committee Meeting</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">Schedule compliance meeting for {activeCommittee}</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Committee Name</Label>
                <p className="font-semibold text-slate-800 text-xs bg-slate-50 p-2 rounded border border-slate-200">{activeCommittee}</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scheduled Date</Label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="w-full h-9 border border-slate-200 rounded-md px-2.5 bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Agenda / Remarks</Label>
                <textarea
                  placeholder="Enter meeting agenda items, e.g. review quarterly safety records, discuss pending complaints..."
                  rows={3}
                  value={meetingNotes}
                  onChange={e => setMeetingNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-md p-2 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setShowConveneDialog(false)} className="h-8 text-xs border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirmConvene}>
                Issue Meeting Circular
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
