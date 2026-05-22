import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

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

export const BudgetHeadcount = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg flex items-center gap-2 text-sm font-bold bg-[#E6F0FD] text-[#003F98] border border-[#C2DBFA]">
        Budget-linked planning tracks how many positions are approved by Finance vs how many are actually filled. Unfilled approved positions are your hiring mandate.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Approved Positions (Budget)" value="68" sub="Finance-approved for FY 2026–27" accent={DS.primary} color={DS.primary} />
        <StatCard label="Filled Positions" value="59" sub="Currently active staff" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="Vacant Approved Positions" value="9" sub="Approved but not yet filled" accent={DS.atRisk.text} color={DS.atRisk.text} />
        <StatCard label="Over-Budget Positions" value="0" sub="No positions filled beyond approved" accent={DS.healthy.text} color={DS.healthy.text} />
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Department-wise Budget vs Actuals</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Approved</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Filled</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Vacant</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Over Budget</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Budget Utilisation</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {[
                { d: 'Physics', a: 8, f: 5, v: 3, o: 0, u: '62%', s: 'Critical', sc: DS.critical },
                { d: 'Computer Science', a: 12, f: 11, v: 1, o: 0, u: '92%', s: 'At Risk', sc: DS.atRisk },
                { d: 'Commerce', a: 6, f: 7, v: 0, o: 1, u: '117%', s: 'Critical', sc: DS.critical, over: true },
                { d: 'Mathematics', a: 10, f: 9, v: 1, o: 0, u: '90%', s: 'At Risk', sc: DS.atRisk },
                { d: 'Economics', a: 5, f: 3, v: 2, o: 0, u: '60%', s: 'Critical', sc: DS.critical },
                { d: 'English', a: 5, f: 5, v: 0, o: 0, u: '100%', s: 'Healthy', sc: DS.healthy },
              ].map((r, i) => (
                <tr key={i} className={`hover:bg-slate-50 ${r.over ? 'border-l-4 border-l-[#993C1D]' : ''}`}>
                  <td className="px-4 py-3 font-bold">{r.d} {r.over && <span className="ml-2 text-[9px] font-bold text-white bg-[#993C1D] px-1.5 py-0.5 rounded">Over Budget</span>}</td>
                  <td className="px-4 py-3 text-center">{r.a}</td>
                  <td className="px-4 py-3 text-center font-bold">{r.f}</td>
                  <td className="px-4 py-3 text-center text-[#854F0B]">{r.v}</td>
                  <td className={`px-4 py-3 text-center font-bold ${r.o > 0 ? 'text-[#993C1D]' : ''}`}>{r.o}</td>
                  <td className="px-4 py-3 text-center">{r.u}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sc.bg, color: r.sc.text }}>{r.s}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F1EFE8] font-bold text-slate-500">
              <tr>
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-center">46</td>
                <td className="px-4 py-3 text-center">40</td>
                <td className="px-4 py-3 text-center">7</td>
                <td className="px-4 py-3 text-center">1</td>
                <td className="px-4 py-3 text-center">87%</td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          </table>
          <div className="p-3 bg-[#FAECE7] text-[#993C1D] text-[11px] font-bold border-t border-[#F5D5CB]">
            Commerce department is over approved budget — Finance review required.
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Update Approved Positions</h3>
            <span className="text-[11px] text-slate-500 font-medium">HR Admin can update Finance-approved positions per department</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Approved Headcount</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Reason for change</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Last updated</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {[
                { d: 'Physics', a: 8, l: 'Mar 12, 2026' },
                { d: 'Computer Science', a: 12, l: 'Apr 04, 2026' },
                { d: 'Commerce', a: 6, l: 'Jan 10, 2026' },
                { d: 'Mathematics', a: 10, l: 'Mar 12, 2026' },
                { d: 'Economics', a: 5, l: 'Mar 12, 2026' },
                { d: 'English', a: 5, l: 'Mar 12, 2026' },
              ].map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-bold">{r.d}</td>
                  <td className="px-4 py-3">
                    <Input type="number" defaultValue={r.a} className="h-8 w-24 text-xs" />
                  </td>
                  <td className="px-4 py-3">
                    <Input placeholder="Optional..." className="h-8 w-full text-xs" />
                  </td>
                  <td className="px-4 py-3 text-slate-400">{r.l}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t flex flex-col gap-4" style={{ borderColor: DS.border }}>
            <Button className="w-fit h-9 text-xs font-bold bg-[#003f98] text-white">Save Budget Configuration</Button>
            <span className="text-[10px] text-slate-400 font-medium">Changes to approved positions require Finance Head sign-off. An approval request will be sent automatically on save.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
