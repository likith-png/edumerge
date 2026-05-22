import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import {
  MessageSquare, ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2,
  ChevronRight, Calendar, Scale, Clock, User, Filter, Search, FileText, Check,
  Sparkles, TrendingUp, RefreshCw
} from 'lucide-react';

interface CaseDetail {
  id: string;
  category: string;
  campus: string;
  dateFiled: string;
  daysOpen: number;
  status: string;
  slaStatus: 'Breached' | 'Overdue' | 'Within SLA';
  assignedTo: string;
  description: string;
  complainant: string;
  accused: string;
  timeline: { date: string; event: string; status: 'completed' | 'pending' }[];
}

export default function GrievanceIntelligence() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('All');
  const [selectedSla, setSelectedSla] = useState('All');
  const [selectedCase, setSelectedCase] = useState<CaseDetail | null>(null);
  const [isAuditInitiated, setIsAuditInitiated] = useState(false);
  const [showAssignChairDialog, setShowAssignChairDialog] = useState(false);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isSimulatingGrievanceRisk, setIsSimulatingGrievanceRisk] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    openGrievances: 23,
    slaBreached: 8,
    poshOpen: 2,
    avgResolution: '11.4 days'
  });

  // Mock POSH cases
  const [poshCases, setPoshCases] = useState([
    {
      id: 'GRV-2026-089',
      category: 'Sexual Harassment',
      campus: 'East Campus',
      filed: '18 March 2026',
      daysOpen: 62,
      status: 'Received and Acknowledged',
      iccStatus: 'Constituted',
      inquiryStatus: 'NOT STARTED — 62 days elapsed',
      legalExposure: 'High. Section 11, POSH Act 2013 employer liability ACTIVE.',
      recommended: 'Convene ICC within 48 hours. Document all proceedings. Inquiry window closes in 28 days.',
      exposureLevel: 'high' as const
    },
    {
      id: 'GRV-2026-091',
      category: 'Hostile Work Environment',
      campus: 'Main Campus',
      filed: '02 April 2026',
      daysOpen: 47,
      status: 'Received and Acknowledged',
      iccStatus: 'Constituted',
      inquiryStatus: 'Preliminary inquiry in progress',
      legalExposure: 'Moderate — inquiry running but approaching 90-day limit.',
      recommended: 'Expedite inquiry completion before Day 90.',
      exposureLevel: 'medium' as const
    }
  ]);

  // Comprehensive mock data
  const [grievances, setGrievances] = useState<CaseDetail[]>([
    {
      id: 'GRV-2026-104',
      category: 'Academic — Grading Bias',
      campus: 'East Campus',
      dateFiled: '05 May 2026',
      daysOpen: 15,
      status: 'Under Review',
      slaStatus: 'Breached',
      assignedTo: 'Dean Academics',
      complainant: 'Aakash Verma (CSE Sem 6)',
      accused: 'Dr. Anand Kumar (Professor)',
      description: 'Student claims grading bias in internal assessment test 2. Points to discrepancies between his sheet and grading rubric.',
      timeline: [
        { date: '05 May 2026', event: 'Complaint Filed', status: 'completed' },
        { date: '07 May 2026', event: 'Assigned to Dean Academics', status: 'completed' },
        { date: '12 May 2026', event: 'SLA Limit Exceeded (7-day response)', status: 'completed' },
        { date: '15 May 2026', event: 'Hearing scheduled', status: 'pending' }
      ]
    },
    {
      id: 'GRV-2026-107',
      category: 'Financial — Refund Delay',
      campus: 'North Campus',
      dateFiled: '12 May 2026',
      daysOpen: 8,
      status: 'Processing',
      slaStatus: 'Overdue',
      assignedTo: 'Accounts Manager',
      complainant: 'Riya Sen (Alumni FY25)',
      accused: 'Billing Division',
      description: 'Delay in processing library security deposit refund. Repeated emails sent with no response.',
      timeline: [
        { date: '12 May 2026', event: 'Complaint registered', status: 'completed' },
        { date: '15 May 2026', event: 'Forwarded to Accounts Manager', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-110',
      category: 'Hostel Facilities',
      campus: 'Main Campus',
      dateFiled: '16 May 2026',
      daysOpen: 4,
      status: 'Assigned',
      slaStatus: 'Within SLA',
      assignedTo: 'Hostel Warden',
      complainant: 'Nikhil Roy (B.Tech Sem 2)',
      accused: 'Facilities Vendor',
      description: 'Water filtration plant in Block B hostel malfunctioning. Water quality is muddy.',
      timeline: [
        { date: '16 May 2026', event: 'Complaint filed', status: 'completed' },
        { date: '17 May 2026', event: 'Assigned to Warden & Vendor', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-098',
      category: 'Academic — Course Material',
      campus: 'East Campus',
      dateFiled: '28 Apr 2026',
      daysOpen: 22,
      status: 'Inquiry Concluded',
      slaStatus: 'Breached',
      assignedTo: 'CSE HOD',
      complainant: 'Group complaint (CSE Section B)',
      accused: 'Prof. S. Rangan',
      description: 'Course material for Compiler Design not distributed in line with lesson plan, resulting in syllabus backlog.',
      timeline: [
        { date: '28 Apr 2026', event: 'Complaint filed', status: 'completed' },
        { date: '30 Apr 2026', event: 'HOD meeting conducted', status: 'completed' },
        { date: '10 May 2026', event: 'Inquiry report submitted', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-112',
      category: 'Administrative — Bus Route',
      campus: 'North Campus',
      dateFiled: '19 May 2026',
      daysOpen: 1,
      status: 'Registered',
      slaStatus: 'Within SLA',
      assignedTo: 'Transport In-Charge',
      complainant: 'Tanvi Shah (MBA Sem 4)',
      accused: 'Driver Route #12',
      description: 'Bus repeatedly skips the designated stop at Metro Pillar 42, causing students to walk 1.5km.',
      timeline: [
        { date: '19 May 2026', event: 'Complaint filed', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-101',
      category: 'Behavioral — Harassment',
      campus: 'Main Campus',
      dateFiled: '01 May 2026',
      daysOpen: 19,
      status: 'Committee Hearing',
      slaStatus: 'Breached',
      assignedTo: 'Disciplinary Cell',
      complainant: 'Rahul Gupta (BBA Sem 6)',
      accused: 'Sameer Sen (Student)',
      description: 'Accusations of bullying and verbal intimidation inside the college playground during sports hour.',
      timeline: [
        { date: '01 May 2026', event: 'Complaint registered', status: 'completed' },
        { date: '03 May 2026', event: 'Referred to Disciplinary Board', status: 'completed' },
        { date: '10 May 2026', event: 'Both parties summoned for hearing', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-115',
      category: 'Academic — Timetable overlap',
      campus: 'Main Campus',
      dateFiled: '20 May 2026',
      daysOpen: 0,
      status: 'Assigned',
      slaStatus: 'Within SLA',
      assignedTo: 'Dean Academics',
      complainant: 'B.Sc Physics Batch',
      accused: 'Scheduling Cell',
      description: 'Overlap between Quantum Mechanics core class and Electronics lab session on Wednesday morning.',
      timeline: [
        { date: '20 May 2026', event: 'Complaint registered', status: 'completed' }
      ]
    },
    {
      id: 'GRV-2026-108',
      category: 'Security Protocol',
      campus: 'East Campus',
      dateFiled: '13 May 2026',
      daysOpen: 7,
      status: 'Investigation',
      slaStatus: 'Overdue',
      assignedTo: 'Chief Security Officer',
      complainant: 'Staff complaint',
      accused: 'Security Gate #3',
      description: 'Unauthorized vehicles allowed entry inside staff parking block without digital gate scan.',
      timeline: [
        { date: '13 May 2026', event: 'Complaint filed', status: 'completed' }
      ]
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInitiateAudit = () => {
    setIsAuditInitiated(true);
    showToast("Academic paper evaluation audit scheduled. Notification dispatched to Registrar & Exam Controller.");
  };

  const handleConveneICC = (caseId: string) => {
    showToast(`Emergency ICC board meeting requested for Case ${caseId}. Chairperson notified.`);
  };

  const handleOpenAssignDialog = (caseId: string) => {
    setActiveCaseId(caseId);
    setShowAssignChairDialog(true);
  };

  const handleAssignChairConfirm = () => {
    setShowAssignChairDialog(false);
    showToast(`ICC Chairperson successfully assigned to Case ${activeCaseId}. Hearing schedule set.`);
  };

  // Filtering Logic
  const filteredGrievances = grievances.filter(grv => {
    const matchesSearch = grv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.complainant.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCampus = selectedCampus === 'All' || grv.campus === selectedCampus;
    const matchesSla = selectedSla === 'All' || grv.slaStatus === selectedSla;
    
    return matchesSearch && matchesCampus && matchesSla;
  });

  return (
    <Layout
      title="Grievance Intelligence"
      description="Track and monitor compliance, statutory risks, POSH cases, and institutional SLAs"
      icon={MessageSquare}
      showHome={true}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Grid: 4 Cards of Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.openGrievances}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Open Grievances</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-50 rounded-md text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-rose-600">{stats.slaBreached}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SLA Breached</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-red-50 rounded-md text-red-600">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{stats.poshOpen}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">POSH/ICC Cases</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardContent className="py-3 px-4 flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 rounded-md text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.avgResolution}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Response Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Copilot Predictive Risk & Sentiment Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
        {/* Card 1: AI Risk Prediction Engine */}
        <Card className="lg:col-span-2 shadow-sm border-purple-200 bg-gradient-to-br from-white to-purple-50/10">
          <CardHeader className="py-3 px-4 border-b border-purple-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                AI Copilot: Escalation Risk Predictor
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-500">Real-time litigation & public reputation risk forecast models</CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsSimulatingGrievanceRisk(true);
                setTimeout(() => {
                  setIsSimulatingGrievanceRisk(false);
                  showToast("AI litigation model execution complete. Escalation weights updated.");
                }, 1500);
              }}
              className="h-7 text-[10px] border-purple-200 text-purple-700 hover:bg-purple-50/50"
              disabled={isSimulatingGrievanceRisk}
            >
              {isSimulatingGrievanceRisk ? (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin animate-infinite" /> Simulating...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Run Prediction Model
                </span>
              )}
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3.5">
              <div className="p-2.5 bg-purple-50/50 border border-purple-100 rounded-lg text-[11px] text-purple-800 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">AI Prediction Log:</span> Predictive algorithm projects an <strong>82% reduction in overall litigation risk</strong> if the outstanding POSH investigation inquiries are completed within 90 days.
                </div>
              </div>

              {/* Forecast Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <th className="px-2 py-2 font-bold uppercase text-[9px]">Case ID</th>
                      <th className="px-2 py-2 font-bold uppercase text-[9px]">Escalation Probability</th>
                      <th className="px-2 py-2 font-bold uppercase text-[9px]">Key Risk Drivers</th>
                      <th className="px-2 py-2 font-bold uppercase text-[9px]">Recommended Proactive Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-purple-50/5">
                      <td className="px-2 py-2.5 font-bold mono text-slate-900">GRV-2026-089</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden block">
                            <span className="h-full bg-rose-600 block rounded-full" style={{ width: '92%' }}></span>
                          </span>
                          <span className="text-rose-600 font-bold text-[10px]">92% (Critical)</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-slate-500 text-[11px]">ICC dormant since 62 days; Section 11 liability; explicit legal mention</td>
                      <td className="px-2 py-2.5 text-[11px] font-medium text-purple-700">Convene ICC within 48h; establish official fact-finding timeline.</td>
                    </tr>
                    <tr className="hover:bg-purple-50/5">
                      <td className="px-2 py-2.5 font-bold mono text-slate-900">GRV-2026-104</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden block">
                            <span className="h-full bg-amber-500 block rounded-full" style={{ width: '65%' }}></span>
                          </span>
                          <span className="text-amber-600 font-bold text-[10px]">65% (High)</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-slate-500 text-[11px]">SLA breached by 8 days; grading bias claim; department overlap</td>
                      <td className="px-2 py-2.5 text-[11px] font-medium text-purple-700">Re-assign grading cell observers; schedule principal mediator call.</td>
                    </tr>
                    <tr className="hover:bg-purple-50/5">
                      <td className="px-2 py-2.5 font-bold mono text-slate-900">GRV-2026-091</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden block">
                            <span className="h-full bg-blue-500 block rounded-full" style={{ width: '38%' }}></span>
                          </span>
                          <span className="text-blue-600 font-bold text-[10px]">38% (Moderate)</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-slate-500 text-[11px]">Preliminary inquiry active; 47 days open; student union involvement</td>
                      <td className="px-2 py-2.5 text-[11px] font-medium text-purple-700">Formalize weekly summary logs; dispatch interim reports.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Campus Sentiment Analytics */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="py-3 px-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              AI Sentiment Index Tracker
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500">Predicted friction spots by department</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">CSE Department (Academics)</span>
                  <span className="text-emerald-600 font-bold">81% Positive</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Mechanical Engineering (Workload)</span>
                  <span className="text-rose-500 font-bold">44% Negative Trend</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '44%' }}></div>
                </div>
                <p className="text-[9px] text-rose-600 font-bold mt-1">⚠️ Friction Cause: Vikas Rao workload overload (26 hrs/wk)</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">East Campus Hostel (Facilities)</span>
                  <span className="text-amber-600 font-bold">62% Mixed Sentiment</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 leading-normal">
              <strong>AI Recommendation:</strong> Proactively schedule a Town Hall for Mechanical Engineering faculty to address workload balance and prevent potential resignation index increases.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* POSH legal exposure tracker */}
      <Card className="shadow-sm border-slate-200 mb-4 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">POSH/ICC Statutory Liability Tracker</h3>
        </div>
        <CardContent className="px-4 py-3">
          <div className="p-2.5 bg-red-50/50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>Statutory Obligation: Inquiry must initiate within 7 days of registering a formal POSH complaint. Management holds personal liability for defaults.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {poshCases.map((c) => (
              <div
                key={c.id}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors flex flex-col justify-between"
                style={{ borderLeft: c.exposureLevel === 'high' ? '4px solid #ef4444' : '4px solid #f59e0b' }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 text-xs">{c.id} | {c.category}</span>
                    <Badge variant={c.exposureLevel === 'high' ? 'destructive' : 'warning'} className="py-0 px-2 text-[9px]">
                      {c.daysOpen} Days Open
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1 mb-2.5 leading-relaxed">
                    <p><strong>Campus:</strong> {c.campus} | <strong>Date Filed:</strong> {c.filed}</p>
                    <p><strong>ICC Committee:</strong> {c.iccStatus} ✓</p>
                    <p><strong>Inquiry Status:</strong> <span className={c.exposureLevel === 'high' ? 'text-red-600 font-bold' : 'text-amber-600 font-bold'}>{c.inquiryStatus}</span></p>
                    <p className="text-slate-500 font-medium">{c.legalExposure}</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-md border border-slate-100 text-[10px] text-slate-500 mb-3 leading-relaxed">
                    <strong className="text-slate-700">Next Action:</strong> {c.recommended}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-[11px] border-slate-200 text-slate-700"
                    onClick={() => handleOpenAssignDialog(c.id)}
                  >
                    Assign ICC Chair
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-[11px] bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => handleConveneICC(c.id)}
                  >
                    Convene ICC Board
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Detection Banner */}
      <Card className="shadow-sm border-amber-200 bg-amber-50/50 mb-4">
        <CardContent className="py-3 px-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-800 text-sm flex items-center gap-1">
                ⚠️ Pattern Alert: Exam Discrepancies Spike
              </strong>
              <p className="text-amber-700 mt-1 leading-relaxed">
                12 academic grievances alleging grading bias and exam result anomalies have been logged across East Campus in the last 30 days (versus a baseline average of 3/month). The concentration points to an anomaly in the paper evaluation cell. **Recommendation:** Launch an audit into the Nov 2025 examination evaluation workflow.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleInitiateAudit}
            disabled={isAuditInitiated}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0 self-end md:self-center"
          >
            {isAuditInitiated ? (
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Audit Scheduled</span>
            ) : (
              "Schedule Evaluation Audit"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Main Table: Open Grievances */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base text-slate-800">Open Grievance Register</CardTitle>
              <CardDescription className="text-xs">Monitor response timelines and assignees for institutional grievances</CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-[11px] w-40 border-slate-200 rounded-md focus-visible:ring-blue-600"
                />
              </div>

              {/* Campus Selector */}
              <select
                value={selectedCampus}
                onChange={e => setSelectedCampus(e.target.value)}
                className="h-8 border border-slate-200 rounded-md text-[11px] text-slate-600 px-2 bg-white outline-none focus:border-blue-500"
              >
                <option value="All">All Campuses</option>
                <option value="Main Campus">Main Campus</option>
                <option value="East Campus">East Campus</option>
                <option value="North Campus">North Campus</option>
              </select>

              {/* SLA Selector */}
              <select
                value={selectedSla}
                onChange={e => setSelectedSla(e.target.value)}
                className="h-8 border border-slate-200 rounded-md text-[11px] text-slate-600 px-2 bg-white outline-none focus:border-blue-500"
              >
                <option value="All">All SLAs</option>
                <option value="Within SLA">Within SLA</option>
                <option value="Overdue">Overdue</option>
                <option value="Breached">Breached</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">ID</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Category</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Campus</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider w-28">Date Filed</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider w-24">Days Open</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider w-28">SLA Status</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider">Assigned To</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wider w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredGrievances.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 text-[11px]">
                      No active grievances matching filters found.
                    </td>
                  </tr>
                ) : (
                  filteredGrievances.map((grv) => (
                    <tr key={grv.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-3 py-2.5 font-semibold mono text-slate-900">{grv.id}</td>
                      <td className="px-3 py-2.5 font-medium text-slate-900">{grv.category}</td>
                      <td className="px-3 py-2.5 text-slate-600">{grv.campus}</td>
                      <td className="px-3 py-2.5 mono text-slate-500">{grv.dateFiled}</td>
                      <td className="px-3 py-2.5 mono text-slate-600">{grv.daysOpen} days</td>
                      <td className="px-3 py-2.5 text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {grv.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge
                          variant={
                            grv.slaStatus === 'Breached'
                              ? 'destructive'
                              : grv.slaStatus === 'Overdue'
                              ? 'warning'
                              : 'emerald'
                          }
                          className="py-0 text-[10px]"
                        >
                          {grv.slaStatus}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{grv.assignedTo}</td>
                      <td className="px-3 py-2.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedCase(grv)}
                          className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Case Details Dialog */}
      {selectedCase && (
        <Dialog open={true} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between pr-4">
                <DialogTitle className="text-base font-bold text-slate-900">{selectedCase.id}</DialogTitle>
                <Badge variant={selectedCase.slaStatus === 'Breached' ? 'destructive' : selectedCase.slaStatus === 'Overdue' ? 'warning' : 'emerald'}>
                  {selectedCase.slaStatus}
                </Badge>
              </div>
              <DialogDescription className="text-xs text-slate-500 font-medium">Category: {selectedCase.category}</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Complainant</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedCase.complainant}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accused Party</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedCase.accused}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Campus Location</p>
                <p className="font-medium text-slate-800 mt-0.5">{selectedCase.campus}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Case Description</p>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-100 text-slate-600 mt-1 leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Audit Timeline Logs</p>
                <div className="space-y-3 border-l-2 border-slate-100 pl-3.5 ml-2">
                  {selectedCase.timeline.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 bg-white ${event.status === 'completed' ? 'border-emerald-500' : 'border-slate-300'}`} />
                      <p className="font-semibold text-slate-800 text-[11px]">{event.event}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">{event.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)} className="h-8 text-xs border-slate-200 text-slate-600">
                Close View
              </Button>
              <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { setSelectedCase(null); showToast(`Re-assigned investigator for ${selectedCase.id}`); }}>
                Re-assign Case
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Assign ICC Chair Dialog */}
      {showAssignChairDialog && (
        <Dialog open={true} onOpenChange={() => setShowAssignChairDialog(false)}>
          <DialogContent className="max-w-sm bg-white border border-slate-200 rounded-lg p-5">
            <DialogHeader className="border-b border-slate-100 pb-3">
              <DialogTitle className="text-sm font-bold text-slate-900">Assign ICC Chairperson</DialogTitle>
              <DialogDescription className="text-xs text-slate-400">Set the presiding officer for the statutory board</DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Chairperson</label>
                <select className="w-full h-9 border border-slate-200 rounded-md px-2 bg-white focus:ring-blue-500 text-xs">
                  <option>Dr. Meera Sen (Senior Professor, English)</option>
                  <option>Dr. Sunita Sharma (HOD Computer Science)</option>
                  <option>Prof. Anjali Devi (Dean Admissions)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Special Observers</label>
                <input
                  type="text"
                  placeholder="e.g. Adv. Rekha Patil (Legal counsel)"
                  className="w-full h-9 border border-slate-200 rounded-md px-2.5 focus:ring-blue-500 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <Button variant="outline" size="sm" onClick={() => setShowAssignChairDialog(false)} className="h-8 text-xs border-slate-200 text-slate-600">
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAssignChairConfirm}>
                Confirm Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
