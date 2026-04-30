export interface Publication {
    id: string;
    employee_id: number;
    title: string;
    type: 'Journal' | 'Conference' | 'Book' | 'Book Chapter';
    journal_name?: string;
    issn_isbn?: string;
    indexing?: 'UGC CARE' | 'Scopus' | 'Web of Science' | 'Other';
    is_peer_reviewed?: boolean;
    ugc_care_listed?: boolean;
    impact_factor?: number;
    authorship: 'Principal' | 'Corresponding' | 'Co-Author';
    date: string;
    status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
    reviewer_comments?: string;
    submission_mode?: 'Online' | 'Offline';
    attachment_path?: string;
    employee_name?: string;
    department?: string;
    designation?: string;
    citations?: number;
}

export const submitPublication = async (data: any) => {
    const response = await fetch('/api/research/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to submit publication');
    return response.json();
};

export const getMyPublications = async (employeeId: number) => {
    const response = await fetch(`/api/research/my/${employeeId}`);
    if (!response.ok) throw new Error('Failed to fetch publications');
    return response.json();
};

export const getAllPublications = async () => {
    const response = await fetch('/api/research/all');
    if (!response.ok) throw new Error('Failed to fetch all publications');
    return response.json();
};

export const getResearchAnalytics = async () => {
    const response = await fetch('/api/research/analytics');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
};

export const reviewPublication = async (id: number, data: { status: string, reviewer_comments: string, approved_by: number }) => {
    const response = await fetch(`/api/research/review/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to review publication');
    return response.json();
};
