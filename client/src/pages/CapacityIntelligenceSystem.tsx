import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import {
    BrainCircuit, Users, Building2, CalendarRange,
    PieChart, LineChart, ShieldCheck, Activity,
    TrendingUp, AlertTriangle, CheckCircle2, ChevronLeft
} from 'lucide-react';
import InfraSpaceModule from '../components/capacity/InfraSpaceModule';

// Mock Data for the 8 Core Engines
const academicData = {
    intakeCapacity: 1200,
    currentEnrolment: 1150,
    utilization: 95.8,
    dropoutRate: 2.1,
    status: 'Healthy'
};

const facultyData = {
    totalFaculty: 120,
    avgLoad: 88,
    overloaded: 15,
    underutilized: 8,
    risk: 'Medium'
};

const infraData = {
    classrooms: 85,
    labs: 92,
    hostel: 105,
    transport: 78,
    overall: 90
};

const financeData = {
    revenue: 4500000,
    cost: 3800000,
    sustainabilityRatio: 1.18,
    status: 'Healthy'
};

const admissionForecast = {
    predictedIntake: 1250,
    growth: 4.2,
    popularCourse: 'B.Tech CS / Grade 11 Science'
};

const complianceData = {
    score: 98,
    pendingAudits: 1,
    riskLevel: 'Low'
};

const CapacityIntelligenceSystem: React.FC = () => {
    const [instType, setInstType] = useState<'School' | 'College'>('College');
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<any>(null);
    const [selectedScenario, setSelectedScenario] = useState<{ q: string, a: string } | null>(null);

    // Reset detail view when closing module
    useEffect(() => {
        if (!activeModule) {
            setSelectedDetail(null);
            setSelectedScenario(null);
        }
    }, [activeModule]);

    useEffect(() => {
        setSelectedScenario(null);
    }, [instType]);

    // Helper to render the specific drill-down content
    const renderDrillDownContent = () => {
        switch (activeModule) {
            case 'academic':
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">New Intake Batch Config</h4>
                                <p className="text-xs text-slate-500">Configure capacity for upcoming academic year</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Add Intake
                            </button>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">{instType === 'School' ? 'Grade Breakdown' : 'Program Breakdown'}</h4>
                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">{instType === 'School' ? 'Grade' : 'Program'}</th>
                                            <th className="px-4 py-3">Capacity</th>
                                            <th className="px-4 py-3">Enrolled</th>
                                            <th className="px-4 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{instType === 'School' ? 'Grade 10 Science' : 'B.Tech CS (Year 1)'}</td>
                                            <td className="px-4 py-3">300</td>
                                            <td className="px-4 py-3">295</td>
                                            <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">Healthy</span></td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{instType === 'School' ? 'Grade 11 Commerce' : 'BBA (Year 2)'}</td>
                                            <td className="px-4 py-3">150</td>
                                            <td className="px-4 py-3">148</td>
                                            <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs">Healthy</span></td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium">{instType === 'School' ? 'Grade 12 Arts' : 'B.Arch (Year 1)'}</td>
                                            <td className="px-4 py-3">100</td>
                                            <td className="px-4 py-3">105</td>
                                            <td className="px-4 py-3"><span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Overcrowded</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'faculty':
                if (selectedDetail) {
                    return (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setSelectedDetail(null)} className="text-sm flex items-center gap-1 text-slate-500 hover:text-slate-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 transition-colors w-fit">
                                <ChevronLeft className="w-4 h-4" /> Back to Overview
                            </button>
                            <div className="bg-white border border-slate-200 px-4 py-4 rounded-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">{selectedDetail.initials}</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800">{selectedDetail.name}</h4>
                                        <p className="text-slate-500">{selectedDetail.dept} • {selectedDetail.role}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h5 className="font-bold text-slate-800 border-b pb-2">Load Breakdown ({selectedDetail.load}%)</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-xs text-slate-500 font-medium">Teaching Load (Max 16 hrs)</div>
                                            <div className="text-lg font-bold text-red-600 mt-1">18 hrs/week</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="text-xs text-slate-500 font-medium">Admin Duties</div>
                                            <div className="text-lg font-bold text-slate-700 mt-1">4 hrs/week</div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-orange-50 text-orange-800 border border-orange-200 rounded-lg text-sm flex gap-2">
                                        <AlertTriangle className="w-5 h-5 shrink-0" />
                                        <p>Risk of burnout. Consider reassigning the introductory Lab sections to a teaching assistant.</p>
                                    </div>
                                    <div className="pt-4 flex gap-3">
                                        <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition">Request Assistant</button>
                                        <button className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition">Transfer Course</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Faculty Reassignment</h4>
                                <p className="text-xs text-slate-500">Balance workload across departments</p>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                Reassign Load
                            </button>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-600 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Overloaded Faculty (Critical)</h4>
                            <div className="space-y-3">
                                {[
                                    { id: 1, name: 'Dr. Sarah Smith', dept: 'CS Department', load: 115, initials: 'SS', role: 'Assoc. Professor' },
                                    { id: 2, name: 'Prof. James Wilson', dept: 'Mathematics', load: 112, initials: 'JW', role: 'Professor' },
                                    { id: 3, name: 'Dr. Emily Chen', dept: 'Physics', load: 108, initials: 'EC', role: 'Asst. Professor' }
                                ].map((fac) => (
                                    <div key={fac.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50/30 rounded-lg hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">{fac.initials}</div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{fac.name} (EMP00{fac.id})</div>
                                                <div className="text-xs text-slate-500">{fac.dept}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-red-600 text-sm">{fac.load}% Load</div>
                                            <button onClick={() => setSelectedDetail(fac)} className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline mt-1 transition-colors">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'infra':
                return <InfraSpaceModule />;
            case 'timetable':
                return (
                    <div className="space-y-6">
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Conflict Matrix</h4>
                                <p className="text-xs text-slate-500">Detect and resolve scheduling overlaps</p>
                            </div>
                            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                                Auto-Resolve
                            </button>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Detected Clashes</h4>
                            {/* Empty state for 0 clashes */}
                            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                                <h5 className="font-bold text-slate-800 mb-1">Clear Schedule</h5>
                                <p className="text-xs text-slate-500">The current simulation shows zero faculty or infrastructure conflicts.</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Simulation Tools</h4>
                            <div className="space-y-3">
                                <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center hover:bg-slate-50 cursor-pointer transition-colors">
                                    <div>
                                        <div className="font-bold text-slate-700">Substitute Finder</div>
                                        <div className="text-xs text-slate-500">Simulate absence for today and find replacements.</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl flex justify-between items-center hover:bg-slate-50 cursor-pointer transition-colors">
                                    <div>
                                        <div className="font-bold text-slate-700">Parallel Section Test</div>
                                        <div className="text-xs text-slate-500">Test infrastructure load if we run 3 sections simultaneously.</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'finance':
                return (
                    <div className="space-y-6">
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Budget Baseline</h4>
                                <p className="text-xs text-slate-500">Manage revenue streams and operational overhead</p>
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                                Adjust Forecast
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 border border-slate-200 rounded-xl bg-white">
                                <div className="text-sm font-medium text-slate-500 mb-1">Total Expected Revenue</div>
                                <div className="text-xl font-black text-emerald-600">₹45.0M</div>
                            </div>
                            <div className="p-4 border border-slate-200 rounded-xl bg-white">
                                <div className="text-sm font-medium text-slate-500 mb-1">Institutional Cost</div>
                                <div className="text-xl font-black text-red-600">₹38.0M</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Cost Breakdown (Top Categories)</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 font-medium">Academic Staff Salaries</span>
                                        <span className="font-bold text-slate-800">55%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '55%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 font-medium">Infrastructure Maintenance</span>
                                        <span className="font-bold text-slate-800">22%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 font-medium">Transport & Ops</span>
                                        <span className="font-bold text-slate-800">18%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'admission':
                return (
                    <div className="space-y-6">
                        <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Enrolment Funnel</h4>
                                <p className="text-xs text-slate-500">Track and predict conversion rates</p>
                            </div>
                            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors">
                                Add Campaign Data
                            </button>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Funnel Analytics</h4>
                            <div className="space-y-2">
                                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-4 items-center">
                                    <div className="w-1/3 font-bold text-slate-700">Inquiries</div>
                                    <div className="w-2/3 flex items-center">
                                        <div className="bg-blue-200 h-6 rounded-l" style={{ width: '100%' }}></div>
                                        <span className="ml-3 font-bold text-slate-800">3,200</span>
                                    </div>
                                </div>
                                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-4 items-center">
                                    <div className="w-1/3 font-bold text-slate-700">Applications</div>
                                    <div className="w-2/3 flex items-center">
                                        <div className="bg-blue-400 h-6 rounded-l" style={{ width: '65%' }}></div>
                                        <span className="ml-3 font-bold text-slate-800">2,080</span>
                                    </div>
                                </div>
                                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-4 items-center">
                                    <div className="w-1/3 font-bold text-slate-700">Admitted</div>
                                    <div className="w-2/3 flex items-center">
                                        <div className="bg-blue-600 h-6 rounded-l" style={{ width: '38%' }}></div>
                                        <span className="ml-3 font-bold text-slate-800">1,216</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl flex gap-4 mt-6">
                            <TrendingUp className="w-8 h-8 text-emerald-600 shrink-0" />
                            <div>
                                <div className="font-bold text-slate-800">Growth Prediction</div>
                                <p className="text-sm text-slate-600 mt-1">Based on historical data and current inquiry velocity, expect a <strong className="text-emerald-700">4.2% increase</strong> in overall cohort size next year.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'compliance':
                return (
                    <div className="space-y-6">
                        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Norms Verification</h4>
                                <p className="text-xs text-slate-500">Real-time check against {instType === 'School' ? 'CBSE' : 'AICTE'} guidelines</p>
                            </div>
                            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
                                Upload Certificate
                            </button>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Continuous Audit Status</h4>
                            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <div className="font-bold text-slate-700">Student-Teacher Ratio</div>
                                            <div className="text-xs text-slate-500">Required: 1:30 | Current: 1:28</div>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Pass</span>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                        <div>
                                            <div className="font-bold text-slate-700">Lab Area per Student</div>
                                            <div className="text-xs text-slate-500">Required: 2.5 sqm | Current: 2.8 sqm</div>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">Pass</span>
                                </div>
                                <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors bg-amber-50/30">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        <div>
                                            <div className="font-bold text-slate-700">Library Book Count</div>
                                            <div className="text-xs text-slate-500">Required: 15,000 | Current: 14,850</div>
                                        </div>
                                    </div>
                                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">Warning</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'ai':
                const scenarios = instType === 'School' ? [
                    { q: "What if grade 1 intake increases by 20% next year?", a: "Requires 2 additional primary classrooms and 3 new homeroom teachers. Transport fleet needs +1 bus route." },
                    { q: "What if we introduce a new Science lab for high school?", a: "Space available in South Wing. Reduces regular classroom capacity by 1. Requires hiring 1 Lab Assistant. Estimated CAPEX: $45,000." },
                    { q: "What if 3 senior math teachers go on long leave?", a: "High risk of 15 periods/week clash. Substitute pool has 1 available match. Recommend external temporary hire." },
                    { q: "What if hostel capacity is expanded by 50 beds?", a: "Improves revenue sustainability ratio to 1.25x. Demands 2 additional wardens and +15% dining hall provisions." }
                ] : [
                    { q: "What if B.Tech CS intake increases by 20% next year?", a: "Requires 2 additional lecture halls and 3 new Assistant Professors. Computer Lab utilization will hit 105% (Critical Overload)." },
                    { q: "What if we introduce a new AI & Data Science program?", a: "Requires dedicated high-compute lab (CAPEX $120k). Expected ROI breakeven in Year 2. Need to hire 4 specialized faculty." },
                    { q: "What if 3 senior computer science professors resign?", a: "Immediate impact on 6 core courses and 12 research scholars. High risk to NBA compliance student-faculty ratio." },
                    { q: "What if hostel capacity is expanded by 100 beds?", a: "Improves overall financial sustainability ratio by 8%. Requires hiring 3 additional wardens and expanding mess capacity." }
                ];

                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-4 rounded-xl text-white">
                            <h4 className="font-bold text-lg flex items-center gap-2 mb-2"><BrainCircuit className="w-6 h-6" /> Semantic Sandbox</h4>
                            <p className="text-blue-100 text-sm mb-4">Type a hypothetical scenario to simulate its impact across all capacity engines.</p>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={instType === 'School' ? "e.g., What if grade 1 intake increases by 20% next year?" : "e.g., What if B.Tech CS intake increases by 20% next year?"}
                                    className="w-full pl-4 pr-32 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <button className="absolute right-2 top-2 bg-white text-indigo-700 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition-colors">
                                    Run Mod
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-800 mb-4">Suggested Scenarios ({instType} Context)</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {scenarios.map((scenario, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedScenario(scenario)}
                                        className={`p-4 border rounded-xl cursor-pointer hover:shadow-sm transition-all group ${selectedScenario?.q === scenario.q ? 'border-indigo-500 bg-indigo-50/50 shadow-sm relative overflow-hidden' : 'border-slate-200 hover:border-blue-400'}`}
                                    >
                                        {selectedScenario?.q === scenario.q && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                                        )}
                                        <div className={`font-bold mb-1 ${selectedScenario?.q === scenario.q ? 'text-indigo-900' : 'text-slate-800'}`}>{scenario.q}</div>

                                        {selectedScenario?.q === scenario.q && (
                                            <div className="mt-3 text-sm text-slate-700 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-indigo-100 rounded-lg shrink-0 mt-0.5">
                                                        <BrainCircuit className="w-4 h-4 text-indigo-700" />
                                                    </div>
                                                    <p className="pt-1">{scenario.a}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                        <BrainCircuit className="w-12 h-12 mb-4 text-slate-300" />
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Select an Engine</h4>
                        <p className="text-sm max-w-sm">Click on any of the capacity module cards to view detailed intelligence and drill-down datasets.</p>
                    </div>
                );
        }
    };

    const getModuleTitle = () => {
        switch (activeModule) {
            case 'academic': return 'Academic Capacity Control Center';
            case 'faculty': return 'Faculty Workload Intelligence';
            case 'infra': return 'Infrastructure & Space Allocation';
            case 'timetable': return 'Timetable & Conflict Resolution';
            case 'finance': return 'Financial Sustainability Modeling';
            case 'admission': return 'Admission Demand Predictive Model';
            case 'compliance': return 'Governance & Audit Readiness';
            case 'ai': return 'Advanced "What-If" Semantic Sandbox';
            default: return 'Module Details';
        }
    }

    return (
        <Layout
            title="Capacity Intelligence (ICIS)"
            description="Unified AI Engine for Institutional Capacity Planning"
            icon={BrainCircuit}
            showHome={true}
        >
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">

                {/* Executive Control Header */}
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-gradient-to-r from-slate-900 to-indigo-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
                    <CardContent className="p-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gapx-4 py-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <BrainCircuit className="w-8 h-8 text-blue-400" />
                                <h2 className="text-xl font-black tracking-tight">Executive AI Dashboard</h2>
                            </div>
                            <p className="text-slate-300 font-medium max-w-2xl">
                                Real-time synthesis of academic, operational, and financial capacities.
                                Powered by predictive intelligence.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setInstType('School')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${instType === 'School' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                            >
                                School View
                            </button>
                            <button
                                onClick={() => setInstType('College')}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${instType === 'College' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                            >
                                College View
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* The 8 Core Modular Engines */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* Module 1: Academic Engine */}
                    <Card onClick={() => setActiveModule('academic')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <CardContent className="px-4 py-4 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                                    {academicData.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Academic Capacity</h3>
                            <p className="text-xs text-slate-500 mb-4">{instType === 'School' ? 'Grade & Section Load' : 'Program & Course Load'}</p>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-500 font-medium">Utilization</span>
                                        <span className="font-bold text-slate-700">{academicData.utilization}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${academicData.utilization}%` }}></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50">
                                    <span className="text-slate-500">Enrolled / Cap</span>
                                    <span className="font-bold text-slate-700">{academicData.currentEnrolment} / {academicData.intakeCapacity}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 2: Faculty Engine */}
                    <Card onClick={() => setActiveModule('faculty')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-100">
                                    Action Rqd
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Faculty Workload</h3>
                            <p className="text-xs text-slate-500 mb-4">{instType === 'School' ? 'Period-based Allocation' : 'Credit-based Allocation'}</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="text-xl font-black text-slate-800">{facultyData.avgLoad}%</div>
                                        <div className="text-xs font-medium text-slate-500">Avg Utilization</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-100"></div>
                                    <div className="flex-1 text-right">
                                        <div className="text-lg font-bold text-red-500 flex items-center justify-end gap-1">
                                            <AlertTriangle className="w-4 h-4" /> {facultyData.overloaded}
                                        </div>
                                        <div className="text-xs font-medium text-slate-500">Overloaded</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 3: Infrastructure Engine */}
                    <Card onClick={() => setActiveModule('infra')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-xl">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${infraData.hostel > 100 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {infraData.hostel > 100 ? 'Overflow Risk' : 'Healthy'}
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Infrastructure</h3>
                            <p className="text-xs text-slate-500 mb-4">Space & Facility Utilization</p>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-slate-500 text-xs mb-1">Classrooms</div>
                                    <div className="font-bold text-slate-700">{infraData.classrooms}%</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-slate-500 text-xs mb-1">Labs/Studios</div>
                                    <div className="font-bold text-slate-700">{infraData.labs}%</div>
                                </div>
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <div className="text-red-600 text-xs mb-1">Hostels</div>
                                    <div className="font-bold text-red-700">{infraData.hostel}%</div>
                                </div>
                                <div className="p-2 bg-slate-50 rounded-lg">
                                    <div className="text-slate-500 text-xs mb-1">Transport</div>
                                    <div className="font-bold text-slate-700">{infraData.transport}%</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 4: Timetable & Sim */}
                    <Card onClick={() => setActiveModule('timetable')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <CalendarRange className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Timetable Engine</h3>
                            <p className="text-xs text-slate-500 mb-4">Conflict & Simulation</p>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 0 Clashes
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg cursor-pointer border border-blue-100">
                                    <div className="text-sm font-bold text-blue-700">
                                        Run Substitute Sim
                                    </div>
                                    <BrainCircuit className="w-4 h-4 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 5: Financial Capacity */}
                    <Card onClick={() => setActiveModule('finance')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                                    Sustainable
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Financial Capacity</h3>
                            <p className="text-xs text-slate-500 mb-4">Revenue vs Institutional Cost</p>

                            <div className="mt-4">
                                <div className="text-xl font-black text-slate-800 mb-1">{financeData.sustainabilityRatio}x</div>
                                <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    Sustainability Ratio (Rev/Cost)
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 6: Admission Forecasting */}
                    <Card onClick={() => setActiveModule('admission')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                                    <LineChart className="w-6 h-6" />
                                </div>
                                <div className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3 mr-1" /> {admissionForecast.growth}%
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Demand Forecast</h3>
                            <p className="text-xs text-slate-500 mb-4">Next Year Intake Prediction</p>

                            <div className="mt-4">
                                <div className="text-xl font-black text-slate-800 mb-2">{admissionForecast.predictedIntake} <span className="text-sm font-medium text-slate-500"> projected</span></div>
                                <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    Trending: <span className="font-bold text-slate-800">{admissionForecast.popularCourse}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 7: Governance & Compliance */}
                    <Card onClick={() => setActiveModule('compliance')} className="hover:shadow-sm transition-all border-none shadow-sm ring-1 ring-slate-100 group relative overflow-hidden cursor-pointer">
                        <CardContent className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-100">
                                    Audit Ready
                                </span>
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-1">Compliance Engine</h3>
                            <p className="text-xs text-slate-500 mb-4">{instType === 'School' ? 'CBSE / Board Norms' : 'AICTE / Univ Norms'}</p>

                            <div className="flex items-end gap-3 mt-4">
                                <div>
                                    <div className="text-xl font-black text-slate-800">{complianceData.score}</div>
                                    <div className="text-xs font-medium text-slate-500">Readiness Score</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Module 8: AI What-If Dashboard */}
                    <Card onClick={() => setActiveModule('ai')} className="hover:shadow-sm transition-all border-none ring-1 ring-blue-200 bg-gradient-to-br from-blue-600 to-indigo-700 text-white group relative overflow-hidden md:col-span-1 lg:col-span-1 cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-10"></div>
                        <CardContent className="px-4 py-4 relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <BrainCircuit className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        V3 Beta
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-white mb-2">Advanced AI Layer</h3>
                                <p className="text-sm text-blue-100 font-medium mb-4">"What-If" Semantic Modeling</p>
                            </div>

                            <div className="space-y-2 mt-4">
                                <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm p-3 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between border border-white/10">
                                    "Intake increases 20%?"
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                                <div className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm p-3 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between border border-white/10">
                                    "Expand hostel capacity?"
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Drilldown Slide-Over Panel */}
                {activeModule && (
                    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
                        {/* Overlay to click and close */}
                        <div
                            className="absolute inset-0"
                            onClick={() => setActiveModule(null)}
                        ></div>

                        {/* Panel */}
                        <div className={`relative w-full ${activeModule === 'infra' ? 'max-w-6xl' : 'max-w-2xl'} bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300`}>
                            {/* Header */}
                            <div className="px-4 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                                        <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{getModuleTitle()}</h3>
                                </div>
                                <button
                                    onClick={() => setActiveModule(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className={`overflow-y-auto flex-1 bg-white ${activeModule === 'infra' ? 'p-0' : 'p-6'}`}>
                                {renderDrillDownContent()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

// Extracted from lucide-react manual import to keep file clean
const ChevronRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);

export default CapacityIntelligenceSystem;
