import { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { 
    BookOpen, FileText, Plus, ChevronRight, 
    BarChart3, CheckCircle2, Clock, 
    TrendingUp, Library, 
    Calculator, Info, Search, Zap, XCircle,
    UserCheck, ShieldAlert
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usePersona } from '../contexts/PersonaContext';
import * as researchService from '../services/researchService';
import type { Publication } from '../services/researchService';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ─── Constants & Rules for API Scores ───────────────────────────────────────

const API_WEIGHTS = {
    'Journal': 25,
    'Conference': 15,
    'Book': 50,
    'Book Chapter': 10,
    'ImpactBonus': 5 
};

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];

// ─── Sub-components ───────────────────────────────────────────────────────────

const KPICard = ({ title, value, icon: Icon, color, trend }: any) => (
    <Card className="border-none shadow-sm bg-white rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500">
        <CardContent className="px-4 pb-4">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-emerald-600 font-black text-xs bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" /> {trend}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
                <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{value}</h3>
            </div>
        </CardContent>
    </Card>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const ResearchPublication = () => {
    const { role, user } = usePersona();
    const [activeSection, setActiveSection] = useState<'overview' | 'publications' | 'approval' | 'analytics'>('overview');
    const [publications, setPublications] = useState<Publication[]>([]);
    const [stats, setStats] = useState<any>({ total: 0, approved: 0, pending: 0, totalCitations: 0, avgImpact: 0, rankings: [] });
    const [showPubModal, setShowPubModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [pubFormData, setPubFormData] = useState<Partial<Publication>>({
        title: '', 
        type: 'Journal', 
        journal_name: '', 
        impact_factor: 0, 
        authorship: 'Principal', 
        date: new Date().toISOString().split('T')[0],
        submission_mode: 'Online',
        indexing: 'Other',
        is_peer_reviewed: true
    });

    useEffect(() => {
        fetchData();
    }, [role, user.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const allRes = await researchService.getAllPublications();
            const allPubs = allRes.data;
            
            if (role === 'EMPLOYEE') {
                const myPubs = allPubs.filter((p: any) => p.employee_id === 1); // Mocked ID
                setPublications(myPubs);
            } else {
                setPublications(allPubs);
            }

            const anaRes = await researchService.getResearchAnalytics();
            setStats(anaRes.data);
        } catch (error) {
            console.error('Error fetching research data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPub = async () => {
        if (!pubFormData.title) return;
        try {
            await researchService.submitPublication({
                ...pubFormData,
                employee_id: 1 // Mocking
            });
            setShowPubModal(false);
            setPubFormData({ 
                title: '', 
                type: 'Journal', 
                journal_name: '', 
                impact_factor: 0, 
                authorship: 'Principal', 
                date: new Date().toISOString().split('T')[0],
                submission_mode: 'Online',
                indexing: 'Other',
                is_peer_reviewed: true
            });
            fetchData();
        } catch (error) {
            alert('Failed to submit publication');
        }
    };

    const handleReview = async (id: number, status: 'Approved' | 'Rejected', comments?: string) => {
        const finalComments = comments !== undefined ? comments : prompt(`Enter comments for ${status}:`);
        if (finalComments === null) return;
        try {
            await researchService.reviewPublication(id, {
                status,
                reviewer_comments: finalComments,
                approved_by: 1 // Mocking reviewer
            });
            fetchData();
        } catch (error) {
            alert('Failed to review publication');
        }
    };

    // ─── Computed Data for Charts ───────────────────────────────────────────
    
    const chartData = useMemo(() => {
        const years = ['2020', '2021', '2022', '2023', '2024'];
        return years.map(y => ({
            year: y,
            count: publications.filter(p => p.date.startsWith(y)).length || 0
        }));
    }, [publications]);

    const typeData = useMemo(() => {
        const types = ['Journal', 'Conference', 'Book', 'Book Chapter'];
        return types.map(t => ({
            name: t,
            value: publications.filter(p => p.type === t).length || 0
        }));
    }, [publications]);

    const apiScore = useMemo(() => {
        return publications
            .filter(p => p.status === 'Approved')
            .reduce((acc, p) => acc + (API_WEIGHTS[p.type] || 0) + (p.impact_factor || 0) * API_WEIGHTS.ImpactBonus, 0);
    }, [publications]);

    // ─── Renderers ─────────────────────────────────────────────────────────────

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gapx-4 py-4">
                <KPICard title="Total Publications" value={publications.length} icon={BookOpen} color="bg-blue-500" trend={12} />
                <KPICard title="H-Index" value="14" icon={TrendingUp} color="bg-indigo-500" />
                <KPICard title="Research Citations" value={stats.totalCitations || 0} icon={Zap} color="bg-amber-500" trend={8} />
                <KPICard title="API Score Index" value={apiScore.toFixed(0)} icon={Calculator} color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-12 gap-8">
                <Card className="col-span-12 lg:col-span-8 border-none shadow-sm bg-white rounded-[40px] p-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Publication Velocity</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1">RESEARCH OUTPUT TREND (5-YEAR WINDOW)</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest bg-indigo-50 rounded-xl px-4">Download Report</Button>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm bg-white rounded-[40px] p-8">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Research Mix</h3>
                    <div className="h-56 w-full mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {typeData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {typeData.map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{t.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">{t.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-10 text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-xl font-black mb-4 leading-tight tracking-tight">Your Academic Performance Index is <span className="bg-white/20 px-3 py-1 rounded-2xl italic">{apiScore.toFixed(0)}</span></h2>
                        <p className="text-indigo-100 font-bold text-sm mb-4 max-w-lg leading-relaxed">We've calculated your real-time score based on approved journals, citation impact factors, and peer-reviewed status. Keep your portfolio updated for next appraisal cycle.</p>
                        <div className="flex gap-4">
                            <Button className="bg-white text-indigo-600 hover:bg-slate-50 rounded-2xl px-6 font-black uppercase text-xs tracking-widest h-12 shadow-xl shadow-indigo-900/20">View Detailed Analytics</Button>
                            <Button variant="ghost" className="text-white hover:bg-white/10 font-bold text-xs tracking-widest h-12 uppercase rounded-2xl gap-2"><Info className="w-4 h-4" /> Scoring Rules</Button>
                        </div>
                    </div>
                    <div className="hidden lg:block p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20">
                        <Calculator className="w-24 h-24 text-white opacity-80" />
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderPublications = () => (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 px-2 gap-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Paper Portfolio</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active scholarly submissions & published works</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input className="bg-white border-none shadow-sm rounded-2xl h-12 pl-10 pr-4 w-full md:w-64 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="Search by title..." />
                    </div>
                    <Button onClick={() => setShowPubModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 px-6 font-black uppercase text-xs tracking-widest shadow-sm shadow-indigo-200 gap-2">
                        <Plus className="w-5 h-5" /> Submit New Paper
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {publications.map((pub) => (
                    <Card key={pub.id} className="border-none shadow-sm bg-white rounded-3xl px-4 py-4 hover:shadow-xl hover:translate-x-2 transition-all duration-300 cursor-pointer group">
                        <div className="flex flex-col md:flex-row items-center gapx-4 py-4">
                            <div className={`w-16 h-16 rounded-2xl ${pub.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'} flex items-center justify-center font-black transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                                <FileText className="w-8 h-8" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${pub.type === 'Journal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{pub.type}</span>
                                    <span className="text-[10px] font-bold text-slate-400 opacity-60">ID: #PUB-{pub.id}</span>
                                </div>
                                <h4 className="font-black text-slate-800 text-lg leading-tight uppercase group-hover:text-indigo-600 transition-colors">{pub.title}</h4>
                                <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                                    <span className="flex items-center gap-1.5 font-bold text-xs text-slate-500"><Library className="w-3.5 h-3.5" /> {pub.journal_name}</span>
                                    <span className="flex items-center gap-1.5 font-bold text-xs text-slate-500"><Clock className="w-3.5 h-3.5" /> {pub.date}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 pr-4">
                                <div className="text-center hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Indexing</p>
                                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{pub.indexing || 'N/A'}</span>
                                </div>
                                <div className="text-center w-32">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Status</p>
                                    <div className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        pub.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                        pub.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {pub.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {pub.status}
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderApproval = () => (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Approval Hub</h2>
            {publications.filter(p => p.status === 'Pending Approval').map((pub) => (
                <Card key={pub.id} className="border-none shadow-sm bg-white rounded-[32px] p-8 border-l-8 border-indigo-500">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gapx-4 py-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Library className="w-4 h-4" /></div>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{pub.type} REQUEST</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto lg:ml-0">By: {pub.employee_name || 'Faculty Member'}</span>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 uppercase">{pub.title}</h4>
                            <p className="text-sm font-bold text-slate-500 mb-4">{pub.journal_name} • Submitted on {pub.date}</p>
                            <div className="flex gap-4">
                                <div className="bg-slate-50 px-4 py-2 rounded-2xl text-center min-w-[100px]">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Impact</p>
                                    <p className="text-sm font-black text-slate-900">{pub.impact_factor || '0.0'}</p>
                                </div>
                                <div className="bg-slate-50 px-4 py-2 rounded-2xl text-center min-w-[100px]">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Indexing</p>
                                    <p className="text-sm font-black text-slate-900">{pub.indexing || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full lg:w-auto">
                            <Button onClick={() => handleReview(parseInt(pub.id), 'Rejected')} variant="outline" className="flex-1 lg:flex-none h-14 rounded-2xl border-rose-100 text-rose-600 font-black uppercase text-xs tracking-widest hover:bg-rose-50 px-8 group transition-all">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Reject
                            </Button>
                            <Button onClick={() => handleReview(parseInt(pub.id), 'Approved')} className="flex-1 lg:flex-none h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest px-8 shadow-xl shadow-indigo-100">
                                <UserCheck className="w-4 h-4 mr-2" /> Approve & Confirm
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
            {publications.filter(p => p.status === 'Pending Approval').length === 0 && (
                <div className="p-20 text-center bg-white rounded-[40px] border border-slate-100">
                    <CheckCircle2 className="w-16 h-16 text-emerald-100 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">No pending publications at the moment</p>
                </div>
            )}
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Institutional Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gapx-4 py-4">
                 <KPICard title="Institutional Citations" value={stats.totalCitations?.toLocaleString() || '0'} icon={Zap} color="bg-blue-500" />
                 <KPICard title="Average Impact Factor" value={parseFloat(stats.avgImpact || 0).toFixed(2)} icon={TrendingUp} color="bg-emerald-500" />
                 <KPICard title="Compliance Rate" value={`${Math.round((stats.approved / (stats.total || 1)) * 100)}%`} icon={UserCheck} color="bg-indigo-500" />
            </div>
            
            <Card className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="font-black text-slate-800 tracking-tight uppercase">Faculty Research Ranking</h3>
                    <Button variant="ghost" className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest gap-2"><BarChart3 className="w-4 h-4" /> Export CSV</Button>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pubs</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Citations</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">API Index</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(stats.rankings || []).map((rank: any) => {
                                return (
                                    <tr key={rank.employee_id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-indigo-600 text-xs">{rank.employee_name ? rank.employee_name[0] : 'F'}</div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{rank.employee_name || 'Faculty Member'}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{rank.designation || 'Faculty'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase">{rank.department || 'General'}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-slate-900">{rank.pubCount}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-black text-emerald-600">{rank.totalCitations}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs">{(rank.pubCount * 25).toFixed(0)} pts</div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    return (
        <Layout
            title="Research Portfolio"
            description="Manage scholarly publications, track institutional research metrics, and verify academic throughput."
            icon={BookOpen}
            showHome={true}
        >
            <div className="flex flex-col lg:flex-row gap-8 pb-20">
                <div className="lg:w-72 space-y-3">
                    <div className="p-4 bg-white/50 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-sm mb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black">{role?.[0] || 'U'}</div>
                            <div>
                                <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tight text-sm">Faculty Hub</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Research Division</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            {[
                                { id: 'overview', name: 'Commander Dashboard', icon: TrendingUp },
                                { id: 'publications', name: 'My Repository', icon: Library },
                                { id: 'approval', name: 'Faculty Reviews', icon: CheckCircle2, role: 'MANAGER' },
                                { id: 'analytics', name: 'Institutional Data', icon: BarChart3, role: 'HR_ADMIN' }
                            ].filter(item => !item.role || item.role === role || (role === 'ADMIN')).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                        activeSection === item.id 
                                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 translate-x-2' 
                                        : 'text-slate-500 hover:bg-white hover:shadow-sm'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    {loading ? (
                         <div className="p-40 text-center">
                             <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                             <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Research Intelligence...</p>
                         </div>
                    ) : (
                        <>
                            {activeSection === 'overview' && renderOverview()}
                            {activeSection === 'publications' && renderPublications()}
                            {activeSection === 'approval' && renderApproval()}
                            {activeSection === 'analytics' && renderAnalytics()}
                        </>
                    )}
                </div>
            </div>

            {showPubModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 scrollbar-hide">
                    <div className="bg-[#F8FAFC] rounded-[48px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
                        <div className="p-10 pb-0 flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-4xl text-slate-900 tracking-tighter uppercase leading-none">Submit Research</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mt-3 bg-indigo-50 inline-block px-3 py-1 rounded-full">New Scholarly Record Entry</p>
                            </div>
                            <Button variant="ghost" onClick={() => setShowPubModal(false)} className="rounded-full h-12 w-12 bg-white/50 border border-slate-100 shadow-sm sm:h-14 sm:w-14">
                                <XCircle className="w-8 h-8 text-slate-400" />
                            </Button>
                        </div>
                        
                        <div className="p-10 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Title</label>
                                        <input type="text" value={pubFormData.title} onChange={(e) => setPubFormData({ ...pubFormData, title: e.target.value })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none transition-all placeholder:font-bold placeholder:text-slate-300" placeholder="e.g. Advancements in Quantum Computing..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Category</label>
                                            <select value={pubFormData.type} onChange={(e) => setPubFormData({ ...pubFormData, type: e.target.value as any })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none">
                                                <option value="Journal">Journal</option>
                                                <option value="Conference">Conference</option>
                                                <option value="Book">Book</option>
                                                <option value="Book Chapter">Book Chapter</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Authorship</label>
                                            <select value={pubFormData.authorship} onChange={(e) => setPubFormData({ ...pubFormData, authorship: e.target.value as any })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none">
                                                <option value="Principal">Principal</option>
                                                <option value="Corresponding">Corresponding</option>
                                                <option value="Co-Author">Co-Author</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Journal/Publisher Name</label>
                                        <input type="text" value={pubFormData.journal_name} onChange={(e) => setPubFormData({ ...pubFormData, journal_name: e.target.value })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none" placeholder="IEEE, Springer, Elsevier..." />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ISSN/ISBN</label>
                                            <input type="text" value={pubFormData.issn_isbn} onChange={(e) => setPubFormData({...pubFormData, issn_isbn: e.target.value})} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none" placeholder="0000-0000" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Indexing</label>
                                            <select value={pubFormData.indexing} onChange={(e) => setPubFormData({...pubFormData, indexing: e.target.value as any})} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none">
                                                <option value="UGC CARE">UGC CARE</option>
                                                <option value="Scopus">Scopus</option>
                                                <option value="Web of Science">WoS</option>
                                                <option value="Other">External/Peer Reviewed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Impact Factor</label>
                                            <input type="number" step="0.1" value={pubFormData.impact_factor} onChange={(e) => setPubFormData({ ...pubFormData, impact_factor: parseFloat(e.target.value) })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Date</label>
                                            <input type="date" value={pubFormData.date} onChange={(e) => setPubFormData({ ...pubFormData, date: e.target.value })} className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-3xl py-4 px-6 text-sm font-black shadow-sm outline-none" />
                                        </div>
                                    </div>
                                    <div className="px-4 py-4 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><Zap className="w-6 h-6" /></div>
                                        <div>
                                            <p className="text-xs font-black text-indigo-900 uppercase tracking-tight">API Points Estimation</p>
                                            <p className="text-sm font-bold text-indigo-600 leading-tight">Estimated score for this entry: <span className="font-black">{(API_WEIGHTS[pubFormData.type as keyof typeof API_WEIGHTS] || 0) + ((pubFormData.impact_factor || 0) * 5)} pts</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-0 bg-slate-50 flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setShowPubModal(false)} className="rounded-3xl px-8 h-12 font-black uppercase text-xs tracking-widest border-slate-200 text-slate-500">Discard Entry</Button>
                            <Button onClick={handleAddPub} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl px-10 h-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200">Final Submission</Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ResearchPublication;
