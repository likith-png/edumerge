import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
    PieChart, FileText, Download, BarChart2, Filter,
    Settings, CheckCircle2, Plus, Sheet, Table,
    Activity, UserPlus, LogOut, FileCheck, Eye, X, Briefcase, Calendar, DollarSign, Users
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getAllStaff, getBioData, getMonthlyLeaveData, getYearlyLeaveData } from '../services/staffPortfolioService';

const mockReports = [
    { id: 1, title: 'New Joinee Summary', module: 'Onboarding', type: 'PDF/Excel', lastRun: '2 hours ago', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, title: 'Pending Onboarding Tasks', module: 'Onboarding', type: 'Excel', lastRun: 'Today', icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { id: 3, title: 'Organization Bell Curve', module: 'Appraisal', type: 'PDF', lastRun: '1 week ago', icon: Activity, color: 'text-blue-800', bg: 'bg-blue-50' },
    { id: 4, title: 'Top Performers List', module: 'Appraisal', type: 'Excel', lastRun: 'Last Month', icon: BarChart2, color: 'text-blue-700', bg: 'bg-blue-50/50' },
    { id: 5, title: 'Attrition Rate Analysis', module: 'Exit Management', type: 'PDF/Excel', lastRun: 'Yesterday', icon: LogOut, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 6, title: 'Exit Interview Sentiments', module: 'Exit Management', type: 'PDF', lastRun: '3 days ago', icon: FileCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 7, title: 'Space Utilization Summary', module: 'Capacity Intelligence', type: 'PDF/Excel', lastRun: '12 hours ago', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 8, title: 'Hostel Waitlist Report', module: 'Capacity Intelligence', type: 'Excel', lastRun: 'Today', icon: Table, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
    { id: 9, title: 'Recruitment Funnel & Metrics', module: 'Talent Acquisition', type: 'PDF/Excel', lastRun: '1 hour ago', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 10, title: 'Monthly Availed Leave Report', module: 'Leave Management', type: 'Excel', lastRun: 'Today', icon: Calendar, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 11, title: 'Yearly Leave Book Details', module: 'Leave Management', type: 'Excel', lastRun: '2 days ago', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 12, title: 'Staff Salary Details', module: 'Payroll', type: 'Excel', lastRun: 'Last week', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 13, title: 'Monthly Biometric Attendance Report', module: 'Attendance', type: 'Excel', lastRun: 'Just now', icon: Activity, color: 'text-blue-700', bg: 'bg-blue-100' },
    { id: 14, title: 'Departmental Staff Comprehensive Report', module: 'Staff Portfolio', type: 'Excel', lastRun: 'New', icon: Users, color: 'text-blue-800', bg: 'bg-blue-50' },
    { id: 15, title: 'Staff Details - Administration', module: 'Staff Portfolio', type: 'Excel', lastRun: 'New', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: 16, title: 'Staff Details - ISE', module: 'Staff Portfolio', type: 'Excel', lastRun: 'New', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 17, title: 'Staff Details - MBA', module: 'Staff Portfolio', type: 'Excel', lastRun: 'New', icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 18, title: 'Bio Metric Details - May 2024', module: 'NHC', type: 'Excel', lastRun: 'New', icon: Activity, color: 'text-blue-700', bg: 'bg-blue-50' },
    { id: 19, title: 'Leave Book Details - May 2024', module: 'NHC', type: 'Excel', lastRun: 'New', icon: Calendar, color: 'text-teal-600', bg: 'bg-teal-50' },
    { id: 20, title: 'Yearly Leave Book - 2025', module: 'NHC', type: 'Excel', lastRun: 'New', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 21, title: 'Staff Details by Department', module: 'NHC', type: 'Excel', lastRun: 'New', icon: Users, color: 'text-emerald-700', bg: 'bg-emerald-50' },
];

const mockModules = ['Onboarding', 'Appraisal', 'Exit Management', 'Capacity Intelligence', 'Staff Portfolio', 'Talent Acquisition', 'Leave Management', 'Payroll', 'Attendance', 'NHC'];

const ONBOARDING_DATA = [
    { id: 0, name: 'Mr. Arvind Sharma', role: 'Mathematics Teacher', dept: 'Mathematics', stage: 'Offer Accepted', status: 'Completed', joinDate: '2026-04-01' },
    { id: 1, name: 'Ms. Reshma Binu Prasad', role: 'Assistant Professor', dept: 'Computer Science', stage: 'Documentation', status: 'In Progress', joinDate: '2026-03-15' },
    { id: 2, name: 'Ms. Sanchaiyata Majumdar', role: 'Lab Instructor', dept: 'Physics', stage: 'Orientation', status: 'On Track', joinDate: '2026-03-10' },
    { id: 3, name: 'Dr. R Sedhunivas', role: 'Admin Officer', dept: 'Administration', stage: 'BGV', status: 'SLA Breach', joinDate: '2026-02-28' },
    { id: 4, name: 'Dr. Ranjita Saikia', role: 'Lecturer', dept: 'Mathematics', stage: 'Operational Checklist', status: 'On Track', joinDate: '2026-03-12' },
    { id: 5, name: 'Mr. Manjit Singh', role: 'Research Associate', dept: 'Chemistry', stage: 'Sign-Off', status: 'On Track', joinDate: '2026-03-01' },
];

const MODULE_COLUMNS: Record<string, string[]> = {
    'Staff Portfolio': ['SlNo', 'StaffCode', 'Name', 'Designation', 'Department', 'DOJ', 'Qualification', 'Experience', 'Status'],
    'Payroll': ['SlNo', 'StaffCode', 'Name', 'Designation', 'Department', 'Basic', 'DA', 'HRA', 'CCA', 'Others', 'Gross'],
    'Talent Acquisition': ['App ID', 'Name', 'Role', 'Department', 'Stage', 'Applied Date'],
    'Onboarding': ['CAND-ID', 'Name', 'Role', 'Department', 'Current Stage', 'Status', 'Join Date'],
    'Leave Management': ['Staff Code', 'Staff Name', 'Department', 'Designation', 'D.O.J', 'EL', 'CL', 'SL', 'ML', 'VL', 'OOD', 'LOP'],
    'Attendance': ['EMPCODE', 'EMPLOYEENAME', 'Department', 'Present', 'Absent', 'Leave', 'Total'],
    'NHC': ['SlNo', 'StaffCode', 'Name', 'Designation', 'Department', 'DOB', 'Experience', 'DOJ', 'Basic', 'HRA', 'Gross']
};

// Default columns for any other module
const DEFAULT_COLUMNS = ['ID', 'Name', 'Module', 'Status', 'Created At'];

const TALENT_DATA = [
    { id: 'APP-1001', name: 'Ms. Reshma Binu Prasad', role: 'Senior Developer', department: 'Engineering', stage: 'Offered', appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1002', name: 'Ms. Sanchaiyata Majumdar', role: 'UX Designer', department: 'Design', stage: 'Interview', appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1003', name: 'Dr. R Sedhunivas', role: 'Product Manager', department: 'Product', stage: 'Screening', appliedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1004', name: 'Dr. Ranjita Saikia', role: 'Data Analyst', department: 'Data Science', stage: 'Applied', appliedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1005', name: 'Mr. Manjit Singh', role: 'Frontend Engineer', department: 'Engineering', stage: 'Interview', appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1006', name: 'Mr. Edwin Vimal A', role: 'DevOps Engineer', department: 'Engineering', stage: 'Offered', appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'APP-1007', name: 'Ms. Reshma Binu Prasad', role: 'Account Executive', department: 'Sales', stage: 'Screening', appliedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() }
];

const formatDateValue = (dateStr: any) => {
    if (!dateStr || dateStr === '-') return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const ReportsDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
    const [filterModule, setFilterModule] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');
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
    const [selectedModule, setSelectedModule] = useState('Staff Portfolio');
    const [selectedColumns, setSelectedColumns] = useState<string[]>(MODULE_COLUMNS['Staff Portfolio'].slice(0, 5));
    const [customFilters, setCustomFilters] = useState<{ column: string, operator: string, value: string }[]>([]);
    const [showGeneratedReport, setShowGeneratedReport] = useState(false);
    const [customReportPreviewData, setCustomReportPreviewData] = useState<any[]>([]);
    const [viewReportModal, setViewReportModal] = useState<any | null>(null);

    const availableColumns = MODULE_COLUMNS[selectedModule] || DEFAULT_COLUMNS;

    // Reset columns when module changes
    React.useEffect(() => {
        setSelectedColumns(availableColumns.slice(0, 5));
        setCustomFilters([]);
        setShowGeneratedReport(false);
    }, [selectedModule]);

    const addFilter = () => {
        setCustomFilters([...customFilters, { column: availableColumns[0], operator: 'Equals', value: '' }]);
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
            const data = getModuleDataForCustom(selectedModule);
            setCustomReportPreviewData(data);
            setIsGenerating(false);
            setShowGeneratedReport(true);
        }, 1200);
    };

    const getModuleDataForCustom = (module: string) => {
        let rawData: any[] = [];
        if (module === 'Staff Portfolio' || module === 'NHC' || module === 'Payroll') {
            rawData = getAllStaff().map((s, idx) => {
                const sal = s.reportDetails?.salary || { basic: 0, da: 0, hra: 0, cca: 0, others: 0, gross: 0 };
                return {
                    SlNo: idx + 1,
                    StaffCode: s.id,
                    Name: s.name,
                    Designation: s.designation,
                    Department: s.department,
                    DOJ: formatDateValue(s.joiningDate),
                    DOB: formatDateValue(s.reportDetails?.dob),
                    Qualification: s.qualification,
                    Experience: s.reportDetails?.experience.tot || '-',
                    Status: s.status,
                    Basic: sal.basic,
                    DA: sal.da,
                    HRA: sal.hra,
                    CCA: sal.cca,
                    Others: sal.others,
                    Gross: sal.gross
                };
            });
        } else if (module === 'Talent Acquisition') {
            rawData = TALENT_DATA.map((t, idx) => ({
                'App ID': t.id,
                'SlNo': idx + 1,
                Name: t.name,
                Role: t.role,
                Department: t.department,
                Stage: t.stage,
                'Applied Date': formatDateValue(t.appliedDate)
            }));
        } else if (module === 'Onboarding') {
            rawData = ONBOARDING_DATA.map(o => ({
                'CAND-ID': `CAND-${o.id}`,
                Name: o.name,
                Role: o.role,
                Department: o.dept,
                'Current Stage': o.stage,
                Status: o.status,
                'Join Date': formatDateValue(o.joinDate)
            }));
        } else {
            // Fallback for others
            rawData = [1, 2, 3, 4, 5].map(i => ({
                ID: `REC-${i}`,
                Name: `Record ${i}`,
                Module: module,
                Status: 'Active',
                'Created At': formatDateValue(new Date())
            }));
        }
        return rawData;
    };

    const handleDownload = (format: string, reportTitle: string) => {
        setIsGenerating(true);
        setTimeout(() => {
            try {
                let exportData: { columns: string[], data: any[] } = { columns: [], data: [] };
                if (reportTitle === 'Custom Report') {
                    exportData.columns = selectedColumns;
                    exportData.data = customReportPreviewData;
                } else {
                    exportData = getReportData(reportTitle);
                }

                if (format === 'PDF') {
                    const isLandscape = exportData.columns.length > 7;
                    const doc = new jsPDF({ orientation: isLandscape ? 'landscape' : 'portrait', unit: 'mm', format: 'a4' });
                    
                    doc.setFontSize(18);
                    doc.text(reportTitle, 14, 15);
                    
                    const tableBody = exportData.data.map(row => exportData.columns.map(col => String(row[col] ?? '-')));
                    
                    autoTable(doc, {
                        startY: 20,
                        head: [exportData.columns],
                        body: tableBody,
                        styles: { fontSize: 8, cellPadding: 2 },
                        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
                        alternateRowStyles: { fillColor: [248, 250, 252] },
                        margin: { top: 20 },
                        theme: 'grid'
                    });
                    
                    doc.save(`${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`);
                } else if (format === 'Excel') {
                    const worksheet = XLSX.utils.json_to_sheet(exportData.data, { header: exportData.columns });
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");
                    XLSX.writeFile(workbook, `${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`);
                }
            } catch (err) {
                console.error("Export failed", err);
                alert("An error occurred while generating the report. Please try again.");
            } finally {
                setIsGenerating(false);
            }
        }, 800);
    };

    const toggleColumn = (col: string) => {
        setSelectedColumns(prev =>
            prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
        );
    };

    const getFilteredTalentData = () => {
        return TALENT_DATA.filter((app: any) => {
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
        }).map((app: any) => ({
            'App ID': app.id,
            Name: app.name,
            Role: app.role,
            Department: app.department,
            Stage: app.stage,
            'Applied Date': formatDateValue(app.appliedDate)
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
                        'Join Date': formatDateValue(c.joinDate),
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
                        { 'Staff Code': 'NH-0001', 'Staff Name': 'V Manjula', 'Department': 'Human Resources', 'Designation': 'Executive Director', 'D.O.J': formatDateValue('2010-06-01'), 'EL': 3, 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' },
                        { 'Staff Code': 'NH-0212', 'Staff Name': 'Bindu Menon', 'Department': 'Human Resources', 'Designation': 'Sr. HR Generalist', 'D.O.J': formatDateValue('2015-08-15'), 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': '-', 'OOD': '-', 'OED': '-', 'CO': '-', 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' },
                        { 'Staff Code': 'NH-0796', 'Staff Name': 'Maroju Hima Bindu', 'Department': 'Human Resources', 'Designation': 'Sr. HR Executive', 'D.O.J': formatDateValue('2017-10-22'), 'EL': '-', 'CL': '-', 'SL': '-', 'ML': '-', 'VL': 7, 'OOD': '-', 'OED': '-', 'CO': 2, 'LOP': '-', 'LOPNR': '-', 'HR Comments': '-' }
                    ]
                };
            case 'Yearly Leave Book Details':
                return {
                    columns: ['EmployeeCode', 'EmployeeName', 'Department', 'Designation', 'DOJ', 'TotalEL', 'TakenEL', 'BalanceEL', 'TotalCL', 'TakenCL', 'BalanceCL', 'TotalSL', 'TakenSL', 'BalanceSL', 'TotalML', 'TakenML', 'BalanceML', 'TotalVL', 'TakenVL', 'BalanceVL', 'TotalOOD', 'TakenOOD', 'BalanceOOD', 'TotalOED', 'TakenOED', 'BalanceOED', 'TotalCO', 'TakenCO', 'BalanceCO', 'TotalLOP', 'TakenLOP', 'BalanceLOP', 'TotalLOPNR', 'TakenLOPNR', 'BalanceLOPNR'],
                    data: [
                        { 'EmployeeCode': 'NH-0001', 'EmployeeName': 'V Manjula', 'Department': 'Human Resources', 'Designation': 'Executive Director', 'DOJ': formatDateValue('2010-06-01'), 'TotalEL': 21, 'TakenEL': 16, 'BalanceEL': 5, 'TotalCL': 12, 'TakenCL': 7.5, 'BalanceCL': 4.5, 'TotalSL': '-', 'TakenSL': '-', 'BalanceSL': '-', 'TotalML': '-', 'TakenML': '-', 'BalanceML': '-', 'TotalVL': '-', 'TakenVL': '-', 'BalanceVL': '-', 'TotalOOD': 7, 'TakenOOD': 0, 'BalanceOOD': 7, 'TotalOED': '-', 'TakenOED': '-', 'BalanceOED': '-', 'TotalCO': '-', 'TakenCO': '-', 'BalanceCO': '-', 'TotalLOP': 5, 'TakenLOP': 0, 'BalanceLOP': 5, 'TotalLOPNR': '-', 'TakenLOPNR': '-', 'BalanceLOPNR': '-' },
                        { 'EmployeeCode': 'NH-0003', 'EmployeeName': 'Surya Prakash H N', 'Department': 'Administration', 'Designation': 'Registrar', 'DOJ': formatDateValue('2008-05-10'), 'TotalEL': 21, 'TakenEL': 14, 'BalanceEL': 7, 'TotalCL': 12, 'TakenCL': 10.5, 'BalanceCL': 1.5, 'TotalSL': '-', 'TakenSL': '-', 'BalanceSL': '-', 'TotalML': '-', 'TakenML': '-', 'BalanceML': '-', 'TotalVL': '-', 'TakenVL': '-', 'BalanceVL': '-', 'TotalOOD': 7, 'TakenOOD': 4, 'BalanceOOD': 3, 'TotalOED': '-', 'TakenOED': '-', 'BalanceOED': '-', 'TotalCO': '-', 'TakenCO': '-', 'BalanceCO': '-', 'TotalLOP': 5, 'TakenLOP': 0, 'BalanceLOP': 5, 'TotalLOPNR': '-', 'TakenLOPNR': '-', 'BalanceLOPNR': '-' }
                    ]
                };
            case 'Staff Salary Details':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'Qualification', 'Experience', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'],
                    data: [
                        { 'SlNo': 1, 'StaffCode': 'NH-0010', 'Name': 'ABC', 'Designation': 'Registrar', 'DOB': formatDateValue('1975-10-15'), 'Qualification': 'SSLC, PUC, B. Com', 'Experience': '37.05 Yrs', 'DOJ': formatDateValue('2008-05-10'), 'Basic': 64900, 'DA': 7301, 'HRA': 25960, 'CCA': 600, 'Others': 60111, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 15000, 'Gross': 175122 },
                        { 'SlNo': 2, 'StaffCode': 'NH-0011', 'Name': 'DEF', 'Designation': 'Asst. Registrar', 'DOB': formatDateValue('1982-03-24'), 'Qualification': 'SSLC, PUC, B.COM', 'Experience': '22.1 Yrs', 'DOJ': formatDateValue('2010-02-18'), 'Basic': 20300, 'DA': 2284, 'HRA': 8120, 'CCA': 600, 'Others': 32772, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 65326 },
                        { 'SlNo': 3, 'StaffCode': 'NH-0012', 'Name': 'XYZ', 'Designation': 'Sr. Office Executive', 'DOB': formatDateValue('1985-06-12'), 'Qualification': 'SSLC, DIPLOMA', 'Experience': '15.5 Yrs', 'DOJ': formatDateValue('2012-04-05'), 'Basic': 18500, 'DA': 2081, 'HRA': 7400, 'CCA': 600, 'Others': 28419, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 58250 },
                        { 'SlNo': 4, 'StaffCode': 'NH-0013', 'Name': 'ahdhjka', 'Designation': 'jr. Divisional Asst.', 'DOB': formatDateValue('1990-11-20'), 'Qualification': 'ARTS', 'Experience': '8.2 Yrs', 'DOJ': formatDateValue('2015-09-15'), 'Basic': 15200, 'DA': 1710, 'HRA': 6080, 'CCA': 600, 'Others': 22510, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 47350 },
                        { 'SlNo': 5, 'StaffCode': 'NH-0014', 'Name': 'lksdlkjlkjs', 'Designation': 'Office Executive', 'DOB': formatDateValue('1992-02-28'), 'Qualification': 'COMMERCE', 'Experience': '6.1 Yrs', 'DOJ': formatDateValue('2018-01-10'), 'Basic': 14000, 'DA': 1575, 'HRA': 5600, 'CCA': 600, 'Others': 20225, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 43250 },
                        { 'SlNo': 6, 'StaffCode': 'NH-0015', 'Name': 'ahdhjka', 'Designation': 'Sr. Assistant Professor', 'DOB': formatDateValue('1988-05-15'), 'Qualification': 'M Tech, (PhD)', 'Experience': '10.5 Yrs', 'DOJ': formatDateValue('2014-07-20'), 'Basic': 35400, 'DA': 3983, 'HRA': 14160, 'CCA': 600, 'Others': 45107, 'Conv.All': 1250, 'AGP(Ind)': 8000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 110300 },
                        { 'SlNo': 7, 'StaffCode': 'NH-0016', 'Name': 'ahdhjka', 'Designation': 'Associate Professor', 'DOB': formatDateValue('1980-08-22'), 'Qualification': 'Ph.D', 'Experience': '18.2 Yrs', 'DOJ': formatDateValue('2012-01-15'), 'Basic': 45000, 'DA': 5063, 'HRA': 18000, 'CCA': 600, 'Others': 58287, 'Conv.All': 1250, 'AGP(Ind) ': 9000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 139000 },
                        { 'SlNo': 8, 'StaffCode': 'NH-0017', 'Name': 'ahdhjka', 'Designation': 'Professor & HOD', 'DOB': formatDateValue('1972-01-05'), 'Qualification': 'Ph.D', 'Experience': '25.4 Yrs', 'DOJ': formatDateValue('2008-05-10'), 'Basic': 65000, 'DA': 7313, 'HRA': 26000, 'CCA': 600, 'Others': 82587, 'Conv.All': 1250, 'AGP(Ind)': 10000, 'PF Amnt': 0, 'Variable Pay': 25000, 'Gross': 217750 },
                        { 'SlNo': 9, 'StaffCode': 'NH-0018', 'Name': 'ahdhjka', 'Designation': 'Sr. Assistant Professor & HOD', 'DOB': formatDateValue('1984-04-18'), 'Qualification': 'MBA, MPhil', 'Experience': '14.1 Yrs', 'DOJ': formatDateValue('2013-06-01'), 'Basic': 32400, 'DA': 3645, 'HRA': 12960, 'CCA': 600, 'Others': 41045, 'Conv.All': 1250, 'AGP(Ind)': 8000, 'PF Amnt': 1800, 'Variable Pay': 0, 'Gross': 101700 },
                        { 'SlNo': 10, 'StaffCode': 'NH-0019', 'Name': 'ahdhjka', 'Designation': 'Librarian', 'DOB': formatDateValue('1986-12-30'), 'Qualification': 'MLISc, KSET', 'Experience': '12.3 Yrs', 'DOJ': formatDateValue('2016-03-22'), 'Basic': 25000, 'DA': 2813, 'HRA': 10000, 'CCA': 600, 'Others': 31587, 'Conv.All': 1250, 'AGP(Ind)': 0, 'PF Amnt': 0, 'Variable Pay': 0, 'Gross': 71250 }
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
            case 'Staff Details - Administration':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'OTHERS', 'UG', 'PG', 'DOCT.', 'Spec.', 'Teach', 'Ind', 'Res', 'Others', 'NHCE', 'Tot', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others_Pay', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'],
                    data: [
                        { SlNo: "1", StaffCode: "NH-0010", Name: "ABC", Designation: "Registrar", DOB: "1975-11-23", OTHERS: "SSLC, PUC", UG: "B. Com", PG: "MBA", "DOCT.": "-", "Spec.": "-", Teach: "-", Ind: "-", Res: "-", Others: "18.09", NHCE: "18.08", Tot: "37.05", DOJ: "2006-03-29", Basic: "64900", DA: "7301", HRA: "25960", CCA: "600", Others_Pay: "60111", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "15000", Gross: "175122" },
                        { SlNo: "2", StaffCode: "NH-0011", Name: "DEF", Designation: "Asst. Registrar", DOB: "1971-12-07", OTHERS: "SSLC, PUC", UG: "B.COM", PG: "-", "DOCT.": "-", "Spec.": "COMMERCE", Teach: "-", Ind: "-", Res: "-", Others: "5.07", NHCE: "17.03", Tot: "22.1", DOJ: "2007-08-02", Basic: "20300", DA: "2284", HRA: "8120", CCA: "600", Others_Pay: "32772", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "65326" },
                        { SlNo: "3", StaffCode: "NH-0012", Name: "XYZ", Designation: "Sr. Office Executive", DOB: "1989-06-20", OTHERS: "SSLC, DIPLOMA", UG: "B.COM", PG: "-", "DOCT.": "-", "Spec.": "ACCOUNTANCY", Teach: "-", Ind: "2.05", Res: "-", Others: "-", NHCE: "10.1", Tot: "13.03", DOJ: "2014-01-29", Basic: "15300", DA: "1721", HRA: "6120", CCA: "600", Others_Pay: "22089", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "47080" },
                        { SlNo: "4", StaffCode: "NH-0013", Name: "ahdhjka", Designation: "jr. Divisional Asst.", DOB: "1976-06-21", OTHERS: "SSLC", UG: "BA", PG: "-", "DOCT.": "-", "Spec.": "ARTS", Teach: "-", Ind: "-", Res: "-", Others: "-", NHCE: "15.05", Tot: "15.05", DOJ: "2009-06-27", Basic: "13500", DA: "1519", HRA: "5400", CCA: "600", Others_Pay: "16746", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "39015" },
                        { SlNo: "9", StaffCode: "NH-0014", Name: "lksdlkjlkjs", Designation: "Principal", DOB: "1977-05-01", OTHERS: "SSLC, PUC", UG: "BE", PG: "M. Tech", "DOCT.": "Ph. D", "Spec.": "Manufacturing Engineering", Teach: "-", Ind: "10.02", Res: "-", Others: "-", NHCE: "21.03", Tot: "31.05", DOJ: "2003-08-25", Basic: "95724", DA: "17230", HRA: "28717", CCA: "600", Others_Pay: "163928", "Conv.All": "0", "AGP(Ind)": "10000", "PF Amnt": "1800", "Variable Pay": "0", Gross: "318000" }
                    ]
                };
            case 'Staff Details - ISE':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'OTHERS', 'UG', 'PG', 'DOCT.', 'Spec.', 'Teach', 'Ind', 'Res', 'Others', 'NHCE', 'Tot', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others_Pay', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'],
                    data: [
                        { SlNo: "8", StaffCode: "NH-0015", Name: "jlksdlj", Designation: "Professor & HOD", DOB: "1965-12-13", OTHERS: "10th, puc", UG: "B.E", PG: "ME", "DOCT.": "Ph. D", "Spec.": "Computer Science", Teach: "22.03", Ind: "4", Res: "-", Others: "-", NHCE: "6.09", Tot: "33", DOJ: "2018-02-05", Basic: "69153", DA: "12448", HRA: "20746", CCA: "600", Others_Pay: "99454", "Conv.All": "0", "AGP(Ind)": "10000", "PF Amnt": "1800", "Variable Pay": "0", Gross: "214200" },
                        { SlNo: "1", StaffCode: "NH-0016", Name: "HLJHFJKH", Designation: "Sr. Assistant Professor", DOB: "1980-04-15", OTHERS: "10th, 12th", UG: "B E", PG: "M Tech", "DOCT.": "-", "Spec.": "CSE", Teach: "4.09", Ind: "1.07", Res: "-", Others: "-", NHCE: "13.04", Tot: "19.08", DOJ: "2011-07-25", Basic: "34660", DA: "6239", HRA: "10398", CCA: "600", Others_Pay: "38307", "Conv.All": "0", "AGP(Ind)": "7000", "PF Amnt": "1800", "Variable Pay": "0", Gross: "99004" },
                        { SlNo: "2", StaffCode: "NH-0017", Name: "JLKFDJLJ", Designation: "Associate Professor", DOB: "1976-07-30", OTHERS: "SSLC, HSC", UG: "B.E", PG: "M Tech", "DOCT.": "Ph.D", "Spec.": "CSE", Teach: "10.04", Ind: "-", Res: "-", Others: "-", NHCE: "10.04", Tot: "20.08", DOJ: "2014-07-21", Basic: "35669", DA: "6420", HRA: "10701", CCA: "600", Others_Pay: "32615", "Conv.All": "0", "AGP(Ind)": "9000", "PF Amnt": "1800", "Variable Pay": "0", Gross: "96805" },
                        { SlNo: "3", StaffCode: "NH-0018", Name: "JLFJLJ", Designation: "Sr. Assistant Professor", DOB: "1979-06-01", OTHERS: "SSLC, Pre Degree", UG: "BTech", PG: "M TECH", "DOCT.": "(PhD)", "Spec.": "CSE", Teach: "2.09", Ind: "-", Res: "-", Others: "-", NHCE: "11.04", Tot: "14.01", DOJ: "2013-07-24", Basic: "29898", DA: "5382", HRA: "8969", CCA: "600", Others_Pay: "30321", "Conv.All": "0", "AGP(Ind)": "7000", "PF Amnt": "1800", "Variable Pay": "0", Gross: "83970" },
                        { SlNo: "4", StaffCode: "NH-0019", Name: "JLKJLDFJ", Designation: "Lab Instructor", DOB: "1980-07-30", OTHERS: "SSLC, Diploma", UG: "-", PG: "-", "DOCT.": "-", "Spec.": "-", Teach: "-", Ind: "-", Res: "-", Others: "11.1", NHCE: "3.08", Tot: "15.06", DOJ: "2021-03-08", Basic: "13500", DA: "1519", HRA: "5400", CCA: "600", Others_Pay: "8631", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "30900" }
                    ]
                };
            case 'Staff Details - MBA':
                return {
                    columns: ['SlNo', 'StaffCode', 'Name', 'Designation', 'DOB', 'OTHERS', 'UG', 'PG', 'DOCT.', 'Spec.', 'Teach', 'Ind', 'Res', 'Others', 'NHCE', 'Tot', 'DOJ', 'Basic', 'DA', 'HRA', 'CCA', 'Others_Pay', 'Conv.All', 'AGP(Ind)', 'PF Amnt', 'Variable Pay', 'Gross'],
                    data: [
                        { SlNo: "1", StaffCode: "NH-0381", Name: "JLSDJLJ", Designation: "Office Executive", DOB: "1968-11-22", OTHERS: "SSLC", UG: "-", PG: "-", "DOCT.": "-", "Spec.": "-", Teach: "-", Ind: "-", Res: "-", Others: "8.04", NHCE: "10.1", Tot: "19.02", DOJ: "2014-01-01", Basic: "13500", DA: "1519", HRA: "5400", CCA: "600", Others_Pay: "16674", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "38943" },
                        { SlNo: "2", StaffCode: "NH-0382", Name: "UOUEOOI", Designation: "Sr. Asst. Prof. & HOD", DOB: "1983-03-10", OTHERS: "SSLC, PUC", UG: "BBM", PG: "MBA, MPhil", "DOCT.": "-", "Spec.": "Marketing, Management", Teach: "-", Ind: "1.1", Res: "-", Others: "-", NHCE: "11.05", Tot: "13.03", DOJ: "2013-06-10", Basic: "20688", DA: "16550", HRA: "6206", CCA: "600", Others_Pay: "20651", "Conv.All": "0", "AGP(Ind)": "0", "PF Amnt": "1800", "Variable Pay": "0", Gross: "66496" },
                        { SlNo: "10", StaffCode: "NH-0384", Name: "EEOIUOIEU", Designation: "Librarian", DOB: "1986-05-28", OTHERS: "SSLC, PUC", UG: "BA", PG: "MLISc, KSET", "DOCT.": "-", "Spec.": "web Designing ...", Teach: "-", Ind: "-", Res: "-", Others: "4.02", NHCE: "11.03", Tot: "15.05", DOJ: "2013-08-08", Basic: "16200", DA: "1823", HRA: "6480", CCA: "600", Others_Pay: "17328", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "43681" },
                        { SlNo: "21", StaffCode: "NH-0385", Name: "IEUOUOE", Designation: "Physical Education Inst.", DOB: "1983-04-12", OTHERS: "SSLC, PUC", UG: "B A, B.PEd", PG: "M P Ed, KSET", "DOCT.": "(Ph.D)", "Spec.": "physical Education ...", Teach: "11", Ind: "-", Res: "-", Others: "-", NHCE: "5.04", Tot: "16.04", DOJ: "2019-07-08", Basic: "15600", DA: "1755", HRA: "6240", CCA: "600", Others_Pay: "16666", "Conv.All": "1250", "AGP(Ind)": "0", "PF Amnt": "0", "Variable Pay": "0", Gross: "42111" }
                    ]
                };
            case 'Bio Metric Details - May 2024': {
                const days = Array.from({ length: 31 }, (_, i) => `D${i + 1}`);
                const dayOfWeek = ['Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon','Tue','Wed','Thu','Fri'];
                const bioData = getBioData();
                const bioRows: any[] = [];
                bioData.forEach(emp => {
                    const nameRow: any = { EMPCODE: emp.EMPCODE, EMPLOYEENAME: emp.EMPLOYEENAME };
                    days.forEach(d => { nameRow[d] = ''; });
                    const inRow: any = { EMPCODE: '', EMPLOYEENAME: 'IN' };
                    const outRow: any = { EMPCODE: '', EMPLOYEENAME: 'OUT' };
                    const hrsRow: any = { EMPCODE: '', EMPLOYEENAME: 'Hrs' };
                    const statusRow: any = { EMPCODE: '', EMPLOYEENAME: 'Status' };
                    days.forEach((d, i) => {
                        inRow[d] = emp.in_times[i] || '';
                        outRow[d] = emp.out_times[i] || '';
                        hrsRow[d] = emp.hours[i] || '';
                        statusRow[d] = emp.status[i] || '';
                    });
                    bioRows.push(nameRow, inRow, outRow, hrsRow, statusRow);
                });
                // Header info row (matching Excel title row)
                const bioHeaderRow: any = { EMPCODE: 'NEW HORIZON COLLEGE OF ENGINEERING', EMPLOYEENAME: 'Monthly Biometric Attendance Report — May 2024' };
                days.forEach(d => { bioHeaderRow[d] = ''; });
                const dayHeaderRow: any = { EMPCODE: 'EMPCODE', EMPLOYEENAME: 'EMPLOYEE NAME' };
                dayOfWeek.forEach((dw, i) => { dayHeaderRow[days[i]] = dw; });
                return {
                    columns: ['EMPCODE', 'EMPLOYEENAME', ...days],
                    data: [bioHeaderRow, dayHeaderRow, ...bioRows]
                };
            }
            case 'Leave Book Details - May 2024': {
                const leaveBookCols = ['Staff Code', 'Staff Name', 'Department', 'Designation', 'D.O.J', 'EL', 'CL', 'SL', 'ML', 'VL', 'OOD', 'OED', 'CO', 'LOP', 'LOPNR', 'HR Comments'];
                const leaveBookHeader: any = { 'Staff Code': 'NEW HORIZON COLLEGE OF ENGINEERING', 'Staff Name': 'Monthly Availed Leave Report', 'Department': 'For The Month: May-2024', 'Designation': '', 'D.O.J': '', 'EL': '', 'CL': '', 'SL': '', 'ML': '', 'VL': '', 'OOD': '', 'OED': '', 'CO': '', 'LOP': '', 'LOPNR': '', 'HR Comments': '' };
                const leaveData = getMonthlyLeaveData();
                return {
                    columns: leaveBookCols,
                    data: [
                        leaveBookHeader,
                        ...leaveData
                    ]
                };
            }
            case 'Yearly Leave Book - 2025': {
                const ylbHeader: any = { EmployeeCode: 'NEW HORIZON COLLEGE OF ENGINEERING', EmployeeName: 'REPORT NAME:- LEAVE BOOK DETAILS — 2025', Department: '', Designation: '', DOJ: '', TotalEL: '', TakenEL: '', BalanceEL: '', TotalCL: '', TakenCL: '', BalanceCL: '', TotalSL: '', TakenSL: '', BalanceSL: '', TotalML: '', TakenML: '', BalanceML: '', TotalVL: '', TakenVL: '', BalanceVL: '', TotalOOD: '', TakenOOD: '', BalanceOOD: '', TotalOED: '', TakenOED: '', BalanceOED: '', TotalCO: '', TakenCO: '', BalanceCO: '', TotalLOP: '', TakenLOP: '', BalanceLOP: '', TotalLOPNR: '', TakenLOPNR: '', BalanceLOPNR: '' };
                const yearlyData = getYearlyLeaveData();
                return {
                    columns: ['EmployeeCode','EmployeeName','Department','Designation','DOJ','TotalEL','TakenEL','BalanceEL','TotalCL','TakenCL','BalanceCL','TotalSL','TakenSL','BalanceSL','TotalML','TakenML','BalanceML','TotalVL','TakenVL','BalanceVL','TotalOOD','TakenOOD','BalanceOOD','TotalOED','TakenOED','BalanceOED','TotalCO','TakenCO','BalanceCO','TotalLOP','TakenLOP','BalanceLOP','TotalLOPNR','TakenLOPNR','BalanceLOPNR'],
                    data: [
                        ylbHeader,
                        ...yearlyData
                    ]
                };
            }
            case 'Staff Details by Department': {
                // Mirrors "New Microsoft Excel Worksheet (3) (1).xlsx" — dept-grouped staff salary register
                const sdCols = ['SlNo','StaffCode','Name','Designation','Department','DOB','OTHERS','UG','PG','DOCT.','Spec.','Teach','Ind','Res','Exp.Others','NHCE','Tot','DOJ','Basic','DA','HRA','CCA','Others','Conv.All','AGP(Ind)','PF Amnt','Variable Pay','Gross'];
                const sdHeader: any = { SlNo:'NEW HORIZON COLLEGE OF ENGINEERING', StaffCode:'Staff Details by Department', Name:'', Designation:'', Department:'', DOB:'', OTHERS:'', UG:'', PG:'', 'DOCT.':'', 'Spec.':'', Teach:'', Ind:'', Res:'', 'Exp.Others':'', NHCE:'', Tot:'', DOJ:'', Basic:'', DA:'', HRA:'', CCA:'', Others:'', 'Conv.All':'', 'AGP(Ind)':'', 'PF Amnt':'', 'Variable Pay':'', Gross:'' };
                
                const allStaff = getAllStaff();
                const departments = Array.from(new Set(allStaff.map(s => s.department)));
                
                const dynamicData: any[] = [sdHeader];
                let slNoCounter = 1;
                
                departments.forEach(dept => {
                    dynamicData.push({ SlNo:`— ${dept} —`, StaffCode:'', Name:'', Designation:'', Department:'', DOB:'', OTHERS:'', UG:'', PG:'', 'DOCT.':'', 'Spec.':'', Teach:'', Ind:'', Res:'', 'Exp.Others':'', NHCE:'', Tot:'', DOJ:'', Basic:'', DA:'', HRA:'', CCA:'', Others:'', 'Conv.All':'', 'AGP(Ind)':'', 'PF Amnt':'', 'Variable Pay':'', Gross:'' });
                    
                    const deptStaff = allStaff.filter(s => s.department === dept);
                    deptStaff.forEach(s => {
                        const edu = s.reportDetails?.education || { others: '-', ug: '-', pg: '-', doct: '-', spec: '-' };
                        const exp = s.reportDetails?.experience || { teach: '-', ind: '-', res: '-', expOthers: '-', nhce: '-', tot: '-' };
                        const sal = s.reportDetails?.salary || { basic: 0, da: 0, hra: 0, cca: 0, others: 0, convAll: 0, agp: 0, pfAmnt: 0, variablePay: 0, gross: 0 };
                        
                        dynamicData.push({
                            SlNo: slNoCounter++,
                            StaffCode: s.id,
                            Name: s.name,
                            Designation: s.designation,
                            Department: s.department,
                            DOB: formatDateValue(s.reportDetails?.dob),
                            OTHERS: edu.others,
                            UG: edu.ug,
                            PG: edu.pg,
                            'DOCT.': edu.doct,
                            'Spec.': edu.spec,
                            Teach: exp.teach,
                            Ind: exp.ind,
                            Res: exp.res,
                            'Exp.Others': exp.expOthers,
                            NHCE: exp.nhce,
                            Tot: exp.tot,
                            DOJ: formatDateValue(s.joiningDate),
                            Basic: sal.basic,
                            DA: sal.da,
                            HRA: sal.hra,
                            CCA: sal.cca,
                            Others: sal.others,
                            'Conv.All': sal.convAll,
                            'AGP(Ind)': sal.agp,
                            'PF Amnt': sal.pfAmnt,
                            'Variable Pay': sal.variablePay,
                            Gross: sal.gross
                        });
                    });
                });

                return {
                    columns: sdCols,
                    data: dynamicData
                };
            }
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
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-16">

                {/* Professional Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 tracking-tight">128</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Daily Reports</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                            <Sheet className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 tracking-tight">{mockReports.length}</div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Neural Blueprints</div>
                        </div>
                    </div>
                </div>

                {/* Main Orchestration Hub */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm min-h-[800px] flex flex-col">
                    {/* Header Tabs */}
                    <div className="flex border-b border-slate-200 bg-slate-50/50 p-1.5 gap-1.5">
                        <button
                            onClick={() => setActiveTab('standard')}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-lg border ${activeTab === 'standard' ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
                        >
                            <FileText className="w-4 h-4" /> Standard Repository
                        </button>
                        <button
                            onClick={() => setActiveTab('custom')}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-lg border ${activeTab === 'custom' ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
                        >
                            <Settings className="w-4 h-4" /> Architect Studio
                        </button>
                    </div>

                    <div className="px-4 py-4 bg-slate-50/50">
                        {activeTab === 'standard' ? (
                            <div className="space-y-6 animate-in fade-in">
                                {/* Mobile Search */}
                                <div className="md:hidden">
                                    <input 
                                        type="text" 
                                        placeholder="Search reports..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full text-sm rounded-2xl py-3 px-5 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-700/20 outline-none text-slate-800 placeholder:text-slate-400 shadow-sm transition-all" 
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex justify-between items-center bg-white border border-slate-200 p-2 rounded-lg shadow-sm gap-4">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div className="flex gap-2 overflow-x-auto min-w-0 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
                                            <button
                                                onClick={() => setFilterModule('All')}
                                                className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${filterModule === 'All' ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                                            >All</button>
                                            {mockModules.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setFilterModule(m)}
                                                    className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${filterModule === m ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                                                >{m}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative w-64 flex-shrink-0 hidden md:block">
                                        <input 
                                            type="text" 
                                            placeholder="Search standard reports..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full text-sm rounded-lg py-2 pl-4 pr-4 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-800 placeholder:text-slate-400 transition-all" 
                                        />
                                    </div>
                                </div>

                                {/* Reports Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gapx-4 py-4">
                                {mockReports
                                    .filter(r => (filterModule === 'All' || r.module === filterModule) && 
                                                 (r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                  r.module.toLowerCase().includes(searchQuery.toLowerCase())))
                                    .map(report => (
                                        <div key={report.id} className="bg-white shadow-sm border border-slate-200 p-6 rounded-xl group/report flex flex-col justify-between min-h-[220px] relative overflow-hidden transition-all hover:shadow-md">
                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="flex flex-col gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.bg} ${report.color} shadow-sm border border-slate-100`}>
                                                        <report.icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider px-2 py-0 border-slate-200 text-slate-500">
                                                            {report.module}
                                                        </Badge>
                                                        <h4 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover/report:text-slate-700 transition-colors">
                                                            {report.title}
                                                        </h4>
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                                            <Calendar className="w-3 h-3" /> Last Run: {report.lastRun}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover/report:opacity-100 transition-all duration-300 relative z-10">
                                                    <button onClick={() => setViewReportModal(report)} className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white transition-all">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2 relative z-10">
                                                {(report.type === 'PDF' || report.type === 'PDF/Excel') && (
                                                    <button onClick={() => handleDownload('PDF', report.title)} disabled={isGenerating} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50">
                                                        <Download className="w-3.5 h-3.5" /> PDF
                                                    </button>
                                                )}
                                                {(report.type === 'Excel' || report.type === 'PDF/Excel') && (
                                                    <button onClick={() => handleDownload('Excel', report.title)} disabled={isGenerating} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50">
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
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Build a Custom Report</h3>
                                        <p className="text-slate-500 text-sm font-medium">Select your data sources, configure columns, and apply targeted filters.</p>
                                    </div>

                                    {/* Step 1: Data Source */}
                                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm shadow-sm">1</span>
                                            Select Data Source
                                        </h4>
                                        <select
                                            value={selectedModule}
                                            onChange={(e) => setSelectedModule(e.target.value)}
                                            className="w-full md:w-1/2 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-slate-900/20 outline-none text-slate-800 bg-slate-50 border border-slate-200 shadow-sm transition-all"
                                        >
                                            {mockModules.map(m => <option key={m} value={m}>{m} Module Data Engine</option>)}
                                        </select>
                                    </div>

                                    {/* Step 2: Columns */}
                                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm relative overflow-hidden">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm shadow-sm">2</span>
                                            Configure Columns
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {availableColumns.map((col: string) => {
                                                const isSelected = selectedColumns.includes(col);
                                                return (
                                                    <button
                                                        key={col}
                                                        onClick={() => toggleColumn(col)}
                                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:text-slate-900'}`}
                                                    >
                                                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                                        {col}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Step 3: Filters (Mock) */}
                                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-bold text-slate-800 flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm shadow-sm">3</span>
                                                Apply Conditional Filters
                                            </h4>
                                            <button onClick={addFilter} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold tracking-wider text-[10px] uppercase rounded-lg flex items-center gap-2 transition-colors">
                                                <Plus className="w-3.5 h-3.5" /> Add Rule
                                            </button>
                                        </div>
                                        {customFilters.length > 0 ? (
                                            <div className="space-y-3">
                                                {customFilters.map((filter, index) => (
                                                    <div key={index} className="flex gap-3 items-center bg-slate-50 border border-slate-200 p-2 rounded-lg">
                                                        <select value={filter.column} onChange={e => updateFilter(index, 'column', e.target.value)} className="p-2 rounded-md text-xs flex-1 bg-white text-slate-800 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-900/10">
                                                            {availableColumns.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                        <select value={filter.operator} onChange={e => updateFilter(index, 'operator', e.target.value)} className="p-2 rounded-md text-xs w-28 bg-white text-slate-800 border border-slate-200 outline-none focus:ring-2 focus:ring-slate-900/10">
                                                            <option>Equals</option>
                                                            <option>Contains</option>
                                                            <option>Greater Than</option>
                                                            <option>Less Than</option>
                                                        </select>
                                                        <input type="text" placeholder="Value..." value={filter.value} onChange={e => updateFilter(index, 'value', e.target.value)} className="p-2 rounded-md text-xs flex-1 text-slate-800 bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400" />
                                                        <button onClick={() => removeFilter(index)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 text-center py-6 bg-slate-50 rounded-lg border border-slate-100 border-dashed">No filters applied. All records included.</p>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="bg-slate-900 shadow-lg px-6 py-5 rounded-xl flex justify-between items-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                                        <div className="relative z-10">
                                            <p className="font-bold text-white text-lg">Preview Ready</p>
                                            <p className="text-xs text-slate-400 font-medium">{selectedColumns.length} columns selected from {selectedModule}</p>
                                        </div>
                                        <div className="flex gap-3 relative z-10">
                                            <button
                                                onClick={handleCustomExport}
                                                disabled={isGenerating || selectedColumns.length === 0}
                                                className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                                            >
                                                {isGenerating ? <Activity className="w-5 h-5 animate-spin" /> : <Table className="w-5 h-5" />}
                                                Generate Preview
                                            </button>
                                        </div>
                                    </div>

                                    {showGeneratedReport && (
                                        <div className="glass-card shadow-sm p-8 rounded-[32px] animate-in fade-in slide-in-from-bottom-2 border-blue-200 bg-white/80">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-black text-slate-900 text-xl uppercase tracking-widest">Output: {selectedModule}</h4>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleDownload('PDF', 'Custom Report')} className="px-5 py-2.5 bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-black uppercase shadow-sm tracking-widest rounded-xl text-xs flex items-center gap-2 transition-all">
                                                        <Download className="w-4 h-4" /> PDF
                                                    </button>
                                                    <button onClick={() => handleDownload('Excel', 'Custom Report')} className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 text-emerald-700 font-black shadow-sm uppercase tracking-widest text-xs rounded-xl flex items-center gap-2 transition-all">
                                                        <Download className="w-4 h-4" /> Excel
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                                <table className="w-full text-sm text-left border-collapse">
                                                    <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-200">
                                                        <tr>
                                                            {selectedColumns.map(col => (
                                                                <th key={col} className="px-6 py-4 whitespace-nowrap border-r border-slate-200 last:border-r-0">{col}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {customReportPreviewData.map((row: any, idx: number) => (
                                                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                                                {selectedColumns.map((col: string) => (
                                                                    <td key={col} className="px-6 py-4 text-slate-700 font-bold border-r border-slate-100 last:border-r-0">
                                                                        {String(row[col] ?? '-')}
                                                                    </td>
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-500/20 backdrop-blur-sm">
                        <div className="bg-white/90 border border-white shadow-2xl p-8 rounded-2xl flex flex-col items-center">
                            <Activity className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                            <h3 className="font-bold text-lg text-slate-800">Compiling Report Data...</h3>
                            <p className="text-xs text-slate-500 mt-2">Connecting to analytics engine and generating secure specific format.</p>
                        </div>
                    </div>
                )}

                {/* View Standard Report Modal */}
                {viewReportModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-in fade-in">
                        <div className="bg-white/80 border border-white/60 shadow-2xl rounded-3xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
                            <div className="p-8 border-b border-slate-200 flex flex-col gapx-4 py-4 bg-white/60 relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl -z-10"></div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${((viewReportModal as any).bg || '').replace('bg-', 'bg-').replace('50', '200')} ${((viewReportModal as any).color || '').replace('text-', 'text-').replace('600', '700')}`}>
                                            <viewReportModal.icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <Badge className="bg-blue-50 text-blue-800 border border-blue-100 font-black text-[10px] uppercase tracking-[0.2em] mb-2 px-3 shadow-none">
                                                {(viewReportModal as any).module}
                                            </Badge>
                                            <h3 className="font-black text-xl text-slate-900 uppercase tracking-tighter">{(viewReportModal as any).title}</h3>
                                        </div>
                                    </div>
                                    <button onClick={() => setViewReportModal(null)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Custom Filters for Talent Acquisition Report */}
                                {(viewReportModal as any).module === 'Talent Acquisition' && (
                                    <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200 relative z-10">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Date Range</label>
                                            <select
                                                value={taDateFilter}
                                                onChange={(e) => setTaDateFilter(e.target.value)}
                                                className="w-full text-sm rounded-xl py-2 px-4 bg-white border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-blue-700/20 appearance-none shadow-sm"
                                            >
                                                <option value="All Time">All Time</option>
                                                <option value="Last 7 Days">Last 7 Days</option>
                                                <option value="Last 30 Days">Last 30 Days</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Department</label>
                                            <select
                                                value={taDeptFilter}
                                                onChange={(e) => setTaDeptFilter(e.target.value)}
                                                className="w-full text-sm rounded-xl py-2 px-4 bg-white border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-blue-700/20 appearance-none shadow-sm"
                                            >
                                                <option value="All">All Departments</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Design">Design</option>
                                                <option value="Product">Product</option>
                                                <option value="Data Science">Data Science</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stage</label>
                                            <select
                                                value={taStageFilter}
                                                onChange={(e) => setTaStageFilter(e.target.value)}
                                                className="w-full text-sm rounded-xl py-2 px-4 bg-white border border-slate-200 text-slate-800 outline-none focus:ring-2 focus:ring-blue-700/20 appearance-none shadow-sm"
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
                            <div className="px-4 py-4 overflow-y-auto flex-1 bg-white/40 backdrop-blur-sm">
                                {(() => {
                                    const repData = getReportData((viewReportModal as any).title);
                                    return (
                                        <div className="overflow-x-auto border border-slate-200 rounded-3xl bg-white shadow-sm">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[10px] tracking-widest border-b border-slate-200">
                                                    <tr>
                                                        {repData.columns.map(col => (
                                                            <th key={col} className="px-6 py-4 whitespace-nowrap border-r border-slate-200 last:border-r-0">{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {repData.data.map((row, idx) => (
                                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                                            {repData.columns.map((col) => (
                                                                <td key={col} className={`px-6 py-4 text-xs font-bold text-slate-700 border-r border-slate-100 last:border-r-0`}>
                                                                    {col === 'Status' ? (
                                                                        <Badge className={`px-3 py-1 text-[9px] rounded-full font-black uppercase tracking-widest border shadow-none pointer-events-none ${(row as any)[col] === 'Pending' || (row as any)[col] === 'Onboarding' ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
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
                            <div className="p-8 border-t border-slate-200 bg-white/60 flex justify-end gap-4 relative">
                                <button onClick={() => handleDownload('PDF', (viewReportModal as any).title)} className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-2 transition-all shadow-sm"><Download className="w-4 h-4" /> Download PDF</button>
                                <button onClick={() => handleDownload('Excel', (viewReportModal as any).title)} className="px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center gap-2 transition-all shadow-sm shadow-blue-900/20"><Download className="w-4 h-4" /> Download Excel</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default ReportsDashboard;
