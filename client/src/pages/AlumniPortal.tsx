import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { usePersona } from '../contexts/PersonaContext';
import {
    Download, FileText, CheckCircle, Clock,
    Briefcase, Building, Mail, Phone, Calendar,
    CreditCard, Home, HelpCircle
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
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-sm relative text-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                            >
                                <Home className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl font-bold text-white tracking-tight">
                                        Edumerge Alumni
                                    </h1>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Ex-Employee Portal
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Alumni Profile Snippet */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-white">{alumniData.name}</p>
                                <p className="text-xs text-slate-400">{alumniData.id}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-slate-700">
                                {alumniData.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Sidebar - Profile Summary */}
                <div className="md:col-span-4 lg:col-span-3 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-24"></div>
                        <div className="px-5 pb-5 pt-0 relative">
                            <div className="w-20 h-20 rounded-full bg-white relative -top-10 flex items-center justify-center border-4 border-white shadow-md mx-auto">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
                                    {alumniData.name.charAt(0)}
                                </div>
                            </div>
                            <div className="-mt-8 text-center space-y-1">
                                <h3 className="font-bold text-lg text-slate-900">{alumniData.name}</h3>
                                <p className="text-sm text-indigo-600 font-medium">{alumniData.designation}</p>
                                <p className="text-xs text-slate-500">{alumniData.department}</p>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <Building className="w-4 h-4 text-slate-400" />
                                    <span>{alumniData.id}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <span>{alumniData.totalTenure}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600 border-b border-slate-100 pb-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{alumniData.email}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Help */}
                    <Card className="border-indigo-100 bg-indigo-50/50">
                        <CardContent className="p-4 flex items-start gap-4">
                            <HelpCircle className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm text-slate-900">Need Assistance?</h4>
                                <p className="text-xs text-slate-600 mt-1">If you have questions regarding your settlement or documents, reach out to HR.</p>
                                <Button variant="link" className="px-0 text-xs text-indigo-600 h-auto mt-2">Contact HR Helpdesk &rarr;</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content Area */}
                <div className="md:col-span-8 lg:col-span-9 space-y-6">
                    {/* Welcome Banner */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Welcome to your Alumni Dashboard</h2>
                            <p className="text-sm text-slate-500 mt-1">Access your service certificates, final pay slips, and track settlement status here.</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-sm font-medium shrink-0">
                            Service Concluded: {alumniData.lwd}
                        </Badge>
                    </div>

                    {/* Content Tabs */}
                    <div className="flex space-x-1 border-b border-slate-200 mb-6">
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Separation Documents
                        </button>
                        <button
                            onClick={() => setActiveTab('settlement')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settlement' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Full & Final Settlement
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Employment Details
                        </button>
                    </div>

                    {/* TABS CONTENT */}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 mb-2">My Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {documents.map(doc => (
                                    <Card key={doc.id} className="border-slate-200 hover:border-indigo-300 transition-colors group">
                                        <CardContent className="p-5 flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                <doc.icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-slate-900 truncate">{doc.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        {doc.type}
                                                    </Badge>
                                                    <span className="text-xs text-slate-500">{doc.generatedOn}</span>
                                                </div>
                                            </div>
                                            <div>
                                                {doc.status === 'Ready' ? (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                                                        onClick={() => handleDownload(doc.name)}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-amber-600 bg-amber-50 border-amber-200">
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

                    {/* Settlement Tab */}
                    {activeTab === 'settlement' && (
                        <div className="space-y-6">
                            <Card className="border-slate-200">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Settlement Tracker</CardTitle>
                                            <CardDescription>Status timeline of your F&F settlement</CardDescription>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none px-3 py-1">
                                            {settlementDetails.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l-2 border-slate-100 ml-3 md:ml-4 py-2 space-y-6">
                                        {settlementDetails.steps.map((step, idx) => (
                                            <div key={idx} className="relative pl-6 md:pl-8">
                                                {/* Tracker Node */}
                                                <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white
                                                    ${step.status === 'done' ? 'bg-emerald-500' :
                                                        step.status === 'active' ? 'bg-blue-500' : 'bg-slate-200'}
                                                `}></span>

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <div>
                                                        <h4 className={`text-sm font-semibold ${step.status === 'pending' ? 'text-slate-500' : 'text-slate-800'}`}>
                                                            {step.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500">{step.date}</p>
                                                    </div>
                                                    {step.status === 'done' && <CheckCircle className="w-4 h-4 text-emerald-500 hidden sm:block" />}
                                                    {step.status === 'active' && <Clock className="w-4 h-4 text-blue-500 animate-pulse hidden sm:block" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-600">Expected Disbursement Date:</span>
                                            <span className="font-bold text-slate-900">{settlementDetails.expectedDate}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Settlement calculations are subject to clearance of all departmental NOCs and final attendance records. The final amount will be credited to your registered salary account.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Employment Details Tab */}
                    {activeTab === 'details' && (
                        <Card className="border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-lg">Service Record Snippet</CardTitle>
                                <CardDescription>A brief overview of your service with the institution.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Employee ID</p>
                                        <p className="font-medium text-slate-900">{alumniData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Last Designation</p>
                                        <p className="font-medium text-slate-900">{alumniData.designation}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Date of Joining</p>
                                        <p className="font-medium text-slate-900">{alumniData.joiningDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Last Working Day (LWD)</p>
                                        <p className="font-medium text-slate-900">{alumniData.lwd}</p>
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-semibold text-slate-800 mb-2">Update Contact Info</h4>
                                        <p className="text-xs text-slate-500 mb-4">Please keep your personal email and phone number updated so we can send important tax documents and settlement updates.</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Personal Email</label>
                                                <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700 font-medium">{alumniData.email}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                                                <div className="flex items-center gap-2 mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md">
                                                    <Phone className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-700 font-medium">{alumniData.phone}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </main>
        </div>
    );
};

export default AlumniPortal;
