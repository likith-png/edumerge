import React from 'react';
import ExitConfiguration from '../components/exit/ExitConfiguration';
import Layout from '../components/Layout';
const ExitConfig: React.FC = () => {
    return (
        <Layout title="Exit Configuration" description="Manage settings for exit workflows and policies" showBack={true}>
            <div className="h-[calc(100vh-160px)]">
                <ExitConfiguration />
            </div>
        </Layout>
    );
};

export default ExitConfig;
