import { Button } from '../ui/button';
import { Monitor, Key, Mail, Check } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const Stage3Assets = ({ onComplete }: any) => {
    return (
        <div className="px-4 py-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-600" /> Asset Assignment
            </h2>
            <p className="text-slate-500 mb-4 text-sm">Assign digital and physical assets to the employee.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="border border-slate-200">
                    <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                            <Monitor className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Workstation</h4>
                        <p className="text-xs text-slate-500 mb-3">Laptop & Peripherals</p>
                        <Button size="sm" className="w-full bg-slate-900 text-white">Assign Asset</Button>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200">
                    <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Email ID</h4>
                        <p className="text-xs text-slate-500 mb-3">Corporate Account</p>
                        <Button size="sm" variant="outline" className="w-full text-emerald-600 border-emerald-200 bg-emerald-50">
                            <Check className="w-4 h-4 mr-1" /> Created
                        </Button>
                    </CardContent>
                </Card>
                <Card className="border border-slate-200">
                    <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3">
                            <Key className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Access Card</h4>
                        <p className="text-xs text-slate-500 mb-3">RFID & Biometric</p>
                        <Button size="sm" variant="outline" className="w-full">Configure</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button onClick={onComplete} className="bg-purple-600 hover:bg-purple-700">
                    Confirm Assets Handover
                </Button>
            </div>
        </div>
    );
};

export default Stage3Assets;
