// Calculate settlement for an exit
export const calculateSettlement = async (exitId: number, overrides?: any) => {
    const response = await fetch(`/api/exit/${exitId}/settlement/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(overrides || {})
    });
    if (!response.ok) throw new Error('Failed to calculate settlement');
    return response.json();
};

// Get settlement details for an exit
export const getSettlementDetails = async (exitId: number) => {
    const response = await fetch(`/api/exit/${exitId}/settlement`);
    if (!response.ok) throw new Error('Settlement not found');
    return response.json();
};

// Update settlement values (HR can modify)
export const updateSettlement = async (exitId: number, data: any) => {
    const response = await fetch(`/api/exit/${exitId}/settlement`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update settlement');
    return response.json();
};

// Approve settlement
export const approveSettlement = async (exitId: number, approvedBy?: number) => {
    const response = await fetch(`/api/exit/${exitId}/settlement/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved_by: approvedBy || 1 })
    });
    if (!response.ok) throw new Error('Failed to approve settlement');
    return response.json();
};

// Process payment (mark as paid)
export const processPayment = async (exitId: number, paymentReference: string) => {
    const response = await fetch(`/api/exit/${exitId}/settlement/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_reference: paymentReference })
    });
    if (!response.ok) throw new Error('Failed to process payment');
    return response.json();
};

// Send settlement notification to employee
export const sendSettlementNotification = async (exitId: number) => {
    const response = await fetch(`/api/exit/${exitId}/settlement/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to send notification');
    return response.json();
};
