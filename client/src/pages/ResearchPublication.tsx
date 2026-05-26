import { useState, useEffect, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import { 
    BookOpen, FileText, Plus, ChevronRight, 
    BarChart3, CheckCircle2, Clock, 
    TrendingUp, Library, 
    Calculator, Info, Search, Zap, XCircle,
    UserCheck, ShieldAlert, Award, FileSpreadsheet,
    Calendar, Users, Building, Download, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { usePersona } from '../contexts/PersonaContext';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// ─── Constants & Configurations ──────────────────────────────────────────────

const ACADEMIC_YEARS = ['2023-24', '2024-25', '2025-26'];
const CALENDAR_YEARS = ['2023', '2024', '2025', '2026'];
const DEPARTMENTS = ['Computer Science', 'Science', 'Mathematics', 'Physical Education', 'Mechanical Engineering'];

const CATEGORY_LABELS = {
    PAPER_PUBLICATION: 'Paper Publication',
    PAPER_PRESENTED: 'Paper Presented',
    PROGRAM_ATTENDED: 'Program Attended',
    BOOK_PUBLISHED: 'Book Published',
    PATENT: 'Patent'
};

const STATUS_STYLING = {
    'Draft': 'bg-gray-100 text-gray-700 border-gray-200',
    'Submitted': 'bg-blue-100 text-blue-700 border-blue-200',
    'HOD Approved': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Verified': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Rejected by HOD': 'bg-rose-100 text-rose-700 border-rose-200',
    'Rejected by HR': 'bg-orange-100 text-orange-700 border-orange-200',
    'Flagged': 'bg-amber-100 text-amber-700 border-amber-200'
};

const MOCK_EMPLOYEES = [
    { id: 'emp-001', name: 'John Faculty', department: 'Computer Science', designation: 'Asst. Professor' },
    { id: 'emp-002', name: 'Ms. Reshma Binu Prasad', department: 'Computer Science', designation: 'Asst. Professor' },
    { id: 'emp-003', name: 'Ms. Sanchaiyata Majumdar', department: 'Computer Science', designation: 'Lecturer' },
    { id: 'emp-004', name: 'Dr. Ranjita Saikia', department: 'Science', designation: 'Professor' },
    { id: 'emp-005', name: 'Mr. Edwin Vimal A', department: 'Mathematics', designation: 'Lecturer' },
    { id: 'emp-006', name: 'Mr. Manjit Singh', department: 'Physical Education', designation: 'Instructor' }
];

// Seed initial dataset for simulation
const INITIAL_SEED_RECORDS = [
    {
        record_id: 'rec-001',
        faculty_id: 'emp-002',
        faculty_name: 'Ms. Reshma Binu Prasad',
        department_id: 'Computer Science',
        category: 'PAPER_PUBLICATION',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-04-12',
        created_at: '2024-04-12T10:00:00Z',
        submitted_at: '2024-04-12T12:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2024-04-15T09:00:00Z',
        hod_remarks: 'Verified first page scan. High-quality indexing.',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-04-17T11:30:00Z',
        verified_at: '2024-04-17T11:30:00Z',
        proof_document_1_url: 'reshma_first_page.pdf',
        additional_remarks: 'NAAC C3 criteria reference.',
        details: {
            paper_title: 'Quantum-inspired Genetic Algorithms for IoT',
            publication_type: 'Journal',
            journal_name: 'Elsevier: Cloud Computing',
            publisher: 'Elsevier',
            indexing_category: 'Scopus',
            impact_factor: 5.8,
            issn: '1234-5678',
            volume: '24',
            issue: '2',
            page_numbers: '45-67',
            publication_status: 'Published'
        },
        co_authors: [
            { type: 'INTERNAL', name: 'John Faculty', institution: 'edumerge University' }
        ]
    },
    {
        record_id: 'rec-002',
        faculty_id: 'emp-002',
        faculty_name: 'Ms. Reshma Binu Prasad',
        department_id: 'Computer Science',
        category: 'PAPER_PUBLICATION',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-05-20',
        created_at: '2024-05-20T14:00:00Z',
        submitted_at: '2024-05-21T09:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2024-05-22T10:00:00Z',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-05-24T15:00:00Z',
        verified_at: '2024-05-24T15:00:00Z',
        proof_document_1_url: 'reshma_deep_learning.pdf',
        details: {
            paper_title: 'Deep Learning for Pulmonary Nodule Detection',
            publication_type: 'Journal',
            journal_name: 'Springer Nature',
            publisher: 'Springer',
            indexing_category: 'Web of Science',
            impact_factor: 4.2,
            issn: '2233-4455',
            volume: '12',
            issue: '4',
            page_numbers: '110-128',
            publication_status: 'Published'
        },
        co_authors: []
    },
    {
        record_id: 'rec-003',
        faculty_id: 'emp-003',
        faculty_name: 'Ms. Sanchaiyata Majumdar',
        department_id: 'Computer Science',
        category: 'PAPER_PRESENTED',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-06-15',
        created_at: '2024-06-10T09:00:00Z',
        submitted_at: '2024-06-11T12:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2024-06-13T10:00:00Z',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-06-15T14:30:00Z',
        verified_at: '2024-06-15T14:30:00Z',
        proof_document_1_url: 'sanchaiyata_cert.jpg',
        details: {
            paper_title: 'Cybersecurity Threat Detection in Grid Computing',
            event_name: 'International Conference on Grid Systems',
            event_type: 'International Conference',
            organising_body: 'IEEE Pune Section',
            venue_city: 'Pune',
            mode: 'Hybrid',
            event_start_date: '2024-06-14',
            event_end_date: '2024-06-15',
            presenter_role: 'Sole Presenter',
            published_in_proceedings: true
        },
        co_authors: []
    },
    {
        record_id: 'rec-004',
        faculty_id: 'emp-004',
        faculty_name: 'Dr. Ranjita Saikia',
        department_id: 'Science',
        category: 'BOOK_PUBLISHED',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-08-01',
        created_at: '2024-07-28T10:00:00Z',
        submitted_at: '2024-07-29T11:00:00Z',
        hod_reviewer_id: 'hod-002',
        hod_reviewed_at: '2024-07-31T09:00:00Z',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-08-01T15:00:00Z',
        verified_at: '2024-08-01T15:00:00Z',
        proof_document_1_url: 'book_cover.pdf',
        proof_document_2_url: 'book_isbn_page.pdf',
        details: {
            contribution_type: 'Authored Book',
            book_title: 'Fundamentals of Biotechnology',
            publisher_name: 'Pearson Education',
            publisher_type: 'International',
            publisher_country: 'India',
            isbn: '978-0133943030',
            year_of_publication: '2024',
            edition: '1st Edition'
        },
        co_authors: []
    },
    {
        record_id: 'rec-005',
        faculty_id: 'emp-005',
        faculty_name: 'Mr. Edwin Vimal A',
        department_id: 'Mathematics',
        category: 'PROGRAM_ATTENDED',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-09-12',
        created_at: '2024-09-15T09:00:00Z',
        submitted_at: '2024-09-15T10:00:00Z',
        hod_reviewer_id: 'hod-003',
        hod_reviewed_at: '2024-09-18T14:00:00Z',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-09-20T11:00:00Z',
        verified_at: '2024-09-20T11:00:00Z',
        proof_document_1_url: 'edwin_fdp_cert.pdf',
        details: {
            program_name: 'Advanced Linear Algebra in Machine Learning',
            program_type: 'FDP (Faculty Development Program)',
            organising_body: 'IIT Madras',
            organising_level: 'National',
            funding_source: 'Institution-funded',
            mode: 'Virtual',
            start_date: '2024-09-08',
            end_date: '2024-09-12',
            duration_days: 5,
            duration_hours: 40,
            certificate_received: true
        },
        co_authors: []
    },
    {
        record_id: 'rec-006',
        faculty_id: 'emp-002',
        faculty_name: 'Ms. Reshma Binu Prasad',
        department_id: 'Computer Science',
        category: 'PATENT',
        status: 'Verified',
        academic_year: '2024-25',
        calendar_year: 2024,
        publication_date: '2024-10-18',
        created_at: '2024-10-15T11:00:00Z',
        submitted_at: '2024-10-15T12:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2024-10-17T09:00:00Z',
        hr_reviewer_id: 'hr-001',
        hr_reviewed_at: '2024-10-18T15:30:00Z',
        verified_at: '2024-10-18T15:30:00Z',
        proof_document_1_url: 'patent_receipt.pdf',
        details: {
            patent_title: 'AI-Based Intelligent Traffic Routing System',
            patent_type: 'Utility Patent',
            patent_office: 'Indian Patent Office (IPO)',
            application_number: 'IPO/2024/99281A',
            filing_date: '2024-10-18',
            patent_status: 'Filed'
        },
        co_authors: []
    },
    {
        record_id: 'rec-007',
        faculty_id: 'emp-001',
        faculty_name: 'John Faculty',
        department_id: 'Computer Science',
        category: 'PAPER_PUBLICATION',
        status: 'Submitted',
        academic_year: '2025-26',
        calendar_year: 2025,
        publication_date: '2025-05-10',
        created_at: '2025-05-10T12:00:00Z',
        submitted_at: '2025-05-11T10:00:00Z',
        proof_document_1_url: 'john_paper_v1.pdf',
        details: {
            paper_title: 'Distributed Edge Computing Schemes in 5G networks',
            publication_type: 'Journal',
            journal_name: 'IEEE Access',
            publisher: 'IEEE',
            indexing_category: 'Scopus',
            impact_factor: 3.9,
            issn: '2169-3536',
            volume: '13',
            issue: '1',
            page_numbers: '1004-1015',
            publication_status: 'Published'
        },
        co_authors: [
            { type: 'EXTERNAL', name: 'Dr. Bruce Banner', institution: 'MIT' }
        ]
    },
    {
        record_id: 'rec-008',
        faculty_id: 'emp-001',
        faculty_name: 'John Faculty',
        department_id: 'Computer Science',
        category: 'BOOK_PUBLISHED',
        status: 'Rejected by HOD',
        academic_year: '2025-26',
        calendar_year: 2025,
        publication_date: '2025-03-01',
        created_at: '2025-03-01T09:00:00Z',
        submitted_at: '2025-03-02T10:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2025-03-05T14:00:00Z',
        hod_rejection_reason: 'Please upload the secondary copyright / ISBN page. You have only uploaded the cover scan.',
        proof_document_1_url: 'john_book_cover.pdf',
        details: {
            contribution_type: 'Book Chapter',
            book_title: 'Introduction to Federated Learning',
            chapter_title: 'Security and Privacy in Smart Grids',
            chapter_page_numbers: '14-38',
            publisher_name: 'Wiley Publications',
            publisher_type: 'National',
            publisher_country: 'India',
            isbn: '978-93-5104-0',
            year_of_publication: '2025',
            edition: 'Rev Edition'
        },
        co_authors: []
    },
    {
        record_id: 'rec-009',
        faculty_id: 'emp-002',
        faculty_name: 'Ms. Reshma Binu Prasad',
        department_id: 'Computer Science',
        category: 'PAPER_PUBLICATION',
        status: 'HOD Approved',
        academic_year: '2025-26',
        calendar_year: 2025,
        publication_date: '2025-05-18',
        created_at: '2025-05-18T10:00:00Z',
        submitted_at: '2025-05-19T09:00:00Z',
        hod_reviewer_id: 'hod-001',
        hod_reviewed_at: '2025-05-20T11:00:00Z',
        hod_remarks: 'Valid publication. Impact factor 4.5.',
        proof_document_1_url: 'reshma_springer2025.pdf',
        details: {
            paper_title: 'Predictive analytics on decentralized healthcare telemetry',
            publication_type: 'Journal',
            journal_name: 'Springer Medical Systems',
            publisher: 'Springer',
            indexing_category: 'Web of Science',
            impact_factor: 4.5,
            issn: '8877-6655',
            volume: '44',
            issue: '3',
            page_numbers: '201-218',
            publication_status: 'Published'
        },
        co_authors: []
    }
];

const INITIAL_NOTIFICATIONS = [
    { id: 'not-1', text: 'Faculty John Faculty submitted a new Paper Publication record.', timestamp: '2025-05-11T10:00:00Z' },
    { id: 'not-2', text: 'HOD Dr. Rajesh rejected Book Published record for John Faculty.', timestamp: '2025-03-05T14:00:00Z' },
    { id: 'not-3', text: 'HOD Dr. Rajesh approved a Paper Publication record for Ms. Reshma Binu Prasad.', timestamp: '2025-05-20T11:00:00Z' }
];

const ResearchPublication = () => {
    const { role, user } = usePersona();
    const [activeSection, setActiveSection] = useState<'ess' | 'hod_queue' | 'hr_dashboard' | 'reports'>('ess');
    
    // Core states synchronized with localStorage
    const [records, setRecords] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [auditLog, setAuditLog] = useState<any[]>([]);
    
    // ESS Navigation & Tab states
    const [activeCategoryTab, setActiveCategoryTab] = useState<string>('PAPER_PUBLICATION');
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [selectedRecordForView, setSelectedRecordForView] = useState<any | null>(null);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
    
    // Auto-save alert
    const [autoSaveToast, setAutoSaveToast] = useState<string | null>(null);
    const autoSaveTimerRef = useRef<any>(null);

    // Form inputs state
    const [formCategory, setFormCategory] = useState<string>('PAPER_PUBLICATION');
    const [formStatus, setFormStatus] = useState<string>('Draft');
    const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [remarks, setRemarks] = useState<string>('');
    const [proofFile1, setProofFile1] = useState<string>('');
    const [proofFile2, setProofFile2] = useState<string>('');
    const [additionalRemarks, setAdditionalRemarks] = useState<string>('');
    
    // Category details details inputs
    const [paperTitle, setPaperTitle] = useState<string>('');
    const [publicationType, setPublicationType] = useState<string>('Journal');
    const [journalName, setJournalName] = useState<string>('');
    const [publisher, setPublisher] = useState<string>('');
    const [indexingCategory, setIndexingCategory] = useState<string>('Scopus');
    const [impactFactor, setImpactFactor] = useState<string>('');
    const [issn, setIssn] = useState<string>('');
    const [isbn, setIsbn] = useState<string>('');
    const [volume, setVolume] = useState<string>('');
    const [issue, setIssue] = useState<string>('');
    const [pageNumbers, setPageNumbers] = useState<string>('');
    const [publicationStatus, setPublicationStatus] = useState<string>('Published');

    // Presented properties
    const [eventName, setEventName] = useState<string>('');
    const [eventType, setEventType] = useState<string>('International Conference');
    const [organisingBody, setOrganisingBody] = useState<string>('');
    const [venueCity, setVenueCity] = useState<string>('');
    const [modeOfParticipation, setModeOfParticipation] = useState<string>('Physical');
    const [eventStartDate, setEventStartDate] = useState<string>('');
    const [eventEndDate, setEventEndDate] = useState<string>('');
    const [presenterRole, setPresenterRole] = useState<string>('Sole Presenter');
    const [publishedInProceedings, setPublishedInProceedings] = useState<string>('No');
    const [linkedPublicationRecordId, setLinkedPublicationRecordId] = useState<string>('');

    // Programs attended properties
    const [programName, setProgramName] = useState<string>('');
    const [programType, setProgramType] = useState<string>('FDP (Faculty Development Program)');
    const [organisingLevel, setOrganisingLevel] = useState<string>('National');
    const [fundingSource, setFundingSource] = useState<string>('Self-funded');
    const [durationDays, setDurationDays] = useState<string>('');
    const [durationHours, setDurationHours] = useState<string>('');
    const [certificateReceived, setCertificateReceived] = useState<string>('Yes');
    const [moocPlatform, setMoocPlatform] = useState<string>('');
    const [certificationGrade, setCertificationGrade] = useState<string>('');

    // Books properties
    const [contributionType, setContributionType] = useState<string>('Authored Book');
    const [bookTitle, setBookTitle] = useState<string>('');
    const [chapterTitle, setChapterTitle] = useState<string>('');
    const [publisherName, setPublisherName] = useState<string>('');
    const [publisherType, setPublisherType] = useState<string>('National');
    const [publisherCountry, setPublisherCountry] = useState<string>('India');
    const [yearOfPublication, setYearOfPublication] = useState<string>(new Date().getFullYear().toString());
    const [edition, setEdition] = useState<string>('');

    // Patents properties
    const [patentTitle, setPatentTitle] = useState<string>('');
    const [patentType, setPatentType] = useState<string>('Utility Patent');
    const [patentOffice, setPatentOffice] = useState<string>('Indian Patent Office (IPO)');
    const [applicationNumber, setApplicationNumber] = useState<string>('');
    const [filingDate, setFilingDate] = useState<string>('');
    const [patentPublicationDate, setPatentPublicationDate] = useState<string>('');
    const [grantDate, setGrantDate] = useState<string>('');
    const [patentStatus, setPatentStatus] = useState<string>('Filed');
    const [commercialisationDetails, setCommercialisationDetails] = useState<string>('');

    // Co-Authors inputs
    const [internalCoAuthors, setInternalCoAuthors] = useState<string[]>([]);
    const [externalCoAuthors, setExternalCoAuthors] = useState<{name: string, institution: string}[]>([]);
    const [newExtName, setNewExtName] = useState<string>('');
    const [newExtInst, setNewExtInst] = useState<string>('');

    // Verification Workflow Actions States
    const [showReviewModal, setShowReviewModal] = useState<any | null>(null);
    const [reviewRemarks, setReviewRemarks] = useState<string>('');
    const [reviewRejectionReason, setReviewRejectionReason] = useState<string>('');

    // Reports View state
    const [selectedReportId, setSelectedReportId] = useState<string>('R01');
    const [filterAcademicYear, setFilterAcademicYear] = useState<string>('All Years');
    const [filterCalendarYear, setFilterCalendarYear] = useState<string>('All Years');
    const [filterDept, setFilterDept] = useState<string>('All Departments');
    const [filterCategory, setFilterCategory] = useState<string>('All Categories');
    const [filterFaculty, setFilterFaculty] = useState<string>('All Faculty');
    const [filterStatus, setFilterStatus] = useState<string>('All Statuses');
    const [filterDateFrom, setFilterDateFrom] = useState<string>('');
    const [filterDateTo, setFilterDateTo] = useState<string>('');

    // Initialize state
    useEffect(() => {
        const storedRecs = localStorage.getItem('edumerge_research_records_v1');
        const storedNots = localStorage.getItem('edumerge_research_notifications_v1');
        const storedLogs = localStorage.getItem('edumerge_research_audit_v1');

        if (storedRecs) {
            setRecords(JSON.parse(storedRecs));
        } else {
            setRecords(INITIAL_SEED_RECORDS);
            localStorage.setItem('edumerge_research_records_v1', JSON.stringify(INITIAL_SEED_RECORDS));
        }

        if (storedNots) {
            setNotifications(JSON.parse(storedNots));
        } else {
            setNotifications(INITIAL_NOTIFICATIONS);
            localStorage.setItem('edumerge_research_notifications_v1', JSON.stringify(INITIAL_NOTIFICATIONS));
        }

        if (storedLogs) {
            setAuditLog(JSON.parse(storedLogs));
        } else {
            setAuditLog([]);
        }

        // Adjust active section depending on loaded persona
        if (role === 'EMPLOYEE') {
            setActiveSection('ess');
        } else if (role === 'MANAGER') {
            setActiveSection('hod_queue');
        } else if (role === 'HR_ADMIN' || role === 'ADMIN') {
            setActiveSection('hr_dashboard');
        }
    }, [role]);

    // Save helper
    const saveToLocalStorage = (newRecs: any[], newNots?: any[], newLogs?: any[]) => {
        setRecords(newRecs);
        localStorage.setItem('edumerge_research_records_v1', JSON.stringify(newRecs));
        if (newNots) {
            setNotifications(newNots);
            localStorage.setItem('edumerge_research_notifications_v1', JSON.stringify(newNots));
        }
        if (newLogs) {
            setAuditLog(newLogs);
            localStorage.setItem('edumerge_research_audit_v1', JSON.stringify(newLogs));
        }
    };

    // Calculate dates & hours for Programs Attended duration calculation
    useEffect(() => {
        if (eventStartDate && eventEndDate && formCategory === 'PAPER_PRESENTED') {
            // just to sync start/end dates
        }
        if (formCategory === 'PROGRAM_ATTENDED') {
            const start = new Date(eventStartDate || formDate);
            const end = new Date(eventEndDate || formDate);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setDurationDays(diffDays.toString());
                setDurationHours((diffDays * 8).toString()); // estimate 8 contact hours per day
            }
        }
    }, [eventStartDate, eventEndDate, formCategory, formDate]);

    // Auto-save scheduler simulator (triggers when form modal is open)
    useEffect(() => {
        if (showFormModal && formStatus === 'Draft') {
            autoSaveTimerRef.current = setInterval(() => {
                triggerAutoSave();
            }, 30000);
        } else {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        }
        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, [showFormModal, paperTitle, bookTitle, patentTitle, programName, eventName, formDate, formCategory, internalCoAuthors, externalCoAuthors, proofFile1, proofFile2, remarks, additionalRemarks]);

    const triggerAutoSave = () => {
        // Collect form data
        const currentData = captureFormData();
        const recordId = activeEditingId || `draft-${Date.now()}`;
        
        let targetId = activeEditingId;
        let updatedList = [...records];
        
        const newRecord = {
            record_id: recordId,
            faculty_id: user.id || 'emp-001',
            faculty_name: user.name || 'John Faculty',
            department_id: user.department || 'Computer Science',
            category: formCategory,
            status: 'Draft',
            academic_year: deriveAcademicYear(formDate),
            calendar_year: new Date(formDate).getFullYear(),
            publication_date: formDate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            proof_document_1_url: proofFile1 || 'draft_document.pdf',
            proof_document_2_url: proofFile2,
            additional_remarks: additionalRemarks,
            details: currentData,
            co_authors: externalCoAuthors.map(e => ({ type: 'EXTERNAL', name: e.name, institution: e.institution }))
                .concat(internalCoAuthors.map(name => ({ type: 'INTERNAL', name, institution: 'edumerge University' })))
        };

        if (targetId) {
            updatedList = updatedList.map(r => r.record_id === targetId ? { ...newRecord, record_id: targetId } : r);
        } else {
            updatedList.unshift(newRecord);
            setActiveEditingId(recordId); // lock future autosaves to this new ID
        }

        saveToLocalStorage(updatedList);
        setAutoSaveToast(`Draft auto-saved at ${new Date().toLocaleTimeString()}`);
        setTimeout(() => setAutoSaveToast(null), 3000);
    };

    const deriveAcademicYear = (dateStr: string) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '2025-26';
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed
        if (month >= 5) { // Academic year starts in June (month 5)
            return `${year}-${(year + 1).toString().slice(-2)}`;
        } else {
            return `${year - 1}-${year.toString().slice(-2)}`;
        }
    };

    const captureFormData = () => {
        switch (formCategory) {
            case 'PAPER_PUBLICATION':
                return {
                    paper_title: paperTitle,
                    publication_type: publicationType,
                    journal_name: journalName,
                    publisher: publisher,
                    indexing_category: indexingCategory,
                    impact_factor: parseFloat(impactFactor) || 0,
                    issn: publicationType === 'Journal' ? issn : undefined,
                    isbn: publicationType === 'Conference Proceedings' ? isbn : undefined,
                    volume,
                    issue,
                    page_numbers: pageNumbers,
                    publication_status: publicationStatus
                };
            case 'PAPER_PRESENTED':
                return {
                    paper_title: paperTitle,
                    event_name: eventName,
                    event_type: eventType,
                    organising_body: organisingBody,
                    venue_city: venueCity,
                    mode: modeOfParticipation,
                    event_start_date: eventStartDate,
                    event_end_date: eventEndDate,
                    presenter_role: presenterRole,
                    published_in_proceedings: publishedInProceedings === 'Yes',
                    linked_publication_record_id: linkedPublicationRecordId || undefined
                };
            case 'PROGRAM_ATTENDED':
                return {
                    program_name: programName,
                    program_type: programType,
                    organising_body: organisingBody,
                    organising_level: organisingLevel,
                    funding_source: fundingSource,
                    mode: modeOfParticipation,
                    start_date: eventStartDate,
                    end_date: eventEndDate,
                    duration_days: parseInt(durationDays) || 1,
                    duration_hours: parseInt(durationHours) || 8,
                    certificate_received: certificateReceived === 'Yes',
                    mooc_platform: programType === 'MOOC / Online Course' ? moocPlatform : undefined,
                    certification_grade: certificationGrade
                };
            case 'BOOK_PUBLISHED':
                return {
                    contribution_type: contributionType,
                    book_title: bookTitle,
                    chapter_title: contributionType === 'Book Chapter' ? chapterTitle : undefined,
                    chapter_page_numbers: contributionType === 'Book Chapter' ? pageNumbers : undefined,
                    publisher_name: publisherName,
                    publisher_type: publisherType,
                    publisher_country: publisherCountry,
                    isbn: isbn,
                    year_of_publication: yearOfPublication,
                    edition: edition
                };
            case 'PATENT':
                return {
                    patent_title: patentTitle,
                    patent_type: patentType,
                    patent_office: patentOffice,
                    application_number: applicationNumber,
                    filing_date: filingDate || formDate,
                    publication_date: patentPublicationDate || undefined,
                    grant_date: grantDate || undefined,
                    patent_status: patentStatus,
                    commercialisation_details: patentStatus === 'Commercialised' ? commercialisationDetails : undefined
                };
            default:
                return {};
        }
    };

    // Resets input states to default
    const resetFormInputs = () => {
        setPaperTitle('');
        setPublicationType('Journal');
        setJournalName('');
        setPublisher('');
        setIndexingCategory('Scopus');
        setImpactFactor('');
        setIssn('');
        setIsbn('');
        setVolume('');
        setIssue('');
        setPageNumbers('');
        setPublicationStatus('Published');

        setEventName('');
        setEventType('International Conference');
        setOrganisingBody('');
        setVenueCity('');
        setModeOfParticipation('Physical');
        setEventStartDate('');
        setEventEndDate('');
        setPresenterRole('Sole Presenter');
        setPublishedInProceedings('No');
        setLinkedPublicationRecordId('');

        setProgramName('');
        setProgramType('FDP (Faculty Development Program)');
        setOrganisingLevel('National');
        setFundingSource('Self-funded');
        setDurationDays('');
        setDurationHours('');
        setCertificateReceived('Yes');
        setMoocPlatform('');
        setCertificationGrade('');

        setContributionType('Authored Book');
        setBookTitle('');
        setChapterTitle('');
        setPublisherName('');
        setPublisherType('National');
        setPublisherCountry('India');
        setYearOfPublication(new Date().getFullYear().toString());
        setEdition('');

        setPatentTitle('');
        setPatentType('Utility Patent');
        setPatentOffice('Indian Patent Office (IPO)');
        setApplicationNumber('');
        setFilingDate('');
        setPatentPublicationDate('');
        setGrantDate('');
        setPatentStatus('Filed');
        setCommercialisationDetails('');

        setInternalCoAuthors([]);
        setExternalCoAuthors([]);
        setNewExtName('');
        setNewExtInst('');
        setProofFile1('');
        setProofFile2('');
        setAdditionalRemarks('');
        setFormDate(new Date().toISOString().split('T')[0]);
        setActiveEditingId(null);
        setIsEditMode(false);
    };

    const handleOpenAddNew = (category: string) => {
        resetFormInputs();
        setFormCategory(category);
        setFormStatus('Draft');
        setShowFormModal(true);
    };

    // Load selected record details into state for editing
    const handleOpenEdit = (rec: any) => {
        resetFormInputs();
        setIsEditMode(true);
        setActiveEditingId(rec.record_id);
        setFormCategory(rec.category);
        setFormStatus(rec.status);
        setFormDate(rec.publication_date);
        setProofFile1(rec.proof_document_1_url || '');
        setProofFile2(rec.proof_document_2_url || '');
        setAdditionalRemarks(rec.additional_remarks || '');
        
        // Map details back
        const d = rec.details || {};
        if (rec.category === 'PAPER_PUBLICATION') {
            setPaperTitle(d.paper_title || '');
            setPublicationType(d.publication_type || 'Journal');
            setJournalName(d.journal_name || '');
            setPublisher(d.publisher || '');
            setIndexingCategory(d.indexing_category || 'Scopus');
            setImpactFactor(d.impact_factor?.toString() || '');
            setIssn(d.issn || '');
            setIsbn(d.isbn || '');
            setVolume(d.volume || '');
            setIssue(d.issue || '');
            setPageNumbers(d.page_numbers || '');
            setPublicationStatus(d.publication_status || 'Published');
        } else if (rec.category === 'PAPER_PRESENTED') {
            setPaperTitle(d.paper_title || '');
            setEventName(d.event_name || '');
            setEventType(d.event_type || 'International Conference');
            setOrganisingBody(d.organising_body || '');
            setVenueCity(d.venue_city || '');
            setModeOfParticipation(d.mode || 'Physical');
            setEventStartDate(d.event_start_date || '');
            setEventEndDate(d.event_end_date || '');
            setPresenterRole(d.presenter_role || 'Sole Presenter');
            setPublishedInProceedings(d.published_in_proceedings ? 'Yes' : 'No');
            setLinkedPublicationRecordId(d.linked_publication_record_id || '');
        } else if (rec.category === 'PROGRAM_ATTENDED') {
            setProgramName(d.program_name || '');
            setProgramType(d.program_type || 'FDP (Faculty Development Program)');
            setOrganisingBody(d.organising_body || '');
            setOrganisingLevel(d.organising_level || 'National');
            setFundingSource(d.funding_source || 'Self-funded');
            setModeOfParticipation(d.mode || 'Physical');
            setEventStartDate(d.start_date || '');
            setEventEndDate(d.end_date || '');
            setDurationDays(d.duration_days?.toString() || '');
            setDurationHours(d.duration_hours?.toString() || '');
            setCertificateReceived(d.certificate_received ? 'Yes' : 'No');
            setMoocPlatform(d.mooc_platform || '');
            setCertificationGrade(d.certification_grade || '');
        } else if (rec.category === 'BOOK_PUBLISHED') {
            setContributionType(d.contribution_type || 'Authored Book');
            setBookTitle(d.book_title || '');
            setChapterTitle(d.chapter_title || '');
            setPageNumbers(d.chapter_page_numbers || '');
            setPublisherName(d.publisher_name || '');
            setPublisherType(d.publisher_type || 'National');
            setPublisherCountry(d.publisher_country || 'India');
            setIsbn(d.isbn || '');
            setYearOfPublication(d.year_of_publication || '');
            setEdition(d.edition || '');
        } else if (rec.category === 'PATENT') {
            setPatentTitle(d.patent_title || '');
            setPatentType(d.patent_type || 'Utility Patent');
            setPatentOffice(d.patent_office || 'Indian Patent Office (IPO)');
            setApplicationNumber(d.application_number || '');
            setFilingDate(d.filing_date || '');
            setPatentPublicationDate(d.publication_date || '');
            setGrantDate(d.grant_date || '');
            setPatentStatus(d.patent_status || 'Filed');
            setCommercialisationDetails(d.commercialisation_details || '');
        }

        // co authors mapping
        const internalList: string[] = [];
        const externalList: any[] = [];
        (rec.co_authors || []).forEach((c: any) => {
            if (c.type === 'INTERNAL') {
                internalList.push(c.name);
            } else {
                externalList.push({ name: c.name, institution: c.institution });
            }
        });
        setInternalCoAuthors(internalList);
        setExternalCoAuthors(externalList);

        setShowFormModal(true);
    };

    const handleFormSubmit = (isSubmitFlow: boolean) => {
        // Validation check
        let mainTitle = '';
        if (formCategory === 'PAPER_PUBLICATION') mainTitle = paperTitle;
        if (formCategory === 'PAPER_PRESENTED') mainTitle = paperTitle;
        if (formCategory === 'PROGRAM_ATTENDED') mainTitle = programName;
        if (formCategory === 'BOOK_PUBLISHED') mainTitle = bookTitle;
        if (formCategory === 'PATENT') mainTitle = patentTitle;

        if (!mainTitle.trim()) {
            alert('Title is mandatory.');
            return;
        }

        if (formCategory === 'PAPER_PUBLICATION') {
            if (publicationType === 'Journal' && !issn) {
                alert('ISSN is mandatory for Journal publications.');
                return;
            }
            if (publicationType === 'Conference Proceedings' && !isbn) {
                alert('ISBN is mandatory for Conference Proceedings.');
                return;
            }
        }

        if (formCategory === 'BOOK_PUBLISHED') {
            if (!isbn) {
                alert('ISBN is mandatory for Book publications.');
                return;
            }
            if (!proofFile1 || !proofFile2) {
                alert('Both cover page (File 1) and copyright page (File 2) uploads are required for Books.');
                return;
            }
        }

        if (!proofFile1 && formCategory !== 'BOOK_PUBLISHED') {
            alert('Document proof upload is mandatory.');
            return;
        }

        const newStatus = isSubmitFlow ? 'Submitted' : 'Draft';
        const finalDetails = captureFormData();
        const recordId = activeEditingId || `rec-${Date.now()}`;
        
        const recordObject = {
            record_id: recordId,
            faculty_id: user.id || 'emp-001',
            faculty_name: user.name || 'John Faculty',
            department_id: user.department || 'Computer Science',
            category: formCategory,
            status: newStatus,
            academic_year: deriveAcademicYear(formDate),
            calendar_year: new Date(formDate).getFullYear(),
            publication_date: formDate,
            created_at: new Date().toISOString(),
            submitted_at: isSubmitFlow ? new Date().toISOString() : null,
            proof_document_1_url: proofFile1,
            proof_document_2_url: proofFile2 || undefined,
            additional_remarks: additionalRemarks,
            details: finalDetails,
            co_authors: externalCoAuthors.map(e => ({ type: 'EXTERNAL', name: e.name, institution: e.institution }))
                .concat(internalCoAuthors.map(name => ({ type: 'INTERNAL', name, institution: 'edumerge University' }))),
            correction_count: isEditMode && records.find(r => r.record_id === activeEditingId)?.status.includes('Rejected') 
                ? (records.find(r => r.record_id === activeEditingId)?.correction_count || 0) + 1 
                : 0
        };

        let updatedList = [...records];
        if (isEditMode) {
            updatedList = updatedList.map(r => r.record_id === activeEditingId ? recordObject : r);
        } else {
            updatedList.unshift(recordObject);
        }

        // Notification Log trigger
        let nextNots = [...notifications];
        if (isSubmitFlow) {
            const isCorrection = isEditMode && records.find(r => r.record_id === activeEditingId)?.status.includes('Rejected');
            const notText = isCorrection 
                ? `Faculty ${user.name} submitted a corrected record: ${mainTitle}.` 
                : `Faculty ${user.name} submitted a new ${CATEGORY_LABELS[formCategory as keyof typeof CATEGORY_LABELS]} record: ${mainTitle}.`;
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: notText,
                timestamp: new Date().toISOString()
            });
        }

        // Add to Audit Log
        const nextLogs = [...auditLog];
        nextLogs.unshift({
            log_id: `log-${Date.now()}`,
            record_id: recordId,
            event_type: isSubmitFlow ? (isEditMode && records.find(r => r.record_id === activeEditingId)?.status.includes('Rejected') ? 'FACULTY_CORRECTED' : 'SUBMITTED') : 'DRAFT',
            actor_id: user.id,
            actor_role: 'FACULTY',
            reason: remarks,
            created_at: new Date().toISOString(),
            snapshot: recordObject
        });

        saveToLocalStorage(updatedList, nextNots, nextLogs);
        setShowFormModal(false);
        resetFormInputs();
    };

    // Duplicate safety check
    const isDuplicateFound = useMemo(() => {
        let identifierValue = '';
        if (formCategory === 'PAPER_PUBLICATION') {
            identifierValue = publicationType === 'Journal' ? issn : isbn;
        } else if (formCategory === 'BOOK_PUBLISHED') {
            identifierValue = isbn;
        } else if (formCategory === 'PATENT') {
            identifierValue = applicationNumber;
        }

        if (!identifierValue) return false;
        
        return records.some(r => {
            if (r.record_id === activeEditingId) return false; // skip current self check
            if (r.category !== formCategory) return false;
            
            const detail = r.details || {};
            if (formCategory === 'PAPER_PUBLICATION') {
                return (publicationType === 'Journal' ? detail.issn === issn : detail.isbn === isbn);
            }
            if (formCategory === 'BOOK_PUBLISHED') {
                return detail.isbn === isbn;
            }
            if (formCategory === 'PATENT') {
                return detail.application_number === applicationNumber;
            }
            return false;
        });
    }, [formCategory, issn, isbn, publicationType, applicationNumber, records, activeEditingId]);

    // Internal co authors logic
    const handleAddInternalCoAuthor = (empName: string) => {
        if (!internalCoAuthors.includes(empName)) {
            setInternalCoAuthors([...internalCoAuthors, empName]);
        }
    };

    const handleRemoveInternalCoAuthor = (empName: string) => {
        setInternalCoAuthors(internalCoAuthors.filter(n => n !== empName));
    };

    // External co authors logic
    const handleAddExternalCoAuthor = () => {
        if (newExtName.trim() && newExtInst.trim()) {
            setExternalCoAuthors([...externalCoAuthors, { name: newExtName, institution: newExtInst }]);
            setNewExtName('');
            setNewExtInst('');
        }
    };

    const handleRemoveExternalCoAuthor = (idx: number) => {
        setExternalCoAuthors(externalCoAuthors.filter((_, i) => i !== idx));
    };

    // Step 1: HOD Action Workflow
    const handleHODDecision = (status: 'HOD Approved' | 'Rejected by HOD') => {
        if (status === 'Rejected by HOD' && !reviewRejectionReason.trim()) {
            alert('Rejection reason is mandatory.');
            return;
        }

        const targetRecord = showReviewModal;
        const updatedList = records.map(r => {
            if (r.record_id === targetRecord.record_id) {
                return {
                    ...r,
                    status,
                    hod_reviewer_id: user.id,
                    hod_reviewed_at: new Date().toISOString(),
                    hod_remarks: reviewRemarks || undefined,
                    hod_rejection_reason: status === 'Rejected by HOD' ? reviewRejectionReason : undefined,
                    updated_at: new Date().toISOString()
                };
            }
            return r;
        });

        // Add log
        const nextLogs = [...auditLog];
        nextLogs.unshift({
            log_id: `log-${Date.now()}`,
            record_id: targetRecord.record_id,
            event_type: status === 'HOD Approved' ? 'HOD_APPROVED' : 'HOD_REJECTED',
            actor_id: user.id,
            actor_role: 'HOD',
            reason: status === 'Rejected by HOD' ? reviewRejectionReason : reviewRemarks,
            created_at: new Date().toISOString(),
            snapshot: updatedList.find(r => r.record_id === targetRecord.record_id)
        });

        // Notifications logic
        const nextNots = [...notifications];
        const recordTitle = targetRecord.details?.paper_title || targetRecord.details?.book_title || targetRecord.details?.program_name || targetRecord.details?.patent_title || 'Record';
        if (status === 'HOD Approved') {
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: `HOD Approved: Record "${recordTitle}" by ${targetRecord.faculty_name} is now pending HR confirmation.`,
                timestamp: new Date().toISOString()
            });
            nextNots.unshift({
                id: `not-${Date.now() + 1}`,
                text: `Notification sent to HR: New record in HR confirmation queue: ${targetRecord.faculty_name} - ${recordTitle}.`,
                timestamp: new Date().toISOString()
            });
        } else {
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: `HOD Rejected: Record "${recordTitle}" by ${targetRecord.faculty_name} was returned for correction. Reason: ${reviewRejectionReason}`,
                timestamp: new Date().toISOString()
            });
        }

        saveToLocalStorage(updatedList, nextNots, nextLogs);
        setShowReviewModal(null);
        setReviewRemarks('');
        setReviewRejectionReason('');
    };

    // Step 2: HR Action Workflow
    const handleHRDecision = (rec: any, status: 'Verified' | 'Rejected by HR' | 'Flagged', reasonText?: string) => {
        if ((status === 'Rejected by HR' || status === 'Flagged') && !reasonText) {
            const inputReason = prompt(`Enter mandatory reason for ${status}:`);
            if (inputReason === null || !inputReason.trim()) {
                alert('Reason is mandatory.');
                return;
            }
            reasonText = inputReason;
        }

        const updatedList = records.map(r => {
            if (r.record_id === rec.record_id) {
                return {
                    ...r,
                    status,
                    hr_reviewer_id: user.id,
                    hr_reviewed_at: new Date().toISOString(),
                    hr_rejection_reason: status === 'Rejected by HR' ? reasonText : undefined,
                    verified_at: status === 'Verified' ? new Date().toISOString() : r.verified_at,
                    updated_at: new Date().toISOString()
                };
            }
            return r;
        });

        // Audit Log
        const nextLogs = [...auditLog];
        nextLogs.unshift({
            log_id: `log-${Date.now()}`,
            record_id: rec.record_id,
            event_type: status === 'Verified' ? 'HR_VERIFIED' : (status === 'Rejected by HR' ? 'HR_REJECTED' : 'FLAGGED'),
            actor_id: user.id,
            actor_role: 'HR_ADMIN',
            reason: reasonText || 'Approved by HR',
            created_at: new Date().toISOString(),
            snapshot: updatedList.find(r => r.record_id === rec.record_id)
        });

        // Notifications logic
        const nextNots = [...notifications];
        const recordTitle = rec.details?.paper_title || rec.details?.book_title || rec.details?.program_name || rec.details?.patent_title || 'Record';
        if (status === 'Verified') {
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: `HR Confirmed: Research record "${recordTitle}" by ${rec.faculty_name} is now Verified and active.`,
                timestamp: new Date().toISOString()
            });
        } else if (status === 'Rejected by HR') {
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: `HR Rejected: Record "${recordTitle}" by ${rec.faculty_name} was rejected. Reason: ${reasonText}`,
                timestamp: new Date().toISOString()
            });
            nextNots.unshift({
                id: `not-${Date.now() + 1}`,
                text: `HOD notification: HR rejected record "${recordTitle}" originally approved by HOD.`,
                timestamp: new Date().toISOString()
            });
        } else if (status === 'Flagged') {
            nextNots.unshift({
                id: `not-${Date.now()}`,
                text: `Disputed: Verified record "${recordTitle}" was Flagged and suppressed by HR. Reason: ${reasonText}`,
                timestamp: new Date().toISOString()
            });
        }

        saveToLocalStorage(updatedList, nextNots, nextLogs);
    };

    // Derive list filter parameters
    const myOwnRecords = useMemo(() => {
        return records.filter(r => r.faculty_id === user.id);
    }, [records, user.id]);

    const activeTabRecords = useMemo(() => {
        return myOwnRecords.filter(r => r.category === activeCategoryTab);
    }, [myOwnRecords, activeCategoryTab]);

    // Department filtering lists for HOD
    const hodQueueRecords = useMemo(() => {
        return records.filter(r => r.department_id === user.department && r.status === 'Submitted');
    }, [records, user.department]);

    // HR dashboard lists
    const hrApprovedQueue = useMemo(() => {
        return records.filter(r => r.status === 'HOD Approved');
    }, [records]);

    const hrAllPendingQueue = useMemo(() => {
        return records.filter(r => r.status === 'Submitted' || r.status === 'HOD Approved');
    }, [records]);

    // Verified lists count
    const myVerifiedCountByCategory = useMemo(() => {
        const counts = { PAPER_PUBLICATION: 0, PAPER_PRESENTED: 0, PROGRAM_ATTENDED: 0, BOOK_PUBLISHED: 0, PATENT: 0 };
        myOwnRecords.forEach(r => {
            if (r.status === 'Verified' && r.category in counts) {
                counts[r.category as keyof typeof counts] += 1;
            }
        });
        return counts;
    }, [myOwnRecords]);

    // Institutional overview parameters
    const totalVerifiedRecords = useMemo(() => records.filter(r => r.status === 'Verified').length, [records]);
    const totalFacultyVerifiedCount = useMemo(() => {
        const set = new Set(records.filter(r => r.status === 'Verified').map(r => r.faculty_id));
        return set.size;
    }, [records]);
    const totalPendingCount = useMemo(() => records.filter(r => r.status === 'Submitted' || r.status === 'HOD Approved').length, [records]);
    const totalRejectedCount = useMemo(() => records.filter(r => r.status.startsWith('Rejected')).length, [records]);

    // Charts calculations for Reports dashboard
    const reportDataChart = useMemo(() => {
        const academicYears = ['2023-24', '2024-25', '2025-26'];
        return academicYears.map(ay => {
            const dataItem: any = { name: ay };
            Object.keys(CATEGORY_LABELS).forEach(cat => {
                dataItem[cat] = records.filter(r => r.status === 'Verified' && r.academic_year === ay && r.category === cat).length;
            });
            return dataItem;
        });
    }, [records]);

    // R01 - Institution Research Summary Data
    const r01Data = useMemo(() => {
        const verified = records.filter(r => r.status === 'Verified');
        const categories = Object.keys(CATEGORY_LABELS);
        const map: any = {};
        categories.forEach(c => {
            map[c] = verified.filter(r => r.category === c).length;
        });
        return {
            totalVerified: verified.length,
            byCategory: map,
            totalFaculty: totalFacultyVerifiedCount,
            totalPending: totalPendingCount,
            totalRejected: totalRejectedCount
        };
    }, [records, totalFacultyVerifiedCount, totalPendingCount, totalRejectedCount]);

    // R02 - Department-wise Research Output Data
    const r02Data = useMemo(() => {
        return DEPARTMENTS.map(dept => {
            const deptRecs = records.filter(r => r.department_id === dept && r.status === 'Verified');
            const totalDeptFaculty = MOCK_EMPLOYEES.filter(e => e.department === dept).length || 1;
            const uniqueParticipatingFaculty = new Set(deptRecs.map(r => r.faculty_id)).size;
            const participationRate = Math.round((uniqueParticipatingFaculty / totalDeptFaculty) * 100);

            const catCounts: any = {};
            Object.keys(CATEGORY_LABELS).forEach(cat => {
                catCounts[cat] = deptRecs.filter(r => r.category === cat).length;
            });

            return {
                department: dept,
                participationRate,
                counts: catCounts,
                total: deptRecs.length
            };
        });
    }, [records]);

    // R06 - Aging Queue Data
    const r06AgingData = useMemo(() => {
        const pending = records.filter(r => r.status === 'Submitted' || r.status === 'HOD Approved');
        return pending.map(p => {
            const created = new Date(p.submitted_at || p.created_at);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - created.getTime());
            const daysPending = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                ...p,
                daysPending
            };
        }).sort((a, b) => b.daysPending - a.daysPending);
    }, [records]);

    // R07 - Faculty Participation Rate (Absence)
    const r07Data = useMemo(() => {
        return MOCK_EMPLOYEES.filter(emp => {
            const hasVerified = records.some(r => r.faculty_id === emp.id && r.status === 'Verified');
            return !hasVerified;
        });
    }, [records]);

    // Dynamic filtering logic for Reports View
    const filteredRecordsForReports = useMemo(() => {
        return records.filter(r => {
            if (filterAcademicYear !== 'All Years' && r.academic_year !== filterAcademicYear) return false;
            if (filterCalendarYear !== 'All Years' && r.calendar_year?.toString() !== filterCalendarYear) return false;
            if (filterDept !== 'All Departments' && r.department_id !== filterDept) return false;
            if (filterCategory !== 'All Categories' && r.category !== filterCategory) return false;
            if (filterFaculty !== 'All Faculty' && r.faculty_id !== filterFaculty) return false;
            
            // Status filter
            if (filterStatus !== 'All Statuses') {
                if (filterStatus === 'Verified' && r.status !== 'Verified') return false;
                if (filterStatus === 'Pending' && r.status !== 'Submitted' && r.status !== 'HOD Approved') return false;
                if (filterStatus === 'Rejected' && !r.status.startsWith('Rejected')) return false;
            }

            // Date Range
            if (filterDateFrom && new Date(r.publication_date) < new Date(filterDateFrom)) return false;
            if (filterDateTo && new Date(r.publication_date) > new Date(filterDateTo)) return false;

            return true;
        });
    }, [records, filterAcademicYear, filterCalendarYear, filterDept, filterCategory, filterFaculty, filterStatus, filterDateFrom, filterDateTo]);

    // Real CSV exporter simulator
    const handleExportCSV = () => {
        let headers: string[] = [];
        let rows: string[][] = [];
        let filename = 'report.csv';

        if (selectedReportId === 'R01') {
            filename = 'Institution_Research_Summary.csv';
            headers = ['Metric', 'Count'];
            rows = [
                ['Total Verified Records', r01Data.totalVerified.toString()],
                ['Paper Publications', r01Data.byCategory.PAPER_PUBLICATION.toString()],
                ['Papers Presented', r01Data.byCategory.PAPER_PRESENTED.toString()],
                ['Programs Attended', r01Data.byCategory.PROGRAM_ATTENDED.toString()],
                ['Books Published', r01Data.byCategory.BOOK_PUBLISHED.toString()],
                ['Patents Filed/Granted', r01Data.byCategory.PATENT.toString()],
                ['Total Faculty Participating', r01Data.totalFaculty.toString()],
                ['Total Pending Verification', r01Data.totalPending.toString()],
                ['Total Rejected Records', r01Data.totalRejected.toString()]
            ];
        } else if (selectedReportId === 'R02') {
            filename = 'Department_Research_Output.csv';
            headers = ['Department', 'Participation Rate (%)', 'Paper Publications', 'Papers Presented', 'Programs Attended', 'Books', 'Patents', 'Total Output'];
            rows = r02Data.map(d => [
                d.department,
                d.participationRate + '%',
                d.counts.PAPER_PUBLICATION.toString(),
                d.counts.PAPER_PRESENTED.toString(),
                d.counts.PROGRAM_ATTENDED.toString(),
                d.counts.BOOK_PUBLISHED.toString(),
                d.counts.PATENT.toString(),
                d.total.toString()
            ]);
        } else if (selectedReportId === 'R03') {
            filename = 'Faculty_Research_Output_Detailed.csv';
            headers = ['Record ID', 'Faculty Name', 'Department', 'Category', 'Record Title', 'Publication Date', 'Verification Date'];
            const verified = filteredRecordsForReports.filter(r => r.status === 'Verified');
            rows = verified.map(r => [
                r.record_id,
                r.faculty_name,
                r.department_id,
                CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS],
                r.details?.paper_title || r.details?.book_title || r.details?.program_name || r.details?.patent_title || 'N/A',
                r.publication_date,
                r.verified_at ? r.verified_at.split('T')[0] : 'N/A'
            ]);
        } else if (selectedReportId === 'R04') {
            filename = 'Verification_Status_Audit.csv';
            headers = ['Record ID', 'Faculty Name', 'Category', 'Record Title', 'Date', 'Workflow Status', 'HOD Reviewer', 'HR Reviewer'];
            rows = filteredRecordsForReports.map(r => [
                r.record_id,
                r.faculty_name,
                CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS],
                r.details?.paper_title || r.details?.book_title || r.details?.program_name || r.details?.patent_title || 'N/A',
                r.publication_date,
                r.status,
                r.hod_reviewer_id || 'N/A',
                r.hr_reviewer_id || 'N/A'
            ]);
        } else if (selectedReportId === 'R05') {
            filename = 'Category_Detailed_Audit.csv';
            headers = ['Record ID', 'Faculty Name', 'Title', 'Date', 'Identifier Info', 'Metrics/Remarks'];
            const verified = filteredRecordsForReports.filter(r => r.status === 'Verified');
            rows = verified.map(r => {
                const d = r.details || {};
                let identifier = 'N/A';
                let metric = 'N/A';
                if (r.category === 'PAPER_PUBLICATION') {
                    identifier = `ISSN: ${d.issn || d.isbn || 'N/A'}`;
                    metric = `Impact: ${d.impact_factor || '0'}`;
                } else if (r.category === 'PAPER_PRESENTED') {
                    identifier = `Venue: ${d.venue_city || 'N/A'}`;
                    metric = `Role: ${d.presenter_role || 'N/A'}`;
                } else if (r.category === 'PROGRAM_ATTENDED') {
                    identifier = `Body: ${d.organising_body || 'N/A'}`;
                    metric = `Hours: ${d.duration_hours || '0'}`;
                } else if (r.category === 'BOOK_PUBLISHED') {
                    identifier = `ISBN: ${d.isbn || 'N/A'}`;
                    metric = `Publisher: ${d.publisher_name || 'N/A'}`;
                } else if (r.category === 'PATENT') {
                    identifier = `App No: ${d.application_number || 'N/A'}`;
                    metric = `Status: ${d.patent_status || 'N/A'}`;
                }
                return [
                    r.record_id,
                    r.faculty_name,
                    d.paper_title || d.book_title || d.program_name || d.patent_title || 'N/A',
                    r.publication_date,
                    identifier,
                    metric
                ];
            });
        } else if (selectedReportId === 'R06') {
            filename = 'Pending_Verification_Ageing_Report.csv';
            headers = ['Record ID', 'Faculty Name', 'Category', 'Record Title', 'Submission Date', 'Workflow Step', 'Days Pending'];
            rows = r06AgingData.map(p => [
                p.record_id,
                p.faculty_name,
                CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS],
                p.details?.paper_title || p.details?.book_title || p.details?.program_name || p.details?.patent_title || 'N/A',
                p.submitted_at ? p.submitted_at.split('T')[0] : p.created_at.split('T')[0],
                p.status === 'Submitted' ? 'Step 1 - HOD Review' : 'Step 2 - HR Confirmation',
                p.daysPending.toString()
            ]);
        } else if (selectedReportId === 'R07') {
            filename = 'Faculty_Absence_Report.csv';
            headers = ['Employee ID', 'Faculty Name', 'Department', 'Designation'];
            rows = r07Data.map(f => [
                f.id,
                f.name,
                f.department,
                f.designation
            ]);
        }

        // Generate CSV file content
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout
            title="Research & Publication Hub"
            description="Manage research output categories, verify publications via a two-step workflow, and access comprehensive regulatory compliance reports."
            icon={BookOpen}
            showHome={true}
        >
            {/* Auto-save notification popover */}
            {autoSaveToast && (
                <div className="fixed top-6 right-6 z-50 bg-[#0F6E56] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-top-6 duration-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">{autoSaveToast}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 pb-20">
                {/* Lateral Sidebar Navigation Section */}
                <div className="lg:w-72 space-y-3 shrink-0">
                    <div className="p-4 bg-white border border-slate-200 rounded-[32px] shadow-sm">
                        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                            <div className="w-12 h-12 bg-[#000099] rounded-2xl flex items-center justify-center text-white font-black">
                                {role === 'EMPLOYEE' ? 'F' : role === 'MANAGER' ? 'H' : 'HR'}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 leading-tight uppercase tracking-tight text-sm">
                                    {role === 'EMPLOYEE' ? 'Faculty Portal' : role === 'MANAGER' ? 'HOD Review' : 'HR Control'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                    {user.name} ({user.department || 'All campus'})
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <button
                                onClick={() => setActiveSection('ess')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeSection === 'ess' 
                                    ? 'bg-[#000099] text-white shadow-md translate-x-2' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Library className="w-4 h-4" />
                                My Research ESS
                            </button>

                            {(role === 'MANAGER' || role === 'ADMIN' || role === 'HR_ADMIN') && (
                                <button
                                    onClick={() => setActiveSection('hod_queue')}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                        activeSection === 'hod_queue' 
                                        ? 'bg-[#000099] text-white shadow-md translate-x-2' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="w-4 h-4" />
                                        <span>HOD Queue</span>
                                    </div>
                                    {hodQueueRecords.length > 0 && (
                                        <span className="bg-[#FF9A01] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            {hodQueueRecords.length}
                                        </span>
                                    )}
                                </button>
                            )}

                            {(role === 'ADMIN' || role === 'HR_ADMIN') && (
                                <button
                                    onClick={() => setActiveSection('hr_dashboard')}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                        activeSection === 'hr_dashboard' 
                                        ? 'bg-[#000099] text-white shadow-md translate-x-2' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Building className="w-4 h-4" />
                                        <span>HR Verification</span>
                                    </div>
                                    {hrApprovedQueue.length > 0 && (
                                        <span className="bg-[#FF9A01] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                                            {hrApprovedQueue.length}
                                        </span>
                                    )}
                                </button>
                            )}

                            {(role === 'ADMIN' || role === 'HR_ADMIN' || role === 'MANAGER') && (
                                <button
                                    onClick={() => setActiveSection('reports')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                        activeSection === 'reports' 
                                        ? 'bg-[#000099] text-white shadow-md translate-x-2' 
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    HR Reports Hub
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Primary Content View Workspace */}
                <div className="flex-1 min-w-0">
                    
                    {/* SECTION 1: FACULTY MY RESEARCH PORTAL */}
                    {activeSection === 'ess' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Summary Badge Banner */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.keys(CATEGORY_LABELS).map((cat, idx) => {
                                    const value = myVerifiedCountByCategory[cat as keyof typeof myVerifiedCountByCategory] || 0;
                                    return (
                                        <div key={cat} className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm flex flex-col justify-between">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
                                                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                                            </span>
                                            <div className="flex items-end justify-between mt-2">
                                                <span className="text-2xl font-black text-slate-900 leading-none">{value}</span>
                                                <span className="text-[10px] font-black text-[#0F6E56] bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Verified</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Category Selector Tabs */}
                            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide border-b border-slate-200">
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveCategoryTab(key)}
                                        className={`px-6 py-3 rounded-t-[20px] text-xs font-black uppercase tracking-widest shrink-0 transition-all ${
                                            activeCategoryTab === key 
                                            ? 'bg-white border-t border-x border-slate-200 text-[#000099] -mb-[1px] relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF9A01]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Panel List */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <div>
                                        <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">
                                            {CATEGORY_LABELS[activeCategoryTab as keyof typeof CATEGORY_LABELS]} Repository
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                            Manage your {CATEGORY_LABELS[activeCategoryTab as keyof typeof CATEGORY_LABELS].toLowerCase()} files
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => handleOpenAddNew(activeCategoryTab)}
                                        className="bg-[#000099] hover:bg-blue-900 text-white rounded-2xl h-11 px-5 font-black uppercase text-xs tracking-widest shadow-sm gap-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Record
                                    </Button>
                                </div>

                                {activeTabRecords.length === 0 ? (
                                    <div className="p-16 text-center bg-white rounded-[32px] border border-slate-200">
                                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No records submitted in this category yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {activeTabRecords.map((rec) => {
                                            const title = rec.details?.paper_title || rec.details?.book_title || rec.details?.program_name || rec.details?.patent_title || 'Untitled';
                                            const subText = rec.details?.journal_name || rec.details?.event_name || rec.details?.organising_body || rec.details?.publisher_name || rec.details?.patent_office || '';
                                            const isRejected = rec.status.includes('Rejected');

                                            return (
                                                <div 
                                                    key={rec.record_id}
                                                    className={`bg-white p-5 rounded-[24px] border ${isRejected ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'} shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4`}
                                                >
                                                    <div className="space-y-1.5 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLING[rec.status as keyof typeof STATUS_STYLING] || 'bg-gray-100'}`}>
                                                                {rec.status}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                AY: {rec.academic_year}
                                                            </span>
                                                            {rec.correction_count > 0 && (
                                                                <span className="text-[9px] font-bold bg-[#FF9A01] text-white px-2 py-0.5 rounded-full">
                                                                    Resubmitted ({rec.correction_count})
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-black text-slate-800 uppercase text-md leading-tight">{title}</h4>
                                                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 flex-wrap">
                                                            <span className="text-[#000099] font-black">{subText}</span>
                                                            <span>• Published: {rec.publication_date}</span>
                                                        </p>
                                                        
                                                        {/* Rejection alert box */}
                                                        {isRejected && (
                                                            <div className="mt-3 p-3 bg-rose-100/50 border border-rose-200 rounded-xl flex items-start gap-2.5">
                                                                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="text-[10px] font-black text-rose-800 uppercase tracking-wider">Correction Required</p>
                                                                    <p className="text-xs font-bold text-rose-700 mt-0.5">
                                                                        {rec.hod_rejection_reason || rec.hr_rejection_reason || 'Please edit parameters or upload correct scan proof.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                                                        {(rec.status === 'Draft' || isRejected) ? (
                                                            <Button
                                                                onClick={() => handleOpenEdit(rec)}
                                                                className={`rounded-xl h-10 px-4 text-xs font-black uppercase tracking-wider ${
                                                                    isRejected 
                                                                    ? 'bg-[#FF9A01] text-white hover:bg-orange-600 border border-orange-300' 
                                                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                                                }`}
                                                            >
                                                                {isRejected ? 'Correct Entry' : 'Edit Draft'}
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                onClick={() => setSelectedRecordForView(rec)}
                                                                className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl h-10 px-4 text-xs font-black uppercase tracking-wider"
                                                            >
                                                                View Details
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: HOD PENDING REVIEW QUEUE */}
                    {activeSection === 'hod_queue' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">HOD Verification Queue</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    Step 1 verification filtered to department: <span className="text-[#000099] font-black">{user.department}</span>
                                </p>
                            </div>

                            {hodQueueRecords.length === 0 ? (
                                <div className="p-20 text-center bg-white rounded-[40px] border border-slate-200">
                                    <CheckCircle2 className="w-16 h-16 text-[#0F6E56]/20 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No pending approvals at the moment</p>
                                </div>
                            ) : (
                                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Member</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Submitted Date</th>
                                                    <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {hodQueueRecords.map((rec) => {
                                                    const title = rec.details?.paper_title || rec.details?.book_title || rec.details?.program_name || rec.details?.patent_title || 'Untitled';
                                                    const subDate = rec.submitted_at ? rec.submitted_at.split('T')[0] : rec.created_at.split('T')[0];
                                                    
                                                    // Calculation for aging
                                                    const dateVal = new Date(rec.submitted_at || rec.created_at);
                                                    const days = Math.ceil(Math.abs(new Date().getTime() - dateVal.getTime()) / (1000 * 60 * 60 * 24));
                                                    
                                                    return (
                                                        <tr key={rec.record_id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{rec.faculty_name}</p>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase">Faculty</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-[10px] font-black text-[#000099] bg-blue-50 px-2 py-0.5 rounded uppercase">
                                                                    {CATEGORY_LABELS[rec.category as keyof typeof CATEGORY_LABELS]}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 max-w-xs">
                                                                <p className="text-xs font-black text-slate-800 uppercase truncate" title={title}>{title}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{rec.details?.journal_name || rec.details?.publisher_name || 'N/A'}</p>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs font-bold text-slate-600">{subDate}</span>
                                                                    {days > 7 && (
                                                                        <span className="bg-rose-100 text-rose-700 text-[8px] font-black px-1.5 py-0.5 rounded" title="Pending over 7 days">
                                                                            {days}d
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <Button
                                                                    onClick={() => setShowReviewModal(rec)}
                                                                    className="bg-[#000099] hover:bg-blue-900 text-white rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-wider"
                                                                >
                                                                    Review Record
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SECTION 3: HR ADMIN CONFIRMATION HUB & NOTIFICATION LOG */}
                    {activeSection === 'hr_dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* KPI Metrics card */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified records</span>
                                    <h4 className="text-2xl font-black text-slate-900 mt-2">{totalVerifiedRecords}</h4>
                                </div>
                                <div className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participating Faculty</span>
                                    <h4 className="text-2xl font-black text-slate-900 mt-2">{totalFacultyVerifiedCount}</h4>
                                </div>
                                <div className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Verification</span>
                                    <h4 className="text-2xl font-black text-[#FF9A01] mt-2">{totalPendingCount}</h4>
                                </div>
                                <div className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rejected / Returned</span>
                                    <h4 className="text-2xl font-black text-rose-800 mt-2">{totalRejectedCount}</h4>
                                </div>
                            </div>

                            {/* Dual Queue layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                
                                {/* Left column: Queues */}
                                <div className="lg:col-span-8 space-y-6">
                                    
                                    {/* Queue 1: HOD Approved Step 2 queue */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <div>
                                                <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">HOD-Approved Queue (Step 2)</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    Awaiting final HR verification to count in compliance metrics
                                                </p>
                                            </div>
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                                                {hrApprovedQueue.length} Pending
                                            </span>
                                        </div>

                                        {hrApprovedQueue.length === 0 ? (
                                            <div className="p-12 text-center bg-white border border-slate-200 rounded-[28px]">
                                                <CheckCircle2 className="w-10 h-10 text-emerald-100 mx-auto mb-3" />
                                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No records awaiting step 2 review</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white border border-slate-200 rounded-[28px] divide-y divide-slate-100">
                                                {hrApprovedQueue.map(rec => {
                                                    const title = rec.details?.paper_title || rec.details?.book_title || rec.details?.program_name || rec.details?.patent_title || 'Untitled';
                                                    return (
                                                        <div key={rec.record_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-[#000099] uppercase tracking-wider">
                                                                    {CATEGORY_LABELS[rec.category as keyof typeof CATEGORY_LABELS]}
                                                                </p>
                                                                <h4 className="text-sm font-black text-slate-800 uppercase">{title}</h4>
                                                                <p className="text-xs font-bold text-slate-500">
                                                                    By: {rec.faculty_name} ({rec.department_id}) • HOD: Approved
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    onClick={() => handleHRDecision(rec, 'Rejected by HR')}
                                                                    variant="outline"
                                                                    className="border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl h-9 px-3 text-[10px] font-black uppercase tracking-wider"
                                                                >
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleHRDecision(rec, 'Verified')}
                                                                    className="bg-[#0F6E56] hover:bg-[#0c5946] text-white rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-wider"
                                                                >
                                                                    Confirm (Verify)
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Queue 2: Institutional Overview Queue */}
                                    <div className="space-y-3">
                                        <h3 className="text-md font-black text-slate-800 uppercase tracking-tight px-1">All Pending Submissions Overview</h3>
                                        <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="bg-slate-50 border-b border-slate-100">
                                                            <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Faculty Name</th>
                                                            <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                                            <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                                                            <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">State</th>
                                                            <th className="px-5 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {hrAllPendingQueue.map((rec) => {
                                                            const title = rec.details?.paper_title || rec.details?.book_title || rec.details?.program_name || rec.details?.patent_title || 'Untitled';
                                                            return (
                                                                <tr key={rec.record_id} className="hover:bg-slate-50/50">
                                                                    <td className="px-5 py-3.5 text-xs font-black text-slate-800 uppercase">{rec.faculty_name}</td>
                                                                    <td className="px-5 py-3.5 text-xs font-bold text-[#000099]">
                                                                        {CATEGORY_LABELS[rec.category as keyof typeof CATEGORY_LABELS]}
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-xs font-bold text-slate-500 max-w-xs truncate">{title}</td>
                                                                    <td className="px-5 py-3.5">
                                                                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_STYLING[rec.status as keyof typeof STATUS_STYLING] || 'bg-slate-100'}`}>
                                                                            {rec.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-5 py-3.5 text-right">
                                                                        <Button
                                                                            onClick={() => setSelectedRecordForView(rec)}
                                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg h-7 px-2.5 text-[9px] font-black uppercase tracking-wider"
                                                                        >
                                                                            View
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {hrAllPendingQueue.length === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="p-8 text-center text-xs font-bold text-slate-400 uppercase">
                                                                    No pending submissions in queue
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right column: Activity Notifications */}
                                <div className="lg:col-span-4 space-y-4">
                                    <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">System Notification Feed</h3>
                                    <div className="bg-white border border-slate-200 rounded-[28px] p-5 max-h-[500px] overflow-y-auto space-y-4">
                                        {notifications.map((not) => (
                                            <div key={not.id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                                                <p className="text-xs font-semibold text-slate-700 leading-relaxed">{not.text}</p>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                                                    {new Date(not.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECTION 4: 7 COMPREHENSIVE HR-FACING REPORTS */}
                    {activeSection === 'reports' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Institutional Reports Hub</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    Filter and export verified records mapping directly to NAAC and NIRF regulatory matrices
                                </p>
                            </div>

                            {/* Reports Navigation Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-slate-200 pb-4">
                                {[
                                    { id: 'R01', label: 'R01: Summary KPIs' },
                                    { id: 'R02', label: 'R02: Dept Research' },
                                    { id: 'R03', label: 'R03: Faculty Listing' },
                                    { id: 'R04', label: 'R04: Audit Status' },
                                    { id: 'R05', label: 'R05: Detail Audit' },
                                    { id: 'R06', label: 'R06: Aging Queue' },
                                    { id: 'R07', label: 'R07: Absence List' }
                                ].map((rep) => (
                                    <button
                                        key={rep.id}
                                        onClick={() => setSelectedReportId(rep.id)}
                                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all text-center ${
                                            selectedReportId === rep.id 
                                            ? 'bg-[#000099] border-[#000099] text-white shadow-sm' 
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {rep.label}
                                    </button>
                                ))}
                            </div>

                            {/* Standard Filters Segment */}
                            <div className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Academic Year</label>
                                    <select 
                                        value={filterAcademicYear} 
                                        onChange={(e) => setFilterAcademicYear(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                    >
                                        <option value="All Years">All Years</option>
                                        {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Calendar Year</label>
                                    <select 
                                        value={filterCalendarYear} 
                                        onChange={(e) => setFilterCalendarYear(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                    >
                                        <option value="All Years">All Years</option>
                                        {CALENDAR_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                                    <select 
                                        value={filterDept} 
                                        onChange={(e) => setFilterDept(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                    >
                                        <option value="All Departments">All Departments</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Research Category</label>
                                    <select 
                                        value={filterCategory} 
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                    >
                                        <option value="All Categories">All Categories</option>
                                        {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Export CSV Control Bar */}
                            <div className="flex justify-between items-center px-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Showing derived report matrix details
                                </span>
                                <Button
                                    onClick={handleExportCSV}
                                    className="bg-[#0F6E56] hover:bg-[#0c5946] text-white rounded-xl h-10 px-4 text-xs font-black uppercase tracking-widest shadow-sm gap-2"
                                >
                                    <Download className="w-4 h-4" /> Export Report CSV
                                </Button>
                            </div>

                            {/* Reports Workspace */}
                            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                                
                                {/* R01: INSTITUTION RESEARCH SUMMARY */}
                                {selectedReportId === 'R01' && (
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R01: Institution Research summary</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-5 bg-slate-50 rounded-2xl">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Total verified records</p>
                                                <p className="text-3xl font-black text-slate-800 mt-2">{r01Data.totalVerified}</p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-2xl">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Participating faculty</p>
                                                <p className="text-3xl font-black text-slate-800 mt-2">{r01Data.totalFaculty}</p>
                                            </div>
                                            <div className="p-5 bg-slate-50 rounded-2xl">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Pending review pipeline</p>
                                                <p className="text-3xl font-black text-slate-800 mt-2">{r01Data.totalPending}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-3">
                                            <h5 className="text-xs font-black text-slate-700 uppercase">Verified Counts By Category</h5>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {Object.entries(r01Data.byCategory).map(([cat, val]: any) => (
                                                    <div key={cat} className="p-4 border border-slate-100 rounded-xl">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</p>
                                                        <p className="text-lg font-black text-slate-800 mt-1">{val}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* R02: DEPARTMENT-WISE RESEARCH OUTPUT */}
                                {selectedReportId === 'R02' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R02: Department-wise output tracking</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Department</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Paper Pubs</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Presented</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">FDP/Attended</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Books</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Patents</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-center">Participation Rate</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Total Verified</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {r02Data.map(d => (
                                                        <tr key={d.department} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-3 text-xs font-black text-slate-800 uppercase">{d.department}</td>
                                                            <td className="px-4 py-3 text-xs text-center font-bold">{d.counts.PAPER_PUBLICATION}</td>
                                                            <td className="px-4 py-3 text-xs text-center font-bold">{d.counts.PAPER_PRESENTED}</td>
                                                            <td className="px-4 py-3 text-xs text-center font-bold">{d.counts.PROGRAM_ATTENDED}</td>
                                                            <td className="px-4 py-3 text-xs text-center font-bold">{d.counts.BOOK_PUBLISHED}</td>
                                                            <td className="px-4 py-3 text-xs text-center font-bold">{d.counts.PATENT}</td>
                                                            <td className="px-4 py-3 text-xs text-center">
                                                                <span className="bg-emerald-50 text-[#0F6E56] font-black px-2 py-0.5 rounded-full text-[10px]">
                                                                    {d.participationRate}%
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-xs text-right font-black text-[#000099]">{d.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* R03: FACULTY-WISE RESEARCH OUTPUT */}
                                {selectedReportId === 'R03' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R03: Faculty-wise Research Output</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Faculty Name</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Department</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Category</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Title</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Date</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Verification Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {filteredRecordsForReports.filter(r => r.status === 'Verified').map(r => {
                                                        const title = r.details?.paper_title || r.details?.book_title || r.details?.program_name || r.details?.patent_title || 'Untitled';
                                                        return (
                                                            <tr key={r.record_id} className="hover:bg-slate-50/50">
                                                                <td className="px-4 py-3 font-black text-slate-800 uppercase">{r.faculty_name}</td>
                                                                <td className="px-4 py-3 font-bold text-slate-500 uppercase">{r.department_id}</td>
                                                                <td className="px-4 py-3 text-[#000099] font-black">{CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS]}</td>
                                                                <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-xs">{title}</td>
                                                                <td className="px-4 py-3 font-bold text-slate-500">{r.publication_date}</td>
                                                                <td className="px-4 py-3 text-right font-bold text-slate-600">{r.verified_at ? r.verified_at.split('T')[0] : 'N/A'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* R04: PIPELINE VERIFICATION STATUS REPORT */}
                                {selectedReportId === 'R04' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R04: Verification Pipeline audit list</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Record ID</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Faculty Name</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Category</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Title</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Workflow Status</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Last Updated</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {filteredRecordsForReports.map(r => {
                                                        const title = r.details?.paper_title || r.details?.book_title || r.details?.program_name || r.details?.patent_title || 'Untitled';
                                                        return (
                                                            <tr key={r.record_id} className="hover:bg-slate-50/50">
                                                                <td className="px-4 py-3 font-black text-slate-400">#{r.record_id}</td>
                                                                <td className="px-4 py-3 font-black text-slate-800 uppercase">{r.faculty_name}</td>
                                                                <td className="px-4 py-3 text-slate-600 font-bold">{CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS]}</td>
                                                                <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-xs">{title}</td>
                                                                <td className="px-4 py-3">
                                                                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_STYLING[r.status as keyof typeof STATUS_STYLING] || 'bg-slate-100'}`}>
                                                                        {r.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-4 py-3 text-right text-slate-400 font-bold">{r.updated_at.split('T')[0]}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* R05: CATEGORY-WISE DEEP DIVE AUDIT */}
                                {selectedReportId === 'R05' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R05: Category Parameter Deep-Dive</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Faculty</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Category</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Title</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Indexing / Info</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Metrics</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {filteredRecordsForReports.filter(r => r.status === 'Verified').map(r => {
                                                        const d = r.details || {};
                                                        let indexingInfo = 'N/A';
                                                        let metricInfo = 'N/A';
                                                        
                                                        if (r.category === 'PAPER_PUBLICATION') {
                                                            indexingInfo = `ISSN: ${d.issn || d.isbn || 'N/A'} [${d.indexing_category || 'N/A'}]`;
                                                            metricInfo = `IF: ${d.impact_factor || '0'}`;
                                                        } else if (r.category === 'PAPER_PRESENTED') {
                                                            indexingInfo = `Event: ${d.event_name || 'N/A'} (${d.mode || 'N/A'})`;
                                                            metricInfo = `Role: ${d.presenter_role || 'N/A'}`;
                                                        } else if (r.category === 'PROGRAM_ATTENDED') {
                                                            indexingInfo = `Body: ${d.organising_body || 'N/A'}`;
                                                            metricInfo = `Hours: ${d.duration_hours || 'N/A'}`;
                                                        } else if (r.category === 'BOOK_PUBLISHED') {
                                                            indexingInfo = `ISBN: ${d.isbn || 'N/A'} [${d.publisher_name || 'N/A'}]`;
                                                            metricInfo = `Contribution: ${d.contribution_type || 'N/A'}`;
                                                        } else if (r.category === 'PATENT') {
                                                            indexingInfo = `App No: ${d.application_number || 'N/A'}`;
                                                            metricInfo = `Filing Status: ${d.patent_status || 'N/A'}`;
                                                        }

                                                        return (
                                                            <tr key={r.record_id} className="hover:bg-slate-50/50">
                                                                <td className="px-4 py-3 font-black text-slate-800 uppercase">{r.faculty_name}</td>
                                                                <td className="px-4 py-3 text-slate-500 font-bold">{CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS]}</td>
                                                                <td className="px-4 py-3 font-medium text-slate-800 truncate max-w-xs">{d.paper_title || d.book_title || d.program_name || d.patent_title}</td>
                                                                <td className="px-4 py-3 font-mono text-[10px] text-slate-600">{indexingInfo}</td>
                                                                <td className="px-4 py-3 text-right font-black text-[#0F6E56]">{metricInfo}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* R06: PENDING VERIFICATION AGEING REPORT */}
                                {selectedReportId === 'R06' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R06: Pending Verification Ageing Report</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Faculty Name</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Category</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Title</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Submission Date</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Workflow Step</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Ageing (Days)</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {r06AgingData.map(p => (
                                                        <tr key={p.record_id} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-3 font-black text-slate-800 uppercase">{p.faculty_name}</td>
                                                            <td className="px-4 py-3 text-slate-500 font-bold">{CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]}</td>
                                                            <td className="px-4 py-3 font-medium text-slate-700 truncate max-w-xs">{p.details?.paper_title || p.details?.book_title || p.details?.program_name || p.details?.patent_title}</td>
                                                            <td className="px-4 py-3 font-bold text-slate-500">{p.submitted_at?.split('T')[0] || p.created_at?.split('T')[0]}</td>
                                                            <td className="px-4 py-3 font-black text-slate-600">
                                                                {p.status === 'Submitted' ? 'Step 1 - HOD Review' : 'Step 2 - HR Confirm'}
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <span className={`font-black px-2 py-0.5 rounded ${p.daysPending > 7 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                                                                    {p.daysPending} days
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {r06AgingData.length === 0 && (
                                                        <tr>
                                                            <td colSpan={6} className="p-8 text-center text-xs font-bold text-slate-400 uppercase">
                                                                No pending records currently in queue
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* R07: FACULTY PARTICIPATION RATE (ABSENCE) */}
                                {selectedReportId === 'R07' && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">R07: Non-Participating Faculty List (Absence Report)</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100">
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Employee ID</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Faculty Name</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">Department</th>
                                                        <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase text-right">Designation</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 text-xs">
                                                    {r07Data.map(f => (
                                                        <tr key={f.id} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-3 font-mono text-slate-400">{f.id}</td>
                                                            <td className="px-4 py-3 font-black text-slate-800 uppercase">{f.name}</td>
                                                            <td className="px-4 py-3 font-bold text-slate-500 uppercase">{f.department}</td>
                                                            <td className="px-4 py-3 text-right font-medium text-slate-700">{f.designation}</td>
                                                        </tr>
                                                    ))}
                                                    {r07Data.length === 0 && (
                                                        <tr>
                                                            <td colSpan={4} className="p-8 text-center text-xs font-bold text-slate-400 uppercase">
                                                                All faculty have at least one verified research record
                                                            </td>
                                                        </tr>
                                                    )}
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

            {/* DYNAMIC FORM MODAL - CATEGORY SPECIFIC INPUTS */}
            {showFormModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-[#F8FAFC] rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-2xl text-[#000099] tracking-tighter uppercase leading-none">
                                    {isEditMode ? 'Modify Research Record' : 'Submit Research Output'}
                                </h3>
                                <p className="text-[10px] font-black text-[#FF9A01] uppercase tracking-[0.2em] mt-2 bg-orange-50 inline-block px-3 py-1 rounded-full">
                                    {CATEGORY_LABELS[formCategory as keyof typeof CATEGORY_LABELS]} parameters
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => { setShowFormModal(false); resetFormInputs(); }} 
                                className="rounded-full h-10 w-10 bg-white border border-slate-100 shadow-sm"
                            >
                                <XCircle className="w-6 h-6 text-slate-400" />
                            </Button>
                        </div>

                        {/* Modal Content Scrollable Area */}
                        <div className="p-8 overflow-y-auto space-y-6 flex-1">
                            
                            {/* Duplicate Safety Alert Indicator */}
                            {isDuplicateFound && (
                                <div className="p-4 bg-rose-100/60 border border-rose-200 rounded-[20px] flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Duplicate Detection Warning</p>
                                        <p className="text-[11px] font-bold text-rose-700 mt-0.5">
                                            A record matching this unique identifier (ISSN/ISBN/Patent Application Number) already exists in the system. Submitting may create a duplicate.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Left Side Inputs */}
                                <div className="space-y-4">
                                    
                                    {/* Parameter Forms mapping category */}
                                    {formCategory === 'PAPER_PUBLICATION' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Paper Title *</label>
                                                <input 
                                                    type="text" 
                                                    value={paperTitle} 
                                                    onChange={(e) => setPaperTitle(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none transition-all"
                                                    placeholder="Full title of the published paper"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publication Type *</label>
                                                    <select 
                                                        value={publicationType} 
                                                        onChange={(e) => setPublicationType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Journal">Journal</option>
                                                        <option value="Conference Proceedings">Conference Proceedings</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Indexing Category *</label>
                                                    <select 
                                                        value={indexingCategory} 
                                                        onChange={(e) => setIndexingCategory(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Scopus">Scopus</option>
                                                        <option value="Web of Science">Web of Science</option>
                                                        <option value="UGC CARE List 1">UGC CARE List 1</option>
                                                        <option value="UGC CARE List 2">UGC CARE List 2</option>
                                                        <option value="ABDC">ABDC</option>
                                                        <option value="Non-indexed">Non-indexed</option>
                                                        <option value="Predatory (flagged)">Predatory (flagged)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Journal / Conference Name *</label>
                                                <input 
                                                    type="text" 
                                                    value={journalName} 
                                                    onChange={(e) => setJournalName(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="e.g. IEEE Transactions on Big Data"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publisher *</label>
                                                    <input 
                                                        type="text" 
                                                        value={publisher} 
                                                        onChange={(e) => setPublisher(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                        placeholder="Springer, IEEE"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Impact Factor</label>
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        value={impactFactor} 
                                                        onChange={(e) => setImpactFactor(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formCategory === 'PAPER_PRESENTED' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Paper Title *</label>
                                                <input 
                                                    type="text" 
                                                    value={paperTitle} 
                                                    onChange={(e) => setPaperTitle(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="Full title of the paper presented"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Event Name *</label>
                                                <input 
                                                    type="text" 
                                                    value={eventName} 
                                                    onChange={(e) => setEventName(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="Conference name"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Event Type *</label>
                                                    <select 
                                                        value={eventType} 
                                                        onChange={(e) => setEventType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="International Conference">International Conference</option>
                                                        <option value="National Conference">National Conference</option>
                                                        <option value="State-level Conference">State-level Conference</option>
                                                        <option value="International Seminar">International Seminar</option>
                                                        <option value="National Seminar">National Seminar</option>
                                                        <option value="Symposium">Symposium</option>
                                                        <option value="Workshop">Workshop</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Mode of Participation *</label>
                                                    <select 
                                                        value={modeOfParticipation} 
                                                        onChange={(e) => setModeOfParticipation(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Physical">Physical</option>
                                                        <option value="Virtual">Virtual</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Presenter Role *</label>
                                                    <select 
                                                        value={presenterRole} 
                                                        onChange={(e) => setPresenterRole(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Sole Presenter">Sole Presenter</option>
                                                        <option value="Co-Presenter">Co-Presenter</option>
                                                        <option value="Session Chair">Session Chair</option>
                                                        <option value="Keynote Speaker">Keynote Speaker</option>
                                                        <option value="Invited Talk">Invited Talk</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Published in proceedings? *</label>
                                                    <select 
                                                        value={publishedInProceedings} 
                                                        onChange={(e) => setPublishedInProceedings(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="No">No</option>
                                                        <option value="Yes">Yes</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formCategory === 'PROGRAM_ATTENDED' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Program Name *</label>
                                                <input 
                                                    type="text" 
                                                    value={programName} 
                                                    onChange={(e) => setProgramName(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="Full name of FDP / course attended"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Program Type *</label>
                                                    <select 
                                                        value={programType} 
                                                        onChange={(e) => setProgramType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="FDP (Faculty Development Program)">FDP</option>
                                                        <option value="Workshop">Workshop</option>
                                                        <option value="Seminar">Seminar</option>
                                                        <option value="Conference (Attended)">Conference (Attended)</option>
                                                        <option value="MOOC / Online Course">MOOC / Online Course</option>
                                                        <option value="Certification Course">Certification Course</option>
                                                        <option value="Refresher Course">Refresher Course</option>
                                                        <option value="Orientation Program">Orientation Program</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Organising Level *</label>
                                                    <select 
                                                        value={organisingLevel} 
                                                        onChange={(e) => setOrganisingLevel(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="International">International</option>
                                                        <option value="National">National</option>
                                                        <option value="State">State</option>
                                                        <option value="Regional">Regional</option>
                                                        <option value="Institutional (External)">Institutional (External)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Funding Source *</label>
                                                    <select 
                                                        value={fundingSource} 
                                                        onChange={(e) => setFundingSource(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Self-funded">Self-funded</option>
                                                        <option value="Institution-funded">Institution-funded</option>
                                                        <option value="UGC-funded">UGC-funded</option>
                                                        <option value="AICTE-funded">AICTE-funded</option>
                                                        <option value="DST-funded">DST-funded</option>
                                                        <option value="Other Government Grant">Other Government Grant</option>
                                                        <option value="Industry Sponsored">Industry Sponsored</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Mode *</label>
                                                    <select 
                                                        value={modeOfParticipation} 
                                                        onChange={(e) => setModeOfParticipation(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Physical">Physical</option>
                                                        <option value="Virtual">Virtual</option>
                                                        <option value="Hybrid">Hybrid</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formCategory === 'BOOK_PUBLISHED' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Contribution Type *</label>
                                                    <select 
                                                        value={contributionType} 
                                                        onChange={(e) => setContributionType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Authored Book">Authored Book</option>
                                                        <option value="Edited Book">Edited Book</option>
                                                        <option value="Book Chapter">Book Chapter</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Year of Publication *</label>
                                                    <input 
                                                        type="number" 
                                                        value={yearOfPublication} 
                                                        onChange={(e) => setYearOfPublication(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Book Title *</label>
                                                <input 
                                                    type="text" 
                                                    value={bookTitle} 
                                                    onChange={(e) => setBookTitle(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="Full title of the book"
                                                />
                                            </div>
                                            {contributionType === 'Book Chapter' && (
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Chapter Title *</label>
                                                    <input 
                                                        type="text" 
                                                        value={chapterTitle} 
                                                        onChange={(e) => setChapterTitle(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                        placeholder="Contributed chapter title"
                                                    />
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publisher Name *</label>
                                                    <input 
                                                        type="text" 
                                                        value={publisherName} 
                                                        onChange={(e) => setPublisherName(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                        placeholder="e.g. McGraw Hill"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publisher Type *</label>
                                                    <select 
                                                        value={publisherType} 
                                                        onChange={(e) => setPublisherType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="International">International</option>
                                                        <option value="National">National</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {formCategory === 'PATENT' && (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Patent Title *</label>
                                                <input 
                                                    type="text" 
                                                    value={patentTitle} 
                                                    onChange={(e) => setPatentTitle(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    placeholder="Full patent title"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Patent Type *</label>
                                                    <select 
                                                        value={patentType} 
                                                        onChange={(e) => setPatentType(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Utility Patent">Utility Patent</option>
                                                        <option value="Design Patent">Design Patent</option>
                                                        <option value="Plant Patent">Plant Patent</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Patent Office *</label>
                                                    <select 
                                                        value={patentOffice} 
                                                        onChange={(e) => setPatentOffice(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Indian Patent Office (IPO)">IPO (India)</option>
                                                        <option value="USPTO (USA)">USPTO (USA)</option>
                                                        <option value="EPO (Europe)">EPO (Europe)</option>
                                                        <option value="WIPO (International PCT)">WIPO (International PCT)</option>
                                                        <option value="Other">Other Office</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Application Number *</label>
                                                    <input 
                                                        type="text" 
                                                        value={applicationNumber} 
                                                        onChange={(e) => setApplicationNumber(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                        placeholder="App registration ID"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Filing Date *</label>
                                                    <input 
                                                        type="date" 
                                                        value={filingDate} 
                                                        onChange={(e) => setFilingDate(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Patent Status *</label>
                                                    <select 
                                                        value={patentStatus} 
                                                        onChange={(e) => setPatentStatus(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-4 text-xs font-black"
                                                    >
                                                        <option value="Filed">Filed</option>
                                                        <option value="Published">Published</option>
                                                        <option value="Granted">Granted</option>
                                                        <option value="Commercialised">Commercialised</option>
                                                        <option value="Abandoned">Abandoned</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Grant Date</label>
                                                    <input 
                                                        type="date" 
                                                        value={grantDate} 
                                                        onChange={(e) => setGrantDate(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-2xl py-3 px-4 text-xs font-black outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>

                                {/* Right Side Inputs */}
                                <div className="space-y-4">
                                    
                                    {/* Conditional and Meta Parameter logic */}
                                    <div className="space-y-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata & Conditional fields</h5>
                                        
                                        {/* Journal ISSN / Conference ISBN conditional mapping */}
                                        {formCategory === 'PAPER_PUBLICATION' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {publicationType === 'Journal' ? (
                                                    <div className="space-y-1 col-span-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">ISSN *</label>
                                                        <input 
                                                            type="text" 
                                                            value={issn} 
                                                            onChange={(e) => setIssn(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="Format: 0000-0000"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1 col-span-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">ISBN *</label>
                                                        <input 
                                                            type="text" 
                                                            value={isbn} 
                                                            onChange={(e) => setIsbn(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="Format: 978-X-XX..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Presented Proceedings link */}
                                        {formCategory === 'PAPER_PRESENTED' && (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Venue City *</label>
                                                        <input 
                                                            type="text" 
                                                            value={venueCity} 
                                                            onChange={(e) => setVenueCity(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Organising Institution *</label>
                                                        <input 
                                                            type="text" 
                                                            value={organisingBody} 
                                                            onChange={(e) => setOrganisingBody(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                        />
                                                    </div>
                                                </div>
                                                {publishedInProceedings === 'Yes' && (
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Link to Publication ID (Optional)</label>
                                                        <input 
                                                            type="text" 
                                                            value={linkedPublicationRecordId} 
                                                            onChange={(e) => setLinkedPublicationRecordId(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="e.g. rec-001"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* MOOC platform conditional fields */}
                                        {formCategory === 'PROGRAM_ATTENDED' && (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Hours *</label>
                                                        <input 
                                                            type="number" 
                                                            value={durationHours} 
                                                            onChange={(e) => setDurationHours(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Duration Days *</label>
                                                        <input 
                                                            type="number" 
                                                            value={durationDays} 
                                                            onChange={(e) => setDurationDays(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                        />
                                                    </div>
                                                </div>
                                                {programType === 'MOOC / Online Course' && (
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">MOOC Platform *</label>
                                                        <input 
                                                            type="text" 
                                                            value={moocPlatform} 
                                                            onChange={(e) => setMoocPlatform(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="Coursera, NPTEL, Swayam"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Book Chapters pages */}
                                        {formCategory === 'BOOK_PUBLISHED' && (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">ISBN-13 *</label>
                                                        <input 
                                                            type="text" 
                                                            value={isbn} 
                                                            onChange={(e) => setIsbn(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="978-..."
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publisher Country *</label>
                                                        <input 
                                                            type="text" 
                                                            value={publisherCountry} 
                                                            onChange={(e) => setPublisherCountry(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                        />
                                                    </div>
                                                </div>
                                                {contributionType === 'Book Chapter' && (
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Chapter Page numbers *</label>
                                                        <input 
                                                            type="text" 
                                                            value={pageNumbers} 
                                                            onChange={(e) => setPageNumbers(e.target.value)}
                                                            className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black"
                                                            placeholder="e.g. 45-67"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Patent Commercialisation details */}
                                        {formCategory === 'PATENT' && patentStatus === 'Commercialised' && (
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Commercialisation details *</label>
                                                <textarea 
                                                    value={commercialisationDetails} 
                                                    onChange={(e) => setCommercialisationDetails(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black h-16 outline-none resize-none"
                                                    placeholder="Licensing agent details and revenue details"
                                                />
                                            </div>
                                        )}

                                        {/* Date field */}
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Publication/Event/Filing Date *</label>
                                            <input 
                                                type="date" 
                                                value={formDate} 
                                                onChange={(e) => setFormDate(e.target.value)}
                                                className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2 px-3 text-xs font-black outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Dual scans upload rules for Books */}
                                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                            <span>Document Proof Scan Files</span>
                                            <span className="text-slate-400 normal-case italic font-medium">(PDF/JPG, Max 5MB)</span>
                                        </h5>
                                        
                                        {formCategory === 'BOOK_PUBLISHED' ? (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Cover Page *</label>
                                                    <input 
                                                        type="text"
                                                        value={proofFile1}
                                                        onChange={(e) => setProofFile1(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                                        placeholder="cover_page_scan.pdf"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Copyright/ISBN Page *</label>
                                                    <input 
                                                        type="text"
                                                        value={proofFile2}
                                                        onChange={(e) => setProofFile2(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                                        placeholder="copyright_scan.pdf"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Upload Scan File *</label>
                                                <input 
                                                    type="text"
                                                    value={proofFile1}
                                                    onChange={(e) => setProofFile1(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                                    placeholder="first_page_scan.pdf"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Multi-Select internal / Repeatable external co-authors */}
                                    <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Co-authors & Contributors</h5>
                                        
                                        {/* Internal Co-Authors */}
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Internal Co-authors</label>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {internalCoAuthors.map(n => (
                                                    <span key={n} className="bg-blue-50 text-[#000099] border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                                                        <span>{n}</span>
                                                        <button type="button" onClick={() => handleRemoveInternalCoAuthor(n)} className="text-slate-400 hover:text-red-500">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <select 
                                                onChange={(e) => { if(e.target.value) { handleAddInternalCoAuthor(e.target.value); e.target.value = ''; } }}
                                                className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-xs font-black"
                                            >
                                                <option value="">-- Add Internal Faculty --</option>
                                                {MOCK_EMPLOYEES.map(emp => (
                                                    <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* External Co-Authors */}
                                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                                            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">External Co-authors</label>
                                            <div className="space-y-1.5 mb-2">
                                                {externalCoAuthors.map((ext, idx) => (
                                                    <div key={idx} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-xl text-[10px] font-black">
                                                        <span className="text-slate-800">{ext.name} ({ext.institution})</span>
                                                        <button type="button" onClick={() => handleRemoveExternalCoAuthor(idx)} className="text-slate-400 hover:text-red-500">×</button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Name" 
                                                    value={newExtName}
                                                    onChange={(e) => setNewExtName(e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-black flex-1"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Institution" 
                                                    value={newExtInst}
                                                    onChange={(e) => setNewExtInst(e.target.value)}
                                                    className="bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-black flex-1"
                                                />
                                                <Button 
                                                    type="button" 
                                                    onClick={handleAddExternalCoAuthor}
                                                    className="bg-[#FF9A01] text-white rounded-xl h-8 px-3 font-black text-xs"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-8 pt-0 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <Button 
                                variant="outline" 
                                onClick={() => { setShowFormModal(false); resetFormInputs(); }} 
                                className="rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest border-slate-200 text-slate-500"
                            >
                                Discard
                            </Button>
                            
                            {formStatus === 'Draft' && (
                                <Button 
                                    onClick={() => handleFormSubmit(false)} 
                                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest"
                                >
                                    Save as Draft
                                </Button>
                            )}

                            <Button 
                                onClick={() => handleFormSubmit(true)} 
                                className="bg-[#000099] hover:bg-blue-900 text-white rounded-2xl px-8 h-11 font-black uppercase text-xs tracking-widest shadow-md"
                            >
                                Final Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAIL READ-ONLY MODAL */}
            {selectedRecordForView && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
                        
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_STYLING[selectedRecordForView.status as keyof typeof STATUS_STYLING] || 'bg-gray-100'}`}>
                                    {selectedRecordForView.status}
                                </span>
                                <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight mt-3">
                                    {selectedRecordForView.details?.paper_title || selectedRecordForView.details?.book_title || selectedRecordForView.details?.program_name || selectedRecordForView.details?.patent_title || 'Untitled'}
                                </h3>
                                <p className="text-[10px] font-bold text-[#000099] uppercase tracking-widest mt-1">
                                    {CATEGORY_LABELS[selectedRecordForView.category as keyof typeof CATEGORY_LABELS]} Details
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setSelectedRecordForView(null)} 
                                className="rounded-full h-10 w-10 bg-slate-100"
                            >
                                <XCircle className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-5 text-xs text-slate-700">
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Faculty Member</p>
                                    <p className="font-black text-slate-800 uppercase mt-0.5">{selectedRecordForView.faculty_name}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Department</p>
                                    <p className="font-black text-slate-800 uppercase mt-0.5">{selectedRecordForView.department_id}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Academic Year</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedRecordForView.academic_year}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Date of Publication</p>
                                    <p className="font-bold text-slate-800 mt-0.5">{selectedRecordForView.publication_date}</p>
                                </div>
                            </div>

                            {/* Category dynamic rendering */}
                            <div className="space-y-3 pb-4 border-b border-slate-100">
                                <h5 className="font-black text-slate-800 uppercase tracking-wide">Category Parameters</h5>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(selectedRecordForView.details || {}).map(([k, val]: any) => (
                                        <div key={k}>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{k.replace(/_/g, ' ')}</p>
                                            <p className="font-bold text-slate-800 mt-0.5">{val?.toString() || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Co-Authors dynamic rendering */}
                            {selectedRecordForView.co_authors?.length > 0 && (
                                <div className="space-y-2 pb-4 border-b border-slate-100">
                                    <h5 className="font-black text-slate-800 uppercase tracking-wide">Co-Authors</h5>
                                    <div className="space-y-1">
                                        {selectedRecordForView.co_authors.map((c: any, idx: number) => (
                                            <p key={idx} className="font-bold text-slate-600">
                                                • {c.name} <span className="text-[10px] text-slate-400">({c.type} - {c.institution})</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* File attachments rendering */}
                            <div className="space-y-2">
                                <h5 className="font-black text-slate-800 uppercase tracking-wide">Scan Proof Document Attachment</h5>
                                <div className="flex gap-4">
                                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex-1 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#000099]" />
                                            <div>
                                                <p className="font-black text-slate-800 text-[11px] uppercase">Proof File 1</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedRecordForView.proof_document_1_url || 'first_page_scan.pdf'}</p>
                                            </div>
                                        </div>
                                        <button className="text-slate-400 hover:text-[#000099]"><Download className="w-4 h-4" /></button>
                                    </div>
                                    {selectedRecordForView.proof_document_2_url && (
                                        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex-1 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-[#000099]" />
                                                <div>
                                                    <p className="font-black text-slate-800 text-[11px] uppercase">Proof File 2</p>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedRecordForView.proof_document_2_url}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-[#000099]"><Download className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dispute/Flagging tools for HR */}
                        {(role === 'ADMIN' || role === 'HR_ADMIN') && selectedRecordForView.status === 'Verified' && (
                            <div className="p-8 pt-0 bg-slate-50 flex justify-end gap-2 border-t border-slate-100">
                                <Button
                                    onClick={() => {
                                        handleHRDecision(selectedRecordForView, 'Flagged');
                                        setSelectedRecordForView(null);
                                    }}
                                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-10 px-5 font-black uppercase text-xs tracking-wider"
                                >
                                    Dispute (Flag Record)
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* HOD REVIEW MODAL (STEP 1) */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-[#F8FAFC] rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-200">
                        
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <h3 className="font-black text-xl text-[#000099] tracking-tighter uppercase leading-none">HOD Review Details</h3>
                                <p className="text-[10px] font-black text-[#FF9A01] uppercase tracking-[0.2em] mt-2">
                                    Step 1 verification matrix for department faculty
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => setShowReviewModal(null)} 
                                className="rounded-full h-10 w-10 bg-white"
                            >
                                <XCircle className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-xs">
                            <div className="bg-white p-5 rounded-[24px] border border-slate-200 space-y-4">
                                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Faculty Member</p>
                                        <p className="font-black text-slate-800 uppercase mt-0.5">{showReviewModal.faculty_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Category</p>
                                        <p className="font-black text-[#000099] uppercase mt-0.5">{CATEGORY_LABELS[showReviewModal.category as keyof typeof CATEGORY_LABELS]}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase">Record Title</p>
                                        <p className="font-black text-slate-900 uppercase mt-0.5">
                                            {showReviewModal.details?.paper_title || showReviewModal.details?.book_title || showReviewModal.details?.program_name || showReviewModal.details?.patent_title || 'Untitled'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(showReviewModal.details || {}).map(([key, val]: any) => (
                                        <div key={key}>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">{key.replace(/_/g, ' ')}</p>
                                            <p className="font-bold text-slate-800 mt-0.5">{val?.toString() || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Document Scan proof viewer block */}
                            <div className="p-4 bg-slate-100 border border-slate-200 rounded-[20px] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-[#000099]" />
                                    <div>
                                        <p className="font-black text-slate-800 text-[11px] uppercase">Proof Document scan scan</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{showReviewModal.proof_document_1_url || 'scan_copy.pdf'}</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="border-slate-200 text-slate-600 bg-white h-9 rounded-xl text-[10px] font-black uppercase">
                                    Preview Scan
                                </Button>
                            </div>

                            {/* Verification forms inputs */}
                            <div className="space-y-4 pt-4 border-t border-slate-200/50">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block">Reviewer Remarks (HOD internal comments)</label>
                                    <textarea 
                                        value={reviewRemarks}
                                        onChange={(e) => setReviewRemarks(e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-[#000099] rounded-xl py-2.5 px-4 text-xs font-bold outline-none resize-none h-16"
                                        placeholder="Add private audit notes here..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-rose-800 uppercase tracking-wide block">HOD Rejection Reason * (Required only if rejecting)</label>
                                    <textarea 
                                        value={reviewRejectionReason}
                                        onChange={(e) => setReviewRejectionReason(e.target.value)}
                                        className="w-full bg-white border border-rose-200 focus:border-rose-600 rounded-xl py-2.5 px-4 text-xs font-bold outline-none resize-none h-16"
                                        placeholder="Enter mandatory correction comments if returning record..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-8 pt-0 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowReviewModal(null)} 
                                className="rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest border-slate-200 text-slate-500"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => handleHODDecision('Rejected by HOD')} 
                                className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl px-6 h-11 font-black uppercase text-xs tracking-widest"
                            >
                                Reject & Return
                            </Button>
                            <Button 
                                onClick={() => handleHODDecision('HOD Approved')} 
                                className="bg-[#000099] hover:bg-blue-900 text-white rounded-2xl px-8 h-11 font-black uppercase text-xs tracking-widest"
                            >
                                Approve & Forward
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </Layout>
    );
};

export default ResearchPublication;
