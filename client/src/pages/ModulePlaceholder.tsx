import React from 'react';
import Layout from '../components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

import { HelpCircle } from 'lucide-react';

const ModulePlaceholder: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Layout title={title} description={`Manage ${title} details`} icon={HelpCircle} showBack>
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">{title} Module</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <div className="text-center py-10">
                        <HelpCircle className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-medium text-slate-500">Module Under Construction</p>
                        <p className="text-xs text-slate-400 mt-1">Detailed requirements pending.</p>
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default ModulePlaceholder;
