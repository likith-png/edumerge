import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Download, Search, Share2, ShieldCheck,
    ChevronLeft, QrCode, ExternalLink, Calendar,
    CheckCircle, Lock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

// --- Mock Data ---
const EARNED_CERTIFICATES = [
    {
        id: 'cert_001',
        title: 'Advanced Classroom Management',
        issuer: 'SCERT Delhi',
        date: 'Jan 15, 2024',
        expiry: 'Jan 15, 2026',
        score: '92%',
        status: 'Active',
        uniqueId: 'SCERT-2024-ACM-8392',
        template: 'institution'
    },
    {
        id: 'cert_002',
        title: 'NEP 2020 Implementation Guide',
        issuer: 'CBSE Training Unit',
        date: 'Dec 10, 2023',
        expiry: 'Lifetime',
        score: 'Completed',
        status: 'Active',
        uniqueId: 'CBSE-NEP-2023-9921',
        template: 'department'
    },
    {
        id: 'cert_003',
        title: 'Digital Literacy for Educators',
        issuer: 'Ministry of Education',
        date: 'Aug 22, 2023',
        expiry: 'Aug 22, 2024',
        score: '88%',
        status: 'Expiring Soon',
        uniqueId: 'MOE-DL-2023-4412',
        template: 'simple'
    }
];

const EARNED_BADGES = [
    { id: 'b1', title: 'Course Finisher', level: 'Bronze', date: 'Jan 15, 2024' },
    { id: 'b2', title: 'High Achiever', level: 'Silver', date: 'Jan 15, 2024' },
    { id: 'b3', title: 'Early Adopter', level: 'Gold', date: 'Sep 05, 2023' },
];

const CertificatesPrototype: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-slate-50 transition-all w-10 h-10" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Credentials</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Verified Certificates • Learner Badges</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 font-bold text-slate-600 h-10 rounded-lg px-6 border-slate-200 shadow-sm">
                        <Share2 className="w-4 h-4" /> Export Profile
                    </Button>
                    <Button className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-6 rounded-lg shadow-md">
                        <ExternalLink className="w-4 h-4" /> Public Verification
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                            <Award className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validated Certs</p>
                            <h3 className="text-2xl font-bold text-slate-900">{EARNED_CERTIFICATES.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Achievement Badges</p>
                            <h3 className="text-2xl font-bold text-slate-900">{EARNED_BADGES.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6 flex items-center gap-5">
                        <div className="w-14 h-14 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-transform">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Compliance</p>
                            <h3 className="text-2xl font-bold text-slate-900">Aug 2026</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Certificates List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Earned Certifications</h2>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Manage and download your professional credentials</p>
                    </div>
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Filter by title or issuer..."
                            className="pl-9 h-11 bg-white border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {EARNED_CERTIFICATES.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((cert) => (
                        <Card key={cert.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-slate-200 rounded-xl bg-white">
                            {/* Certificate Preview Mockup */}
                            <div className="h-52 bg-slate-50 relative p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-sm z-10">
                                    <Button variant="secondary" className="font-bold h-10 px-6 rounded-lg shadow-lg bg-white text-slate-900 border-none text-xs uppercase tracking-widest">
                                        <Download className="w-4 h-4 mr-2" /> PDF Copy
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="font-bold h-10 px-6 rounded-lg shadow-lg bg-indigo-600 text-white border-none text-xs uppercase tracking-widest">
                                                <QrCode className="w-4 h-4 mr-2" /> Verify
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-bold">Credential Verification</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-col items-center justify-center py-8 space-y-6">
                                                <div className="w-52 h-52 bg-white p-6 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                                                    <QrCode className="w-40 h-40 text-slate-900" />
                                                </div>
                                                <div className="text-center space-y-3 w-full">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Permanent Credential ID</p>
                                                    <p className="font-mono font-bold text-base text-slate-900 bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl select-all">
                                                        {cert.uniqueId}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Blockchain Verified Status</span>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="w-full h-full bg-white border-8 border-slate-100 shadow-sm p-4 flex flex-col items-center text-center transform group-hover:scale-105 transition-all duration-700">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 mb-2 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-xs leading-tight mb-1 uppercase tracking-tight">{cert.title}</h4>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Presented to</p>
                                    <p className="font-bold text-sm text-indigo-600 tracking-tight">Likith V.</p>
                                    <div className="mt-auto w-full flex justify-between items-end grayscale opacity-30">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-full" />
                                        <div className="w-16 h-0.5 bg-slate-900" />
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-900 text-base leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cert.title}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                            <ShieldCheck className="w-3 h-3 text-indigo-500" /> Verified by {cert.issuer}
                                        </p>
                                    </div>
                                    <Badge variant={cert.status === 'Active' ? 'default' : 'destructive'} className={`${cert.status === 'Active' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-red-50 text-red-700 hover:bg-red-100'} border-none font-bold text-[8px] px-2.5 py-1 uppercase tracking-widest rounded-full`}>
                                        {cert.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                                        <p className="font-bold text-slate-700 text-xs">{cert.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valid Until</p>
                                        <p className="font-bold text-slate-700 text-xs">{cert.expiry}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-6 pt-12 border-t border-slate-200">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Achievement Badges</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Milestones earned through continuous learning</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {EARNED_BADGES.map((badge) => (
                        <Card key={badge.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-md transition-all group">
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner
                                ${badge.level === 'Gold' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    badge.level === 'Silver' ? 'bg-slate-50 text-slate-400 border border-slate-200' :
                                        'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                <Award className="w-10 h-10" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm tracking-tight">{badge.title}</h4>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{badge.level} Class</p>
                            </div>
                        </Card>
                    ))}
                    {/* Locked Badge Placeholder */}
                    <Card className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center gap-4 opacity-70">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                            <Lock className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-400 text-sm tracking-tight">Master Guide</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Status: Locked</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CertificatesPrototype;
