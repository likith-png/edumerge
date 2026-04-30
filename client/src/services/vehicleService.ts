const BASE = '/api/vehicle';

export interface Vehicle {
    id: number;
    reg_number: string;
    vehicle_type: 'BUS' | 'VAN' | 'CAR' | 'TEMPO' | 'TWO_WHEELER' | 'OTHER';
    make_model: string;
    year: number;
    fuel_type: string;
    seating_capacity: number;
    ownership_type: 'OWNED' | 'HIRED' | 'LEASED';
    status: 'ACTIVE' | 'MAINTENANCE' | 'GROUNDED' | 'DECOMMISSIONED';
    chassis_number: string;
    engine_number: string;
    purchase_date: string;
    campus: string;
    operator_name: string;
    tank_capacity: number;
    mileage_standard: number;
    created_at: string;
}

export interface VehicleDoc {
    doc_id: number;
    vehicle_id: number;
    reg_number: string;
    vehicle_type: string;
    make_model: string;
    vehicle_status: string;
    doc_type: string;
    expiry_date: string;
    issue_date: string;
    issuing_authority: string;
    rag_status: 'COMPLIANT' | 'WARNING' | 'CRITICAL' | 'EXPIRED';
    days_to_expiry: number;
}

export interface MaintenanceRecord {
    id: number;
    vehicle_id: number;
    reg_number: string;
    make_model: string;
    maintenance_type: string;
    service_date: string;
    description: string;
    vendor: string;
    cost: number;
    odometer_reading: number;
    next_service_due: string;
    status: string;
    work_order_no: string;
}

export interface FuelLog {
    id: number;
    vehicle_id: number;
    reg_number: string;
    make_model: string;
    fuel_date: string;
    litres: number;
    price_per_litre: number;
    total_cost: number;
    odometer_at_fuelling: number;
    vendor: string;
    payment_mode: string;
    logged_by: string;
    anomaly_flag: 'NONE' | 'OVER_FUELLING' | 'MILEAGE_DROP' | 'UNAPPROVED_VENDOR' | 'DUPLICATE' | 'WEEKEND';
    anomaly_details: string;
}

export interface DriverProfile {
    id: number;
    driver_name: string;
    dl_number: string;
    dl_category: string;
    dl_expiry: string;
    blood_group: string;
    badge_number: string;
    assigned_vehicle_id: number;
    reg_number: string;
    make_model: string;
    status: string;
}

export interface Route {
    id: number;
    route_name: string;
    route_code: string;
    vehicle_id: number;
    driver_id: number;
    stops: string[];
    total_distance_km: number;
    students_count: number;
    status: string;
    reg_number: string;
    driver_name: string;
}

export interface FeeRecord {
    id: number;
    student_name: string;
    student_id: string;
    route_id: number;
    route_name: string;
    monthly_fee: number;
    fee_term: string;
    status: 'PAID' | 'PENDING' | 'OVERDUE';
    due_date: string;
    paid_date: string;
    amount_paid: number;
}

export interface Trip {
    id: number;
    vehicle_id: number;
    reg_number: string;
    make_model: string;
    driver_name: string;
    route_name: string;
    trip_type: string;
    start_time: string;
    end_time: string;
    distance_km: number;
    trip_status: string;
    students_count: number;
    trip_cost: number;
}

export interface FastagLog {
    id: number;
    vehicle_id: number;
    reg_number: string;
    tag_id: string;
    provider: string;
    balance: number;
    status: string;
}

export interface ChallanRecord {
    id: number;
    vehicle_id: number;
    reg_number: string;
    driver_id?: number;
    driver_name?: string;
    challan_number: string;
    violation_type: string;
    location: string;
    penalty_amount: number;
    status: string;
    issue_date: string;
}

const get = (url: string) => fetch(BASE + url).then(r => r.json());
const post = (url: string, body: any) =>
    fetch(BASE + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());
const patch = (url: string, body: any) =>
    fetch(BASE + url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const vehicleService = {
    getDashboard: () => get('/dashboard'),

    // Fleet
    getFleet: () => get('/fleet'),
    addVehicle: (data: Partial<Vehicle>) => post('/fleet', data),
    updateStatus: (id: number, status: string) => patch(`/fleet/${id}/status`, { status }),

    // Compliance
    getCompliance: () => get('/compliance'),
    addDocument: (data: any) => post('/documents', data),
    updateDocument: (id: number, data: any) => patch(`/documents/${id}`, data),

    // Maintenance
    getMaintenance: () => get('/maintenance'),
    addMaintenance: (data: any) => post('/maintenance', data),

    // Fuel
    getFuel: () => get('/fuel'),
    addFuel: (data: any) => post('/fuel', data),

    // Drivers
    getDrivers: () => get('/drivers'),
    addDriver: (data: any) => post('/drivers', data),
    assignDriver: (driverId: number, vehicleId: number) => patch(`/drivers/${driverId}/assign`, { vehicle_id: vehicleId }),

    // Routes
    getRoutes: () => get('/routes'),
    addRoute: (data: any) => post('/routes', data),

    // Fees
    getFees: () => get('/fees'),
    addFee: (data: any) => post('/fees', data),
    markPaid: (id: number, amount: number) => patch(`/fees/${id}/pay`, { amount_paid: amount }),

    // Trips
    getTrips: () => get('/trips'),
    logTrip: (data: any) => post('/trips', data),

    // Analytics
    getAnalytics: () => get('/analytics'),

    // Tolls & Fines
    getTollsAndFines: () => get('/tolls_fines'),
    payChallan: (id: number) => patch(`/challans/${id}/pay`, {})
};
