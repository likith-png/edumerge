import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { usePersona } from '../contexts/PersonaContext';
import {
    Download, FileText, CheckCircle,
    Building, Mail, Phone, Calendar,
    HelpCircle, Briefcase, CreditCard
} from 'lucide-react';

const AlumniPortal: React.FC = () => {
    const { user } = usePersona();
    const [activeTab, setActiveTab] = useState('documents');

    // Mock Alumni Data
    const alumniData = {
        name: user.name,
        id: user.id,
        department: user.department || 'Academic Department',
        designation: 'Senior Associate Professor',
        joiningDate: '2018-08-01',
        lwd: '2023-12-15',
        totalTenure: '5 Years, 4 Months',
        email: 'jane.personal@email.com',
        phone: '+91 9876543210'
    };

    const documents = [
        { id: 1, name: 'Relieving Letter', type: 'PDF', generatedOn: '2023-12-20', status: 'Ready', icon: FileText },
        { id: 2, name: 'Experience Certificate', type: 'PDF', generatedOn: '2023-12-20', status: 'Ready', icon: Briefcase },
        { id: 3, name: 'Full & Final Settlement Sheet', type: 'Excel', generatedOn: '2024-01-10', status: 'Pending Approval', icon: CreditCard },
        { id: 4, name: 'Last 3 Months Payslips', type: 'ZIP', generatedOn: '2023-12-15', status: 'Ready', icon: FileText }
    ];

    const settlementDetails = {
        status: 'Processing',
        expectedDate: '2024-01-30',
        steps: [
            { name: 'Exit Interview Completed', date: '2023-12-14', status: 'done' },
            { name: 'Assets Handed Over', date: '2023-12-15', status: 'done' },
            { name: 'Department NOCs Cleared', date: '2023-12-18', status: 'done' },
            { name: 'Payroll Calculation', date: 'In Progress', status: 'active' },
            { name: 'Final Payout Disbursed', date: 'Expected 2024-01-30', status: 'pending' },
        ]
    };

    const handleDownload = (docName: string) => {
        // Mock download action
        alert(`Initiating download for ${docName}...`);
    };

    return (
        <Layout
            title="Edumerge Alumni"
            description="Ex-Employee Portal | Service Concluded: 2023-12-15"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Sidebar - Profile Summary */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-20"></div>
                        <div className="px-5 pb-5 pt-0 relative">
                            <div className="w-16 h-16 rounded-2xl bg-white relative -top-8 flex items-center justify-center border-4 border-white shadow-md mx-auto">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-black text-slate-700">
                                    {alumniData.name.charAt(0)}
                                </div>
                            </div>
                            <div className="-mt-6 text-center space-y-1">
                                <h3 className="font-black text-slate-900 uppercase tracking-tight">{alumniData.name}</h3>
                                <p className="text-xs text-indigo-600 font-black uppercase tracking-widest">{alumniData.designation}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">{alumniData.department}</p>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 border-b border-slate-50 pb-2">
                                    <Building className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{alumniData.id}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 border-b border-slate-50 pb-2">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    <span>{alumniData.totalTenure}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600 border-b border-slate-50 pb-2">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="truncate">{alumniData.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Help */}
                    <Card className="border-indigo-100 bg-indigo-50/30 rounded-2xl">
                        <CardContent className="p-4 flex items-start gap-4">
                            <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-black text-xs text-slate-900 uppercase tracking-tight">Need help?</h4>
                                <p className="text-[10px] font-medium text-slate-600 mt-1 leading-relaxed">Reach out to HR for settlement queries.</p>
                                <Button variant="link" className="px-0 text-[10px] font-black text-indigo-600 h-auto mt-2 uppercase tracking-widest">Contact HR &rarr;</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content Area */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-2xl px-6 py-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-[950] text-slate-900 tracking-tight uppercase">Alumni Dashboard</h2>
                            <p className="text-xs font-medium text-slate-500">Access service certificates and track settlement.</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0">
                            Service Concluded: {alumniData.lwd}
                        </Badge>
                    </div>

                    {/* Content Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'documents' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Documents
                        </button>
                        <button
                            onClick={() => setActiveTab('settlement')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settlement' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Settlement
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Details
                        </button>
                    </div>

                    {/* TABS CONTENT */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {documents.map(doc => (
                                        <Card key={doc.id} className="border-slate-100 hover:border-indigo-200 transition-all group rounded-2xl shadow-sm hover:shadow-md">
                                            <CardContent className="p-5 flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0 border border-slate-50">
                                                    <doc.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-sm text-slate-900 uppercase tracking-tighter truncate">{doc.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-black px-2 py-0">
                                                            {doc.type}
                                                        </Badge>
                                                        <span className="text-[10px] font-bold text-slate-400">{doc.generatedOn}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    {doc.status === 'Ready' ? (
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 rounded-xl text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                                            onClick={() => handleDownload(doc.name)}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    ) : (
                                                        <Badge className="text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border-none px-2">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'settlement' && (
                            <Card className="border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-base font-[950] text-slate-900 uppercase tracking-tight">Settlement Tracker</CardTitle>
                                            <CardDescription className="text-xs font-medium">Timeline of your final settlement</CardDescription>
                                        </div>
                                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {settlementDetails.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="relative border-l-2 border-slate-100 ml-4 py-2 space-y-8">
                                        {settlementDetails.steps.map((step, idx) => (
                                            <div key={idx} className="relative pl-10">
                                                <span className={`absolute -left-[11px] top-1.5 h-5 w-5 rounded-full ring-4 ring-white shadow-sm transition-all
                                                    ${step.status === 'done' ? 'bg-emerald-500 scale-110' :
                                                        step.status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-200'}
                                                `}>
                                                    {step.status === 'done' && <CheckCircle className="w-3 h-3 text-white absolute inset-0 m-auto" />}
                                                </span>

                                                <div className="flex flex-col gap-1">
                                                    <h4 className={`text-sm font-black uppercase tracking-tight ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>
                                                        {step.name}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected Payout</p>
                                            <p className="text-sm font-black text-slate-900">{settlementDetails.expectedDate}</p>
                                        </div>
                                        <p className="text-[10px] font-medium text-slate-500 max-w-[200px] text-right italic">
                                            Subject to departmental NOC clearances.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'details' && (
                            <Card className="border-slate-100 rounded-[32px] shadow-sm">
                                <CardHeader className="p-6">
                                    <CardTitle className="text-base font-[950] text-slate-900 uppercase tracking-tight">Service Record</CardTitle>
                                    <CardDescription className="text-xs font-medium">Overview of your professional history.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Employee ID', value: alumniData.id },
                                            { label: 'Last Designation', value: alumniData.designation },
                                            { label: 'Joining Date', value: alumniData.joiningDate },
                                            { label: 'Last Working Day', value: alumniData.lwd }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                                <p className="text-sm font-black text-slate-900">{item.value}</p>
                                            </div>
                                        ))}
                                        <div className="md:col-span-2 mt-4 p-6 rounded-[24px] bg-indigo-50/30 border border-indigo-100 space-y-4">
                                            <div>
                                                <h4 className="text-xs font-[950] text-slate-900 uppercase tracking-tight">Contact Information</h4>
                                                <p className="text-[10px] font-medium text-slate-500 mt-1">Keep your details updated for tax relevant documents.</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-xl">
                                                    <Mail className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-xs font-bold text-slate-700">{alumniData.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-xl">
                                                    <Phone className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-xs font-bold text-slate-700">{alumniData.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AlumniPortal;
