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

export const NAACReadiness = ({ instType }: { instType: 'SCHOOL' | 'COLLEGE' }) => {
  if (instType === 'SCHOOL') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-sm font-bold text-slate-800">NAAC Readiness is applicable to Degree and PG College institutions.</p>
        <p className="text-xs text-slate-500 mt-2">This view is not available for School institutions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg flex items-center justify-between gap-4 bg-[#FAEEDA] text-[#854F0B] border border-[#F7E1C3]">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div className="flex flex-col">
            <span className="text-sm font-bold">Staff profile completeness: 84%</span>
            <span className="text-[11px] font-medium">Incomplete profiles affect NAAC score accuracy.</span>
          </div>
        </div>
        <Button variant="outline" className="h-8 text-xs font-bold border-[#854F0B] text-[#854F0B] hover:bg-[#854F0B] hover:text-white">View incomplete profiles →</Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden" style={{ borderRadius: '14px' }}>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="stroke-[#F1EFE8]" fill="none" strokeWidth="3" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="stroke-[#fe9b01]" fill="none" strokeWidth="3" strokeDasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-[#854F0B]">3.2</span>
              <span className="text-sm font-bold text-slate-400">/ 4.0</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-start gap-4">
            <div>
              <h2 className="text-2xl font-black mb-1" style={{ color: DS.text }}>NAAC Criterion 2 Score (Estimated)</h2>
              <p className="text-xs text-slate-500 font-medium">Based on current faculty profile data from HRMS Staff Profiles and Payroll</p>
            </div>
            <Badge className="bg-[#FAEEDA] text-[#854F0B] border-none text-xs font-black px-3 py-1">Score band: B+ (estimated)</Badge>
            <p className="text-[10px] font-bold text-slate-400 mt-2" style={{ fontFamily: DS.fontMono }}>Last synced: 2026-05-15 09:14:22</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
            <CardContent className="p-0">
              <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
                <h3 className="text-sm font-bold">Criterion 2 Sub-Parameter Status</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Parameter</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Your Value</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Benchmark</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Gap</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Score</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: DS.border }}>
                  {[
                    { p: 'Faculty with PhD qualification', y: '68%', b: '60%', g: '+8%', s: '4/4', st: 'Healthy', sc: DS.healthy },
                    { p: 'Permanent to visiting ratio', y: '82%', b: '80%', g: '+2%', s: '4/4', st: 'Healthy', sc: DS.healthy },
                    { p: 'Faculty with 10+ years experience', y: '44%', b: '50%', g: '-6%', s: '2/4', st: 'At Risk', sc: DS.atRisk },
                    { p: 'Faculty adequacy (ratio compliance)', y: '78%', b: '85%', g: '-7%', s: '3/4', st: 'At Risk', sc: DS.atRisk },
                    { p: 'Faculty with research publications', y: '34%', b: '40%', g: '-6%', s: '2/4', st: 'Critical', sc: DS.critical },
                    { p: 'Faculty attending FDPs in last 2 yrs', y: '52%', b: '50%', g: '+2%', s: '4/4', st: 'Healthy', sc: DS.healthy },
                    { p: 'Faculty with patents or innovation', y: '8%', b: '10%', g: '-2%', s: '2/4', st: 'At Risk', sc: DS.atRisk },
                    { p: 'Student-faculty interaction score', y: '3.4/5', b: '3.5/5', g: '-0.1', s: '3/4', st: 'At Risk', sc: DS.atRisk },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50 cursor-pointer group">
                      <td className="px-4 py-3 font-bold group-hover:text-[#003f98]">{r.p}</td>
                      <td className="px-4 py-3 text-center font-bold">{r.y}</td>
                      <td className="px-4 py-3 text-center text-slate-500">{r.b}</td>
                      <td className={`px-4 py-3 text-center font-bold ${r.g.startsWith('-') ? 'text-[#993C1D]' : 'text-[#0F6E56]'}`}>{r.g}</td>
                      <td className="px-4 py-3 text-center font-bold">{r.s}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sc.bg, color: r.sc.text }}>{r.st}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400">
                Data sourced from Staff Profiles, Payroll, and manually entered research data. Update staff qualification profiles to improve NAAC score accuracy.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-sm h-full" style={{ borderRadius: '14px' }}>
            <CardContent className="p-0 flex flex-col h-full">
              <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
                <h3 className="text-sm font-bold">Actions to Improve NAAC Score</h3>
              </div>
              <div className="p-4 space-y-4 flex-1">
                {[
                  { p: 'High', c: DS.critical, t: 'Update PhD qualification for 6 faculty whose records are incomplete', btn: 'Open Staff Profiles' },
                  { p: 'Medium', c: DS.atRisk, t: 'Record FDP attendance for 12 faculty from last academic year', btn: 'Update Records' },
                  { p: 'Low', c: DS.healthy, t: 'Enter publication data for faculty in research departments', btn: 'Open Research Records' },
                ].map((r, i) => (
                  <div key={i} className="p-4 rounded-xl border bg-slate-50 flex flex-col gap-3" style={{ borderColor: DS.border }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.c.text }}></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: r.c.text }}>Priority {r.p}</span>
                    </div>
                    <p className="text-xs font-bold leading-snug text-slate-700">{r.t}</p>
                    <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold border-slate-300 hover:border-[#003f98] hover:text-[#003f98]">{r.btn}</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
