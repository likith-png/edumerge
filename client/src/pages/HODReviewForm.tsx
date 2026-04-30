import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { UserCog, CheckCircle, XCircle, Clock, Send } from 'lucide-react';
import { getKRAsByRole, getKPIsByKRA } from '../services/appraisalService';

interface FacultyAppraisal {
    id: string;
    facultyName: string;
    employeeId: string;
    department: string;
    submittedDate: string;
    status: 'Pending Review' | 'Reviewed' | 'Sent to Principal';
}

const HODReviewForm: React.FC = () => {
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyAppraisal | null>(null);
    const [activeTab, setActiveTab] = useState('pending');

    const pendingAppraisals: FacultyAppraisal[] = [
        {
            id: 'a1',
            facultyName: 'Ms. Reshma Binu Prasad',
            employeeId: 'FAC001',
            department: 'Computer Science',
            submittedDate: '2025-02-10',
            status: 'Pending Review'
        },
        {
            id: 'a2',
            facultyName: 'Ms. Sanchaiyata Majumdar',
            employeeId: 'FAC002',
            department: 'Computer Science',
            submittedDate: '2025-02-08',
            status: 'Pending Review'
        }
    ];

    const reviewedAppraisals: FacultyAppraisal[] = [
        {
            id: 'a3',
            facultyName: 'Dr. R Sedhunivas',
            employeeId: 'FAC003',
            department: 'Computer Science',
            submittedDate: '2025-02-05',
            status: 'Reviewed'
        }
    ];

    const tabs = [
        { id: 'pending', label: 'Pending Review', count: pendingAppraisals.length, icon: Clock },
        { id: 'reviewed', label: 'Reviewed', count: reviewedAppraisals.length, icon: CheckCircle }
    ];

    return (
        <Layout title="HOD Review Dashboard" description="Review and approve teaching staff appraisals" icon={UserCog} showBack>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-amber-900">{pendingAppraisals.length}</div>
                        <div className="text-xs text-amber-700">Pending Review</div>
                    </CardContent>
                </Card>
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-green-900">{reviewedAppraisals.length}</div>
                        <div className="text-xs text-green-700">Reviewed</div>
                    </CardContent>
                </Card>
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="text-xl font-bold text-blue-900">5</div>
                        <div className="text-xs text-blue-700">Faculty under Supervision</div>
                    </CardContent>
                </Card>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                        <Badge variant="secondary" className="text-[10px]">{tab.count}</Badge>
                    </button>
                ))}
            </div>

            {/* Appraisal List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gapx-4 py-4">
                {/* Faculty List */}
                <div className="space-y-3">
                    {activeTab === 'pending' ? pendingAppraisals.map((appraisal) => (
                        <Card
                            key={appraisal.id}
                            className={`cursor-pointer border-slate-200 hover:shadow-sm transition-all ${selectedFaculty?.id === appraisal.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setSelectedFaculty(appraisal)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{appraisal.facultyName}</h3>
                                        <p className="text-sm text-slate-600">{appraisal.employeeId} • {appraisal.department}</p>
                                        <p className="text-xs text-slate-500 mt-1">Submitted: {new Date(appraisal.submittedDate).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                                        Pending
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )) : reviewedAppraisals.map((appraisal) => (
                        <Card
                            key={appraisal.id}
                            className={`cursor-pointer border-slate-200 hover:shadow-sm transition-all ${selectedFaculty?.id === appraisal.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                            onClick={() => setSelectedFaculty(appraisal)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{appraisal.facultyName}</h3>
                                        <p className="text-sm text-slate-600">{appraisal.employeeId} • {appraisal.department}</p>
                                        <p className="text-xs text-slate-500 mt-1">Submitted: {new Date(appraisal.submittedDate).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-[10px]">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Reviewed
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Review Panel */}
                <div>
                    {selectedFaculty ? (
                        <ReviewPanel faculty={selectedFaculty} />
                    ) : (
                        <Card className="border-slate-200">
                            <CardContent className="pt-6 text-center text-slate-500">
                                Select a faculty member to review their appraisal
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Layout>
    );
};

// Review Panel Component
const ReviewPanel: React.FC<{ faculty: FacultyAppraisal }> = ({ faculty }) => {
    const kras = getKRAsByRole('Teaching Staff');
    const [hodRatings, setHodRatings] = useState<Record<string, number>>({});
    const [overallRecommendation, setOverallRecommendation] = useState<string>('');

    const handleSubmit = () => {
        console.log('Submitting review for:', faculty.facultyName, {
            hodRatings,
            overallRecommendation
        });
    };

    return (
        <Card className="border-slate-200">
            <CardHeader className="pb-3 bg-blue-50 border-b border-blue-100">
                <CardTitle className="text-base">Review: {faculty.facultyName}</CardTitle>
                <p className="text-xs text-slate-600">{faculty.employeeId} • Submitted: {new Date(faculty.submittedDate).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent className="pt-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                    {/* Faculty Self-Ratings Summary */}
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Faculty Self-Assessment Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Overall Score: <strong>4.2/5.0</strong></div>
                            <div>KRAs Completed: <strong>7/7</strong></div>
                        </div>
                    </div>

                    {/* HOD Ratings */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-3">HOD Rating (Override Faculty Rating)</h4>
                        <div className="space-y-3">
                            {kras.filter(kra => kra.isMandatory).slice(0, 4).map((kra) => {
                                const kpis = getKPIsByKRA(kra.id);
                                return (
                                    <div key={kra.id} className="border border-slate-200 rounded-lg p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h5 className="text-sm font-medium text-slate-900">{kra.title}</h5>
                                                <p className="text-xs text-slate-500">{kra.description}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{kra.weightage}%</Badge>
                                        </div>

                                        {/* Faculty Self-Rating */}
                                        <div className="mb-2 p-2 bg-blue-50 rounded text-xs">
                                            <span className="text-slate-600">Faculty Self-Rating:</span>
                                            <span className="font-semibold text-blue-900 ml-2">4/5</span>
                                        </div>

                                        {/* KPI Display */}
                                        {kpis.length > 0 && (
                                            <div className="mb-2 p-2 bg-slate-50 rounded text-xs">
                                                {kpis.map((kpi) => (
                                                    <div key={kpi.id} className="flex justify-between">
                                                        <span className="text-slate-600">{kpi.title}</span>
                                                        <span className="font-semibold">{kpi.achieved || 0}/{kpi.target} {kpi.unit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* HOD Rating */}
                                        <div>
                                            <Label className="text-xs mb-1 block">Your Rating</Label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((rating) => (
                                                    <button
                                                        key={rating}
                                                        type="button"
                                                        onClick={() => setHodRatings({ ...hodRatings, [kra.id]: rating })}
                                                        className={`flex-1 py-1 text-sm rounded border-2 transition-all ${hodRatings[kra.id] === rating
                                                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                                                            : 'border-slate-200 hover:border-blue-300'
                                                            }`}
                                                    >
                                                        {rating}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Overall Recommendation */}
                    <div>
                        <Label htmlFor="recommendation">Overall Recommendation*</Label>
                        <Select value={overallRecommendation} onValueChange={setOverallRecommendation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select recommendation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="exceed">Exceeds Expectations - Recommend for Excellence Award</SelectItem>
                                <SelectItem value="meet">Meets Expectations - Approve</SelectItem>
                                <SelectItem value="improve">Needs Improvement - Coaching Required</SelectItem>
                                <SelectItem value="pip">Below Expectations - Recommend PIP</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* HOD Comments */}
                    <div>
                        <Label htmlFor="hodComments">HOD Comments & Observations</Label>
                        <Textarea
                            id="hodComments"
                            placeholder="Provide detailed feedback on faculty performance, specific observations, strengths, and areas for development..."
                            rows={4}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button variant="outline" className="flex-1 gap-2">
                            <XCircle className="h-4 w-4" />
                            Save as Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
                            disabled={!overallRecommendation}
                        >
                            <Send className="h-4 w-4" />
                            Submit to Principal
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HODReviewForm;
