import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { BookOpen, FileText, Award, GraduationCap, Plus, Search, Filter, ChevronRight, BarChart3, TrendingUp, Lightbulb, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export interface Publication {
    id: string;
    title: string;
    type: 'Journal' | 'Conference' | 'Book' | 'Book Chapter';
    journalName?: string;
    impactFactor?: number;
    points: number;
    date: string;
    authorship: 'Principal' | 'Corresponding' | 'Co-Author';
    status: 'Published' | 'Accepted' | 'Under Review';
}

export interface ResearchProject {
    id: string;
    title: string;
    agency: string;
    type: 'Major' | 'Minor';
    grantAmount: number;
    status: 'Ongoing' | 'Completed';
    points: number;
}

export interface GuidanceEntry {
    id: string;
    studentName: string;
    degree: 'Ph.D' | 'M.Phil' | 'PG Dissertation';
    status: 'Degree Awarded' | 'Thesis Submitted' | 'Ongoing';
    points: number;
}

const ResearchPublication = () => {
    const [activeSection, setActiveSection] = useState<'overview' | 'publications' | 'projects' | 'guidance'>('overview');
    const [publications, setPublications] = useState<Publication[]>([]);
    const [projects, setProjects] = useState<ResearchProject[]>([]);
    const [guidance, setGuidance] = useState<GuidanceEntry[]>([]);

    const [showPubModal, setShowPubModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showGuidanceModal, setShowGuidanceModal] = useState(false);

    const [pubFormData, setPubFormData] = useState<Partial<Publication>>({
        title: '', type: 'Journal', journalName: '', impactFactor: 0, authorship: 'Principal', status: 'Published', date: new Date().toISOString().split('T')[0]
    });

    const [projectFormData, setProjectFormData] = useState<Partial<ResearchProject>>({
        title: '', agency: '', type: 'Major', grantAmount: 0, status: 'Ongoing'
    });

    const [guidanceFormData, setGuidanceFormData] = useState<Partial<GuidanceEntry>>({
        studentName: '', degree: 'Ph.D', status: 'Ongoing'
    });

    // Persistence
    useEffect(() => {
        const storedPubs = localStorage.getItem('edumerge_publications');
        const storedProjects = localStorage.getItem('edumerge_projects');
        const storedGuidance = localStorage.getItem('edumerge_guidance');

        if (storedPubs) setPublications(JSON.parse(storedPubs));
        else {
            const initial: Publication[] = [
                { id: '1', title: 'Deep Learning in Predictive Analytics', type: 'Journal', journalName: 'IEEE Transactions', impactFactor: 4.2, points: 40, date: '2024-01-15', authorship: 'Principal', status: 'Published' },
                { id: '2', title: 'Edge Computing for Smart Cities', type: 'Conference', journalName: 'ICCE 2023', points: 15, date: '2023-11-20', authorship: 'Co-Author', status: 'Published' },
            ];
            setPublications(initial);
        }

        if (storedProjects) setProjects(JSON.parse(storedProjects));
        else {
            const initial: ResearchProject[] = [
                { id: '1', title: 'AI for Sustainable Energy', agency: 'DST', type: 'Major', grantAmount: 2500000, status: 'Ongoing', points: 30 }
            ];
            setProjects(initial);
        }

        if (storedGuidance) setGuidance(JSON.parse(storedGuidance));
        else {
            const initial: GuidanceEntry[] = [
                { id: '1', studentName: 'Rahul Sharma', degree: 'Ph.D', status: 'Degree Awarded', points: 10 }
            ];
            setGuidance(initial);
        }
    }, []);

    // Save helpers
    useEffect(() => {
        if (publications.length > 0) localStorage.setItem('edumerge_publications', JSON.stringify(publications));
        if (projects.length > 0) localStorage.setItem('edumerge_projects', JSON.stringify(projects));
        if (guidance.length > 0) localStorage.setItem('edumerge_guidance', JSON.stringify(guidance));
    }, [publications, projects, guidance]);

    const calculatePubPoints = (data: Partial<Publication>) => {
        let base = 0;
        if (data.type === 'Journal') base = 25;
        else if (data.type === 'Conference') base = 15;
        else if (data.type === 'Book') base = 50;
        else if (data.type === 'Book Chapter') base = 10;

        if (data.type === 'Journal' && data.impactFactor) {
            if (data.impactFactor > 10) base += 25;
            else if (data.impactFactor > 5) base += 20;
            else if (data.impactFactor > 2) base += 15;
            else if (data.impactFactor > 1) base += 10;
            else base += 5;
        }

        if (data.authorship === 'Co-Author') return Math.floor(base * 0.3);
        return base;
    };

    const handleAddPub = () => {
        if (!pubFormData.title) return;
        const pts = calculatePubPoints(pubFormData);
        const newPub = { ...pubFormData, id: Date.now().toString(), points: pts } as Publication;
        setPublications([newPub, ...publications]);
        setShowPubModal(false);
        setPubFormData({ title: '', type: 'Journal', journalName: '', impactFactor: 0, authorship: 'Principal', status: 'Published', date: new Date().toISOString().split('T')[0] });
    };

    const handleAddProject = () => {
        if (!projectFormData.title) return;
        let pts = projectFormData.type === 'Major' ? 20 : 10;
        if (projectFormData.grantAmount && projectFormData.grantAmount > 1000000) pts += 10;
        const newProj = { ...projectFormData, id: Date.now().toString(), points: pts } as ResearchProject;
        setProjects([newProj, ...projects]);
        setShowProjectModal(false);
        setProjectFormData({ title: '', agency: '', type: 'Major', grantAmount: 0, status: 'Ongoing' });
    };

    const handleAddGuidance = () => {
        if (!guidanceFormData.studentName) return;
        let pts = 0;
        if (guidanceFormData.degree === 'Ph.D') pts = guidanceFormData.status === 'Degree Awarded' ? 10 : 5;
        else if (guidanceFormData.degree === 'M.Phil') pts = 5;
        else pts = 2;
        const newEntry = { ...guidanceFormData, id: Date.now().toString(), points: pts } as GuidanceEntry;
        setGuidance([newEntry, ...guidance]);
        setShowGuidanceModal(false);
        setGuidanceFormData({ studentName: '', degree: 'Ph.D', status: 'Ongoing' });
    };

    const totalScore = publications.reduce((acc, p) => acc + p.points, 0) +
        projects.reduce((acc, p) => acc + p.points, 0) +
        guidance.reduce((acc, p) => acc + p.points, 0);

    const stats = [
        { label: 'Total API Score', value: totalScore.toString(), icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Publications', value: publications.length.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Research Projects', value: projects.length.toString(), icon: Lightbulb, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Ph.D Guidance', value: guidance.filter(g => g.degree === 'Ph.D' && g.status === 'Degree Awarded').length.toString(), icon: GraduationCap, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <Layout
            title="Research & Publication"
            description="Manage your academic contributions and track API scores according to UGC guidelines."
            icon={BookOpen}
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm ring-1 ring-slate-100 bg-white hover:-translate-y-1 transition-transform cursor-pointer">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                        {[
                            { id: 'overview', label: 'Overview & Scoring', icon: TrendingUp },
                            { id: 'publications', label: 'Publications', icon: FileText },
                            { id: 'projects', label: 'Research Projects', icon: Lightbulb },
                            { id: 'guidance', label: 'Research Guidance', icon: Users }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id as any)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeSection === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {activeSection === 'overview' && (
                            <>
                                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">API Score Breakdown</h3>
                                                <p className="text-slate-500 text-sm">Calculated according to Appendix II, Table 2 of UGC Regulations 2018.</p>
                                            </div>
                                            <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                                                <Award className="w-4 h-4 mr-2" /> Generate CAS Report
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'Category III: Research Publications', points: publications.reduce((acc, p) => acc + p.points, 0), color: 'bg-blue-500', textColor: 'text-blue-600', width: '70%' },
                                                { label: 'Category IV: Research Projects', points: projects.reduce((acc, p) => acc + p.points, 0), color: 'bg-purple-500', textColor: 'text-purple-600', width: '45%' },
                                                { label: 'Category V: Research Guidance & Awards', points: guidance.reduce((acc, p) => acc + p.points, 0), color: 'bg-amber-500', textColor: 'text-amber-600', width: '30%' }
                                            ].map((cat, i) => (
                                                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <span className="font-bold text-slate-700">{cat.label}</span>
                                                        <span className={`text-xl font-black ${cat.textColor}`}>{cat.points} Pts</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                        <div className={`${cat.color} h-full w-[${cat.width}]`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white p-6">
                                        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-blue-500" /> Recent Activity
                                        </h4>
                                        <div className="space-y-4">
                                            {publications.slice(0, 3).map(pub => (
                                                <div key={pub.id} className="flex gap-4 items-start border-b border-slate-50 pb-3 last:border-0">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{pub.title}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{pub.type} • {pub.date}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white p-6">
                                        <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-amber-500" /> Guidance Status
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-slate-600">Ph.D Thesis Submitted</span>
                                                <span className="text-sm font-black text-slate-800">{guidance.filter(g => g.status === 'Thesis Submitted').length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-slate-600">Ongoing Supervision</span>
                                                <span className="text-sm font-black text-slate-800">{guidance.filter(g => g.status === 'Ongoing').length}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-slate-600">Ph.D Awarded</span>
                                                <span className="text-sm font-black text-slate-800">{guidance.filter(g => g.status === 'Degree Awarded' && g.degree === 'Ph.D').length}</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </>
                        )}

                        {activeSection === 'publications' && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search publications..."
                                            className="bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold w-64"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="bg-white">
                                            <Filter className="w-4 h-4 mr-2" /> Filter
                                        </Button>
                                        <Button onClick={() => setShowPubModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                            <Plus className="w-4 h-4 mr-2" /> Add Publication
                                        </Button>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Title & Type</th>
                                                <th className="px-6 py-4">Journal / Publisher</th>
                                                <th className="px-6 py-4">Authorship</th>
                                                <th className="px-6 py-4">Points</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {publications.map((pub) => (
                                                <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{pub.title}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{pub.type} • {pub.date}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-700">{pub.journalName || 'N/A'}</div>
                                                        {pub.impactFactor && <div className="text-xs text-emerald-600 font-bold">IF: {pub.impactFactor}</div>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${pub.authorship === 'Principal' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                                            {pub.authorship}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-black text-slate-800">{pub.points}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                                                            {pub.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}

                        {activeSection === 'projects' && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-black text-slate-800">Research Projects & Grants</h3>
                                    <Button onClick={() => setShowProjectModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" /> Add Project
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Project Title</th>
                                                <th className="px-6 py-4">Agency</th>
                                                <th className="px-6 py-4">Grant Amount</th>
                                                <th className="px-6 py-4">Points</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {projects.map((proj) => (
                                                <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800">{proj.title}</div>
                                                        <div className="text-xs text-slate-500 font-medium">{proj.type} Project</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-700">{proj.agency}</td>
                                                    <td className="px-6 py-4 font-bold text-slate-900">₹{(proj.grantAmount / 100000).toFixed(2)}L</td>
                                                    <td className="px-6 py-4 font-black text-blue-600">{proj.points}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${proj.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {proj.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}

                        {activeSection === 'guidance' && (
                            <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-black text-slate-800">Research Guidance (Ph.D/M.Phil)</h3>
                                    <Button onClick={() => setShowGuidanceModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="w-4 h-4 mr-2" /> Record Entry
                                    </Button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Student Name</th>
                                                <th className="px-6 py-4">Degree</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {guidance.map((entry) => (
                                                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-800">{entry.studentName}</td>
                                                    <td className="px-6 py-4 font-semibold text-slate-700">{entry.degree}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${entry.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {entry.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-blue-600">{entry.points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Publication Modal */}
            {showPubModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 tracking-tight">Add New Publication</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
                                <input type="text" value={pubFormData.title} onChange={(e) => setPubFormData({ ...pubFormData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                                    <select value={pubFormData.type} onChange={(e) => setPubFormData({ ...pubFormData, type: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold">
                                        <option value="Journal">Journal</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Book">Book</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Authorship</label>
                                    <select value={pubFormData.authorship} onChange={(e) => setPubFormData({ ...pubFormData, authorship: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold">
                                        <option value="Principal">Principal</option>
                                        <option value="Co-Author">Co-Author</option>
                                    </select>
                                </div>
                            </div>
                            {pubFormData.type === 'Journal' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Journal Name</label>
                                        <input type="text" value={pubFormData.journalName} onChange={(e) => setPubFormData({ ...pubFormData, journalName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">IF</label>
                                        <input type="number" step="0.1" value={pubFormData.impactFactor} onChange={(e) => setPubFormData({ ...pubFormData, impactFactor: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowPubModal(false)}>Cancel</Button>
                            <Button onClick={handleAddPub} className="bg-blue-600 text-white">Save</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Project Modal */}
            {showProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 tracking-tight">Add Research Project</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Project Title</label>
                                <input type="text" value={projectFormData.title} onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Agency (e.g. DST, UGC)</label>
                                    <input type="text" value={projectFormData.agency} onChange={(e) => setProjectFormData({ ...projectFormData, agency: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Grant Amount (₹)</label>
                                    <input type="number" value={projectFormData.grantAmount} onChange={(e) => setProjectFormData({ ...projectFormData, grantAmount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowProjectModal(false)}>Cancel</Button>
                            <Button onClick={handleAddProject} className="bg-blue-600 text-white">Save Project</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guidance Modal */}
            {showGuidanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 tracking-tight">Record Research Guidance</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                                <input type="text" value={guidanceFormData.studentName} onChange={(e) => setGuidanceFormData({ ...guidanceFormData, studentName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Degree</label>
                                    <select value={guidanceFormData.degree} onChange={(e) => setGuidanceFormData({ ...guidanceFormData, degree: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold">
                                        <option value="Ph.D">Ph.D</option>
                                        <option value="M.Phil">M.Phil</option>
                                        <option value="PG Dissertation">PG Dissertation</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                    <select value={guidanceFormData.status} onChange={(e) => setGuidanceFormData({ ...guidanceFormData, status: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-semibold">
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Thesis Submitted">Thesis Submitted</option>
                                        <option value="Degree Awarded">Degree Awarded</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowGuidanceModal(false)}>Cancel</Button>
                            <Button onClick={handleAddGuidance} className="bg-blue-600 text-white">Save Entry</Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ResearchPublication;
