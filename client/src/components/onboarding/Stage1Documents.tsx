import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Upload, CheckCircle, FileText } from 'lucide-react';

const Stage1Documents = ({ onComplete }: any) => {
    const [documents, setDocuments] = useState<any[]>([
        { id: 1, name: 'Aadhaar Card', status: 'Pending' },
        { id: 2, name: 'PAN Card', status: 'Pending' },
        { id: 3, name: 'Offer Letter Signed', status: 'Pending' },
        { id: 4, name: 'Educational Certificates', status: 'Pending' },
    ]);

    const handleUpload = (docId: number) => {
        // Simulate upload
        setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status: 'Uploaded' } : d));
    };

    const isAllUploaded = documents.every(d => d.status === 'Uploaded');

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Document Submission
            </h2>
            <p className="text-slate-500 mb-6 text-sm">Please upload clear scanned copies of the following documents to proceed to verification.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {documents.map((doc) => (
                    <Card key={doc.id} className={`border ${doc.status === 'Uploaded' ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${doc.status === 'Uploaded' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {doc.status === 'Uploaded' ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-900 text-sm">{doc.name}</h4>
                                    <p className="text-xs text-slate-500">{doc.status}</p>
                                </div>
                            </div>
                            {doc.status !== 'Uploaded' && (
                                <Button size="sm" variant="outline" onClick={() => handleUpload(doc.id)}>
                                    <Upload className="w-3 h-3 mr-1" /> Upload
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end">
                <Button disabled={!isAllUploaded} onClick={onComplete} className="bg-indigo-600 hover:bg-indigo-700">
                    Submit for Verification
                </Button>
            </div>
        </div>
    );
};

export default Stage1Documents;
