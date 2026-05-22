import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

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

export const PTRCompliance = ({ instType }: { instType: 'SCHOOL' | 'COLLEGE' }) => {
  if (instType === 'COLLEGE') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-800">PTR Report is applicable to School institutions under CBSE, ICSE, or State board.</p>
        <p className="text-xs text-slate-500 mt-2">This view is not available for College institutions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Overall PTR" value="1:28" sub="Institution average (CBSE norm: 1:30)" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="Grades Non-Compliant" value="1 grade" sub="Requires immediate assignment" accent={DS.critical.text} color={DS.critical.text} />
        <StatCard label="Report Ready for Submission" value="Yes" sub="Format follows CBSE template" accent={DS.healthy.text} color={DS.healthy.text} />
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Grade-wise PTR — CBSE Compliance</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Sections</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Total Students</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Teachers Assigned</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">PTR</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">CBSE Norm</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Compliant</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {[
                { g: 'Grade 1–5 (Primary)', s: 20, ts: 500, ta: 20, ptr: '1:25', n: '1:30', c: 'Yes', sc: DS.healthy },
                { g: 'Grade 6–8 (Middle)', s: 12, ts: 336, ta: 12, ptr: '1:28', n: '1:30', c: 'Yes', sc: DS.healthy },
                { g: 'Grade 9', s: 4, ts: 128, ta: 4, ptr: '1:32', n: '1:30', c: 'No', sc: DS.critical },
                { g: 'Grade 10', s: 4, ts: 116, ta: 4, ptr: '1:29', n: '1:30', c: 'Yes', sc: DS.healthy },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold">{r.g}</td>
                  <td className="px-4 py-3 text-center">{r.s}</td>
                  <td className="px-4 py-3 text-center">{r.ts}</td>
                  <td className="px-4 py-3 text-center">{r.ta}</td>
                  <td className={`px-4 py-3 text-center font-bold ${r.c === 'No' ? 'text-[#993C1D]' : 'text-[#0F6E56]'}`}>{r.ptr}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{r.n}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sc.bg, color: r.sc.text }}>
                      {r.c === 'No' ? 'Non-Compliant' : 'Compliant'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.c === 'No' ? (
                      <div className="flex flex-col gap-1 items-center">
                        <span className="text-[9px] text-[#993C1D] font-bold">2 teachers needed</span>
                        <Button size="sm" className="h-7 text-[10px] font-bold px-3 bg-[#003f98] text-white">Assign Teacher</Button>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold mb-4">Export for Board / Regulatory Submission</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="h-10 text-xs font-bold border-slate-300">Export as PDF</Button>
            <Button variant="outline" className="h-10 text-xs font-bold border-slate-300">Export as Excel</Button>
            <Button className="h-10 text-xs font-bold bg-[#003f98] text-white">Send to Board Portal</Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-4 font-medium">Format follows CBSE affiliation reporting template.</p>
        </CardContent>
      </Card>
    </div>
  );
};
