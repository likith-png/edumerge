export interface Group {
    id: number;
    uuid: string;
    name: string;
    classYear: string;
    academicYear: string;
    students: { id: string; name: string }[];
    teachers: string[];
    isActive: boolean;
}

export interface Communication {
    id: number;
    uuid: string;
    type: 'homework' | 'classwork';
    title: string;
    description: string;
    subject: string;
    sender_id: string;
    sender_name: string;
    recipient_groups: { groupId: string; groupName: string; studentCount: number }[];
    sent_time: string;
    deadline: string;
    read_by: { studentId: string; readTime: string }[];
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface Config {
    oneTimeSendEnabled: boolean;
    sendTime: string;
    appliesTo: ('homework' | 'classwork')[];
}

export interface ActivityLog {
    id: number;
    uuid: string;
    type: 'homework' | 'classwork';
    title: string;
    description: string;
    subject: string;
    senderName: string;
    senderId: string;
    sentTime: string;
    deadline: string;
    recipientGroups: { groupId: string; groupName: string; studentCount: number }[];
    readByCount: number;
}

export interface AcademicReport {
    classWise: Record<string, { subjects: Record<string, number>; total: number }>;
    subjectWise: Record<string, number>;
    departmentWise: Record<string, number>;
    grandTotal: number;
}

// Service Methods
export const getConfig = async (): Promise<Config> => {
    const response = await fetch('/api/academic/config');
    if (!response.ok) throw new Error('Failed to fetch consolidation configuration');
    return response.json();
};

export const saveConfig = async (config: Config): Promise<any> => {
    const response = await fetch('/api/academic/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    if (!response.ok) throw new Error('Failed to save configuration');
    return response.json();
};

export const getGroups = async (): Promise<{ data: Group[] }> => {
    const response = await fetch('/api/academic/groups');
    if (!response.ok) throw new Error('Failed to fetch recipient groups');
    return response.json();
};

export const sendCommunication = async (data: {
    type: 'homework' | 'classwork';
    title: string;
    description?: string;
    subject: string;
    senderId: string;
    senderName: string;
    recipientGroups: { groupId: string; groupName: string; studentCount: number }[];
    deadline: string;
}): Promise<any> => {
    const response = await fetch('/api/academic/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to send communication');
    }
    return response.json();
};

export const getCommunications = async (role: string, studentId?: string): Promise<{ data: Communication[] }> => {
    const url = `/api/academic/communications?role=${role}${studentId ? `&studentId=${studentId}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch communications');
    return response.json();
};

export const getCommunicationDetails = async (uuid: string): Promise<{ data: Communication }> => {
    const response = await fetch(`/api/academic/communications/${uuid}`);
    if (!response.ok) throw new Error('Failed to fetch communication details');
    return response.json();
};

export const updateCommunication = async (
    uuid: string,
    data: { title: string; description: string; deadline: string }
): Promise<any> => {
    const response = await fetch(`/api/academic/communications/${uuid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update communication');
    }
    return response.json();
};

export const deleteCommunication = async (uuid: string): Promise<any> => {
    const response = await fetch(`/api/academic/communications/${uuid}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete communication');
    return response.json();
};

export const markAsRead = async (uuid: string, studentId: string): Promise<any> => {
    const response = await fetch(`/api/academic/communications/${uuid}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
    });
    if (!response.ok) throw new Error('Failed to mark communication as read');
    return response.json();
};

export const getLogs = async (): Promise<{ data: ActivityLog[] }> => {
    const response = await fetch('/api/academic/logs');
    if (!response.ok) throw new Error('Failed to fetch activity logs');
    return response.json();
};

export const getReports = async (): Promise<{ data: AcademicReport }> => {
    const response = await fetch('/api/academic/reports');
    if (!response.ok) throw new Error('Failed to generate academic reports');
    return response.json();
};

export const getTeacherSubjects = async (teacherId: string): Promise<{ subjects: string[] }> => {
    const response = await fetch(`/api/academic/subjects/${teacherId}`);
    if (!response.ok) throw new Error('Failed to fetch teacher subjects');
    return response.json();
};
