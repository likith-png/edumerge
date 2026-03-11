import { Button } from '../ui/button';
import { BadgeCheck, XCircle } from 'lucide-react';

const Stage2Verification = ({ onComplete }: any) => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-blue-600" /> HR Verification
            </h2>
            <p className="text-slate-500 mb-6 text-sm">Review submitted documents and approve to proceed to asset assignment.</p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                <h4 className="font-semibold text-sm mb-2">Documents for Review</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span>Aadhaar Card.pdf</span>
                        <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:underline">View</button>
                            <span className="text-xs text-emerald-600 font-medium">Auto-Verified</span>
                        </div>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span>PAN Card.pdf</span>
                        <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:underline">View</button>
                            <span className="text-xs text-emerald-600 font-medium">Verified</span>
                        </div>
                    </li>
                    <li className="flex justify-between items-center py-2">
                        <span>Offer Letter Signed.pdf</span>
                        <div className="flex gap-2">
                            <button className="text-xs text-blue-600 hover:underline">View</button>
                            <button className="text-xs text-amber-600 hover:underline">Mark Pending</button>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="flex gap-3 justify-end">
                <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="w-4 h-4 mr-2" /> Reject & Request Resubmission
                </Button>
                <Button onClick={onComplete} className="bg-blue-600 hover:bg-blue-700">
                    <BadgeCheck className="w-4 h-4 mr-2" /> Approve & Proceed
                </Button>
            </div>
        </div>
    );
};

export default Stage2Verification;
