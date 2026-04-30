import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Calendar, RefreshCw, Search, FileSpreadsheet, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePersona } from '../contexts/PersonaContext';
import * as XLSX from 'xlsx-js-style';

interface LeaveRecord {
  id: string;
  staffName: string;
  department: string;
  designation: string;
  staffType: string;
  leaveType: string;
  openingBalance: number;
  jan: number; feb: number; mar: number; apr: number;
  may: number; jun: number; jul: number; aug: number;
  sep: number; oct: number; nov: number; dec: number;
  lopDays: number;
  carryForwardMax: number;
  exited?: boolean;
}

const mockData: LeaveRecord[] = [
  { id: 'EMP-101', staffName: 'Dr. Vivek Sharma', department: 'Computer Science', designation: 'HOD', staffType: 'Teaching', leaveType: 'CL', openingBalance: 12, jan: 1, feb: 0, mar: 2, apr: 0, may: 1, jun: 0, jul: 0, aug: 1, sep: 0, oct: 1, nov: 0, dec: 2, lopDays: 0, carryForwardMax: 0 },
  { id: 'EMP-101', staffName: 'Dr. Vivek Sharma', department: 'Computer Science', designation: 'HOD', staffType: 'Teaching', leaveType: 'SL', openingBalance: 10, jan: 2, feb: 2, mar: 0, apr: 0, may: 0, jun: 0, jul: 5, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 0, carryForwardMax: 5 },
  { id: 'EMP-102', staffName: 'Prof. Anita Desai', department: 'Computer Science', designation: 'Asst. Professor', staffType: 'Teaching', leaveType: 'CL', openingBalance: 12, jan: 0, feb: 0, mar: 1, apr: 2, may: 0, jun: 1, jul: 1, aug: 0, sep: 1, oct: 1, nov: 0, dec: 1, lopDays: 2, carryForwardMax: 0 },
  { id: 'EMP-102', staffName: 'Prof. Anita Desai', department: 'Computer Science', designation: 'Asst. Professor', staffType: 'Teaching', leaveType: 'SL', openingBalance: 10, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 0, carryForwardMax: 5 },
  { id: 'EMP-103', staffName: 'Ms. Rekha Pillai', department: 'Computer Science', designation: 'Lecturer', staffType: 'Teaching', leaveType: 'ML', openingBalance: 90, jan: 0, feb: 30, mar: 30, apr: 30, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 0, carryForwardMax: 0 },
  { id: 'EMP-105', staffName: 'Ramesh Kumawat', department: 'Administration', designation: 'Office Executive', staffType: 'Non-Teaching', leaveType: 'EL', openingBalance: 15, jan: 0, feb: 0, mar: 0, apr: 5, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 5, nov: 0, dec: 2, lopDays: 0, carryForwardMax: 30 },
  { id: 'EMP-105', staffName: 'Ramesh Kumawat', department: 'Administration', designation: 'Office Executive', staffType: 'Non-Teaching', leaveType: 'CL', openingBalance: 8, jan: 1, feb: 1, mar: 1, apr: 0, may: 1, jun: 1, jul: 1, aug: 1, sep: 1, oct: 0, nov: 1, dec: 0, lopDays: 0, carryForwardMax: 0 },
  { id: 'EMP-110', staffName: 'Sunita Rao', department: 'Administration', designation: 'HR Assistant', staffType: 'Non-Teaching', leaveType: 'CL', openingBalance: 10, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 5, carryForwardMax: 0, exited: true },
  { id: 'EMP-201', staffName: 'Dr. John Mathew', department: 'Mechanical Engg', designation: 'Professor', staffType: 'Teaching', leaveType: 'CL', openingBalance: 12, jan: 2, feb: 2, mar: 2, apr: 2, may: 2, jun: 2, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 1, carryForwardMax: 0 },
  { id: 'EMP-201', staffName: 'Dr. John Mathew', department: 'Mechanical Engg', designation: 'Professor', staffType: 'Teaching', leaveType: 'EL', openingBalance: 10, jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 0, carryForwardMax: 30 },
  { id: 'EMP-202', staffName: 'Vikram Singh', department: 'Mechanical Engg', designation: 'Lab Assistant', staffType: 'Non-Teaching', leaveType: 'CL', openingBalance: 12, jan: 0, feb: 0, mar: 1, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, lopDays: 0, carryForwardMax: 0 },
];

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

// ── Leave Type colour palette ──────────────────────────────────
const LEAVE_TYPE_PALETTE: Record<string, { bg: string; text: string; border: string }> = {
  CL:  { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  SL:  { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  EL:  { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  ML:  { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  LOP: { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
};
const leaveTypeStyle = (lt: string) =>
  LEAVE_TYPE_PALETTE[lt] ?? { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };

// ── Month heat cell ────────────────────────────────────────────
const monthCellStyle = (days: number) => {
  if (days === 0) return { bg: 'transparent', text: '#CBD5E1', fw: '400' };
  if (days <= 1)  return { bg: '#DBEAFE', text: '#1E40AF', fw: '600' };
  if (days <= 3)  return { bg: '#FEF3C7', text: '#92400E', fw: '700' };
  return          { bg: '#FEE2E2', text: '#991B1B', fw: '800' };
};

// ── Department colour strip ────────────────────────────────────
const DEPT_ACCENTS = ['#6366F1', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899'];
const deptAccent = (idx: number) => DEPT_ACCENTS[idx % DEPT_ACCENTS.length];

export default function YearlyLeaveBook() {
  usePersona();

  const [year, setYear]           = useState('2024-25');
  const [deptFilter, setDeptFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch]         = useState('');
  const [showLegend, setShowLegend] = useState(false);

  // ── Filtered + sorted data ─────────────────────────────────
  const filteredData = useMemo(() => {
    return mockData
      .filter(d => {
        const matchDept   = deptFilter === 'All' || d.department === deptFilter;
        const matchType   = typeFilter === 'All' || d.staffType  === typeFilter;
        const matchSearch = search === '' ||
          d.staffName.toLowerCase().includes(search.toLowerCase()) ||
          d.id.toLowerCase().includes(search.toLowerCase());
        return matchDept && matchType && matchSearch;
      })
      .sort((a, b) => {
        if (a.department !== b.department) return a.department.localeCompare(b.department);
        if (a.staffName  !== b.staffName)  return a.staffName.localeCompare(b.staffName);
        const order: Record<string, number> = { CL: 0, SL: 1, EL: 2, ML: 3 };
        return (order[a.leaveType] ?? 99) - (order[b.leaveType] ?? 99);
      });
  }, [deptFilter, typeFilter, search]);

  const groupedData = useMemo(() => {
    const groups: Record<string, LeaveRecord[]> = {};
    filteredData.forEach(d => {
      if (!groups[d.department]) groups[d.department] = [];
      groups[d.department].push(d);
    });
    return groups;
  }, [filteredData]);

  // ── Calculations ────────────────────────────────────────────
  const calcAvailed       = (r: LeaveRecord) => MONTHS.reduce((s, m) => s + r[m], 0);
  const calcClosing       = (r: LeaveRecord) => Math.max(0, r.openingBalance - calcAvailed(r));
  const calcCarryForward  = (r: LeaveRecord) => Math.min(calcClosing(r), r.carryForwardMax);
  const calcLapsed        = (r: LeaveRecord) => Math.max(0, calcClosing(r) - r.carryForwardMax);
  const calcGroupTotals   = (recs: LeaveRecord[]) =>
    recs.reduce((acc, r) => ({ availed: acc.availed + calcAvailed(r), lop: acc.lop + r.lopDays }), { availed: 0, lop: 0 });

  const grandTotals = calcGroupTotals(filteredData);

  // ── Excel Export ────────────────────────────────────────────
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData: any[][] = [
      ['Yearly Leave Book (Staff Leave Ledger)'],
      [`Academic Year: ${year} | Department: ${deptFilter} | Generated on: ${new Date().toLocaleDateString()}`],
      [],
      ['Sr. No.','Staff ID','Staff Name','Department','Designation','Staff Type','Leave Type','Opening Balance',
       'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
       'Total Availed','LOP Days','Closing Balance','Carry Forward','Lapsed Days'],
    ];

    let rowIndex = 5, srNo = 1;
    const styles: { cell: string; s: any }[] = [];
    const coord = (r: number, c: number) => XLSX.utils.encode_cell({ r: r - 1, c });

    Object.entries(groupedData).forEach(([dept, records]) => {
      records.forEach(r => {
        const availed = calcAvailed(r), closing = calcClosing(r),
              carry   = calcCarryForward(r), lapsed  = calcLapsed(r);
        wsData.push([
          srNo++, r.id, r.exited ? `${r.staffName} (Exited)` : r.staffName,
          r.department, r.designation, r.staffType, r.leaveType, r.openingBalance,
          ...MONTHS.map(m => r[m] || '-'),
          availed, r.lopDays, closing, carry, lapsed,
        ]);
        if (r.lopDays > 0)
          styles.push({ cell: coord(rowIndex, 21), s: { fill: { fgColor: { rgb: 'FFC000' } }, font: { bold: true } } });
        if (closing === 0)
          styles.push({ cell: coord(rowIndex, 22), s: { fill: { fgColor: { rgb: 'FECACA' } }, font: { bold: true, color: { rgb: '991B1B' } } } });
        rowIndex++;
      });
      const sub = calcGroupTotals(records);
      const subRow = Array(25).fill('');
      subRow[3] = `${dept} — Subtotal`; subRow[20] = sub.availed; subRow[21] = sub.lop;
      wsData.push(subRow);
      for (let c = 0; c < 25; c++)
        styles.push({ cell: coord(rowIndex, c), s: { font: { bold: true }, fill: { fgColor: { rgb: 'E0E7FF' } } } });
      rowIndex++;
    });

    const grandRow = Array(25).fill('');
    grandRow[3] = 'GRAND TOTAL'; grandRow[20] = grandTotals.availed; grandRow[21] = grandTotals.lop;
    wsData.push(grandRow);
    for (let c = 0; c < 25; c++)
      styles.push({ cell: coord(rowIndex, c), s: { font: { bold: true, sz: 12 }, fill: { fgColor: { rgb: '1E293B' } }, color: { rgb: 'FFFFFF' } } });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['A1'] = { v: wsData[0][0], t: 's', s: { font: { bold: true, sz: 14 } } };
    ws['A2'] = { v: wsData[1][0], t: 's', s: { font: { italic: true, color: { rgb: '555555' } } } };
    for (let c = 0; c < 25; c++) {
      const cell = coord(4, c);
      if (ws[cell]) ws[cell].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: '1A1A2E' } }, alignment: { horizontal: 'center' } };
    }
    styles.forEach(({ cell, s }) => { if (ws[cell]) ws[cell].s = { ...(ws[cell].s || {}), ...s }; });
    ws['!freeze'] = { xSplit: 7, ySplit: 4, topLeftCell: 'H5', activePane: 'bottomRight', state: 'frozen' };
    XLSX.utils.book_append_sheet(wb, ws, 'Yearly Leave Book');
    XLSX.writeFile(wb, `Staff_Leave_Ledger_${year.replace('-', '_')}.xlsx`);
  };

  const deptKeys = Object.keys(groupedData);

  return (
    <Layout title="Yearly Leave Book" description="Annual staff leave ledger — balances, availed, LOP & carry forward" icon={Calendar} showHome showBack>
      <div className="space-y-5 animate-in fade-in pb-10">

        {/* ── Filter Card ────────────────────────────────── */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'Academic Year', value: year, setter: setYear,
                opts: [['2023-24','2023-24'],['2024-25','2024-25'],['2025-26','2025-26']] },
              { label: 'Department', value: deptFilter, setter: setDeptFilter,
                opts: [['All','All Departments'],['Computer Science','Computer Science'],['Mechanical Engg','Mechanical Engg'],['Administration','Administration']] },
              { label: 'Staff Type', value: typeFilter, setter: setTypeFilter,
                opts: [['All','All Types'],['Teaching','Teaching'],['Non-Teaching','Non-Teaching']] },
            ].map(({ label, value, setter, opts }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
                <select
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition"
                >
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Staff</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text" placeholder="Staff ID or Name…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">{filteredData.length} records</span>
              <button
                onClick={() => setShowLegend(v => !v)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                <Info className="w-3.5 h-3.5" /> {showLegend ? 'Hide' : 'Show'} Legend
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => { setDeptFilter('All'); setTypeFilter('All'); setSearch(''); }} className="bg-white text-sm">
                <RefreshCw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 font-bold">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Excel
              </Button>
            </div>
          </div>

          {/* ── Legend panel ────────────────────────────── */}
          {showLegend && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1.5">
                <p className="font-black text-slate-600 uppercase tracking-wider mb-2">Leave Types</p>
                {Object.entries(LEAVE_TYPE_PALETTE).map(([lt, s]) => (
                  <span key={lt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold mr-1.5"
                    style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
                    {lt}
                  </span>
                ))}
              </div>
              <div className="space-y-1.5">
                <p className="font-black text-slate-600 uppercase tracking-wider mb-2">Month Heat</p>
                <div className="flex flex-col gap-1">
                  {[['0 days','#F1F5F9','#94A3B8'],['1 day','#DBEAFE','#1E40AF'],['2–3 days','#FEF3C7','#92400E'],['4+ days','#FEE2E2','#991B1B']].map(([lbl,bg,text]) => (
                    <span key={lbl} className="inline-flex items-center gap-2 px-2 py-0.5 rounded font-semibold" style={{ background: bg, color: text }}>● {lbl}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="font-black text-slate-600 uppercase tracking-wider mb-2">Key Columns</p>
                <div className="flex flex-col gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">LOP &gt; 0 → Amber</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">Cl. Bal = 0 → Red</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Carry Fwd &gt; 0 → Green</span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">Lapsed &gt; 0 → Orange</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="font-black text-slate-600 uppercase tracking-wider mb-2">Row Types</p>
                <div className="flex flex-col gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white border text-slate-700 font-semibold">Normal data row</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">Dept subtotal row</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-black">Grand total row</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">(Exited) staff</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Table ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ maxHeight: '72vh' }}>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">

              {/* ── HEADER ────────────────────────────────── */}
              <thead className="sticky top-0 z-30">
                {/* Group row */}
                <tr>
                  <th colSpan={7} className="sticky bg-[#0F172A] text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-1.5 border-b border-slate-700" style={{ left: 0, zIndex: 41 }}>
                    Staff Details (frozen)
                  </th>
                  <th className="bg-[#0F172A] text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-1.5 border-b border-slate-700">Opening</th>
                  <th colSpan={12} className="bg-[#1E293B] text-[10px] font-black text-blue-300 uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">Monthly Leave Availed</th>
                  <th className="bg-[#1C2434] text-[10px] font-black text-white uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">Total</th>
                  <th className="bg-amber-900/80 text-[10px] font-black text-amber-200 uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">LOP</th>
                  <th className="bg-[#1C2434] text-[10px] font-black text-blue-200 uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">Closing</th>
                  <th className="bg-emerald-900/60 text-[10px] font-black text-emerald-200 uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">Carry</th>
                  <th className="bg-orange-900/60 text-[10px] font-black text-orange-200 uppercase tracking-widest px-4 py-1.5 text-center border-b border-slate-700">Lapsed</th>
                </tr>
                {/* Column names */}
                <tr className="text-xs font-bold text-slate-200" style={{ background: '#1A1A2E' }}>
                  <th style={{ left: 0   }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40">#</th>
                  <th style={{ left: 40  }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40">Staff ID</th>
                  <th style={{ left: 120 }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40 min-w-[170px]">Staff Name</th>
                  <th style={{ left: 290 }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40">Department</th>
                  <th style={{ left: 440 }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40">Designation</th>
                  <th style={{ left: 580 }} className="sticky bg-[#1A1A2E] px-4 py-3 border-b border-slate-700 z-40">Type</th>
                  <th style={{ left: 660 }} className="sticky bg-[#252540] px-4 py-3 border-b border-r border-slate-600 z-40 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.5)]">Leave Type</th>
                  <th className="px-4 py-3 border-b border-slate-700 text-center">Op. Bal</th>
                  {MONTHS.map(m => (
                    <th key={m} className="px-3 py-3 border-b border-slate-700 text-center uppercase tracking-widest text-[10px]">{m}</th>
                  ))}
                  <th className="px-4 py-3 border-b border-slate-700 text-center bg-[#252540]">Availed</th>
                  <th className="px-4 py-3 border-b border-slate-700 text-center bg-amber-900/70 text-amber-300">LOP</th>
                  <th className="px-4 py-3 border-b border-slate-700 text-center bg-[#252540]">Cl. Bal</th>
                  <th className="px-4 py-3 border-b border-slate-700 text-center bg-[#1a3828] text-emerald-300">Carry Fwd</th>
                  <th className="px-4 py-3 border-b border-slate-700 text-center bg-[#3b1f0f] text-orange-300">Lapsed</th>
                </tr>
              </thead>

              {/* ── BODY ──────────────────────────────────── */}
              <tbody>
                {deptKeys.length === 0 && (
                  <tr>
                    <td colSpan={25} className="px-6 py-16 text-center text-slate-500 font-medium bg-white">
                      No records match the selected filters.
                    </td>
                  </tr>
                )}

                {deptKeys.map((dept, deptIdx) => {
                  const records = groupedData[dept];
                  const accent  = deptAccent(deptIdx);
                  let srNo = filteredData.indexOf(records[0]) + 1;

                  return (
                    <React.Fragment key={dept}>
                      {/* Department header strip */}
                      <tr>
                        <td colSpan={25} style={{ background: accent + '18', borderLeft: `4px solid ${accent}` }}
                          className="px-5 py-2 text-xs font-black uppercase tracking-widest border-y border-slate-200">
                          <span style={{ color: accent }}>{dept}</span>
                          <span className="ml-2 font-medium text-slate-500">— {records.length} records</span>
                        </td>
                      </tr>

                      {/* Data rows */}
                      {records.map((r, rowIdx) => {
                        const availed  = calcAvailed(r);
                        const closing  = calcClosing(r);
                        const carry    = calcCarryForward(r);
                        const lapsed   = calcLapsed(r);
                        const lt       = leaveTypeStyle(r.leaveType);
                        const isExited = !!r.exited;
                        const rowBg    = isExited ? '#FFF1F2' : rowIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

                        return (
                          <tr key={`${r.id}-${r.leaveType}`}
                            className="group transition-colors duration-75 hover:brightness-95"
                            style={{ background: rowBg }}>

                            {/* ── Frozen cols ── */}
                            <td style={{ left: 0,   background: rowBg }} className="sticky px-4 py-2 text-xs text-slate-400 z-20 border-b border-slate-100 group-hover:bg-blue-50">{srNo++}</td>
                            <td style={{ left: 40,  background: rowBg }} className="sticky px-4 py-2 z-20 border-b border-slate-100 group-hover:bg-blue-50">
                              <span className="font-mono text-xs font-bold text-slate-600">{r.id}</span>
                            </td>
                            <td style={{ left: 120, background: rowBg }} className="sticky px-4 py-2 z-20 border-b border-slate-100 min-w-[170px] group-hover:bg-blue-50">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0"
                                  style={{ background: accent }}>
                                  {r.staffName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900 leading-tight">{r.staffName}</p>
                                  {isExited && (
                                    <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black">EXITED</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={{ left: 290, background: rowBg }} className="sticky px-4 py-2 text-xs text-slate-600 z-20 border-b border-slate-100 group-hover:bg-blue-50">{r.department}</td>
                            <td style={{ left: 440, background: rowBg }} className="sticky px-4 py-2 text-xs text-slate-600 z-20 border-b border-slate-100 group-hover:bg-blue-50 max-w-[130px] truncate" title={r.designation}>{r.designation}</td>
                            <td style={{ left: 580, background: rowBg }} className="sticky px-4 py-2 z-20 border-b border-slate-100 group-hover:bg-blue-50">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${r.staffType === 'Teaching' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'}`}>
                                {r.staffType === 'Teaching' ? 'TCH' : 'N-TCH'}
                              </span>
                            </td>
                            <td style={{ left: 660 }}
                              className="sticky px-3 py-2 z-20 border-b border-r border-slate-200 group-hover:brightness-95 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.12)]"
                              >
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-black"
                                style={{ background: lt.bg, color: lt.text, border: `1px solid ${lt.border}` }}>
                                {r.leaveType}
                              </span>
                            </td>

                            {/* ── Opening Balance ── */}
                            <td className="px-4 py-2 text-center border-b border-slate-100">
                              <span className="text-sm font-black text-slate-700">{r.openingBalance}</span>
                            </td>

                            {/* ── Month Cells ── */}
                            {MONTHS.map(m => {
                              const ms = monthCellStyle(r[m]);
                              return (
                                <td key={m} className="px-2 py-2 text-center border-b border-slate-100" style={{ minWidth: 36 }}>
                                  {r[m] > 0 ? (
                                    <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[11px]"
                                      style={{ background: ms.bg, color: ms.text, fontWeight: ms.fw }}>
                                      {r[m]}
                                    </span>
                                  ) : (
                                    <span className="text-slate-200 text-xs">–</span>
                                  )}
                                </td>
                              );
                            })}

                            {/* ── Summary cols ── */}
                            {/* Total Availed */}
                            <td className="px-4 py-2 text-center border-b border-slate-100 bg-slate-50">
                              <span className="font-black text-slate-800 text-sm">{availed}</span>
                            </td>

                            {/* LOP Days */}
                            <td className={`px-4 py-2 text-center border-b border-slate-100 ${r.lopDays > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}>
                              {r.lopDays > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-white">
                                  ⚠ {r.lopDays}d
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">–</span>
                              )}
                            </td>

                            {/* Closing Balance */}
                            <td className={`px-4 py-2 text-center border-b border-slate-100 ${closing === 0 ? 'bg-rose-50' : 'bg-slate-50'}`}>
                              {closing === 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white">
                                  0
                                </span>
                              ) : (
                                <span className="font-bold text-blue-700 text-sm">{closing}</span>
                              )}
                            </td>

                            {/* Carry Forward */}
                            <td className={`px-4 py-2 text-center border-b border-slate-100 ${carry > 0 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                              {carry > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-emerald-500 text-white">
                                  ✓ {carry}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">–</span>
                              )}
                            </td>

                            {/* Lapsed Days */}
                            <td className={`px-4 py-2 text-center border-b border-slate-100 ${lapsed > 0 ? 'bg-orange-50' : 'bg-white'}`}>
                              {lapsed > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-400 text-white">
                                  {lapsed}d
                                </span>
                              ) : (
                                <span className="text-slate-200 text-xs">–</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* ── Department Subtotal Row ────────── */}
                      <tr style={{ background: accent + '15', borderLeft: `4px solid ${accent}` }}
                        className="border-y border-slate-200 font-bold">
                        <td colSpan={6} className="sticky px-4 py-3 z-20" style={{ left: 0, background: accent + '15' }}></td>
                        <td className="sticky px-4 py-3 z-20 text-right text-[11px] font-black uppercase tracking-widest"
                          style={{ left: 660, background: accent + '25', color: accent, borderRight: '1px solid #E2E8F0' }}>
                          {dept} Total
                        </td>
                        <td className="px-4 py-3 text-center text-slate-500 text-xs">—</td>
                        {MONTHS.map(m => <td key={m} className="px-2 py-3 text-center text-slate-400 text-xs">—</td>)}
                        <td className="px-4 py-3 text-center font-black text-slate-800">
                          <span className="px-3 py-1 rounded-full text-sm" style={{ background: accent + '20', color: accent }}>
                            {calcGroupTotals(records).availed}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-center font-black ${calcGroupTotals(records).lop > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                          {calcGroupTotals(records).lop > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-xs font-black">{calcGroupTotals(records).lop}d LOP</span>
                          ) : '–'}
                        </td>
                        <td colSpan={3} className="px-4 py-3"></td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>

              {/* ── GRAND TOTAL ────────────────────────────── */}
              {filteredData.length > 0 && (
                <tfoot className="sticky bottom-0 z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.15)]">
                  <tr style={{ background: '#0F172A' }} className="text-white font-black">
                    <td colSpan={6} className="sticky px-4 py-4 z-30 bg-[#0F172A]" style={{ left: 0 }}></td>
                    <td className="sticky px-4 py-4 z-30 text-right text-[11px] uppercase tracking-widest bg-[#1E293B]"
                      style={{ left: 660, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                      Grand Total
                    </td>
                    <td className="px-4 py-4 text-center text-slate-400 text-xs">—</td>
                    {MONTHS.map(m => <td key={m} className="px-2 py-4 text-center text-slate-600 text-xs">—</td>)}
                    <td className="px-4 py-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-500 text-white font-black text-sm">{grandTotals.availed}</span>
                    </td>
                    <td className="px-4 py-4 text-center bg-amber-900/40">
                      {grandTotals.lop > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-white font-black text-sm">{grandTotals.lop}</span>
                      ) : <span className="text-slate-600">–</span>}
                    </td>
                    <td colSpan={3} className="px-4 py-4 text-slate-600"></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
