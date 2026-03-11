import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, Download, Search, Share2, ShieldCheck,
    ChevronLeft, QrCode, ExternalLink, Calendar,
    CheckCircle
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
        <div className="min-h-screen bg-slate-50 animate-in fade-in slide-in-from-right-4 duration-500 p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Credentials</h1>
                        <p className="text-slate-500 font-medium">Manage your earned certificates and digital badges.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 font-bold text-slate-600">
                        <Share2 className="w-4 h-4" /> Export Profile
                    </Button>
                    <Button className="gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        <ExternalLink className="w-4 h-4" /> Public Verification Page
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Certificates</p>
                            <h3 className="text-3xl font-black text-slate-900">{EARNED_CERTIFICATES.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Digital Badges</p>
                            <h3 className="text-3xl font-black text-slate-900">{EARNED_BADGES.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Next Renewal</p>
                            <h3 className="text-xl font-black text-slate-900">Aug 2024</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Certificates List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Certificates</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search certificates..."
                            className="pl-9 h-10 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {EARNED_CERTIFICATES.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((cert) => (
                        <Card key={cert.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-slate-200 rounded-2xl">
                            {/* Certificate Preview Mockup */}
                            <div className="h-48 bg-slate-100 relative p-4 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm z-10">
                                    <Button variant="secondary" className="font-bold shadow-lg">
                                        <Download className="w-4 h-4 mr-2" /> PDF
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="font-bold shadow-lg">
                                                <QrCode className="w-4 h-4 mr-2" /> Verify
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Certificate Verification</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-col items-center justify-center py-6 space-y-6">
                                                <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-inner border border-slate-100 flex items-center justify-center">
                                                    <QrCode className="w-32 h-32 text-slate-900" />
                                                </div>
                                                <div className="text-center space-y-2">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credential ID</p>
                                                    <p className="font-mono font-bold text-lg text-slate-900 bg-slate-100 px-4 py-2 rounded-lg select-all">
                                                        {cert.uniqueId}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span className="text-xs font-bold">Valid & Verified</span>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="w-full h-full bg-white border-4 border-double border-slate-200 shadow-sm p-4 flex flex-col items-center text-center transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 mb-2" />
                                    <h4 className="font-serif font-bold text-slate-800 text-sm leading-tight mb-1">{cert.title}</h4>
                                    <p className="text-[10px] text-slate-500">Awarded to</p>
                                    <p className="font-bold text-xs text-slate-700 mb-2">Likith V.</p>
                                    <div className="mt-auto w-full flex justify-between items-end">
                                        <div className="w-8 h-8 bg-amber-100 rounded-full opacity-50" />
                                        <div className="w-12 h-0.5 bg-slate-800" />
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 line-clamp-1">{cert.title}</h3>
                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                            Issued by {cert.issuer}
                                        </p>
                                    </div>
                                    <Badge variant={cert.status === 'Active' ? 'default' : 'destructive'} className={`${cert.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-700 hover:bg-red-100'} border-none`}>
                                        {cert.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1">
                                        <p className="text-slate-400 font-bold">Issued on</p>
                                        <p className="font-medium text-slate-700">{cert.date}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-400 font-bold">Valid until</p>
                                        <p className="font-medium text-slate-700">{cert.expiry}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Badges Section */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Digital Badges</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {EARNED_BADGES.map((badge) => (
                        <div key={badge.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center 
                                ${badge.level === 'Gold' ? 'bg-amber-100 text-amber-600' :
                                    badge.level === 'Silver' ? 'bg-slate-100 text-slate-500' :
                                        'bg-orange-100 text-orange-600'}`}>
                                <Award className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{badge.title}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{badge.level}</p>
                            </div>
                        </div>
                    ))}
                    {/* Locked Badge Placeholder */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200 flex flex-col items-center text-center gap-3 opacity-60">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-400 text-sm">Master Guide</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Locked</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatesPrototype;
