import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { ArrowRight } from 'lucide-react';

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

const CAMPUS_DATA = [
  { id: 0, name: 'All Campuses', staff: 312, gaps: 8, inflight: 14, comp: '74%', cName: 'Group' },
  { id: 1, name: 'Campus 1 — Jayanagar', staff: 84, gaps: 2, inflight: 3, comp: '81%', cName: 'Jayanagar' },
  { id: 2, name: 'Campus 2 — Whitefield', staff: 71, gaps: 3, inflight: 5, comp: '69%', cName: 'Whitefield' },
  { id: 3, name: 'Campus 3 — Kolar', staff: 52, gaps: 1, inflight: 2, comp: '88%', cName: 'Kolar' },
  { id: 4, name: 'Campus 4 — Mysore', staff: 63, gaps: 2, inflight: 3, comp: '76%', cName: 'Mysore' },
  { id: 5, name: 'Campus 5 — Hubli', staff: 42, gaps: 0, inflight: 1, comp: '91%', cName: 'Hubli' },
];

const TABLE_DATA = [
  { c: 'Jayanagar', t: 'College', s: 84, cr: 2, ar: 3, h: 10, com: '81%', i: 3, st: 'At Risk', sc: DS.atRisk },
  { c: 'Whitefield', t: 'College', s: 71, cr: 3, ar: 4, h: 8, com: '69%', i: 5, st: 'Critical', sc: DS.critical },
  { c: 'Kolar', t: 'School', s: 52, cr: 1, ar: 2, h: 14, com: '88%', i: 2, st: 'Healthy', sc: DS.healthy },
  { c: 'Mysore', t: 'College', s: 63, cr: 2, ar: 1, h: 9, com: '76%', i: 3, st: 'At Risk', sc: DS.atRisk },
  { c: 'Hubli', t: 'School', s: 42, cr: 0, ar: 3, h: 12, com: '91%', i: 1, st: 'Healthy', sc: DS.healthy },
];

const REDEPLOY_DATA = [
  { f: 'Kolar', fs: 'Commerce', fv: '+2 surplus', t: 'Whitefield', ts: 'Commerce', tv: '-1 gap', n: null },
  { f: 'Hubli', fs: 'English', fv: '+1 surplus', t: 'Mysore', ts: 'English', tv: '-1 gap', n: null },
  { f: 'Jayanagar', fs: 'Mathematics', fv: '+1 surplus', t: 'Whitefield', ts: 'Mathematics', tv: '-2 gap', n: 'Partial cover only — 1 additional hire still required' },
];

const SCENARIO_DATA = [
  { t: 'Scenario A: Whitefield 20% enrollment growth', d1: 'Net new hires: 8', d2: 'Cost impact: ₹48L/year', c: 'Whitefield' },
  { t: 'Scenario B: 2 campus HODs retire Q3', d1: 'Gap impact: 4 depts affected', d2: 'Succession: 2 ready', c: 'Jayanagar' },
  { t: 'Scenario C: New campus opening — Tumkur 2027', d1: 'Staff required: 28', d2: 'Redeployable from group: 6', c: 'Group' },
  { t: 'Scenario D: Group-wide 5% attrition', d1: 'Net headcount loss: 15', d2: 'Hiring needed: 12', c: 'Group' },
];

export const GOIConsolidated = ({ handleToast }: { handleToast?: (msg: string) => void }) => {
  const [activeTab, setActiveTab] = useState(0);

  const activeData = CAMPUS_DATA[activeTab];
  
  // Filter logic
  const filteredTable = activeTab === 0 ? TABLE_DATA : TABLE_DATA.filter(r => r.c === activeData.cName);
  const filteredRedeploy = activeTab === 0 ? REDEPLOY_DATA : REDEPLOY_DATA.filter(r => r.f === activeData.cName || r.t === activeData.cName);
  const filteredScenario = activeTab === 0 ? SCENARIO_DATA : SCENARIO_DATA.filter(r => r.c === activeData.cName || r.c === 'Group');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: DS.border }}>
        {CAMPUS_DATA.map((t, i) => (
          <button 
            key={i} 
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-t-lg transition-all ${activeTab === i ? 'text-[#003f98] border-b-2 border-[#003f98]' : 'text-slate-500 hover:text-slate-800'}`}>
            {t.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label={activeTab === 0 ? "Total Staff Across Group" : "Total Campus Staff"} value={activeData.staff} sub="Active permanent & visiting" accent={DS.primary} color={DS.primary} />
        <StatCard label="Critical Gaps" value={activeData.gaps} sub={activeTab === 0 ? "Departments group-wide" : "Departments in campus"} accent={activeData.gaps > 0 ? DS.critical.text : DS.healthy.text} color={activeData.gaps > 0 ? DS.critical.text : DS.healthy.text} />
        <StatCard label="Total Hiring in Flight" value={activeData.inflight} sub="Active requisitions" accent={DS.atRisk.text} color={DS.atRisk.text} />
        <StatCard label={activeTab === 0 ? "Group Compliance Score" : "Campus Compliance"} value={activeData.comp} sub={activeTab === 0 ? "Average across 5 campuses" : "Current readiness score"} accent={activeData.comp < '80%' ? DS.atRisk.text : DS.healthy.text} color={activeData.comp < '80%' ? DS.atRisk.text : DS.healthy.text} />
      </div>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Campus-wise Capacity Health</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBF9]" style={{ color: DS.textSecondary, borderBottom: `1px solid ${DS.border}` }}>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Campus</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Staff Strength</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Critical Gaps</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">At Risk</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Healthy</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Compliance</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">In Flight</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: DS.border }}>
              {filteredTable.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 cursor-pointer group">
                  <td className="px-4 py-4 font-bold flex items-center gap-2">{r.c} <ArrowRight className="h-3 w-3 text-transparent group-hover:text-[#003f98] transition-all" /></td>
                  <td className="px-4 py-4 text-slate-500">{r.t}</td>
                  <td className="px-4 py-4 text-center font-bold">{r.s}</td>
                  <td className="px-4 py-4 text-center text-[#993C1D]">{r.cr}</td>
                  <td className="px-4 py-4 text-center text-[#854F0B]">{r.ar}</td>
                  <td className="px-4 py-4 text-center text-[#0F6E56]">{r.h}</td>
                  <td className="px-4 py-4 text-center font-bold">{r.com}</td>
                  <td className="px-4 py-4 text-center">{r.i}</td>
                  <td className="px-4 py-4 text-center">
                    <Badge className="text-[9px] font-bold uppercase px-2 py-0 border-none" style={{ backgroundColor: r.sc.bg, color: r.sc.text }}>{r.st}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Cross-Campus Redeployment Opportunities</h3>
            <span className="text-[11px] text-slate-500 font-medium">Staff surplus at one campus can partially offset gaps at another</span>
          </div>
          <div className="p-6 space-y-4">
            {filteredRedeploy.length > 0 ? filteredRedeploy.map((r, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border bg-slate-50" style={{ borderColor: DS.border }}>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">From Campus</span>
                    <span className="font-bold">{r.f}</span>
                    <Badge className="bg-[#E1F5EE] text-[#0F6E56] border-none text-[9px] font-bold w-fit px-1.5 py-0 mt-1">{r.fs} {r.fv}</Badge>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300" />
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To Campus</span>
                    <span className="font-bold">{r.t}</span>
                    <Badge className="bg-[#FAECE7] text-[#993C1D] border-none text-[9px] font-bold w-fit px-1.5 py-0 mt-1">{r.ts} {r.tv}</Badge>
                  </div>
                </div>
                {r.n && <p className="text-[11px] font-bold text-[#854F0B]">{r.n}</p>}
                <Button variant="outline" className="h-9 text-xs font-bold border-slate-300 hover:border-[#003f98] hover:text-[#003f98]" onClick={() => handleToast && handleToast(`Redeployment initiated from ${r.f} to ${r.t}`)}>Initiate Redeployment</Button>
              </div>
            )) : (
              <p className="text-sm text-slate-500 font-medium text-center py-4">No active redeployment opportunities available for this campus.</p>
            )}
          </div>
          <div className="p-4 bg-slate-50 text-[10px] font-bold text-slate-400 border-t" style={{ borderColor: DS.border }}>
            Redeployment suggestions are advisory. Final decision requires Group HR and campus Principal sign-off.
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm" style={{ borderRadius: '14px' }}>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-col gap-1" style={{ borderColor: DS.border }}>
            <h3 className="text-sm font-bold">Campus Scenario Comparison</h3>
            <span className="text-[11px] text-slate-500 font-medium">What-if modelling across all campuses simultaneously</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredScenario.map((r, i) => (
              <div key={i} onClick={() => handleToast && handleToast(`Loaded ${r.t.split(':')[0]} into Scenario Planner`)} className="p-4 rounded-xl border hover:border-[#003f98] transition-all cursor-pointer flex flex-col justify-between" style={{ borderColor: DS.border }}>
                <div>
                  <h4 className="text-sm font-bold text-[#003f98] mb-3">{r.t}</h4>
                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-bold text-slate-600">{r.d1}</p>
                    <p className="text-xs font-bold text-slate-600">{r.d2}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-[#fe9b01] flex items-center gap-1">Run Full Scenario <ArrowRight className="h-3 w-3" /></p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
