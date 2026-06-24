import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Award,
  FileText,
  CheckCircle,
  AlertTriangle,
  Search,
  Building,
  Clock,
  UserCheck,
  Users,
  Printer,
  Download,
  RefreshCw,
  Sliders,
  ClipboardList,
  ShieldCheck,
  ArrowRight,
  Filter,
  Check,
  X
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  program: string;
  creditsEarned: number;
  creditsRequired: number;
  cgpa: number;
  durationYears: number;
  academicHolds: string[];
  feeStatus: 'Cleared' | 'Outstanding';
  feeDuesAmount?: number;
  status: 'Pending' | 'Awarded' | 'Under Review';
  certificateId?: string;
  awardDate?: string;
  overridden?: boolean;
  overrideJustification?: string;
}

interface AuditLog {
  id: string;
  studentId: string;
  studentName: string;
  program: string;
  cgpa: number;
  degreeClass: string;
  certificateId?: string;
  awardDate: string;
  approver: string;
  decision: 'AWARDED' | 'OVERRIDDEN_AWARDED' | 'MANUAL_REVIEW_FLAG';
  timestamp: string;
  reason?: string;
  evidence: {
    credits: boolean;
    cgpa: boolean;
    duration: boolean;
    holds: boolean;
    fees: boolean;
  };
}

const DegreeAwardingSystem: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'eligible' | 'batch' | 'review' | 'records'>('eligible');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('All');
  
  // State for Toast messages
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock Registrar
  const registrarName = 'Dr. M. Sharma, Registrar';

  // 10-15 Sample students
  const [students, setStudents] = useState<Student[]>([
    { id: 'REG-2022-001', name: 'Aarav Sharma', program: 'B.Tech Computer Science', creditsEarned: 180, creditsRequired: 180, cgpa: 8.25, durationYears: 4, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-002', name: 'Priya Patel', program: 'B.Tech Electronics & Comm', creditsEarned: 180, creditsRequired: 180, cgpa: 7.82, durationYears: 4.1, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-003', name: 'Vikram Singh', program: 'B.Tech Mechanical Eng', creditsEarned: 172, creditsRequired: 180, cgpa: 6.20, durationYears: 4.0, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-004', name: 'Ananya Rao', program: 'B.Tech Computer Science', creditsEarned: 182, creditsRequired: 180, cgpa: 4.85, durationYears: 4.0, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-005', name: 'Kian Mehta', program: 'B.Tech Electrical Eng', creditsEarned: 180, creditsRequired: 180, cgpa: 7.15, durationYears: 2.5, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-006', name: 'Rohan Gupta', program: 'B.Tech Computer Science', creditsEarned: 180, creditsRequired: 180, cgpa: 8.52, durationYears: 4.0, academicHolds: ['Disciplinary Board Hold Pending'], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-007', name: 'Meera Iyer', program: 'B.Tech Electronics & Comm', creditsEarned: 180, creditsRequired: 180, cgpa: 8.04, durationYears: 4.0, academicHolds: [], feeStatus: 'Outstanding', feeDuesAmount: 12000, status: 'Pending' },
    { id: 'REG-2022-008', name: 'Sanjay Dutt', program: 'B.Tech Mechanical Eng', creditsEarned: 180, creditsRequired: 180, cgpa: 9.10, durationYears: 4.2, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-009', name: 'Divya Nair', program: 'B.Tech Computer Science', creditsEarned: 180, creditsRequired: 180, cgpa: 7.56, durationYears: 4.0, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-010', name: 'Amit Mishra', program: 'B.Tech Electrical Eng', creditsEarned: 180, creditsRequired: 180, cgpa: 6.84, durationYears: 4.5, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-011', name: 'Neha Sen', program: 'B.Tech Mechanical Eng', creditsEarned: 178, creditsRequired: 180, cgpa: 5.25, durationYears: 4.5, academicHolds: [], feeStatus: 'Outstanding', feeDuesAmount: 8500, status: 'Pending' },
    { id: 'REG-2022-012', name: 'Rahul Verma', program: 'B.Tech Computer Science', creditsEarned: 180, creditsRequired: 180, cgpa: 8.12, durationYears: 3.8, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' },
    { id: 'REG-2022-013', name: 'Sneha Reddy', program: 'B.Tech Electronics & Comm', creditsEarned: 180, creditsRequired: 180, cgpa: 7.33, durationYears: 4.0, academicHolds: [], feeStatus: 'Cleared', status: 'Pending' }
  ]);

  // Conferred Degrees Logs Registry
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'LOG-2026-101',
      studentId: 'REG-2022-099',
      studentName: 'Karan Malhotra',
      program: 'B.Tech Computer Science',
      cgpa: 8.92,
      degreeClass: 'First Class with Distinction',
      certificateId: 'CERT-2026-000101',
      awardDate: '15 Jun 2026',
      approver: 'Dr. M. Sharma, Registrar',
      decision: 'AWARDED',
      timestamp: '15 Jun 2026 14:32 IST',
      evidence: { credits: true, cgpa: true, duration: true, holds: true, fees: true }
    },
    {
      id: 'LOG-2026-102',
      studentId: 'REG-2022-098',
      studentName: 'Aishwarya Sen',
      program: 'B.Tech Electronics & Comm',
      cgpa: 7.12,
      degreeClass: 'First Class',
      certificateId: 'CERT-2026-000102',
      awardDate: '15 Jun 2026',
      approver: 'Dr. M. Sharma, Registrar',
      decision: 'OVERRIDDEN_AWARDED',
      timestamp: '15 Jun 2026 15:10 IST',
      reason: 'Fees cleared via external scholarship sponsor (cleared in ERP registry)',
      evidence: { credits: true, cgpa: true, duration: true, holds: true, fees: false }
    }
  ]);

  // Selection state for batch operations
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  // Selected certificate template modal view
  const [selectedCertStudent, setSelectedCertStudent] = useState<Student | null>(null);

  // Registrar override modal state
  const [overrideStudent, setOverrideStudent] = useState<Student | null>(null);
  const [justificationText, setJustificationText] = useState('');

  // ── ELIGIBILITY ENGINE PURE LOGIC FUNCTIONS ──────────────────
  const getEligibilityEvidence = (student: Student) => {
    return {
      credits: student.creditsEarned >= student.creditsRequired,
      cgpa: student.cgpa >= 5.0,
      duration: student.durationYears >= 3.0 && student.durationYears <= 7.0,
      holds: student.academicHolds.length === 0,
      fees: student.feeStatus === 'Cleared'
    };
  };

  const checkIsEligible = (student: Student) => {
    const evidence = getEligibilityEvidence(student);
    return evidence.credits && evidence.cgpa && evidence.duration && evidence.holds && evidence.fees;
  };

  // Indian HEI Degree Classification:
  // CGPA >= 7.75: First Class with Distinction
  // CGPA >= 6.75 and < 7.75: First Class
  // CGPA >= 5.75 and < 6.75: Second Class
  // CGPA >= 5.0 and < 5.75: Pass Class
  const getDegreeClassification = (cgpa: number) => {
    if (cgpa >= 7.75) return 'First Class with Distinction';
    if (cgpa >= 6.75) return 'First Class';
    if (cgpa >= 5.75) return 'Second Class';
    return 'Pass Class';
  };

  // ── ACTIONS ──────────────────────────────────────────────────
  const handleAwardSingleDegree = (student: Student, overrideReason?: string) => {
    if (student.status === 'Awarded') {
      triggerToast('Degree already awarded for this student.');
      return;
    }

    const certId = `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const awardDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // Update student state
    setStudents(prev => prev.map(s => {
      if (s.id === student.id) {
        return {
          ...s,
          status: 'Awarded',
          certificateId: certId,
          awardDate: awardDate,
          overridden: !!overrideReason,
          overrideJustification: overrideReason
        };
      }
      return s;
    }));

    // Add to audit logs
    const evidence = getEligibilityEvidence(student);
    const newLog: AuditLog = {
      id: `LOG-2026-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.name,
      program: student.program,
      cgpa: student.cgpa,
      degreeClass: getDegreeClassification(student.cgpa),
      certificateId: certId,
      awardDate: awardDate,
      approver: registrarName,
      decision: overrideReason ? 'OVERRIDDEN_AWARDED' : 'AWARDED',
      timestamp: new Date().toLocaleString() + ' IST',
      reason: overrideReason,
      evidence
    };

    setAuditLogs([newLog, ...auditLogs]);
    triggerToast(`Successfully awarded degree to ${student.name}. Certificate ID: ${certId}`);
  };

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideStudent || !justificationText.trim()) {
      triggerToast('Justification reason is required for manual overrides.');
      return;
    }
    
    handleAwardSingleDegree(overrideStudent, justificationText);
    setOverrideStudent(null);
    setJustificationText('');
  };

  const handleAwardBatch = () => {
    if (selectedStudentIds.length === 0) {
      triggerToast('No students selected.');
      return;
    }

    const awardDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newLogs: AuditLog[] = [];

    setStudents(prev => prev.map(s => {
      if (selectedStudentIds.includes(s.id) && s.status !== 'Awarded' && checkIsEligible(s)) {
        const certId = `CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
        const evidence = getEligibilityEvidence(s);
        
        newLogs.push({
          id: `LOG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          studentId: s.id,
          studentName: s.name,
          program: s.program,
          cgpa: s.cgpa,
          degreeClass: getDegreeClassification(s.cgpa),
          certificateId: certId,
          awardDate: awardDate,
          approver: registrarName,
          decision: 'AWARDED',
          timestamp: new Date().toLocaleString() + ' IST',
          evidence
        });

        return {
          ...s,
          status: 'Awarded',
          certificateId: certId,
          awardDate: awardDate
        };
      }
      return s;
    }));

    setAuditLogs([...newLogs, ...auditLogs]);
    triggerToast(`Conferred degrees for ${newLogs.length} selected students in batch.`);
    setSelectedStudentIds([]);
  };

  const handleToggleSelectAll = (eligibleList: Student[]) => {
    const allIds = eligibleList.map(s => s.id);
    const allSelected = allIds.every(id => selectedStudentIds.includes(id));
    if (allSelected) {
      setSelectedStudentIds(selectedStudentIds.filter(id => !allIds.includes(id)));
    } else {
      const unique = Array.from(new Set([...selectedStudentIds, ...allIds]));
      setSelectedStudentIds(unique);
    }
  };

  // Filter lists based on tab & query
  const eligibleStudents = useMemo(() => {
    return students.filter(s => {
      if (s.status === 'Awarded') return false;
      const isElig = checkIsEligible(s);
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProg = selectedProgram === 'All' || s.program === selectedProgram;
      return isElig && matchesSearch && matchesProg;
    });
  }, [students, searchQuery, selectedProgram]);

  const manualReviewStudents = useMemo(() => {
    return students.filter(s => {
      if (s.status === 'Awarded') return false;
      const isElig = checkIsEligible(s);
      // Fails at least one check
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProg = selectedProgram === 'All' || s.program === selectedProgram;
      return !isElig && matchesSearch && matchesProg;
    });
  }, [students, searchQuery, selectedProgram]);

  const activePrograms = ['All', 'B.Tech Computer Science', 'B.Tech Electronics & Comm', 'B.Tech Mechanical Eng', 'B.Tech Electrical Eng'];

  return (
    <Layout
      title="Degree Awarding & Compliance"
      description="UGC-compliant degree eligibility checking engine, batch conferment workflow, audit trail logging, and certificate validation."
      icon={Award}
      showHome
    >
      {/* Dynamic Toast Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 border border-slate-800 text-white rounded-xl py-3 px-5 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-black uppercase tracking-wider">{toastMessage}</span>
        </div>
      )}

      {/* Main Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Pending Candidates', val: students.filter(s => s.status !== 'Awarded').length, desc: 'Awaiting eligibility checks', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Eligible Graduates', val: students.filter(s => s.status !== 'Awarded' && checkIsEligible(s)).length, desc: 'Passed all 5 checks', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'Requires Manual Review', val: students.filter(s => s.status !== 'Awarded' && !checkIsEligible(s)).length, desc: 'Failing checks', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'Degrees Conferred', val: students.filter(s => s.status === 'Awarded').length + auditLogs.filter(l => l.decision !== 'MANUAL_REVIEW_FLAG' && !students.some(s => s.id === l.studentId && s.status === 'Awarded')).length, desc: 'Signed certificate audit trail', icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
        ].map((stat, idx) => (
          <Card key={idx} className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">{stat.label}</span>
                <span className="text-3xl font-black text-slate-800 block">{stat.val}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">{stat.desc}</span>
              </div>
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by student ID, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 border-slate-200 text-xs rounded-lg bg-slate-50/50"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border px-3 py-1.5 rounded-lg text-slate-500 text-xs font-semibold uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar justify-start sm:justify-end">
          {activePrograms.map((prog) => (
            <button
              key={prog}
              onClick={() => setSelectedProgram(prog)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider border shrink-0 ${
                selectedProgram === prog
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {prog === 'All' ? 'All Programs' : prog.replace('B.Tech ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'eligible', label: 'Eligible Graduates', count: eligibleStudents.length },
          { id: 'batch', label: 'Batch Operations', count: eligibleStudents.length },
          { id: 'review', label: 'Manual Review / Overrides', count: manualReviewStudents.length },
          { id: 'records', label: 'Conferred Degree Records', count: auditLogs.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3.5 pt-1 px-4 border-b-2 text-xs font-black uppercase tracking-wider transition-all relative shrink-0 ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 font-black'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{tab.label}</span>
              <Badge className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>{tab.count}</Badge>
            </div>
          </button>
        ))}
      </div>

      {/* ── TAB 1: ELIGIBLE STUDENTS ────────────────────────────────── */}
      {activeTab === 'eligible' && (
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Eligible Degree Candidates</CardTitle>
            <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Students meeting all 5 eligibility metrics. Click award to generate certificate and sign audit log.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px] tracking-wider">
                    <th className="p-4 w-28 text-center border-r border-slate-100">Reg ID</th>
                    <th className="p-4">Graduate Name</th>
                    <th className="p-4">Degree & Branch</th>
                    <th className="p-4 text-center">CGPA</th>
                    <th className="p-4 text-center">Duration</th>
                    <th className="p-4">Degree Class</th>
                    <th className="p-4 border-l border-slate-100 text-center">Eligibility Indicators</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                        No eligible graduates match the active filter criteria.
                      </td>
                    </tr>
                  )}
                  {eligibleStudents.map((student) => {
                    const classLabel = getDegreeClassification(student.cgpa);
                    return (
                      <tr key={student.id} className="border-b last:border-b-0 hover:bg-slate-50/40 transition-colors font-medium">
                        <td className="p-4 font-mono font-black text-slate-600 text-center border-r border-slate-100 bg-slate-50/20">{student.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{student.name}</div>
                          <span className="text-[9px] text-emerald-600 font-bold uppercase flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> UGC COMPLIANT CANDIDATE
                          </span>
                        </td>
                        <td className="p-4">{student.program}</td>
                        <td className="p-4 text-center font-bold text-slate-800">{student.cgpa.toFixed(2)}</td>
                        <td className="p-4 text-center text-slate-600">{student.durationYears} Years</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-[8px] font-black uppercase ${
                            student.cgpa >= 7.75 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {classLabel}
                          </Badge>
                        </td>
                        <td className="p-4 border-l border-slate-100 bg-slate-50/10">
                          <div className="flex items-center justify-center gap-2">
                            {[
                              { label: 'CR', val: student.creditsEarned >= student.creditsRequired, tooltip: `${student.creditsEarned}/${student.creditsRequired} Credits` },
                              { label: 'GP', val: student.cgpa >= 5.0, tooltip: `CGPA ${student.cgpa}` },
                              { label: 'DR', val: student.durationYears >= 3.0 && student.durationYears <= 7.0, tooltip: `${student.durationYears} Years duration` },
                              { label: 'HD', val: student.academicHolds.length === 0, tooltip: 'No disciplinary holds' },
                              { label: 'FE', val: student.feeStatus === 'Cleared', tooltip: 'Fees fully cleared' }
                            ].map((check, cIdx) => (
                              <div
                                key={cIdx}
                                title={check.tooltip}
                                className={`w-7 h-7 rounded-lg border text-[9px] font-black flex items-center justify-center ${
                                  check.val
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-rose-50 border-rose-200 text-rose-700'
                                }`}
                              >
                                {check.label}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            onClick={() => handleAwardSingleDegree(student)}
                            className="bg-[#000099] hover:bg-blue-800 text-white text-[10px] font-black uppercase tracking-wider h-8 rounded-lg shadow-sm"
                          >
                            Award Degree
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 2: BATCH OPERATIONS ─────────────────────────────────── */}
      {activeTab === 'batch' && (
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Batch Degree Conferment</CardTitle>
              <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Select multiple graduates to sign and award certificates simultaneously.</CardDescription>
            </div>
            {selectedStudentIds.length > 0 && (
              <Button
                onClick={handleAwardBatch}
                className="bg-[#000099] hover:bg-blue-800 text-white text-[10px] font-black uppercase tracking-wider h-8 rounded-lg shadow-md animate-bounce"
              >
                Confer Selected ({selectedStudentIds.length})
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px] tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={eligibleStudents.length > 0 && eligibleStudents.every(s => selectedStudentIds.includes(s.id))}
                        onChange={() => handleToggleSelectAll(eligibleStudents)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                    </th>
                    <th className="p-4 w-28 text-center border-r border-slate-100">Reg ID</th>
                    <th className="p-4">Graduate Name</th>
                    <th className="p-4">Program</th>
                    <th className="p-4 text-center">CGPA</th>
                    <th className="p-4 text-center">Credits Earned</th>
                    <th className="p-4">Degree Class</th>
                    <th className="p-4 text-center">Audit Trails Status</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                        No eligible batch graduates found.
                      </td>
                    </tr>
                  )}
                  {eligibleStudents.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    const classLabel = getDegreeClassification(student.cgpa);
                    return (
                      <tr key={student.id} className={`border-b last:border-b-0 hover:bg-slate-50/40 transition-colors font-medium ${isSelected ? 'bg-indigo-50/10' : ''}`}>
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                              } else {
                                setSelectedStudentIds([...selectedStudentIds, student.id]);
                              }
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                        </td>
                        <td className="p-4 font-mono font-black text-slate-600 text-center border-r border-slate-100 bg-slate-50/20">{student.id}</td>
                        <td className="p-4 font-bold text-slate-800">{student.name}</td>
                        <td className="p-4">{student.program}</td>
                        <td className="p-4 text-center font-bold text-slate-800">{student.cgpa.toFixed(2)}</td>
                        <td className="p-4 text-center text-slate-600">{student.creditsEarned} / {student.creditsRequired}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-[8px] font-black uppercase ${
                            student.cgpa >= 7.75 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {classLabel}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-black uppercase px-2 py-0.5">
                            Ready
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── TAB 3: MANUAL REVIEW / OVERRIDES ─────────────────────────── */}
      {activeTab === 'review' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
              <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Manual Review Queue (Failures)</CardTitle>
              <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Students failing one or more UGC metrics. Registrars can select a student to override and authorize awarding.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px] tracking-wider">
                      <th className="p-4 w-28 text-center border-r border-slate-100">Reg ID</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Program</th>
                      <th className="p-4 text-center">CGPA</th>
                      <th className="p-4 text-center">Credits</th>
                      <th className="p-4 border-l border-slate-100 text-center">Failed Indicators & Info</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualReviewStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-bold uppercase tracking-wider">
                          No students require manual review.
                        </td>
                      </tr>
                    )}
                    {manualReviewStudents.map((student) => {
                      const evidence = getEligibilityEvidence(student);
                      return (
                        <tr key={student.id} className="border-b last:border-b-0 hover:bg-slate-50/40 transition-colors font-medium">
                          <td className="p-4 font-mono font-black text-slate-600 text-center border-r border-slate-100 bg-slate-50/20">{student.id}</td>
                          <td className="p-4 font-bold text-slate-800">{student.name}</td>
                          <td className="p-4">{student.program}</td>
                          <td className="p-4 text-center font-bold text-slate-800">{student.cgpa.toFixed(2)}</td>
                          <td className="p-4 text-center text-slate-600">{student.creditsEarned} / {student.creditsRequired}</td>
                          <td className="p-4 border-l border-slate-100 bg-slate-50/10">
                            <div className="flex flex-col gap-1.5 justify-center items-start pl-2">
                              {!evidence.credits && (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-black uppercase py-0.5 px-2">
                                  ⚠️ CREDITS DEFICIT: {student.creditsEarned}/{student.creditsRequired}
                                </Badge>
                              )}
                              {!evidence.cgpa && (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-black uppercase py-0.5 px-2">
                                  ⚠️ CGPA UNDER-LIMIT: {student.cgpa} &lt; 5.0
                                </Badge>
                              )}
                              {!evidence.duration && (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-black uppercase py-0.5 px-2">
                                  ⚠️ DURATION LIMIT EXCEEDED: {student.durationYears} Years
                                </Badge>
                              )}
                              {!evidence.holds && (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-black uppercase py-0.5 px-2">
                                  ⚠️ HOLDS ACTIVE: {student.academicHolds.join(', ')}
                                </Badge>
                              )}
                              {!evidence.fees && (
                                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[8px] font-black uppercase py-0.5 px-2">
                                  ⚠️ FEES OUTSTANDING: Dues ₹{student.feeDuesAmount?.toLocaleString()}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              onClick={() => setOverrideStudent(student)}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider h-8 rounded-lg shadow-sm"
                            >
                              Authorise Override
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 4: CONFERRED DEGREE RECORDS ──────────────────────────── */}
      {activeTab === 'records' && (
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden animate-in fade-in duration-300">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4 px-6">
            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-wider">Conferred Degrees Registry</CardTitle>
            <CardDescription className="text-[10px] text-slate-400 font-bold uppercase">Official ledger of degrees issued. Fully locked and audit-trail certified.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b font-black text-slate-500 uppercase text-[9px] tracking-wider">
                    <th className="p-4 border-r">Log ID</th>
                    <th className="p-4">Reg ID</th>
                    <th className="p-4">Graduate Name</th>
                    <th className="p-4">Degree Details</th>
                    <th className="p-4">Degree Class</th>
                    <th className="p-4">Certificate ID</th>
                    <th className="p-4">Approver & Stamp</th>
                    <th className="p-4">Audit Type</th>
                    <th className="p-4 text-right">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => {
                    const matchedStudent = students.find(s => s.id === log.studentId);
                    return (
                      <tr key={log.id} className="border-b last:border-b-0 hover:bg-slate-50/40 transition-colors font-medium">
                        <td className="p-4 font-mono font-black text-slate-400 border-r">{log.id}</td>
                        <td className="p-4 font-mono font-bold text-slate-700">{log.studentId}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{log.studentName}</div>
                          <span className="text-[9px] text-slate-400 font-medium block">Timestamp: {log.timestamp}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold">{log.program}</div>
                          <div className="text-[9px] text-slate-400 font-bold">CGPA: {log.cgpa.toFixed(2)}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-[8px] font-black uppercase ${
                            log.cgpa >= 7.75 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {log.degreeClass}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-indigo-700 font-bold">{log.certificateId || 'N/A'}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700">{log.approver}</div>
                          <span className="text-[8px] text-emerald-600 font-black uppercase block tracking-wide">✓ Digital Signature Valid</span>
                        </td>
                        <td className="p-4">
                          {log.decision === 'OVERRIDDEN_AWARDED' ? (
                            <div className="space-y-0.5">
                              <Badge className="bg-amber-100 text-amber-800 border-none text-[8px] font-black uppercase">
                                Overridden
                              </Badge>
                              {log.reason && (
                                <p className="text-[8px] text-amber-700 max-w-xs italic leading-tight">{log.reason}</p>
                              )}
                            </div>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-800 border-none text-[8px] font-black uppercase">
                              Standard
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            onClick={() => {
                              // Recreate mock student context if necessary to preview certificate
                              const tempStudent: Student = matchedStudent || {
                                id: log.studentId,
                                name: log.studentName,
                                program: log.program,
                                creditsEarned: 180,
                                creditsRequired: 180,
                                cgpa: log.cgpa,
                                durationYears: 4,
                                academicHolds: [],
                                feeStatus: 'Cleared',
                                status: 'Awarded',
                                certificateId: log.certificateId,
                                awardDate: log.awardDate,
                                overridden: log.decision === 'OVERRIDDEN_AWARDED',
                                overrideJustification: log.reason
                              };
                              setSelectedCertStudent(tempStudent);
                            }}
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 text-[10px] font-black uppercase tracking-wider h-8 rounded-lg"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1" /> View Cert
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── MODAL: REGISTRAR OVERRIDE JUSTIFICATION ──────────────────── */}
      {overrideStudent && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100">
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-6 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Registrar Manual Override Authorization
              </h3>
              <button onClick={() => setOverrideStudent(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>
            <form onSubmit={handleApplyOverride} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-black uppercase text-[9px]">Student:</span>
                  <span className="font-bold text-slate-800">{overrideStudent.name} ({overrideStudent.id})</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-black uppercase text-[9px]">Program:</span>
                  <span className="font-semibold text-slate-700">{overrideStudent.program}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t pt-2">
                  <span className="text-slate-400 font-black uppercase text-[9px]">Academic Stats:</span>
                  <span className="font-medium text-slate-700">{overrideStudent.creditsEarned} Credits · CGPA {overrideStudent.cgpa}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Written Justification (Audit Evidence)</label>
                <textarea
                  required
                  rows={4}
                  value={justificationText}
                  onChange={(e) => setJustificationText(e.target.value)}
                  placeholder="e.g. Dues cleared via external sponsorship or Medical waiver approved by the academic council."
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={() => setOverrideStudent(null)} className="uppercase font-black text-[9px] border-slate-200">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white uppercase font-black text-[9px]">
                  Authorize & Award
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DEGREE CERTIFICATE PREVIEW ───────────────────────── */}
      {selectedCertStudent && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-100 border border-slate-200 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col h-[90vh]">
            <div className="bg-slate-50 border-b border-slate-200 py-3 px-6 flex justify-between items-center shrink-0">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Certificate Preview: {selectedCertStudent.name}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.print()}
                  size="sm"
                  className="bg-[#000099] hover:bg-blue-800 text-white text-[9px] font-black uppercase tracking-wider h-8 rounded-lg"
                >
                  <Printer className="w-3.5 h-3.5 mr-1" /> Print Certificate
                </Button>
                <button onClick={() => setSelectedCertStudent(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg pl-2 border-l">×</button>
              </div>
            </div>
            
            {/* Scrollable Certificate Display */}
            <div className="flex-grow p-8 overflow-y-auto flex items-center justify-center">
              <div 
                id="certificate-print-area"
                className="bg-white border-[12px] border-double border-amber-800 shadow-xl p-12 max-w-2xl w-full text-center relative overflow-hidden flex flex-col justify-between"
                style={{ minHeight: '680px', fontFamily: '"Times New Roman", Times, serif' }}
              >
                {/* Background watermarks or borders */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                  <Award className="w-[400px] h-[400px] text-amber-800" />
                </div>

                {/* Crest and Title */}
                <div className="space-y-4">
                  <div className="mx-auto w-20 h-20 flex items-center justify-center border-4 border-amber-700/80 rounded-full p-2 bg-amber-50">
                    <ShieldCheck className="w-12 h-12 text-amber-800" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold text-amber-900 tracking-wide uppercase">Academy of Higher Education</h2>
                    <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase font-sans">(Approved under UGC regulations & statutory board norms)</p>
                  </div>
                </div>

                {/* Body Text */}
                <div className="my-10 space-y-4 leading-relaxed text-slate-800 text-sm">
                  <p className="text-xs font-bold uppercase tracking-widest font-sans text-slate-400">This is to certify that</p>
                  <p className="text-2xl font-bold italic text-slate-900 my-2">{selectedCertStudent.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider font-sans text-slate-400">having satisfied the statutory UGC requirements for the award of the degree of</p>
                  <p className="text-xl font-bold text-amber-800 tracking-wide uppercase">{selectedCertStudent.program}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider font-sans text-slate-400">with a Cumulative Grade Point Average of</p>
                  <p className="text-lg font-bold text-slate-900">{selectedCertStudent.cgpa.toFixed(2)} / 10.00</p>
                  <p className="text-xs font-semibold uppercase tracking-wider font-sans text-slate-400">is placed in the division of</p>
                  <p className="text-lg font-bold text-slate-900 uppercase tracking-wide">{getDegreeClassification(selectedCertStudent.cgpa)}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider font-sans text-slate-400">Given under the seal of the Academy this day</p>
                  <p className="text-sm font-semibold text-slate-900 font-sans">{selectedCertStudent.awardDate || '16 June 2026'}</p>
                </div>

                {/* Signatures & Seal */}
                <div className="border-t border-slate-200/80 pt-6 flex justify-between items-end text-xs font-sans text-slate-500">
                  <div className="text-left space-y-1">
                    <p className="font-mono text-[9px] font-black text-slate-400">CERTIFICATE ID: {selectedCertStudent.certificateId || 'CERT-PENDING'}</p>
                    <p className="font-mono text-[9px] font-black text-slate-400">STUDENT REG: {selectedCertStudent.id}</p>
                    {selectedCertStudent.overridden && (
                      <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[8px] font-black uppercase">
                        Manual Override Approved
                      </Badge>
                    )}
                  </div>
                  
                  {/* Seal Stamp */}
                  <div className="w-16 h-16 rounded-full border-2 border-double border-red-500/80 flex items-center justify-center text-red-500/80 font-black text-[8px] rotate-12 bg-red-50/10">
                    ACADEMY SEAL
                  </div>

                  <div className="text-right space-y-2">
                    <div className="w-28 h-6 flex items-center justify-center italic text-slate-800 font-bold border-b border-slate-300">
                      Dr. M. Sharma
                    </div>
                    <p className="text-[9px] font-black uppercase text-slate-400">Registrar / Auth Signatory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default DegreeAwardingSystem;
