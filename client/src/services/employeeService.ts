export interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    department: string;
}

export const getAllEmployees = async () => {
    const response = await fetch('/api/employee');
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
};
