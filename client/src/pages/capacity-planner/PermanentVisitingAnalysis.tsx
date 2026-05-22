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

export const PermanentVisitingAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg flex items-center gap-2 text-sm font-bold bg-[#FAEEDA] text-[#854F0B] border border-[#F7E1C3]">
        UGC recommends minimum 80% permanent faculty. High visiting dependency increases accreditation risk and operational instability.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Permanent Faculty" value="53" sub="88% of effective strength" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="Visiting / Contract Faculty" value="6" sub="10% of effective strength" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="Visiting Dependency Risk" value="Low" sub="Group wide average" accent={DS.healthy.text} color={DS.healthy.text} />
        <StatCard label="UGC Benchmark" value="80% req." sub="88% current" accent={DS.healthy.text} color={DS.healthy.text} />
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Permanent vs Visiting — Department Breakdown</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4 mb-6">
              {[
                { d: 'Physics', p: 83, v: 17 },
                { d: 'Comp Science', p: 91, v: 9 },
                { d: 'Commerce', p: 100, v: 0 },
                { d: 'Mathematics', p: 90, v: 10 },
                { d: 'Economics', p: 100, v: 0 },
                { d: 'English', p: 100, v: 0 }
              ].map(item => (
                <div key={item.d} className="flex items-center gap-4 text-xs font-bold">
                  <div className="w-24 text-right">{item.d}</div>
                  <div className="flex-1 h-4 flex rounded-full overflow-hidden bg-slate-100">
                    <div className="h-full bg-[#003f98]" style={{ width: `${item.p}%` }}></div>
                    <div className="h-full bg-[#fe9b01]" style={{ width: `${item.v}%` }}></div>
                  </div>
                  <div className="w-12 text-slate-500">{item.v}%</div>
                </div>
              ))}
            </div>
            
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Permanent</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Visiting</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Total</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Permanent %</th>
                  <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: DS.border }}>
                {[
                  { d: 'Physics', p: 5, v: 1, t: 6, pp: 83, r: 'Low', c: DS.healthy },
                  { d: 'Economics', p: 3, v: 0, t: 3, pp: 100, r: 'Below Count', c: DS.atRisk },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold">{r.d}</td>
                    <td className="px-4 py-3 text-center">{r.p}</td>
                    <td className="px-4 py-3 text-center">{r.v}</td>
                    <td className="px-4 py-3 text-center">{r.t}</td>
                    <td className="px-4 py-3 text-center font-bold">{r.pp}%</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.c.bg, color: r.c.text }}>{r.r}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Visiting Faculty — Contract Status</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Hours/Week</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Contract Until</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Renewal Status</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {[
                { n: 'Dr. Deepa Rao', d: 'Physics', h: '10 hrs', c: 'Jun 2026', s: 'Expiring 30 days', sc: DS.atRisk, act: 'Renew' },
                { n: 'Prof. Anand Mehta', d: 'Computer Science', h: '8 hrs', c: 'Aug 2026', s: 'Active', sc: DS.healthy, act: 'View' },
                { n: 'Mrs. Priya Sharma', d: 'Mathematics', h: '12 hrs', c: 'Jul 2026', s: 'Expiring 60 days', sc: DS.atRisk, act: 'Renew' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold">{r.n}</td>
                  <td className="px-4 py-3">{r.d}</td>
                  <td className="px-4 py-3">{r.h}</td>
                  <td className="px-4 py-3 font-bold">{r.c}</td>
                  <td className="px-4 py-3">
                    <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sc.bg, color: r.sc.text }}>{r.s}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant={r.act === 'Renew' ? 'default' : 'outline'} className={`h-7 text-[10px] font-bold px-3 ${r.act === 'Renew' ? 'bg-[#003f98] text-white' : ''}`}>
                      {r.act}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400">
            Visiting faculty counted at 0.5 weight in regulatory ratio calculations. Contracts expiring within 60 days flagged automatically.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
