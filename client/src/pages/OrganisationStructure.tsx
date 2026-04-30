import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Plus, Search, Users, Landmark,
    Briefcase, Trash2, Edit3,
    Building2, School, Phone, Mail, UserPlus,
    Settings, Shield, LayoutGrid, List, BookOpen, ArrowRight,
    History as HistoryIcon
} from 'lucide-react';
import { usePersona } from '../contexts/PersonaContext';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Organisation Structure with Persona-Based Views & Nested Hierarchy
const GovernanceMindmap: React.FC<{ heads: string[], blockTitle: string }> = ({ heads, blockTitle }) => {
    return (
        <div className="w-full h-full relative flex items-center justify-center py-12">
            <svg className="w-full h-full min-h-[300px]" viewBox="0 0 800 400">
                {/* Connection Lines (Gradients) */}
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
                    </linearGradient>
                </defs>

                {heads.map((_, index) => {
                    const angle = (index * (360 / heads.length)) * (Math.PI / 180);
                    const x2 = 400 + 280 * Math.cos(angle);
                    const y2 = 200 + 120 * Math.sin(angle);
                    return (
                        <line
                            key={`line-${index}`}
                            x1="400"
                            y1="200"
                            x2={x2}
                            y2={y2}
                            stroke="url(#lineGrad)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from="20"
                                to="0"
                                dur="3s"
                                repeatCount="indefinite"
                            />
                        </line>
                    );
                })}

                {/* Central Node */}
                <g transform="translate(400, 200)">
                    <circle r="50" fill="white" stroke="#6366f1" strokeWidth="4" className="shadow-sm" />
                    <text
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-[10px] font-black uppercase fill-slate-900 tracking-tighter"
                    >
                        {blockTitle.split(' ').map(s => s[0]).join('')}
                    </text>
                    <circle r="60" fill="none" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.2">
                        <animate attributeName="r" values="55;65;55" dur="3s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Head Nodes */}
                {heads.map((head, index) => {
                    const angle = (index * (360 / heads.length)) * (Math.PI / 180);
                    const x = 400 + 280 * Math.cos(angle);
                    const y = 200 + 120 * Math.sin(angle);
                    const initials = head.split(' ').filter(n => !n.startsWith('(')).map(n => n[0]).join('').slice(0, 2);

                    return (
                        <g key={index} transform={`translate(${x}, ${y})`} className="cursor-pointer group">
                            <circle
                                r="35"
                                fill="white"
                                stroke="#cbd5e1"
                                strokeWidth="2"
                                className="group-hover:stroke-indigo-500 group-hover:r-40 transition-all duration-300"
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                dy="-5"
                                className="text-[12px] font-black fill-indigo-600 group-hover:fill-indigo-700"
                            >
                                {initials}
                            </text>
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                dy="15"
                                className="text-[8px] font-black uppercase fill-slate-400 tracking-widest overflow-visible"
                            >
                                {head.length > 12 ? head.slice(0, 10) + '...' : head}
                            </text>

                            {/* Hover Label */}
                            <rect
                                x="-60"
                                y="45"
                                width="120"
                                height="24"
                                rx="12"
                                fill="#1e293b"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                            <text
                                x="0"
                                y="60"
                                textAnchor="middle"
                                className="text-[8px] font-bold fill-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                            >
                                {head}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const OrganisationStructure: React.FC = () => {
    const { role } = usePersona();
    const isHR = role === 'HR_ADMIN' || role === 'ADMIN';
    const isManager = role === 'MANAGER';
    const isEmployee = role === 'EMPLOYEE';

    const [activeTab, setActiveTab] = useState<'hierarchy' | 'directory'>('hierarchy');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMindmapOpen, setIsMindmapOpen] = useState(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{ type: 'block' | 'dept' | 'unit', data: any } | null>(null);
    const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
    const [activeDeptId, setActiveDeptId] = useState<string | null>(null);

    // HR Config state for visibility
    const [config, setConfig] = useState({
        showPhone: true,
        showEmail: true,
        showJoinedDate: false,
        showReportingManager: true
    });

    const [structure, setStructure] = useState([
        {
            id: 'gb',
            level: 'Institutional Governance',
            title: "Governing Body",
            icon: Shield,
            members: 8,
            heads: ['Ms. Reshma Binu Prasad (Chairman)', 'Ms. Sanchaiyata Majumdar (Secretary)', 'Dr. R Sedhunivas (Member)'],
            color: 'from-amber-600 to-orange-700',
            departments: [],
            history: [
                { name: 'Dr. Ranjita Saikia', tenure: '2015 - 2018', role: 'Former Chairman' },
                { name: 'Mr. Manjit Singh', tenure: '2018 - 2022', role: 'Former Secretary' }
            ]
        },
        {
            id: '1',
            level: 'Leadership',
            title: "Principal's Office",
            icon: Landmark,
            members: 4,
            heads: ['Mr. Edwin Vimal A (Principal)'],
            color: 'from-slate-900 to-indigo-900',
            history: [
                { name: 'Dr. R Sedhunivas', tenure: '2010 - 2020', role: 'Principal Emeritus' },
                { name: 'Dr. Ranjita Saikia', tenure: '2020 - 2022', role: 'Former Principal' }
            ],
            departments: [
                {
                    id: 'd1',
                    name: 'Academic Affairs',
                    hod: 'Ms. Reshma Binu Prasad',
                    hodsCount: 8,
                    facultyCount: 120,
                    status: 'Active',
                    units: [
                        { id: 'u1', name: 'Curriculum Planning', coordinator: 'Ms. Sanchaiyata Majumdar', staff: 12 },
                        { id: 'u2', name: 'Examination Cell', coordinator: 'Mr. Manjit Singh', staff: 8 }
                    ],
                    members: [
                        { id: 'EMP102', name: 'Dr. R Sedhunivas', designation: 'Assistant Professor' },
                        { id: 'EMP105', name: 'Dr. Ranjita Saikia', designation: 'Lecturer' },
                        { id: 'EMP106', name: 'Mr. Edwin Vimal A', designation: 'Asst. Professor' }
                    ]
                },
                {
                    id: 'd2',
                    name: 'Student Welfare',
                    hod: 'Ms. Sanchaiyata Majumdar',
                    hodsCount: 4,
                    facultyCount: 45,
                    status: 'Active',
                    units: [],
                    members: []
                }
            ]
        },
        {
            id: '2',
            level: 'Academic Council',
            title: 'School of Engineering',
            icon: School,
            members: 12,
            heads: ['Dr. R Sedhunivas (Director)'],
            color: 'from-indigo-600 to-violet-700',
            departments: [
                {
                    id: 'e1',
                    name: 'Computer Science',
                    hod: 'Dr. Ranjita Saikia',
                    hodsCount: 1,
                    facultyCount: 42,
                    status: 'Active',
                    units: [
                        { id: 'ue1', name: 'AI & ML Lab', coordinator: 'Mr. Manjit Singh', staff: 15 },
                        { id: 'ue2', name: 'Cloud Computing Cell', coordinator: 'Mr. Edwin Vimal A', staff: 10 }
                    ],
                    members: [
                        { id: 'EMP101', name: 'Ms. Reshma Binu Prasad', designation: 'Senior Lecturer' },
                        { id: 'EMP103', name: 'Ms. Sanchaiyata Majumdar', designation: 'Lab Instructor' },
                        { id: 'EMP107', name: 'Dr. R Sedhunivas', designation: 'Senior Professor' },
                        { id: 'EMP108', name: 'Dr. Ranjita Saikia', designation: 'Associate Professor' }
                    ]
                }
            ],
            history: [
                { name: 'Mr. Manjit Singh', tenure: '2018 - 2021', role: 'Former Director' },
                { name: 'Mr. Edwin Vimal A', tenure: '2021 - 2023', role: 'Dean' }
            ]
        }
    ]);

    // Mock global employee list for search & quick view
    const globalEmployees = [
        { id: 'EMP101', name: 'Ms. Reshma Binu Prasad', designation: 'Senior Lecturer', department: 'Computer Science', phone: '+91 98844 22110', email: 'reshma@college.edu', manager: 'Dr. Ranjita Saikia', photo: 'RB', subjects: ['Algorithms', 'Machine Learning'], joined: '2021-01-10' },
        { id: 'EMP102', name: 'Dr. R Sedhunivas', designation: 'Assistant Professor', department: 'Academic Affairs', phone: '+91 98844 22111', email: 'sedhunivas@college.edu', manager: 'Ms. Sanchaiyata Majumdar', photo: 'RS', subjects: ['Academic Ethics'], joined: '2022-03-15' },
        { id: 'EMP103', name: 'Ms. Sanchaiyata Majumdar', designation: 'Lab Instructor', department: 'Computer Science', phone: '+91 98844 22112', email: 'sanchaiyata@college.edu', manager: 'Mr. Manjit Singh', photo: 'SM', subjects: ['Web Labs'], joined: '2021-06-20' },
        { id: 'EMP104', name: 'Mr. Edwin Vimal A', designation: 'Professor', department: 'School of Engineering', phone: '+91 98844 22113', email: 'edwin@college.edu', manager: 'Dr. R Sedhunivas', photo: 'EV', subjects: ['Structural Engineering'], joined: '2019-11-05' },
    ];

    const [selectedMember, setSelectedMember] = useState<any | null>(null);
    const [selectedHistoryBlock, setSelectedHistoryBlock] = useState<any | null>(null);

    const myTeam = globalEmployees.filter(emp => emp.department === 'Computer Science');

    const filteredHierarchy = structure.map(block => ({
        ...block,
        departments: block.departments.filter(dept =>
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.hod.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.members?.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })).filter(block =>
        block.departments.length > 0 ||
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.heads.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const searchedEmployees = globalEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string, type: 'block' | 'dept' | 'unit') => {
        if (!window.confirm(`Are you sure you want to delete this ${type === 'block' ? 'Block' : type === 'dept' ? 'Department' : 'Unit'}?`)) return;
        setStructure(prev => {
            if (type === 'block') return prev.filter(b => b.id !== id);
            if (type === 'dept') return prev.map(block => ({
                ...block,
                departments: block.departments.filter(d => d.id !== id)
            }));
            return prev.map(block => ({
                ...block,
                departments: block.departments.map(dept => ({
                    ...dept,
                    units: dept.units.filter(u => u.id !== id)
                }))
            }));
        });
    };

    return (
        <Layout
            title="Organisation Structure"
            description="Institutional governance, leadership hierarchy, and academic departments."
            headerActions={
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('hierarchy')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'hierarchy' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <LayoutGrid className="w-4 h-4" /> Hierarchy
                        </button>
                        <button
                            onClick={() => setActiveTab('directory')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <List className="w-4 h-4" /> Directory
                        </button>
                    </div>
                    {isHR && (
                        <button
                            onClick={() => setIsConfigModalOpen(true)}
                            className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                </div>
            }
        >
            <div className="space-y-8">
                {/* Sub Header / Search */}
                <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100 sticky top-0 z-10">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder={activeTab === 'hierarchy' ? "Search leadership, depts or member names..." : "Search employees by name, role or dept..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-12 rounded-2xl bg-slate-50 border-none pl-12 pr-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                    {isHR && activeTab === 'hierarchy' && (
                        <Button
                            onClick={() => { setEditingItem(null); setIsBlockModalOpen(true); }}
                            className="rounded-2xl bg-slate-900 hover:bg-black text-white px-6 font-black uppercase text-[10px] tracking-widest h-12 ml-4"
                        >
                            <Plus className="w-4 h-4 mr-2" /> New Block
                        </Button>
                    )}
                </div>

                {activeTab === 'hierarchy' ? (
                    <div className="space-y-12">
                        {filteredHierarchy.map((block) => (
                            <div key={block.id} className="space-y-6">
                                {/* Leadership Level Label */}
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-slate-200" />
                                    <Badge variant="outline" className="px-4 py-1.5 rounded-full border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {block.level}
                                    </Badge>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>

                                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white group relative">
                                    <div className={`h-2 w-full bg-gradient-to-r ${block.color}`} />
                                    <CardContent className="p-8">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Block info */}
                                            <div className="lg:w-1/3 space-y-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                                                            <block.icon className="w-8 h-8 text-slate-900" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{block.title}</h3>
                                                            <div className="flex items-center gap-2">
                                                                {block.departments.length > 0 && (
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.departments.length} Sub-Entities</p>
                                                                )}
                                                                <button
                                                                    onClick={() => setSelectedHistoryBlock(block)}
                                                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest group/history"
                                                                >
                                                                    <HistoryIcon className="w-3 h-3 group-hover/history:rotate-[-45deg] transition-transform" />
                                                                    History
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isHR && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingItem({ type: 'block', data: block }); setIsBlockModalOpen(true); }} className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center">
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleDelete(block.id, 'block')} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leadership & Board</p>
                                                    {block.heads.map(head => (
                                                        <div key={head} className="flex items-center gap-3 group/head">
                                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center font-black text-xs text-indigo-600 group-hover/head:bg-indigo-600 group-hover/head:text-white transition-all">
                                                                {head.split(' ').filter(n => !n.startsWith('(')).map(n => n[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-700">{head}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Departments / Units Grid */}
                                            <div className="lg:w-2/3 lg:pl-8 lg:border-l border-slate-100">
                                                {block.departments.length === 0 ? (
                                                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
                                                            <div className="w-20 h-20 rounded-[32px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center mb-4 border border-slate-100">
                                                                <Landmark className="w-10 h-10 text-indigo-600" />
                                                            </div>
                                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Governance Board</h4>
                                                            <p className="text-xs font-medium text-slate-400 mb-4 leading-relaxed">Visualize the highest authority levels and institutional leadership in an interactive format.</p>
                                                            <Button
                                                                onClick={() => setIsMindmapOpen(true)}
                                                                className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest px-8 py-6 h-auto shadow-sm shadow-indigo-100 group/btn"
                                                            >
                                                                Launch Mindmap
                                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {block.departments.map(dept => (
                                                            <div key={dept.id} className="px-4 py-4 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border-dashed hover:border-solid hover:border-indigo-200 group/dept">
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div className="space-y-1">
                                                                        <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] uppercase tracking-widest mb-1">DEPARTMENT</Badge>
                                                                        <h5 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{dept.name}</h5>
                                                                        <p className="text-xs font-bold text-slate-400">Head: {dept.hod}</p>
                                                                    </div>
                                                                    {isHR && (
                                                                        <div className="flex gap-1 opacity-0 group-hover/dept:opacity-100 transition-all">
                                                                            <button onClick={() => { setActiveBlockId(block.id); setEditingItem({ type: 'dept', data: dept }); setIsDeptModalOpen(true); }} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600">
                                                                                <Edit3 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                            <button onClick={() => handleDelete(dept.id, 'dept')} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500">
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Team Members List */}
                                                                <div className="space-y-2 mb-4 bg-white/50 p-3 rounded-2xl border border-slate-100">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Team Members</p>
                                                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{dept.members?.length || 0} Members</span>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {dept.members?.map(m => (
                                                                            <button
                                                                                key={m.id}
                                                                                onClick={() => {
                                                                                    const fullData = globalEmployees.find(emp => emp.id === m.id) || { ...m, phone: 'N/A', email: 'N/A', manager: dept.hod, photo: m.name[0], subjects: [], joined: 'N/A' };
                                                                                    setSelectedMember(fullData);
                                                                                }}
                                                                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm"
                                                                            >
                                                                                {m.name}
                                                                            </button>
                                                                        ))}
                                                                        {dept.facultyCount > (dept.members?.length || 0) && (
                                                                            <span className="text-[9px] font-bold text-slate-400 flex items-center px-1.5">
                                                                                + {dept.facultyCount - (dept.members?.length || 0)} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Nested Units */}
                                                                {dept.units && dept.units.length > 0 && (
                                                                    <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-2">
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                            <Shield className="w-3 h-3 text-indigo-400" /> Internal Units & Cells
                                                                        </p>
                                                                        {dept.units.map((unit: any) => (
                                                                            <div key={unit.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-white/50 border border-slate-100 group/unit">
                                                                                <div className="flex items-center gap-3 font-bold text-xs text-slate-700">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                                    {unit.name}
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Coord: {unit.coordinator.split(' ')[0]}</span>
                                                                                    {isHR && (
                                                                                        <div className="flex gap-1 opacity-0 group-hover/unit:opacity-100 transition-all">
                                                                                            <button onClick={() => { setActiveDeptId(dept.id); setEditingItem({ type: 'unit', data: unit }); setIsUnitModalOpen(true); }} className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600">
                                                                                                <Edit3 className="w-3 h-3" />
                                                                                            </button>
                                                                                            <button onClick={() => handleDelete(unit.id, 'unit')} className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500">
                                                                                                <Trash2 className="w-3 h-3" />
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        {isHR && (
                                                                            <button
                                                                                onClick={() => { setActiveDeptId(dept.id); setEditingItem(null); setIsUnitModalOpen(true); }}
                                                                                className="w-full py-2 rounded-xl border border-dashed border-slate-200 text-[10px] font-black uppercase text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-white transition-all mt-2"
                                                                            >
                                                                                + Add Activity/Unit Coordinator
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isHR && (
                                                            <button
                                                                onClick={() => { setActiveBlockId(block.id); setEditingItem(null); setIsDeptModalOpen(true); }}
                                                                className="flex flex-col items-center justify-center px-4 py-4 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-slate-50 transition-all group min-h-[160px]"
                                                            >
                                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-indigo-50">
                                                                    <Plus className="w-6 h-6" />
                                                                </div>
                                                                <span className="font-black text-xs uppercase tracking-widest">Add Department</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* My Team Section (For Manager & Employee) */}
                        {(isManager || isEmployee) && !searchQuery && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">My Team Members</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {myTeam.map(emp => (
                                        <EmployeeCard key={emp.id} employee={emp} config={config} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results / Directory */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm shadow-slate-200">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                                        {searchQuery ? `Search Results (${searchedEmployees.length})` : "Company Directory"}
                                    </h3>
                                </div>
                                {!searchQuery && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing all active employees</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {searchedEmployees.map(emp => (
                                    <EmployeeCard key={emp.id} employee={emp} config={config} />
                                ))}
                            </div>
                            {searchedEmployees.length === 0 && (
                                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                                    <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">No employees found</h4>
                                    <p className="text-sm font-bold text-slate-400">Try adjusting your search filters</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Full-Screen Governance Mindmap */}
            <Dialog open={isMindmapOpen} onOpenChange={setIsMindmapOpen}>
                <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] rounded-[40px] border-none shadow-2xl bg-white p-0 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm shadow-slate-200">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Institutional Governance</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Governance Body & Board Members</p>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={() => setIsMindmapOpen(false)} className="rounded-xl font-bold uppercase text-xs">Close View</Button>
                        </div>
                        <div className="flex-1 bg-slate-50 relative overflow-hidden">
                            {/* Abstract Background for Mindmap */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent pointer-events-none" />
                            <GovernanceMindmap
                                heads={structure.find(b => b.departments.length === 0)?.heads || []}
                                blockTitle={structure.find(b => b.departments.length === 0)?.title || 'Governance Board'}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>



            {/* Modals */}
            <BlockModal
                isOpen={isBlockModalOpen}
                onClose={() => setIsBlockModalOpen(false)}
                onSave={(data: any) => {
                    if (editingItem) {
                        setStructure(prev => prev.map(b => b.id === editingItem.data.id ? { ...b, ...data } : b));
                    } else {
                        setStructure(prev => [...prev, { ...data, id: Date.now().toString(), departments: [], icon: Building2, color: 'from-blue-600 to-indigo-700', members: 0 }]);
                    }
                    setIsBlockModalOpen(false);
                }}
                editingData={editingItem?.type === 'block' ? editingItem.data : null}
            />

            <DeptModal
                isOpen={isDeptModalOpen}
                onClose={() => setIsDeptModalOpen(false)}
                onSave={(data: any) => {
                    if (editingItem) {
                        setStructure(prev => prev.map(b => b.id === activeBlockId ? { ...b, departments: b.departments.map(d => d.id === editingItem.data.id ? { ...d, ...data } : d) } : b));
                    } else {
                        setStructure(prev => prev.map(b => b.id === activeBlockId ? { ...b, departments: [...b.departments, { ...data, id: Date.now().toString(), hodsCount: 1, facultyCount: 0, status: 'Active', units: [] }] } : b));
                    }
                    setIsDeptModalOpen(false);
                }}
                editingData={editingItem?.type === 'dept' ? editingItem.data : null}
            />

            <ConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                config={config}
                onSave={setConfig}
            />

            <UnitModal
                isOpen={isUnitModalOpen}
                onClose={() => setIsUnitModalOpen(false)}
                onSave={(data: any) => {
                    if (editingItem) {
                        setStructure(prev => prev.map(b => ({
                            ...b,
                            departments: b.departments.map(d => d.id === activeDeptId ? {
                                ...d,
                                units: d.units.map(u => u.id === editingItem.data.id ? { ...u, ...data } : u)
                            } : d)
                        })));
                    } else {
                        setStructure(prev => prev.map(b => ({
                            ...b,
                            departments: b.departments.map(d => d.id === activeDeptId ? {
                                ...d,
                                units: [...d.units, { ...data, id: Date.now().toString(), staff: 0 }]
                            } : d)
                        })));
                    }
                    setIsUnitModalOpen(false);
                }}
                editingData={editingItem?.type === 'unit' ? editingItem.data : null}
            />

            <MemberQuickViewModal
                member={selectedMember}
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />

            <GovernanceHistoryModal
                block={selectedHistoryBlock}
                isOpen={!!selectedHistoryBlock}
                onClose={() => setSelectedHistoryBlock(null)}
            />
        </Layout>
    );
};

const MemberQuickViewModal = ({ member, isOpen, onClose }: any) => {
    const navigate = useNavigate();
    const { role } = usePersona();
    const isRestricted = role === 'EMPLOYEE';
    if (!member) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[40px] border-none shadow-2xl p-0 overflow-hidden max-w-md">
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-700 relative">
                    <button onClick={onClose} className="absolute right-6 topx-4 py-4 w-8 h-8 rounded-full bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all">
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>
                </div>
                <div className="px-8 pb-8 -mt-12 text-center">
                    <div className="w-24 h-24 rounded-[32px] bg-white border-4 border-white shadow-xl mx-auto flex items-center justify-center font-black text-xl text-indigo-600 mb-4 overflow-hidden">
                        {member.photo || member.name[0]}
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{member.name}</h4>
                        <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{member.designation}</p>
                        <Badge variant="outline" className="mt-2 text-[10px] font-black border-slate-100 text-slate-400 uppercase tracking-widest">{member.department}</Badge>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined On</p>
                            <p className="text-xs font-bold text-slate-700">{member.joined || 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-slate-50 border border-indigo-100 bg-indigo-50/20 group/rep cursor-pointer">
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex justify-between">
                                Reporting To
                                <Settings className="w-2.5 h-2.5 opacity-0 group-hover/rep:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-xs font-bold text-indigo-600">{member.manager || 'Not Assigned'}</p>
                        </div>
                    </div>

                    <div className="mt-4 p-5 rounded-[32px] bg-indigo-50/50 border border-indigo-100 text-left">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Subjects Handled
                            </p>
                            <Settings className="w-3 h-3 text-indigo-400 cursor-pointer hover:text-indigo-600" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {member.subjects?.length > 0 ? member.subjects.map((s: string) => (
                                <Badge key={s} className="bg-white text-indigo-600 border-indigo-100 text-[9px] font-bold">
                                    {s}
                                </Badge>
                            )) : (
                                <span className="text-[10px] text-slate-400 font-bold italic">No subjects assigned</span>
                            )}
                        </div>
                    </div>

                    {!isRestricted && (
                        <Button
                            onClick={() => { navigate(`/staff-portfolio/${member.id}`); onClose(); }}
                            className="w-full mt-8 h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200"
                        >
                            View Full Profile
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const EmployeeCard = ({ employee, config }: { employee: any, config: any }) => {
    const navigate = useNavigate();
    const { role } = usePersona();
    const isHR = role === 'HR_ADMIN' || role === 'ADMIN';
    const isEmployee = role === 'EMPLOYEE';

    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border border-slate-50 group relative cursor-pointer">
            {isHR && (
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                        <Settings className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}
            <div className="px-4 py-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-lg text-indigo-600 uppercase border border-indigo-100">
                        {employee.photo}
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 leading-none mb-1">{employee.name}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{employee.designation}</p>
                        <Badge variant="outline" className="mt-2 text-[8px] font-black border-slate-100 text-slate-400">{employee.department}</Badge>
                    </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-50">
                    {config.showEmail && (
                        <div className="flex items-center gap-3 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold truncate">{employee.email}</span>
                        </div>
                    )}
                    {config.showPhone && (
                        <div className="flex items-center gap-3 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs font-bold">{employee.phone}</span>
                        </div>
                    )}
                    {config.showReportingManager && (
                        <div className="flex items-center gap-3 text-slate-500">
                            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-300 uppercase leading-none">Reports To</span>
                                <span className="text-[11px] font-bold text-slate-600">{employee.manager}</span>
                            </div>
                        </div>
                    )}
                </div>
                {!isEmployee && (
                    <button
                        onClick={() => navigate(`/staff-portfolio/${employee.id}`)}
                        className="w-full mt-6 py-3 rounded-2xl bg-slate-50 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                    >
                        Full Profile
                    </button>
                )}
            </div>
        </Card>
    );
};

const ConfigModal = ({ isOpen, onClose, config, onSave }: any) => {
    const [localConfig, setLocalConfig] = useState(config);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                <DialogHeader>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Shield className="w-6 h-6 text-slate-900" />
                    </div>
                    <DialogTitle className="text-xl font-[950] uppercase tracking-tight text-slate-900">Directory Visibility</DialogTitle>
                    <p className="text-sm font-bold text-slate-400">Configure which employee details are visible to the company.</p>
                </DialogHeader>
                <div className="space-y-4 py-6">
                    {Object.entries(localConfig).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <Label className="font-black text-xs uppercase tracking-widest text-slate-600">{key.replace(/([A-Z])/g, ' $1')}</Label>
                            <Switch checked={value as boolean} onCheckedChange={(val) => setLocalConfig({ ...localConfig, [key]: val })} />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-xs">Cancel</Button>
                    <Button onClick={() => { onSave(localConfig); onClose(); }} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs px-8">Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const BlockModal = ({ isOpen, onClose, onSave, editingData }: any) => {
    const [title, setTitle] = useState(editingData?.title || '');
    const [level, setLevel] = useState(editingData?.level || '');
    const [heads, setHeads] = useState(editingData?.heads?.join(', ') || '');

    useEffect(() => {
        setTitle(editingData?.title || '');
        setLevel(editingData?.level || '');
        setHeads(editingData?.heads?.join(', ') || '');
    }, [editingData, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-[950] uppercase tracking-tight text-slate-900">
                        {editingData ? 'Edit Block' : 'New Leadership Block'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Principal's Office" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authority Level</Label>
                        <Input value={level} onChange={e => setLevel(e.target.value)} placeholder="e.g. Leadership" className="rounded-xl" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-xs">Cancel</Button>
                    <Button onClick={() => onSave({ title, level, heads: heads.split(',') })} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs px-8">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeptModal = ({ isOpen, onClose, onSave, editingData }: any) => {
    const [name, setName] = useState(editingData?.name || '');
    const [hod, setHod] = useState(editingData?.hod || '');

    useEffect(() => {
        setName(editingData?.name || '');
        setHod(editingData?.hod || '');
    }, [editingData, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-[950] uppercase tracking-tight text-slate-900">
                        {editingData ? 'Edit Dept' : 'New Department'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dept Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" placeholder="e.g. Physics Department" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Head of Department (HOD)</Label>
                        <Input value={hod} onChange={e => setHod(e.target.value)} className="rounded-xl" placeholder="e.g. Dr. Richards" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reporting To (SLA / Leadership)</Label>
                        <Select defaultValue="director">
                            <SelectTrigger className="rounded-xl bg-slate-50 border-slate-100">
                                <SelectValue placeholder="Select Superior" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-xl">
                                <SelectItem value="director">Institutional Director</SelectItem>
                                <SelectItem value="dean">Academic Dean</SelectItem>
                                <SelectItem value="registrar">Registrar</SelectItem>
                                <SelectItem value="vc">Vice Chancellor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-xs">Cancel</Button>
                    <Button onClick={() => onSave({ name, hod })} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs px-8">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const UnitModal = ({ isOpen, onClose, onSave, editingData }: any) => {
    const [name, setName] = useState(editingData?.name || '');
    const [coordinator, setCoordinator] = useState(editingData?.coordinator || '');

    useEffect(() => {
        setName(editingData?.name || '');
        setCoordinator(editingData?.coordinator || '');
    }, [editingData, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[32px] border-none shadow-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-[950] uppercase tracking-tight text-slate-900">
                        {editingData ? 'Edit Coordinator Role' : 'New Coordinator Assignment'}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity/Role Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="rounded-xl" placeholder="e.g. Subject Coordinator" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Coordinator</Label>
                        <Input value={coordinator} onChange={e => setCoordinator(e.target.value)} className="rounded-xl" placeholder="e.g. Prof. X" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold uppercase text-xs">Cancel</Button>
                    <Button onClick={() => onSave({ name, coordinator })} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs px-8">Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const GovernanceHistoryModal = ({ block, isOpen, onClose }: any) => {
    if (!block) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-[40px] border-none shadow-2xl p-0 overflow-hidden max-w-lg">
                <div className={`h-24 bg-gradient-to-r ${block.color} relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <button onClick={onClose} className="absolute right-6 topx-4 py-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-all z-10">
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>
                    <div className="absolute bottom-4 left-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Governance History</h3>
                        <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest">{block.title}</p>
                    </div>
                </div>
                <div className="p-8 space-y-6 bg-white">
                    <div className="space-y-4">
                        {(block.history || []).map((entry: any, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-5 rounded-[28px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                    {entry.name.split(' ').filter((n: string) => !n.startsWith('(')).map((n: string) => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black text-slate-900">{entry.name}</h4>
                                        <Badge className="bg-white text-indigo-600 border-indigo-100 text-[9px] font-black uppercase tracking-widest">
                                            {entry.tenure}
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{entry.role}</p>
                                </div>
                            </div>
                        ))}

                        {(!block.history || block.history.length === 0) && (
                            <div className="py-12 text-center">
                                <HistoryIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-400">No legacy records found for this block.</p>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={onClose}
                        className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest shadow-sm"
                    >
                        Close History Archive
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrganisationStructure;
