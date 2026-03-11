import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { BookOpen, FileText, Award, Plus, ChevronRight, BarChart3, CheckCircle2, XCircle, Clock, Eye, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '../contexts/PersonaContext';
import * as researchService from '../services/researchService';
import type { Publication } from '../services/researchService';

const ResearchPublication = () => {
    const { role, user } = usePersona();
    const [activeSection, setActiveSection] = useState<'overview' | 'publications' | 'approval' | 'analytics'>('overview');
    const [publications, setPublications] = useState<Publication[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [showPubModal, setShowPubModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedPub, setSelectedPub] = useState<Publication | null>(null);
    const [loading, setLoading] = useState(true);

    const [pubFormData, setPubFormData] = useState<Partial<Publication>>({
        title: '', 
        type: 'Journal', 
        journal_name: '', 
        impact_factor: 0, 
        authorship: 'Principal', 
        date: new Date().toISOString().split('T')[0],
        submission_mode: 'Online',
        attachment_path: ''
    });

    useEffect(() => {
        fetchData();
    }, [role, user.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (role === 'EMPLOYEE') {
                const res = await researchService.getMyPublications(1); // Mocking employee_id 1 for now
                setPublications(res.data);
                setActiveSection('publications');
            } else if (role === 'MANAGER') {
                const res = await researchService.getAllPublications();
                setPublications(res.data);
                setActiveSection('approval');
            } else if (role === 'HR_ADMIN' || role === 'ADMIN') {
                const res = await researchService.getAllPublications();
                setPublications(res.data);
                const ana = await researchService.getResearchAnalytics();
                setAnalytics(ana.data);
                setActiveSection('analytics');
            }
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
                attachment_path: ''
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Pending Approval': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Approved': return <CheckCircle2 className="w-4 h-4" />;
            case 'Rejected': return <XCircle className="w-4 h-4" />;
            case 'Pending Approval': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <Layout
            title="Research & Publication"
            description={role === 'HR_ADMIN' ? "View institutional research output and staff contributions." : "Manage and track academic research and scholarly publications."}
            icon={BookOpen}
            showHome={true}
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                
                {/* Header Stats for HR / Admin */}
                {(role === 'HR_ADMIN' || role === 'ADMIN') && analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-800">{analytics.total}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Submitted</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-800">{analytics.approved}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                            <CardContent className="p-5 flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-slate-800">{analytics.pending}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Review</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3 space-y-2">

                        {role === 'EMPLOYEE' && (
                            <button
                                onClick={() => setActiveSection('publications')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeSection === 'publications' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4" />
                                    My Publications
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        )}
                        {role === 'MANAGER' && (
                            <button
                                onClick={() => setActiveSection('approval')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeSection === 'approval' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Award className="w-4 h-4" />
                                    R&D Approval Hub
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        )}
                        {(role === 'HR_ADMIN' || role === 'ADMIN') && (
                            <button
                                onClick={() => setActiveSection('analytics')}
                                className={`w-full flex items-center justify-between p-4 rounded-xl font-bold text-sm transition-all ${activeSection === 'analytics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4" />
                                    Staff Research List
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {loading ? (
                            <div className="flex items-center justify-center p-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                {activeSection === 'publications' && (
                                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                            <h3 className="font-black text-slate-800 tracking-tight">My Publications</h3>
                                            <Button onClick={() => setShowPubModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                                <Plus className="w-4 h-4 mr-2" /> Submit Paper
                                            </Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Title & Type</th>
                                                        <th className="px-6 py-4">Journal</th>
                                                        <th className="px-6 py-4 text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {publications.length === 0 ? (
                                                        <tr><td colSpan={3} className="px-6 py-10 text-center text-slate-400 font-medium">No publications found.</td></tr>
                                                    ) : publications.map((pub) => (
                                                        <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-800">{pub.title}</div>
                                                                <div className="text-xs text-slate-500 font-medium">{pub.type} • {pub.date}</div>
                                                            </td>
                                                            <td className="px-6 py-4 font-semibold text-slate-700">{pub.journal_name || 'N/A'}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex justify-center">
                                                                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(pub.status)}`}>
                                                                        {getStatusIcon(pub.status)}
                                                                        {pub.status}
                                                                    </span>
                                                                </div>
                                                                {pub.reviewer_comments && (
                                                                    <div className="text-[10px] text-slate-400 mt-1 italic text-center max-w-[150px] mx-auto truncate">"{pub.reviewer_comments}"</div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}

                                {activeSection === 'approval' && (
                                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                        <div className="px-6 py-5 border-b border-slate-100 bg-indigo-50/30">
                                            <h3 className="font-black text-slate-800 tracking-tight">R&D Team Review Dashboard</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Faculty Detail</th>
                                                        <th className="px-6 py-4">Publication Title</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {publications.length === 0 ? (
                                                        <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400 font-medium">No pending requests.</td></tr>
                                                    ) : publications.map((pub) => (
                                                        <tr key={pub.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-bold text-slate-800">{pub.employee_name}</div>
                                                                <div className="text-[10px] text-slate-500 uppercase font-black">{pub.department}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="font-semibold text-slate-700">{pub.title}</div>
                                                                <div className="text-xs text-slate-400 font-medium">{pub.journal_name} • Impact: {pub.impact_factor}</div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${getStatusColor(pub.status)}`}>
                                                                    {pub.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                {pub.status === 'Pending Approval' ? (
                                                                    <div className="flex justify-end gap-2">
                                                                        <Button 
                                                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedPub(pub); setShowReviewModal(true); }} 
                                                                            size="sm" 
                                                                            className="h-8 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                                                                        >
                                                                            Review
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400 font-bold italic">Reviewed</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}

                                {activeSection === 'analytics' && (
                                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-emerald-50/30">
                                            <h3 className="font-black text-slate-800 tracking-tight">Staff Research & Publications List</h3>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                                                <Eye className="w-4 h-4" /> View Only Access
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-50/50 text-slate-500 font-bold border-b border-slate-100 text-xs uppercase tracking-wider">
                                                    <tr>
                                                        <th className="px-6 py-4">Staff Name</th>
                                                        <th className="px-6 py-4">Department</th>
                                                        <th className="px-6 py-4 text-center">Total Published</th>
                                                        <th className="px-6 py-4 text-center">Approved</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {/* Grouping by staff for HR view */}
                                                    {Array.from(new Set(publications.map(p => p.employee_id))).map(empId => {
                                                        const empPubs = publications.filter(p => p.employee_id === empId);
                                                        const first = empPubs[0];
                                                        return (
                                                            <tr key={empId} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="font-bold text-slate-800">{first.employee_name}</div>
                                                                    <div className="text-xs text-slate-500">{first.designation}</div>
                                                                </td>
                                                                <td className="px-6 py-4 font-semibold text-slate-600">{first.department}</td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <span className="font-black text-slate-800 bg-slate-100 px-2 py-1 rounded">{empPubs.length}</span>
                                                                </td>
                                                                <td className="px-6 py-4 text-center">
                                                                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                                        {empPubs.filter(p => p.status === 'Approved').length}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Publication Submission Modal */}
            {showPubModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 tracking-tight">Submit Research Paper</h3>
                            <button onClick={() => setShowPubModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-slate-500 uppercase">Title of the Paper</label>
                                <input type="text" value={pubFormData.title} onChange={(e) => setPubFormData({ ...pubFormData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter paper title" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Publication Type</label>
                                    <select value={pubFormData.type} onChange={(e) => setPubFormData({ ...pubFormData, type: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="Journal">Journal</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Book">Book</option>
                                        <option value="Book Chapter">Book Chapter</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Authorship</label>
                                    <select value={pubFormData.authorship} onChange={(e) => setPubFormData({ ...pubFormData, authorship: e.target.value as any })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="Principal">Principal</option>
                                        <option value="Corresponding">Corresponding</option>
                                        <option value="Co-Author">Co-Author</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-bold text-slate-500 uppercase">Journal / Conference Name</label>
                                <input type="text" value={pubFormData.journal_name} onChange={(e) => setPubFormData({ ...pubFormData, journal_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name of publisher" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Impact Factor</label>
                                    <input type="number" step="0.1" value={pubFormData.impact_factor} onChange={(e) => setPubFormData({ ...pubFormData, impact_factor: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Publication Date</label>
                                    <input type="date" value={pubFormData.date} onChange={(e) => setPubFormData({ ...pubFormData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                            </div>

                            <div className="space-y-4 pt-2 border-t border-slate-100 text-left">
                                <label className="text-xs font-bold text-slate-500 uppercase block">Submission Details</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="submission_mode" 
                                            value="Online" 
                                            checked={pubFormData.submission_mode === 'Online'} 
                                            onChange={() => setPubFormData({ ...pubFormData, submission_mode: 'Online' })} 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">Digital Copy (Online)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="submission_mode" 
                                            value="Offline" 
                                            checked={pubFormData.submission_mode === 'Offline'} 
                                            onChange={() => setPubFormData({ ...pubFormData, submission_mode: 'Offline' })} 
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">Physical Copy (Offline)</span>
                                    </label>
                                </div>

                                {pubFormData.submission_mode === 'Online' ? (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Upload Digital Copy / Link</label>
                                        <input 
                                            type="text" 
                                            value={pubFormData.attachment_path} 
                                            onChange={(e) => setPubFormData({ ...pubFormData, attachment_path: e.target.value })} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
                                            placeholder="URL or file path to digital copy"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Physical Submission Date</label>
                                        <input 
                                            type="date" 
                                            value={pubFormData.date} 
                                            onChange={(e) => setPubFormData({ ...pubFormData, date: e.target.value })} 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" 
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium italic">Please ensure physical copies are submitted to the R&D department.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowPubModal(false)} className="rounded-xl">Cancel</Button>
                            <Button onClick={handleAddPub} className="bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">Submit for Approval</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal for Managers */}
            {showReviewModal && selectedPub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300 text-left">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800 tracking-tight">Review Publication</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5">Application ID: #PUB-{selectedPub.id}</p>
                            </div>
                            <button onClick={() => setShowReviewModal(false)} className="bg-white p-2 rounded-full shadow-sm text-slate-400 hover:text-slate-600 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto max-h-[70vh] space-y-6">
                            {/* Paper Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-6 text-left">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faculty Member</p>
                                        <p className="font-bold text-slate-800">{selectedPub.employee_name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{selectedPub.department} • {selectedPub.designation}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Mode</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${selectedPub.submission_mode === 'Online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {selectedPub.submission_mode || 'Online'}
                                            </span>
                                            <span className="text-xs text-slate-500 font-bold">{selectedPub.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Paper Details</p>
                                    <h4 className="font-black text-lg text-slate-800 leading-tight mb-3">{selectedPub.title}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Type</p>
                                            <p className="text-xs font-black text-slate-700">{selectedPub.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Authorship</p>
                                            <p className="text-xs font-black text-slate-700">{selectedPub.authorship}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Impact Factor</p>
                                            <p className="text-xs font-black text-slate-700">{selectedPub.impact_factor || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 mb-0.5">Journal/Conf</p>
                                            <p className="text-xs font-black text-slate-700 truncate">{selectedPub.journal_name}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedPub.submission_mode === 'Online' && selectedPub.attachment_path && (
                                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-left">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <Eye className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-blue-900">Digital Copy Available</p>
                                            <p className="text-[10px] text-blue-600 font-bold truncate">{selectedPub.attachment_path}</p>
                                        </div>
                                        <Button size="sm" variant="outline" className="text-[10px] h-7 bg-white border-blue-200 text-blue-600 font-black hover:bg-blue-50">VIEW ATTACHMENT</Button>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-slate-100" />

                            {/* Decision Section */}
                            <div className="space-y-4 text-left">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Reviewer Comments</label>
                                    <textarea 
                                        id="reviewer-comments-detail"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" 
                                        placeholder="Add notes for the faculty member regarding this decision..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowReviewModal(false)}
                                className="rounded-xl font-bold border-slate-200 text-slate-600"
                            >
                                Back to Dashboard
                            </Button>
                            <div className="flex gap-3">
                                <Button 
                                    onClick={() => {
                                        const comments = (document.getElementById('reviewer-comments-detail') as HTMLTextAreaElement).value;
                                        handleReview(parseInt(selectedPub.id), 'Rejected', comments);
                                        setShowReviewModal(false);
                                    }}
                                    className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-xl px-6 font-black text-xs uppercase tracking-widest shadow-sm transition-all"
                                >
                                    Reject Application
                                </Button>
                                <Button 
                                    onClick={() => {
                                        const comments = (document.getElementById('reviewer-comments-detail') as HTMLTextAreaElement).value;
                                        handleReview(parseInt(selectedPub.id), 'Approved', comments);
                                        setShowReviewModal(false);
                                    }}
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/30 transition-all border-none"
                                >
                                    Approve Publication
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ResearchPublication;
