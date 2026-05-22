import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const DS = {
  primary: '#003f98',
  accent: '#fe9b01',
  bg: '#f8f9ff',
  cardBg: '#FFFFFF',
  border: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  critical: { text: '#dc2626', bg: '#fef2f2' },
  atRisk: { text: '#d97706', bg: '#fffbeb' },
  healthy: { text: '#475569', bg: '#f1f5f9' },
  neutral: { text: '#64748b', bg: '#f8fafc' },
  purple: { text: '#4f46e5', bg: '#eef2ff' },
  fontSans: '"DM Sans", sans-serif',
  fontMono: '"DM Mono", monospace',
};

const StatCard = ({ label, value, sub, accent, color }: { label: string; value: string | number; sub: string; accent: string; color: string }) => (
  <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:shadow-md transition-shadow" style={{ borderRadius: '12px' }}>
    <CardContent className="p-5">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black leading-none tracking-tight mb-2" style={{ color, fontFamily: DS.fontSans }}>{value}</p>
      <p className="text-[10px] font-medium text-slate-500">{sub}</p>
    </CardContent>
  </Card>
);

export const WorkloadPlanner = ({ instType }: { instType: 'SCHOOL' | 'COLLEGE' }) => {
  if (instType === 'COLLEGE') {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg flex items-center gap-2 text-sm font-bold bg-[#EEEDFE] text-[#534AB7] border border-[#DEDCFC]">
          Workload planning calculates capacity from actual course load — not just headcount ratios. More accurate than ratio-only planning.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Credit Hours this Semester" value="840 hrs" sub="Across all departments" accent={DS.primary} color={DS.primary} />
          <StatCard label="Faculty Load Capacity" value="720 hrs" sub="Current permanent staff at max load" accent={DS.healthy.text} color={DS.healthy.text} />
          <StatCard label="Visiting Faculty Coverage" value="60 hrs" sub="Contracted this semester" accent={DS.accent} color={DS.accent} />
          <StatCard label="Uncovered Load" value="60 hrs" sub="Requires additional faculty" accent={DS.critical.text} color={DS.critical.text} />
        </div>
        <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
          <CardContent className="p-0">
            <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
              <h3 className="text-sm font-bold">Department-wise Load vs Capacity</h3>
              <span className="text-[11px] text-slate-500 font-medium">Each faculty handles max 18 credit hours per semester (configurable)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Total Credit Hours</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Faculty Count</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Max Load Capacity</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Visiting Hours</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Effective Capacity</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Uncovered</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: DS.border }}>
                  {[
                    { dept: 'Physics', cr: 120, fac: 5, max: 90, vis: 10, eff: 100, unc: 20, stat: 'Critical', sColor: DS.critical },
                    { dept: 'Computer Science', cr: 144, fac: 10, max: 180, vis: 10, eff: 190, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                    { dept: 'Commerce', cr: 96, fac: 7, max: 126, vis: 0, eff: 126, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                    { dept: 'Mathematics', cr: 120, fac: 9, max: 162, vis: 10, eff: 172, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                    { dept: 'Economics', cr: 72, fac: 3, max: 54, vis: 0, eff: 54, unc: 18, stat: 'Critical', sColor: DS.critical },
                    { dept: 'English', cr: 60, fac: 5, max: 90, vis: 0, eff: 90, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-4 py-3 font-bold">{r.dept}</td>
                      <td className="px-4 py-3 text-center">{r.cr} hrs</td>
                      <td className="px-4 py-3 text-center">{r.fac}</td>
                      <td className="px-4 py-3 text-center">{r.max} hrs</td>
                      <td className="px-4 py-3 text-center">{r.vis} hrs</td>
                      <td className="px-4 py-3 text-center font-bold">{r.eff} hrs</td>
                      <td className={`px-4 py-3 text-center font-bold ${r.unc > 0 ? 'text-[#993C1D]' : 'text-[#0F6E56]'}`}>{r.unc} hrs</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sColor.bg, color: r.sColor.text }}>{r.stat}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F1EFE8] font-bold" style={{ color: DS.textSecondary }}>
                  <tr>
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3 text-center">612 hrs</td>
                    <td className="px-4 py-3 text-center">—</td>
                    <td className="px-4 py-3 text-center">702 hrs</td>
                    <td className="px-4 py-3 text-center">30 hrs</td>
                    <td className="px-4 py-3 text-center">732 hrs</td>
                    <td className="px-4 py-3 text-center text-[#993C1D]">38 hrs uncovered</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
        <p className="text-[10px] font-bold text-slate-400">Max load per faculty: 18 credit hrs/semester · Click 'Configure ratios' to change.</p>
      </div>
    );
  }

  // School View
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg flex items-center gap-2 text-sm font-bold bg-[#EEEDFE] text-[#534AB7] border border-[#DEDCFC]">
        Workload planning calculates capacity from actual course load — not just headcount ratios. More accurate than ratio-only planning.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Periods/Week Required" value="520" sub="Across all grades and sections" accent={DS.primary} color={DS.primary} />
        <StatCard label="Teacher Load Capacity" value="460" sub="Current teachers at max periods" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="Guest Teacher Coverage" value="20" sub="This week" accent={DS.accent} color={DS.accent} />
        <StatCard label="Uncovered Periods" value="40" sub="Unassigned this week" accent={DS.critical.text} color={DS.critical.text} />
      </div>
      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Grade-wise Load vs Capacity</h3>
            <span className="text-[11px] text-slate-500 font-medium">Each teacher handles max 24 periods per week (configurable)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Sections</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Total Periods/Week</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Teachers Available</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Max Load Capacity</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Uncovered</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: DS.border }}>
                {[
                  { grade: 'Grade 6', sec: 4, per: 160, teach: 7, max: 168, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                  { grade: 'Grade 7', sec: 4, per: 160, teach: 6, max: 144, unc: 16, stat: 'Critical', sColor: DS.critical },
                  { grade: 'Grade 8', sec: 3, per: 120, teach: 4, max: 96, unc: 24, stat: 'Critical', sColor: DS.critical },
                  { grade: 'Grade 9', sec: 2, per: 80, teach: 4, max: 96, unc: 0, stat: 'Healthy', sColor: DS.healthy },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold">{r.grade}</td>
                    <td className="px-4 py-3 text-center">{r.sec}</td>
                    <td className="px-4 py-3 text-center">{r.per}</td>
                    <td className="px-4 py-3 text-center">{r.teach}</td>
                    <td className="px-4 py-3 text-center">{r.max}</td>
                    <td className={`px-4 py-3 text-center font-bold ${r.unc > 0 ? 'text-[#993C1D]' : 'text-[#0F6E56]'}`}>{r.unc}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sColor.bg, color: r.sColor.text }}>{r.stat}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
