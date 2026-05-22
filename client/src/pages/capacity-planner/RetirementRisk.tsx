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

const TimelineCard = ({ title, stat, breakdown, bottom, statColor }: any) => (
  <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
    <CardContent className="p-5">
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <p className="text-2xl font-black mb-4" style={{ color: statColor }}>{stat}</p>
      <div className="space-y-2 mb-4 text-xs">
        {breakdown.map((b: any, i: number) => (
          <div key={i} className="flex justify-between border-b pb-1" style={{ borderColor: DS.border }}>
            <span className="text-slate-500">{b.label}</span>
            <span className="font-bold">{b.val}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded text-center">
        {bottom}
      </div>
    </CardContent>
  </Card>
);

export const RetirementRisk = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg flex items-center gap-2 text-sm font-bold bg-[#FAEEDA] text-[#854F0B] border border-[#F7E1C3]">
        Plan hiring before retirements create gaps. This view combines retirement age data, known resignations, and probation pipeline to show your net future headcount.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimelineCard 
          title="Exits in next 12 months" 
          stat="4 staff leaving" statColor={DS.critical.text}
          breakdown={[{label: 'Retirements', val: 1}, {label: 'Confirmed resignations', val: 2}, {label: 'Contract expiry', val: 1}]}
          bottom="Net impact: -4 headcount"
        />
        <TimelineCard 
          title="Exits in 12–24 months" 
          stat="3 staff leaving" statColor={DS.atRisk.text}
          breakdown={[{label: 'Retirements', val: 2}, {label: 'Predicted attrition', val: 1}]}
          bottom="Net impact: -3 headcount"
        />
        <TimelineCard 
          title="Exits in 24–36 months" 
          stat="5 staff leaving" statColor={DS.atRisk.text}
          breakdown={[{label: 'Retirements', val: 4}, {label: 'Predicted attrition', val: 1}]}
          bottom="Net impact: -5 headcount"
        />
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Staff Approaching Retirement</h3>
            <span className="text-[11px] text-slate-500 font-medium">Based on date of birth and institution retirement age configuration (60 years default)</span>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Designation</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Date of Birth</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Retirement Date</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Months Remaining</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {[
                { n: 'Dr. S. Krishnamurti', d: 'Physics', des: 'Professor', dob: 'Jan 1966', ret: 'Jan 2026', m: '8 months' },
                { n: 'Mrs. R. Balasubramaniam', d: 'Mathematics', des: 'Assoc. Professor', dob: 'Mar 1966', ret: 'Mar 2027', m: '22 months' },
                { n: 'Dr. P. Venkatesh', d: 'Chemistry', des: 'Professor', dob: 'Jul 1966', ret: 'Jul 2027', m: '26 months' },
                { n: 'Mr. K. Sundaram', d: 'Commerce', des: 'Lecturer', dob: 'Nov 1966', ret: 'Nov 2027', m: '30 months' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold">{r.n}</td>
                  <td className="px-4 py-3">{r.d}</td>
                  <td className="px-4 py-3">{r.des}</td>
                  <td className="px-4 py-3">{r.dob}</td>
                  <td className="px-4 py-3 font-bold">{r.ret}</td>
                  <td className="px-4 py-3 text-[#993C1D] font-bold">{r.m}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold px-3 border-[#003f98] text-[#003f98]">Plan Succession</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-6">
          <h3 className="text-sm font-bold mb-4">Net Headcount Projection — 36 Month View</h3>
          
          <div className="h-40 flex items-end gap-12 mt-6 px-10 border-b pb-2 relative" style={{ borderColor: DS.border }}>
            <div className="absolute w-full border-t border-dashed top-10 border-[#fe9b01]/50 z-0"></div>
            {[
              { l: 'Today', h: 100, v: 59 },
              { l: '12 months', h: 90, v: 55 },
              { l: '24 months', h: 85, v: 52 },
              { l: '36 months', h: 80, v: 51 },
            ].map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative z-10 gap-2">
                <span className="text-[10px] font-bold text-slate-500 absolute -top-6">{b.v}</span>
                <div className="w-16 bg-[#003f98] rounded-t-md transition-all" style={{ height: `${b.h}%` }}></div>
                <div className="absolute -bottom-8 text-xs font-bold whitespace-nowrap">{b.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-14 p-4 bg-slate-50 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold">If current hiring pipeline closes on time:</p>
              <p className="text-[11px] text-slate-500">Projected headcount at 36 months = 51 (vs current 59)</p>
              <p className="text-[11px] text-[#993C1D] font-bold">Net deficit if no additional hiring: -8 staff</p>
            </div>
            <Button className="h-9 text-xs font-bold bg-[#003f98] text-white">Create Forward Hiring Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
