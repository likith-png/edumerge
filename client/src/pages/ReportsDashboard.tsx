import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import {
    PieChart, FileText, Download, BarChart2, Filter,
    Settings, CheckCircle2, Plus, Sheet, Table,
    Activity, UserPlus, LogOut, FileCheck, Eye, X, Briefcase, Calendar, DollarSign, Users
} from 'lucide-react';
import { Badge } from '../components/ui/badge';

const mockReports = [
    { id: 1, title: 'New Joinee Summary', module: 'Onboarding', type: 'PDF/Excel', lastRun: '2 hours ago', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, title: 'Pending Onboarding Tasks', module: 'Onboarding', type: 'Excel', lastRun: 'Today', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { id: 3, title: 'Organization Bell Curve', module: 'Appraisal', type: 'PDF', lastRun: '1 week ago', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 4, title: 'Top Performers List', module: 'Appraisal', type: 'Excel', lastRun: 'Last Month', icon: BarChart2, color: 'text-indigo-500', bg: 'bg-indigo-50/50' },
    { id: 5, title: 'Attrition Rate Analysis', module: 'Exit Management', type: 'PDF/Excel', lastRun: 'Yesterday', icon: LogOut, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 6, title: 'Exit Interview Sentiments', module: 'Exit Management', type: 'PDF', lastRun: '3 days ago', icon: FileCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 7, title: 'Space Utilization Summary', module: 'Capacity Intelligence', type: 'PDF/Excel', lastRun: '12 hours ago', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 8, title: 'Hostel Waitlist Report', module: 'Capacity Intelligence', type: 'Excel', lastRun: 'Today', icon: Table, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
    { id: 9, title: 'Recruitment Funnel & Metrics', module: 'Talent Acquisition', type: 'PDF/Excel', lastRun: '1 hour ago', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 10, title: 'Monthly Availed Leave Report', module: 'Leave Management', type: 'Excel', lastRun: 'Today', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 11, title: 'Yearly Leave Book Details', module: 'Leave Management', type: 'Excel', lastRun: '2 days ago', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 12, title: 'Staff Salary Details', module: 'Payroll', type: 'Excel', lastRun: 'Last week', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 13, title: 'Monthly Biometric Attendance Report', module: 'Attendance', type: 'Excel', lastRun: 'Just now', icon: Activity, color: 'text-blue-700', bg: 'bg-blue-100' },
    { id: 14, title: 'Departmental Staff Comprehensive Report', module: 'Staff Portfolio', type: 'Excel', lastRun: 'New', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const mockModules = ['Onboarding', 'Appraisal', 'Exit Management', 'Capacity Intelligence', 'Staff Portfolio', 'Talent Acquisition', 'Leave Management', 'Payroll', 'Attendance'];
const mockColumns = [
    'SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'Qualification',
    'Experience', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others',
    'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'
];

const seededTalentData = [
    { id: 'APP-1001', name: 'Ms. Reshma Binu Prasad', role: 'Senior Developer', department: 'Engineering', stage: 'Offered', appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1002', name: 'Ms. Sanchaiyata Majumdar', role: 'UX Designer', department: 'Design', stage: 'Interview', appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1003', name: 'Dr. R Sedhunivas', role: 'Product Manager', department: 'Product', stage: 'Screening', appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1004', name: 'Dr. Ranjita Saikia', role: 'Data Analyst', department: 'Data Science', stage: 'Applied', appliedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1005', name: 'Mr. Manjit Singh', role: 'Frontend Engineer', department: 'Engineering', stage: 'Interview', appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1006', name: 'Mr. Edwin Vimal A', role: 'DevOps Engineer', department: 'Engineering', stage: 'Offered', appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1007', name: 'Ms. Reshma Binu Prasad', role: 'Account Executive', department: 'Sales', stage: 'Screening', appliedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }
];

const ReportsDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
    const [filterModule, setFilterModule] = useState<string>('All');
    const [isGenerating, setIsGenerating] = useState(false);

    // Talent Acquisition Report Filters
    const [taDateFilter, setTaDateFilter] = useState<string>('All Time');
    const [taDeptFilter, setTaDeptFilter] = useState<string>('All');
    const [taStageFilter, setTaStageFilter] = useState<string>('All');

    React.useEffect(() => {
        // Fetch real data to drive "New Joinee Summary" report
        fetch('http://localhost:5002/api/onboarding/dashboard')
            .then(res => res.json())
            .catch(err => console.error("Failed to fetch onboarding data", err));

        // Fetch Employee data for Appraisal reports
        fetch('/api/employee')
            .then(res => res.json())
            .then(data => console.log('Fetched Employee Data', Array.isArray(data) ? data.length : 0))
            .catch(err => console.error("Failed to fetch employee data", err));

        // Fetch Exit data for Exit reporting
        fetch('/api/exit')
            .then(res => res.json())
            .then(data => console.log('Fetched Exit Data', Array.isArray(data) ? data.length : 0))
            .catch(err => console.error("Failed to fetch exit data", err));
    }, []);

    // Custom Builder State
    const [selectedModule, setSelectedModule] = useState('Onboarding');
    const [selectedColumns, setSelectedColumns] = useState<string[]>(['Employee ID', 'Name', 'Department']);
    const [customFilters, setCustomFilters] = useState<{ column: string, operator: string, value: string }[]>([]);
    const [showGeneratedReport, setShowGeneratedReport] = useState(false);
    const [viewReportModal, setViewReportModal] = useState<any | null>(null);

    const addFilter = () => {
        setCustomFilters([...customFilters, { column: mockColumns[0], operator: 'Equals', value: '' }]);
    };

    const updateFilter = (index: number, field: string, value: string) => {
        const newFilters = [...customFilters];
        newFilters[index] = { ...newFilters[index], [field]: value };
        setCustomFilters(newFilters);
    };

    const removeFilter = (index: number) => {
        setCustomFilters(customFilters.filter((_, i) => i !== index));
    };

    const handleCustomExport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setShowGeneratedReport(true);
        }, 1500);
    };

    const handleDownload = (format: string, reportTitle: string) => {
        setIsGenerating(true);
        // Simulate generation delay
        setTimeout(() => {
            setIsGenerating(false);
            alert(`Successfully generated ${reportTitle} as ${format}`);
        }, 1500);
    };

    const toggleColumn = (col: string) => {
        setSelectedColumns(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    const getFilteredTalentData = () => {
        return seededTalentData.filter(app => {
            let matchesDate = true;
            if (taDateFilter === 'Last 7 Days') {
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = new Date(app.appliedDate) >= sevenDaysAgo;
            } else if (taDateFilter === 'Last 30 Days') {
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = new Date(app.appliedDate) >= thirtyDaysAgo;
            }

            const matchesDept = taDeptFilter === 'All' || app.department === taDeptFilter;
            const matchesStage = taStageFilter === 'All' || app.stage === taStageFilter;

            return matchesDate && matchesDept && matchesStage;
        }).map(app => ({
            'App ID': app.id,
            Name: app.name,
            Role: app.role,
            Department: app.department,
            Stage: app.stage,
            'Applied Date': new Date(app.appliedDate).toLocaleDateString()
        }));
    };

    const getReportData = (title: string) => {
        switch (title) {
            case 'Recruitment Funnel & Metrics':
                const filteredApplications = getFilteredTalentData();
                return {
                    columns: ['App ID', 'Name', 'Role', 'Department', 'Stage', 'Applied Date'],
                    data: filteredApplications.length > 0 ? filteredApplications : [{ 'App ID': '-', Name: 'No Applications Found matching the filters', Role: '-', Department: '-', Stage: '-', 'Applied Date': '-' }]
                };
            case 'New Joinee Summary':
                const onboardingCandidates = [
                    { id: 0, name: 'Mr. Arvind Sharma', role: 'Mathematics Teacher', dept: 'Mathematics', stage: 'Offer Accepted', status: 'Completed', joinDate: '2026-04-01' },
                    { id: 1, name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', dept: 'Computer Science', stage: 'Documentation', status: 'In Progress', joinDate: '2026-03-15' },
                    { id: 2, name: 'Ms. Sanchaiyata Majumdar', role: 'Lab Instructor', dept: 'Physics', stage: 'Orientation', status: 'On Track', joinDate: '2026-03-10' },
                    { id: 3, name: 'Dr. R Sedhunivas', role: 'Admin Officer', dept: 'Administration', stage: 'BGV', status: 'SLA Breach', joinDate: '2026-02-28' },
                    { id: 4, name: 'Dr. Ranjita Saikia', role: 'Lecturer', dept: 'Mathematics', stage: 'Operational Checklist', status: 'On Track', joinDate: '2026-03-12' },
                    { id: 5, name: 'Mr. Manjit Singh', role: 'Research Associate', dept: 'Chemistry', stage: 'Sign-Off', status: 'On Track', joinDate: '2026-03-01' },
                ];
                const joiners = onboardingCandidates.filter(c => c.stage === 'Sign-Off' || c.status === 'Completed');
                return {
                    columns: ['ID', 'Name', 'Department', 'Role', 'Join Date', 'Status'],
                    data: joiners.length > 0 ? joiners.map(c => ({
                        ID: `CAND-${c.id}`,
                        Name: c.name,
                        Department: c.dept,
                        Role: c.role,
                        'Join Date': c.joinDate,
                        Status: c.status
                    })) : [{ ID: '-', Name: 'No new joiners found', Department: '-', Role: '-', 'Join Date': '-', Status: '-' }]
                };
            case 'Pending Onboarding Tasks':
                const pendingCandidates = [
                    { id: 0, name: 'Mr. Arvind Sharma', role: 'Mathematics Teacher', dept: 'Mathematics', stage: 'Offer Accepted', status: 'Completed', joinDate: '2026-04-01' },
                    { id: 1, name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', dept: 'Computer Science', stage: 'Documentation', status: 'In Progress', joinDate: '2026-03-15' },
                    { id: 2, name: 'Ms. Sanchaiyata Majumdar', role: 'Lab Instructor', dept: 'Physics', stage: 'Orientation', status: 'On Track', joinDate: '2026-03-10' },
                    { id: 3, name: 'Dr. R Sedhunivas', role: 'Admin Officer', dept: 'Administration', stage: 'BGV', status: 'SLA Breach', joinDate: '2026-02-28' },
                    { id: 4, name: 'Dr. Ranjita Saikia', role: 'Lecturer', dept: 'Mathematics', stage: 'Operational Checklist', status: 'On Track', joinDate: '2026-03-12' },
                    { id: 5, name: 'Mr. Manjit Singh', role: 'Research Associate', dept: 'Chemistry', stage: 'Sign-Off', status: 'On Track', joinDate: '2026-03-01' },
                ].filter(c => c.status !== 'Completed' && c.stage !== 'Sign-Off');
                return {
                    columns: ['ID', 'Name', 'Department', 'Current Stage', 'Status', 'SLA Status'],
                    data: pendingCandidates.length > 0 ? pendingCandidates.map(c => ({
                        ID: `CAND-${c.id}`,
                        Name: c.name,
                        Department: c.dept,
                        'Current Stage': c.stage,
                        Status: c.status,
                        'SLA Status': c.status === 'SLA Breach' ? '⚠️ Breach' : '✅ On Track'
                    })) : [{ ID: '-', Name: 'No pending tasks', Department: '-', 'Current Stage': '-', Status: '-', 'SLA Status': '-' }]
                };
            case 'Organization Bell Curve':
            case 'Top Performers List':
                return {
                    columns: ['Employee ID', 'Name', 'Department', 'Designation'],
                    data: [{ 'Employee ID': '-', Name: 'No Appraisal Data', Department: '-', Designation: '-' }]
                };
            case 'Attrition Rate Analysis':
            case 'Exit Interview Sentiments':
                return {
                    columns: ['Exit ID', 'Type', 'Reason', 'Status'],
                    data: [{ 'Exit ID': '-', Type: 'No Exit Data', Reason: '-', Status: '-' }]
                };
            case 'Monthly Availed Leave Report':
                return {
                    columns: ['Staff Code', 'Staff Name', 'Department', 'Designation', 'D.O.J', 'EL', 'CL', 'SL', 'ML', 'VL', 'OOD', 'OED', 'CO', 'LOP', 'LOPNR', 'HR Comments'],
                    data: [
                        { 'Staff Code': 'NH-0001', 'Staff Name': 'V Manjula', 'Department': 'Human Resources', 'Designation': 'Executive Director', 'D.O.J': '2010-06-01', 'EL': 3, 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' },
                        { 'Staff Code': 'NH-0212', 'Staff Name': 'Bindu Menon', 'Department': 'Human Resources', 'Designation': 'Sr. HR Generalist', 'D.O.J': '2015-08-15', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' },
                        { 'Staff Code': 'NH-0796', 'Staff Name': 'Maroju Hima Bindu', 'Department': 'Human Resources', 'Designation': 'Sr. HR Executive', 'D.O.J': '2017-10-22', 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': 7, 'OOD': '-', 'OED': '-', 'CO': 2, 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' }
                    ]
                };
            case 'Yearly Leave Book Details':
                return {
                    columns: ['EmployeeCode', 'EmployeeName', 'Department', 'Designation', 'DOJ', 'TotalEL', 'TakenEL', 'BalanceEL', 'TotalCL', 'TakenCL', 'BalanceCL', 'TotalSL', 'TakenSL', 'BalanceSL', 'TotalML', 'TakenML', 'BalanceML', 'TotalVL', 'TakenVL', 'BalanceVL', 'TotalOOD', 'TakenOOD', 'BalanceOOD', 'TotalOED', 'TakenOED', 'BalanceOED', 'TotalCO', 'TakenCO', 'BalanceCO', 'TotalLOP', 'TakenLOP', 'BalanceLOP', 'TotalLOPNR', 'TakenLOPNR', 'BalanceLOPNR'],
                    data: [
                        { 'EmployeeCode': 'NH-0001', 'EmployeeName': 'V Manjula', 'Department': 'Human Resources', 'Designation': 'Executive Director', 'DOJ': '2010-06-01', 'TotalEL': 21, 'TakenEL': 16, 'BalanceEL': 5, 'TotalCL': 12, 'TakenCL': 7.5, 'BalanceCL': 4.5, 'TotalSL': '-', 'TakenSL': '-', 'BalanceSL': '-', 'TotalML': '-', 'TakenML': '-', 'BalanceML': '-', 'TotalVL': '-', 'TakenVL': '-', 'BalanceVL': '-', 'TotalOOD': 7, 'TakenOOD': 0, 'BalanceOOD': 7, 'TotalOED': '-', 'TakenOED': '-', 'BalanceOED': '-', 'TotalCO': '-', 'TakenCO': '-', 'BalanceCO': '-', 'TotalLOP': 5, 'TakenLOP': 0, 'BalanceLOP': 5, 'TotalLOPNR': '-', 'TakenLOPNR': '-', 'BalanceLOPNR': '-' },
                        { 'EmployeeCode': 'NH-0003', 'EmployeeName': 'Surya Prakash H N', 'Department': 'Administration', 'Designation': 'Registrar', 'DOJ': '2008-05-10', 'TotalEL': 21, 'TakenEL': 14, 'BalanceEL': 7, 'TotalCL': 12, 'TakenCL': 10.5, 'BalanceCL': 1.5, 'TotalSL': '-', 'TakenSL': '-', 'BalanceSL': '-', 'TotalML': '-', 'TakenML': '-', 'BalanceML': '-', 'TotalVL': '-', 'TakenVL': '-', 'BalanceVL': '-', 'TotalOOD': 7, 'TakenOOD': 4, 'BalanceOOD': 3, 'TotalOED': '-', 'TakenOED': '-', 'BalanceOED': '-', 'TotalCO': '-', 'TakenCO': '-', 'BalanceCO': '-', 'TotalLOP': 5, 'TakenLOP': 0, 'BalanceLOP': 5, 'TotalLOPNR': '-', 'TakenLOPNR': '-', 'BalanceLOPNR': '-' }
                    ]
                };
            case 'Staff Salary Details':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'Qualification', 'Experience', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'],
                    data: [
                        { 'SlNo': 1, 'StaffCode': 'NH-0010', 'Name': 'ABC', 'Designation': 'Registrar', 'DOB': '1975-10-15', 'Qualification': 'SSLC, PUC, B. Com', 'Experience': '37.05 Yrs', 'DOJ': '2008-05-10', 'Basic': 64900, 'DA': 7301, 'HRA': 25960, 'CCA': 600, 'Others': 60111, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 15000, 'Gross': 175122 },
                        { 'SlNo': 2, 'StaffCode': 'NH-0011', 'Name': 'DEF', 'Designation': 'Asst. Registrar', 'DOB': '1982-03-24', 'Qualification': 'SSLC, PUC, B.COM', 'Experience': '22.1 Yrs', 'DOJ': '2010-02-18', 'Basic': 20300, 'DA': 2284, 'HRA': 8120, 'CCA': 600, 'Others': 32772, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 65326 },
                        { 'SlNo': 3, 'StaffCode': 'NH-0012', 'Name': 'XYZ', 'Designation': 'Sr. Office Executive', 'DOB': '1985-06-12', 'Qualification': 'SSLC, DIPLOMA', 'Experience': '15.5 Yrs', 'DOJ': '2012-04-05', 'Basic': 18500, 'DA': 2081, 'HRA': 7400, 'CCA': 600, 'Others': 28419, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 58250 },
                        { 'SlNo': 4, 'StaffCode': 'NH-0013', 'Name': 'ahdhjka', 'Designation': 'jr. Divisional Asst.', 'DOB': '1990-11-20', 'Qualification': 'ARTS', 'Experience': '8.2 Yrs', 'DOJ': '2015-09-15', 'Basic': 15200, 'DA': 1710, 'HRA': 6080, 'CCA': 600, 'Others': 22510, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 47350 },
                        { 'SlNo': 5, 'StaffCode': 'NH-0014', 'Name': 'lksdlkjlkjs', 'Designation': 'Office Executive', 'DOB': '1992-02-28', 'Qualification': 'COMMERCE', 'Experience': '6.1 Yrs', 'DOJ': '2018-01-10', 'Basic': 14000, 'DA': 1575, 'HRA': 5600, 'CCA': 600, 'Others': 20225, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 43250 },
                        { 'SlNo': 6, 'StaffCode': 'NH-0015', 'Name': 'ahdhjka', 'Designation': 'Sr. Assistant Professor', 'DOB': '1988-05-15', 'Qualification': 'M Tech, (PhD)', 'Experience': '10.5 Yrs', 'DOJ': '2014-07-20', 'Basic': 35400, 'DA': 3983, 'HRA': 14160, 'CCA': 600, 'Others': 45107, 'Conv.All': 1250, 'AGP(Ind)': 8000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 110300 },
                        { 'SlNo': 7, 'StaffCode': 'NH-0016', 'Name': 'ahdhjka', 'Designation': 'Associate Professor', 'DOB': '1980-08-22', 'Qualification': 'Ph.D', 'Experience': '18.2 Yrs', 'DOJ': '2012-01-15', 'Basic': 45000, 'DA': 5063, 'HRA': 18000, 'CCA': 600, 'Others': 58287, 'Conv.All': 1250, 'AGP(Ind)': 9000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 139000 },
                        { 'SlNo': 8, 'StaffCode': 'NH-0017', 'Name': 'ahdhjka', 'Designation': 'Professor & HOD', 'DOB': '1972-01-05', 'Qualification': 'Ph.D', 'Experience': '25.4 Yrs', 'DOJ': '2008-05-10', 'Basic': 65000, 'DA': 7313, 'HRA': 26000, 'CCA': 600, 'Others': 82587, 'Conv.All': 1250, 'AGP(Ind)': 10000, 'PF Amnt': 0, 'Variable Pay': 25000, 'Gross': 217750 },
                        { 'SlNo': 9, 'StaffCode': 'NH-0018', 'Name': 'ahdhjka', 'Designation': 'Sr. Assistant Professor & HOD', 'DOB': '1984-04-18', 'Qualification': 'MBA, MPhil', 'Experience': '14.1 Yrs', 'DOJ': '2013-06-01', 'Basic': 32400, 'DA': 3645, 'HRA': 12960, 'CCA': 600, 'Others': 41045, 'Conv.All': 1250, 'AGP(Ind)': 8000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 101700 },
                        { 'SlNo': 10, 'StaffCode': 'NH-0019', 'Name': 'ahdhjka', 'Designation': 'Librarian', 'DOB': '1986-12-30', 'Qualification': 'MLISc, KSET', 'Experience': '12.3 Yrs', 'DOJ': '2016-03-22', 'Basic': 25000, 'DA': 2813, 'HRA': 10000, 'CCA': 600, 'Others': 31587, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 71250 }
                    ]
                };
            case 'Monthly Biometric Attendance Report':
                return {
                    columns: ['EMPCODE', 'EMPLOYEENAME', ...Array.from({ length: 31 }, (_, i) => `DAY${i + 1}`), 'Present', 'Absent', 'Leave', 'Total'],
                    data: [
                        {
                            'EMPCODE': 'NH-0001', 'EMPLOYEENAME': 'V Manjula',
                            ...Object.fromEntries(Array.from({ length: 31 }, (_, i) => [`DAY${i + 1}`, i % 7 === 0 ? 'WO' : 'P'])),
                            'Present': 22, 'Absent': 0, 'Leave': 4, 'Total': 31
                        },
                        {
                            'EMPCODE': 'NH-0212', 'EMPLOYEENAME': 'Bindu Menon',
                            ...Object.fromEntries(Array.from({ length: 31 }, (_, i) => [`DAY${i + 1}`, i % 7 === 0 ? 'WO' : 'P'])),
                            'Present': 21, 'Absent': 1, 'Leave': 4, 'Total': 31
                        }
                    ]
                };
            case 'Departmental Staff Comprehensive Report':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'Qualification', 'Experience', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross', 'OTHERS', 'UG', 'PG', 'DOCT.', 'Spec.', 'Teach', 'Ind', 'Res', 'NHCE', 'Tot'],
                    data: [
                        {
                            'SlNo': 1, 'StaffCode': 'NH-0010', 'Name': 'ABC', 'Designation': 'Registrar', 'DOB': '1975-10-15', 'Qualification': 'SSLC, PUC, B. Com', 'Experience': '37.05 Yrs', 'DOJ': '2008-05-10', 'Basic': 64900, 'DA': 7301, 'HRA': 25960, 'CCA': 600, 'Others': 60111, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 15000, 'Gross': 175122,
                            'OTHERS': '-', 'UG': 'SSLC, PUC', 'PG': 'B. Com', 'DOCT.': '-', 'Spec.': 'Administration', 'Teach': '37.05', 'Ind': '-', 'Res': '-', 'NHCE': '15.8', 'Tot': '37.05'
                        },
                        {
                            'SlNo': 2, 'StaffCode': 'NH-0011', 'Name': 'DEF', 'Designation': 'Asst. Registrar', 'DOB': '1982-03-24', 'Qualification': 'SSLC, PUC, B.COM', 'Experience': '22.1 Yrs', 'DOJ': '2010-02-18', 'Basic': 20300, 'DA': 2284, 'HRA': 8120, 'CCA': 600, 'Others': 32772, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 65326,
                            'OTHERS': '-', 'UG': 'SSLC, PUC', 'PG': 'B.COM', 'DOCT.': '-', 'Spec.': 'Administration', 'Teach': '22.1', 'Ind': '-', 'Res': '-', 'NHCE': '14.1', 'Tot': '22.1'
                        }
                    ]
                };
            default:
                // Fallback for capacity/other static reports without live endpoints yet
                return {
                    columns: ['ID', 'Name', 'Department', 'Status'],
                    data: [1, 2, 3].map(row => ({
                        ID: `REC-00${row}`, Name: `Sample Record ${row}`, Department: 'Operations', Status: 'Processed'
                    }))
                };
        }
    };

    return (
        <Layout
            title="Reports Central"
            description="Comprehensive analytical reports, templates, and custom builder pipeline."
            icon={PieChart}
            showHome={true}
        >
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-800">128</div>
                                <div className="text-xs font-medium text-slate-500">Reports Generated Today</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Sheet className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black text-slate-800">{mockReports.length}</div>
                                <div className="text-xs font-medium text-slate-500">Total Predefined Templates</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Hub */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Header Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab('standard')}
                            className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === 'standard' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FileText className="w-5 h-5" /> Standard Reports
                            {activeTab === 'standard' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`flex flex-1 items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === 'custom' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Settings className="w-5 h-5" /> Custom Report Builder
                            {activeTab === 'custom' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"></div>}
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'standard' ? (
                            <div className="space-y-6 animate-in fade-in">
                                {/* Filters */}
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <Filter className="w-5 h-5 text-slate-400" />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setFilterModule('All')}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterModule === 'All' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                                            >All Modules</button>
                                            {mockModules.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setFilterModule(m)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${filterModule === m ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                                                >{m}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative w-64">
                                        <input type="text" placeholder="Search standard reports..." className="w-full text-sm bg-white border border-slate-200 rounded-lg py-2 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
                                    </div>
                                </div>

                                {/* Reports Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {mockReports.filter(r => filterModule === 'All' || r.module === filterModule).map(report => (
                                        <div key={report.id} className="p-6 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border-dashed hover:border-solid hover:border-indigo-200 group/report flex flex-col justify-between min-h-[220px]">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-4">
                                                    <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 shadow-inner border border-white/50 bg-white group-hover/report:scale-110 transition-transform ${report.color}`}>
                                                        <report.icon className="w-7 h-7" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] uppercase tracking-widest mb-1">
                                                            {report.module}
                                                        </Badge>
                                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none group-hover/report:text-indigo-600 transition-colors">
                                                            {report.title}
                                                        </h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            Last: {report.lastRun}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover/report:opacity-100 transition-all">
                                                    <button onClick={() => setViewReportModal(report)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-200/50 flex gap-2">
                                                {(report.type === 'PDF' || report.type === 'PDF/Excel') && (
                                                    <button onClick={() => handleDownload('PDF', report.title)} disabled={isGenerating} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
                                                        <Download className="w-3.5 h-3.5" /> PDF
                                                    </button>
                                                )}
                                                {(report.type === 'Excel' || report.type === 'PDF/Excel') && (
                                                    <button onClick={() => handleDownload('Excel', report.title)} disabled={isGenerating} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white hover:bg-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-slate-200 disabled:opacity-50">
                                                        <Download className="w-3.5 h-3.5" /> Excel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4">
                                <div className="max-w-4xl mx-auto space-y-8">

                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-slate-800 mb-2">Build a Custom Report</h3>
                                        <p className="text-slate-500">Select your data sources, configure columns, and apply targeted filters to generate bespoke analytics.</p>
                                    </div>

                                    {/* Step 1: Data Source */}
                                    <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">1</span>
                                            Select Data Source
                                        </h4>
                                        <select
                                            value={selectedModule}
                                            onChange={(e) => setSelectedModule(e.target.value)}
                                            className="w-full md:w-1/2 bg-white border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            {mockModules.map(m => <option key={m} value={m}>{m} Module Data Engine</option>)}
                                        </select>
                                    </div>

                                    {/* Step 2: Columns */}
                                    <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">2</span>
                                            Configure Columns
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {mockColumns.map(col => {
                                                const isSelected = selectedColumns.includes(col);
                                                return (
                                                    <button
                                                        key={col}
                                                        onClick={() => toggleColumn(col)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                                    >
                                                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                                        {col}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Step 3: Filters (Mock) */}
                                    <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">3</span>
                                                Apply Conditional Filters
                                            </h4>
                                            <button onClick={addFilter} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-sm rounded-lg flex items-center gap-2 transition-colors">
                                                <Plus className="w-4 h-4" /> Add Filter Rule
                                            </button>
                                        </div>
                                        {customFilters.length > 0 ? (
                                            <div className="space-y-3">
                                                {customFilters.map((filter, index) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <select value={filter.column} onChange={e => updateFilter(index, 'column', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm flex-1">
                                                            {mockColumns.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                        <select value={filter.operator} onChange={e => updateFilter(index, 'operator', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm w-32">
                                                            <option>Equals</option>
                                                            <option>Contains</option>
                                                            <option>Greater Than</option>
                                                            <option>Less Than</option>
                                                        </select>
                                                        <input type="text" placeholder="Value..." value={filter.value} onChange={e => updateFilter(index, 'value', e.target.value)} className="p-2 border border-slate-200 rounded-lg text-sm flex-1" />
                                                        <button onClick={() => removeFilter(index)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-lg">No filters applied. All records will be included.</p>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-6 border border-emerald-200 bg-emerald-50/50 rounded-xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-emerald-800">Preview Ready</p>
                                            <p className="text-sm text-emerald-600 font-medium">{selectedColumns.length} columns selected from {selectedModule}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleCustomExport}
                                                disabled={isGenerating || selectedColumns.length === 0}
                                                className="px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {isGenerating ? <Activity className="w-5 h-5 animate-spin" /> : <Table className="w-5 h-5" />}
                                                Generate Custom Export
                                            </button>
                                        </div>
                                    </div>

                                    {showGeneratedReport && (
                                        <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm animate-in fade-in slide-in-from-bottom-2">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-slate-800">Generated Report: {selectedModule}</h4>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDownload('PDF', 'Custom Report')} className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors">
                                                        <Download className="w-4 h-4" /> PDF
                                                    </button>
                                                    <button onClick={() => handleDownload('Excel', 'Custom Report')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors">
                                                        <Download className="w-4 h-4" /> Excel
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                                                        <tr>
                                                            {selectedColumns.map(col => (
                                                                <th key={col} className="px-4 py-3 whitespace-nowrap">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {[1, 2, 3, 4, 5].map(row => (
                                                            <tr key={row} className="hover:bg-slate-50 transition-colors">
                                                                {selectedColumns.map(col => (
                                                                    <td key={col} className="px-4 py-3 text-slate-600">Sample {col} {row}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isGenerating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center">
                            <Activity className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                            <h3 className="font-bold text-lg text-slate-800">Compiling Report Data...</h3>
                            <p className="text-sm text-slate-500 mt-2">Connecting to analytics engine and generating secure specific format.</p>
                        </div>
                    </div>
                )}

                {/* View Standard Report Modal */}
                {viewReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
                            <div className="p-8 border-b border-slate-100 flex flex-col gap-6 bg-slate-50/50">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center bg-white shadow-xl shadow-slate-200/50 border border-white ${(viewReportModal as any).color}`}>
                                            <viewReportModal.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] uppercase tracking-[0.2em] mb-1">
                                                {(viewReportModal as any).module}
                                            </Badge>
                                            <h3 className="font-[950] text-3xl text-slate-900 uppercase tracking-tighter">{(viewReportModal as any).title}</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewReportModal(null)} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm transition-all hover:scale-110">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Custom Filters for Talent Acquisition Report */}
                                {(viewReportModal as any).module === 'Talent Acquisition' && (
                                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-slate-500">Date Range</label>
                                            <select
                                                value={taDateFilter}
                                                onChange={(e) => setTaDateFilter(e.target.value)}
                                                className="text-sm border border-slate-200 rounded-lg py-1.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            >
                                                <option value="All Time">All Time</option>
                                                <option value="Last 7 Days">Last 7 Days</option>
                                                <option value="Last 30 Days">Last 30 Days</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-slate-500">Department</label>
                                            <select
                                                value={taDeptFilter}
                                                onChange={(e) => setTaDeptFilter(e.target.value)}
                                                className="text-sm border border-slate-200 rounded-lg py-1.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            >
                                                <option value="All">All Departments</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Design">Design</option>
                                                <option value="Product">Product</option>
                                                <option value="Data Science">Data Science</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-slate-500">Stage</label>
                                            <select
                                                value={taStageFilter}
                                                onChange={(e) => setTaStageFilter(e.target.value)}
                                                className="text-sm border border-slate-200 rounded-lg py-1.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            >
                                                <option value="All">All Stages</option>
                                                <option value="Applied">Applied</option>
                                                <option value="Screening">Screening</option>
                                                <option value="Interview">Interview</option>
                                                <option value="Offered">Offered</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                {(() => {
                                    const repData = getReportData((viewReportModal as any).title);
                                    return (
                                        <div className="overflow-x-auto border-none rounded-3xl bg-slate-50/50 p-1">
                                            <table className="w-full text-sm text-left border-separate border-spacing-y-2">
                                                <thead className="bg-transparent text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                                    <tr>
                                                        {repData.columns.map(col => (
                                                            <th key={col} className="px-6 py-4 whitespace-nowrap">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="">
                                                    {repData.data.map((row, idx) => (
                                                        <tr key={idx} className="bg-white hover:bg-indigo-50/30 transition-all group overflow-hidden first:rounded-t-2xl last:rounded-b-2xl shadow-sm ring-1 ring-slate-100">
                                                            {repData.columns.map((col, cIdx) => (
                                                                <td key={col} className={`px-6 py-5 text-sm font-bold text-slate-600 ${cIdx === 0 ? 'rounded-l-2xl' : ''} ${cIdx === repData.columns.length - 1 ? 'rounded-r-2xl' : ''}`}>
                                                                    {col === 'Status' ? (
                                                                        <Badge className={`px-3 py-1 text-[10px] rounded-full font-black uppercase tracking-widest border-none pointer-events-none ${(row as any)[col] === 'Pending' || (row as any)[col] === 'Onboarding' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                                            {(row as any)[col]}
                                                                        </Badge>
                                                                    ) : col === 'Name' || col === 'Staff Name' || col === 'EmployeeName' ? (
                                                                        <span className="text-slate-900 font-black uppercase tracking-tight">{(row as any)[col]}</span>
                                                                    ) : (
                                                                        (row as any)[col]
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4">
                                <button onClick={() => handleDownload('PDF', (viewReportModal as any).title)} className="px-8 py-4 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-700 font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-2 transition-all shadow-sm"><Download className="w-4 h-4" /> Download PDF</button>
                                <button onClick={() => handleDownload('Excel', (viewReportModal as any).title)} className="px-8 py-4 bg-slate-900 hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-slate-200"><Download className="w-4 h-4" /> Download Excel</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default ReportsDashboard;
