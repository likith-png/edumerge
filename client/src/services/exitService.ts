


export const terminateEmployee = async (data: {
    employee_id: number,
    reason: string,
    lwd_proposed: string,
    comments: string,
    resignation_type: 'Termination'
}) => {
    const response = await fetch('/api/exit/terminate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to terminate employee');
    }
    return response.json();
};

export const submitResignation = async (data: {
    employee_id?: number,
    reason: string,
    lwd_proposed: string,
    comments: string,
    resignation_type?: string,
    attachment_url?: string
}) => {
    const response = await fetch('/api/exit/resign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: data.employee_id || 1, ...data })
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to submit resignation');
    }
    return response.json();
};

export const getExitDetails = async (id: number) => {
    const response = await fetch(`/api/exit/${id}`);
    if (!response.ok) throw new Error('Failed to fetch exit details');
    return response.json();
};

export const getAllExits = async () => {
    const response = await fetch('/api/exit');
    if (!response.ok) throw new Error('Failed to fetch exits');
    return response.json();
};

export const updateExitStatus = async (id: number, data: { status: 'Approved' | 'Rejected' | 'Withdrawn', lwd_approved?: string, comments?: string, approver_role?: string }) => {
    const response = await fetch(`/api/exit/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update exit status');
    return response.json();
};

export const updateNOCStatus = async (id: number, data: { status: string, remarks?: string, cleared_by?: number }) => {
    const response = await fetch(`/api/exit/noc/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update NOC status');
    return response.json();
};

export const getNOCRequests = async (department?: string) => {
    const url = department ? `/api/exit/noc/list?department=${department}` : '/api/exit/noc/list';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch NOC requests');
    return response.json();
};

export const getHandoverItems = async (exitId: number) => {
    const response = await fetch(`/api/exit/${exitId}/handover`);
    if (!response.ok) throw new Error('Failed to fetch handover items');
    return response.json();
};

export const addHandoverItem = async (data: { exit_id: number, item_name: string, category: string, assigned_to?: number }) => {
    const response = await fetch('/api/exit/handover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add handover item');
    return response.json();
};

export const getExitInterview = async (exitId: number) => {
    const response = await fetch(`/api/exit/${exitId}/interview`);
    if (!response.ok) throw new Error('Failed to fetch interview');
    return response.json();
};

export const updateExitInterview = async (id: number, data: { answer: string, rating: number }) => {
    const response = await fetch(`/api/exit/interview/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update interview');
    return response.json();
};

export const getSettlement = async (exitId: number) => {
    const response = await fetch(`/api/exit/${exitId}/settlement`);
    if (!response.ok) throw new Error('Failed to fetch settlement');
    return response.json();
};

export const updateSettlement = async (id: number, data: any) => {
    const response = await fetch(`/api/exit/settlement/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update settlement');
    return response.json();
};

export const updateHandoverStatus = async (itemId: number, status: string, proof_url?: string) => {
    const response = await fetch(`/api/exit/handover/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, proof_url })
    });
    if (!response.ok) throw new Error('Failed to update item status');
    return response.json();
};

export const verifyHandoverItem = async (itemId: number) => {
    const response = await fetch(`/api/exit/handover/${itemId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified_by: 1 }) // Mock ID
    });
    if (!response.ok) throw new Error('Failed to verify item');
    return response.json();
};
export const deferResignation = async (id: number, data: { deferment_date: string, reason: string }) => {
    const response = await fetch(`/api/exit/${id}/defer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to defer resignation');
    return response.json();
};

export const modifyResignation = async (id: number, data: { reason: string, lwd_proposed: string }) => {
    const response = await fetch(`/api/exit/${id}/modify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to modify resignation');
    return response.json();
};

export const assignSuccessor = async (id: number, successor_id: number) => {
    const response = await fetch(`/api/exit/${id}/successor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ successor_id })
    });
    if (!response.ok) throw new Error('Failed to assign successor');
    return response.json();
};

export const calculateShortfall = async (id: number) => {
    const response = await fetch(`/api/exit/${id}/calculate-shortfall`, {
        method: 'PATCH'
    });
    if (!response.ok) throw new Error('Failed to calculate shortfall');
    return response.json();
};

export const requestWaiver = async (id: number, reason: string) => {
    const response = await fetch(`/api/exit/${id}/waiver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
    });
    if (!response.ok) throw new Error('Failed to request waiver');
    return response.json();
};

export const approveWaiver = async (id: number, approved: boolean) => {
    const response = await fetch(`/api/exit/${id}/waiver-approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
    });
    if (!response.ok) throw new Error('Failed to approve waiver');
    return response.json();
};


export const getExitConfig = async () => {
    const response = await fetch('/api/exit/config');
    if (!response.ok) throw new Error('Failed to fetch configuration');
    return response.json();
};

export const updateExitConfig = async (config: any) => {
    const response = await fetch('/api/exit/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    });
    if (!response.ok) throw new Error('Failed to update configuration');
    return response.json();
};
