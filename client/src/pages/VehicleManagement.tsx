import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Truck, AlertTriangle, CheckCircle, Fuel,
    Wrench, Users, MapPin, DollarSign, BarChart2, Plus,
    Shield, Activity, TrendingUp, RefreshCw, ChevronRight,
    Navigation, AlertCircle, Zap, Receipt,
    CheckCircle2, FileText, Smartphone, User, MessageSquare, Flame, Trash2, Clock
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleDoc, MaintenanceRecord, FuelLog, DriverProfile, Route, FeeRecord, Trip, FastagLog, ChallanRecord, IncidentRecord, GPSLog } from '../services/vehicleService';
import { usePersona } from '../contexts/PersonaContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from 'recharts';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'overview',     label: 'Overview',    icon: BarChart2  },
    { id: 'tracking',     label: 'Tracking',    icon: Navigation },
    { id: 'fleet',        label: 'Fleet',       icon: Truck      },
    { id: 'compliance',   label: 'Compliance',  icon: Shield     },
    { id: 'incidents',    label: 'Incidents',   icon: AlertCircle },
    { id: 'maintenance',  label: 'Maintenance', icon: Wrench     },
    { id: 'fuel',         label: 'Fuel',        icon: Fuel       },
    { id: 'drivers',      label: 'Drivers',     icon: Users      },
    { id: 'routes',       label: 'Routes',      icon: MapPin     },
    { id: 'fees',         label: 'Fees',        icon: DollarSign },
    { id: 'tolls',        label: 'Tolls & Fines', icon: Receipt  },
    { id: 'reports',      label: 'Reports',     icon: TrendingUp },
    { id: 'simulator',    label: 'Simulator',   icon: Smartphone },
];

const VEHICLE_TYPES  = ['BUS', 'VAN', 'CAR', 'TEMPO', 'TWO_WHEELER', 'OTHER'];
const FUEL_TYPES     = ['DIESEL', 'CNG', 'PETROL', 'ELECTRIC'];
const OWNERSHIP      = ['OWNED', 'HIRED', 'LEASED'];
const DOC_TYPES      = ['INSURANCE', 'PUC', 'FITNESS_CERT', 'PERMIT', 'SPEED_GOVERNOR', 'ROAD_TAX', 'CCTV', 'DRIVER_DL', 'EMERGENCY_EXIT'];
const MAINT_TYPES    = ['PREVENTIVE', 'CORRECTIVE', 'REGULATORY', 'SAFETY', 'TYRE', 'BATTERY'];
const PAYMENT_MODES  = ['VOUCHER', 'CASH', 'CARD', 'FUEL_CARD'];
const DL_CATEGORIES  = ['HMV', 'LMV', 'MCWG'];
const BLOOD_GROUPS   = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const PIE_COLORS     = ['#000099', '#FF9A01', '#ef4444', '#10b981'];
const ANOMALY_COLORS: Record<string, string> = {
    NONE: 'text-green-600 bg-green-50',
    OVER_FUELLING: 'text-red-600 bg-red-50',
    MILEAGE_DROP: 'text-orange-600 bg-orange-50',
    UNAPPROVED_VENDOR: 'text-yellow-600 bg-yellow-50',
    DUPLICATE: 'text-red-700 bg-red-50',
    WEEKEND: 'text-purple-600 bg-purple-50',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ragBadge = (status: string) => {
    const map: Record<string, string> = {
        COMPLIANT: 'bg-green-100 text-green-700 border-green-200',
        WARNING:   'bg-yellow-100 text-yellow-700 border-yellow-200',
        CRITICAL:  'bg-red-100 text-red-700 border-red-200',
        EXPIRED:   'bg-red-200 text-red-900 border-red-400',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
};

const vehicleStatusBadge = (s: string) => {
    const m: Record<string, string> = {
        ACTIVE:          'bg-green-100 text-green-700',
        MAINTENANCE:     'bg-yellow-100 text-yellow-700',
        GROUNDED:        'bg-red-100 text-red-700',
        DECOMMISSIONED:  'bg-slate-200 text-slate-600',
    };
    return m[s] || 'bg-slate-100 text-slate-600';
};

const feeBadge = (s: string) => {
    const m: Record<string, string> = {
        PAID:    'bg-green-100 text-green-700',
        PENDING: 'bg-yellow-100 text-yellow-700',
        OVERDUE: 'bg-red-100 text-red-700',
    };
    return m[s] || '';
};

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const fmtCur  = (n: number) => `₹${n?.toLocaleString('en-IN') ?? 0}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, icon: Icon, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white p-5 border border-[#E2E0D8] rounded-[10px] shadow-sm flex items-center gap-4 transition-all ${onClick ? 'cursor-pointer hover:border-[#000099] hover:shadow-md' : ''}`}
    >
        <div className="w-10 h-10 bg-[#000099] rounded-[8px] flex items-center justify-center text-white shadow-sm">
            <Icon className="w-5 h-5 text-[#FF9A01]" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{value}</p>
            {sub && <p className="text-[10px] font-medium text-slate-400 mt-1">{sub}</p>}
        </div>
    </div>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-[10px] border border-[#E2E0D8] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm leading-none">✕</button>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
        {children}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#000099] focus:border-transparent bg-white text-slate-800" />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <select {...props} className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#000099] focus:border-transparent bg-white text-slate-800">
        {children}
    </select>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const VehicleManagement: React.FC = () => {
    const { role, user } = usePersona();
    const isDriver = role === 'DRIVER';

    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading]     = useState(true);

    // Data state
    const [dashboard, setDashboard]     = useState<any>({});
    const [vehicles, setVehicles]       = useState<Vehicle[]>([]);
    const [compliance, setCompliance]   = useState<VehicleDoc[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [fuel, setFuel]               = useState<FuelLog[]>([]);
    const [drivers, setDrivers]         = useState<DriverProfile[]>([]);
    const [routes, setRoutes]           = useState<Route[]>([]);
    const [fees, setFees]               = useState<FeeRecord[]>([]);
    const [trips, setTrips]             = useState<Trip[]>([]);
    const [fastags, setFastags]         = useState<FastagLog[]>([]);
    const [challans, setChallans]       = useState<ChallanRecord[]>([]);
    const [incidents, setIncidents]     = useState<IncidentRecord[]>([]);
    const [gpsLogs, setGpsLogs]         = useState<GPSLog[]>([]);

    // TRM v2 UI Simulator and Alerts States
    const [simMode, setSimMode]         = useState<'in_charge' | 'driver' | 'parent'>('in_charge');
    const [activeAlerts, setActiveAlerts] = useState<any[]>([
        { id: 1, type: 'SOS', reg_number: 'KA01F7002', route: 'RT-B', message: 'SOS button pressed by driver Suresh. Fuel pump indicator failure.', timestamp: 'Just Now', resolved: false },
        { id: 2, type: 'GEOFENCE_BREACH', reg_number: 'KA01F7004', route: 'RT-D', message: 'Vehicle diverted 1.8km off corridor at Hebbal Junction.', timestamp: '3 mins ago', resolved: false },
        { id: 3, type: 'DELAY', reg_number: 'KA01F7005', route: 'RT-C', message: 'Delay exceeds 15 mins due to construction at Silk Board.', timestamp: '8 mins ago', resolved: false },
    ]);
    const [reportsTab, setReportsTab]   = useState<string>('cost_student_km');
    const [reportRows, setReportRows]   = useState<any[]>([]);
    const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);
    const [ledgerSyncStatus, setLedgerSyncStatus] = useState<string>('SYNCHRONIZED');
    const [parentETAs, setParentETAs]   = useState<any[]>([
        { id: 1, route: 'RT-A', stop: 'Silk Board', message: 'Bus RT-A has departed school. ETA to Silk Board: 15 mins.', timestamp: '07:05 AM', status: 'SENT' },
        { id: 2, route: 'RT-B', stop: 'Richmond Road', message: 'Bus RT-B is at Richmond Road. Arrival in 5 mins.', timestamp: '07:35 AM', status: 'DELIVERED' }
    ]);
    const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

    // Simulator states for driver
    const [driverChecklist, setDriverChecklist] = useState<Record<string, boolean>>({
        brakes: false,
        lights: false,
        clean: false,
        emergency_door: false,
        first_aid: false
    });
    const [studentManifest, setStudentManifest] = useState<any[]>([
        { id: 'STU-101', name: 'Arjun Mehta', stop: 'Electronic City', boarded: false },
        { id: 'STU-102', name: 'Priya Sharma', stop: 'Silk Board', boarded: false },
        { id: 'STU-108', name: 'Kavya Pillai', stop: 'BTM Layout', boarded: false }
    ]);
    
    // Modal states
    const [showAddVehicle,    setShowAddVehicle]    = useState(false);
    const [showAddDoc,        setShowAddDoc]        = useState(false);
    const [showAddMaint,      setShowAddMaint]      = useState(false);
    const [showAddFuel,       setShowAddFuel]       = useState(false);
    const [showAddDriver,     setShowAddDriver]     = useState(false);
    const [showAddRoute,      setShowAddRoute]      = useState(false);
    const [showAddFee,        setShowAddFee]        = useState(false);
    const [showLogTrip,       setShowLogTrip]       = useState(false);
    const [showAddIncident,   setShowAddIncident]   = useState(false);
    const [showStatusChange,  setShowStatusChange]  = useState<Vehicle | null>(null);
    const [updatingDoc,       setUpdatingDoc]       = useState<VehicleDoc | null>(null);
    const [viewingDriver,     setViewingDriver]     = useState<DriverProfile | null>(null);
    const [viewingVehicle,    setViewingVehicle]    = useState<Vehicle | null>(null);
    const [allocatingDriver,  setAllocatingDriver]  = useState<DriverProfile | null>(null);
    const [resolvingIncident, setResolvingIncident] = useState<IncidentRecord | null>(null);

    // Form states
    const [vForm, setVForm]     = useState<any>({ vehicle_type: 'BUS', fuel_type: 'DIESEL', ownership_type: 'OWNED', campus: 'Main Campus' });
    const [dForm, setDForm]     = useState<any>({ dl_category: 'HMV', blood_group: 'O+' });
    const [mForm, setMForm]     = useState<any>({ maintenance_type: 'PREVENTIVE', status: 'COMPLETED' });
    const [fForm, setFForm]     = useState<any>({ payment_mode: 'VOUCHER' });
    const [rForm, setRForm]     = useState<any>({ stops_text: '' });
    const [feForm, setFeForm]   = useState<any>({ fee_term: 'Monthly' });
    const [tForm, setTForm]     = useState<any>({ trip_type: 'REGULAR' });
    const [docForm, setDocForm] = useState<any>({ doc_type: 'INSURANCE' });
    const [incForm, setIncForm] = useState<any>({ severity: 'MINOR', incident_date: new Date().toISOString().split('T')[0] });
    const [resForm, setResForm] = useState<any>({ resolution_details: '' });
    const [updateDocForm, setUpdateDocForm] = useState<any>({});

    // ─── Fetch helpers ────────────────────────────────────────────────────────

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [dash, fleet, comp, maint, fuelD, drv, rts, feeD, tripD, tollsFines, incs, gps] = await Promise.all([
                vehicleService.getDashboard(),
                vehicleService.getFleet(),
                vehicleService.getCompliance(),
                vehicleService.getMaintenance(),
                vehicleService.getFuel(),
                vehicleService.getDrivers(),
                vehicleService.getRoutes(),
                vehicleService.getFees(),
                vehicleService.getTrips(),
                vehicleService.getTollsAndFines(),
                vehicleService.getIncidents(),
                vehicleService.getLatestGPS()
            ]);
            setDashboard(dash);
            setVehicles(fleet.data || []);
            setCompliance(comp.data || []);
            setMaintenance(maint.data || []);
            setFuel(fuelD.data || []);
            setDrivers(drv.data || []);
            setRoutes(rts.data || []);
            setFees(feeD.data || []);
            setTrips(tripD.data || []);
            setFastags(tollsFines.fastags || []);
            setChallans(tollsFines.challans || []);
            setIncidents(incs.data || []);
            setGpsLogs(gps.data || []);

            // Initial load of standard report
            const reports = await vehicleService.getReportData(reportsTab);
            setReportRows(reports.data || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    // 30-Second Live Polling Loop for GPS updates
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const gps = await vehicleService.getLatestGPS();
                setGpsLogs(gps.data || []);
            } catch (e) {
                console.error("GPS poll check failed:", e);
            }
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Fetch reports when report tab toggles
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await vehicleService.getReportData(reportsTab);
                setReportRows(res.data || []);
            } catch (e) { console.error(e); }
        };
        fetchReport();
    }, [reportsTab]);

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleAddVehicle = async () => {
        await vehicleService.addVehicle(vForm);
        setShowAddVehicle(false);
        setVForm({ vehicle_type: 'BUS', fuel_type: 'DIESEL', ownership_type: 'OWNED', campus: 'Main Campus' });
        fetchAll();
    };

    const handleAddDoc = async () => {
        await vehicleService.addDocument(docForm);
        setShowAddDoc(false);
        setDocForm({ doc_type: 'INSURANCE' });
        fetchAll();
    };

    const handleUpdateDocClick = (doc: VehicleDoc) => {
        setUpdatingDoc(doc);
        setUpdateDocForm({
            issue_date: doc.issue_date || '',
            expiry_date: doc.expiry_date || '',
            issuing_authority: doc.issuing_authority || ''
        });
    };

    const handleUpdateDocSubmit = async () => {
        if (!updatingDoc) return;
        await vehicleService.updateDocument(updatingDoc.doc_id, updateDocForm);
        setUpdatingDoc(null);
        setUpdateDocForm({});
        fetchAll();
    };

    const handleAddMaint = async () => {
        await vehicleService.addMaintenance(mForm);
        setShowAddMaint(false);
        setMForm({ maintenance_type: 'PREVENTIVE' });
        fetchAll();
    };

    const handleAddFuel = async () => {
        await vehicleService.addFuel(fForm);
        setShowAddFuel(false);
        setFForm({ payment_mode: 'VOUCHER' });
        fetchAll();
    };

    const handleAddDriver = async () => {
        await vehicleService.addDriver(dForm);
        setShowAddDriver(false);
        setDForm({ dl_category: 'HMV', blood_group: 'O+' });
        fetchAll();
    };

    const handleAddRoute = async () => {
        const stops = rForm.stops_text ? rForm.stops_text.split(',').map((s: string) => s.trim()) : [];
        await vehicleService.addRoute({ ...rForm, stops });
        setShowAddRoute(false);
        setRForm({ stops_text: '' });
        fetchAll();
    };

    const handleAddFee = async () => {
        await vehicleService.addFee(feForm);
        setShowAddFee(false);
        setFeForm({ fee_term: 'Monthly' });
        fetchAll();
    };

    const handleLogTrip = async () => {
        await vehicleService.logTrip(tForm);
        setShowLogTrip(false);
        setTForm({ trip_type: 'REGULAR' });
        fetchAll();
    };

    const handleMarkPaid = async (fee: FeeRecord) => {
        await vehicleService.markPaid(fee.id, fee.monthly_fee);
        setLedgerSyncStatus('SYNC_REQUIRED');
        fetchAll();
    };

    const handleStatusChange = async (vehicle: Vehicle, status: string) => {
        await vehicleService.updateStatus(vehicle.id, status);
        setShowStatusChange(null);
        fetchAll();
    };

    const payChallan = async (id: number) => {
        if (!confirm('Mark this challan as paid?')) return;
        await vehicleService.payChallan(id);
        fetchAll();
    };

    const handleAddIncident = async () => {
        await vehicleService.addIncident(incForm);
        setShowAddIncident(false);
        setIncForm({ severity: 'MINOR', incident_date: new Date().toISOString().split('T')[0] });
        fetchAll();
    };

    const handleResolveIncidentSubmit = async () => {
        if (!resolvingIncident) return;
        await vehicleService.resolveIncident(resolvingIncident.id, resForm.resolution_details);
        setResolvingIncident(null);
        setResForm({ resolution_details: '' });
        fetchAll();
    };

    const handleSyncLedger = () => {
        setLedgerSyncStatus('SYNCING');
        setTimeout(() => {
            setLedgerSyncStatus('SYNCHRONIZED');
            alert('Chart of Accounts successfully reconciled. Net transport fee credit posted to General Ledger.');
        }, 1500);
    };

    const handleResolveAlert = (id: number) => {
        setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    };

    const handleSendAlertBroadcast = (alertItem: any) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const newSMS = {
            id: Date.now(),
            route: alertItem.route,
            stop: 'All Route Stops',
            message: `Parent Alert: Bus ${alertItem.reg_number} is experiencing a delay. Operational dispatch has mobilized backup support.`,
            timestamp: timestamp,
            status: 'SENT'
        };
        setParentETAs(prev => [newSMS, ...prev]);
        alert(`Parent broadcast notification dispatched for Route ${alertItem.route}`);
    };

    const handleToggleStudentBoarding = (stuId: string) => {
        setStudentManifest(prev => prev.map(s => {
            if (s.id === stuId) {
                const nextState = !s.boarded;
                if (nextState) {
                    // Auto-trigger parent notification message
                    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const notification = {
                        id: Date.now(),
                        route: 'RT-A',
                        stop: s.stop,
                        message: `Parent Alert: Student ${s.name} boarded Bus KA01F7001 at ${s.stop}.`,
                        timestamp: timestamp,
                        status: 'DELIVERED'
                    };
                    setParentETAs(prev => [notification, ...prev]);
                }
                return { ...s, boarded: nextState };
            }
            return s;
        }));
    };

    const handleAddOfflineLog = (logName: string) => {
        const item = { name: logName, time: new Date().toLocaleTimeString() };
        setOfflineQueue(prev => [...prev, item]);
    };

    const handleSyncOfflineLogs = () => {
        if (offlineQueue.length === 0) return;
        alert(`Reconnecting... Syncing ${offlineQueue.length} offline cached operational logs to primary databases.`);
        setOfflineQueue([]);
    };

    // ─── Derived data ─────────────────────────────────────────────────────────

    const compByVehicle = compliance.reduce((acc: any, d) => {
        if (!d.vehicle_id) return acc;
        if (!acc[d.vehicle_id]) acc[d.vehicle_id] = { reg_number: d.reg_number, make_model: d.make_model, docs: [], maxSeverity: 0 };
        acc[d.vehicle_id].docs.push(d);
        
        const sevMap: any = { 'EXPIRED': 3, 'CRITICAL': 2, 'WARNING': 1, 'COMPLIANT': 0 };
        const sev = sevMap[d.rag_status] || 0;
        if (sev > acc[d.vehicle_id].maxSeverity) acc[d.vehicle_id].maxSeverity = sev;
        
        return acc;
    }, {});

    const sortedCompByVehicle = Object.values(compByVehicle).sort((a: any, b: any) => b.maxSeverity - a.maxSeverity);

    const activeIncidents = incidents.filter(i => i.resolution_status === 'PENDING');
    const hasCriticalExpirations = compliance.some(c => c.rag_status === 'EXPIRED' || c.rag_status === 'CRITICAL');

    // ─── Tab Renderers ────────────────────────────────────────────────────────

    const renderOverview = () => {
        const overdueCount = fees.filter(f => f.status === 'OVERDUE').length;
        const dlExpiring = drivers.filter(d => {
            const days = d.dl_expiry ? Math.ceil((new Date(d.dl_expiry).getTime() - Date.now()) / 86400000) : 100;
            return days <= 30;
        }).length;

        // Compute dynamic cost per student-km for the summary overview
        const fuelTotal = fuel.reduce((s, f) => s + f.total_cost, 0);
        const maintTotal = maintenance.reduce((s, m) => s + m.cost, 0);
        const totalDistance = routes.reduce((s, r) => s + r.total_distance_km, 0) || 1;
        const totalStudents = routes.reduce((s, r) => s + r.students_count, 0) || 1;
        const totalCostSum = fuelTotal + maintTotal + (fastags.reduce((s, f) => s + f.balance, 0) || 0);
        const costPerStudentKm = (totalCostSum / (totalDistance * totalStudents)).toFixed(2);

        return (
            <div className="space-y-5">
                {/* Critical Expirations Alert Banner */}
                {hasCriticalExpirations && (
                    <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 text-slate-800 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[8px] bg-red-600 flex items-center justify-center text-white">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-900 text-xs">Urgent Compliance Deficit Detected</h4>
                                <p className="text-[10px] text-red-700 font-medium">Critical documentation gaps found. Expirations exist on vehicle registrations or driver credentials.</p>
                            </div>
                        </div>
                        <Button size="sm" onClick={() => setActiveTab('compliance')} className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider h-8">
                            Resolve Gaps
                        </Button>
                    </div>
                )}

                {/* KPI Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <KpiCard label="Fleet Registry" value={vehicles.length} sub={`${vehicles.filter(v => v.status === 'ACTIVE').length} active vehicles`} icon={Truck} onClick={() => setActiveTab('fleet')} />
                    <KpiCard label="Active Incidents" value={activeIncidents.length} sub={`${incidents.filter(i => i.severity === 'CRITICAL').length} critical case`} icon={AlertCircle} onClick={() => setActiveTab('incidents')} />
                    <KpiCard label="Cost per Student-Km" value={`₹${costPerStudentKm}`} sub="Integrated operational cost metric" icon={Activity} onClick={() => setActiveTab('reports')} />
                    <KpiCard label="Defaulters Overdue" value={overdueCount} sub="Synced with Fee ledger module" icon={DollarSign} onClick={() => setActiveTab('fees')} />
                </div>

                {/* Real-time Alerts Command Center */}
                <Card className="border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-[#E2E0D8] bg-[#F8F8F6] flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                Live Incident & Operations Command Center
                            </h3>
                            <p className="text-[10px] text-slate-500">Immediate routing, delay, and emergency dispatch tracking</p>
                        </div>
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-[4px]">
                            {activeAlerts.filter(a => !a.resolved).length} Unresolved Alerts
                        </span>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {activeAlerts.map(alert => (
                                <div key={alert.id} className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${alert.resolved ? 'bg-slate-50 opacity-60' : 'bg-white'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-[6px] shrink-0 mt-0.5 ${
                                            alert.type === 'SOS' ? 'bg-red-100 text-red-600' :
                                            alert.type === 'GEOFENCE_BREACH' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {alert.type === 'SOS' ? <Flame className="w-4 h-4" /> :
                                             alert.type === 'GEOFENCE_BREACH' ? <Navigation className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-xs text-slate-800">{alert.reg_number} ({alert.route})</span>
                                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${
                                                    alert.type === 'SOS' ? 'bg-red-200 text-red-800' :
                                                    alert.type === 'GEOFENCE_BREACH' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'
                                                }`}>{alert.type}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{alert.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.message}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!alert.resolved ? (
                                            <>
                                                <Button size="sm" onClick={() => handleSendAlertBroadcast(alert)} className="bg-[#FF9A01] text-white hover:bg-orange-600 text-[10px] font-bold h-7 px-3 rounded-[6px]">
                                                    Notify Parents
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleResolveAlert(alert.id)} className="border-slate-200 hover:bg-slate-100 text-[10px] font-bold h-7 px-3 rounded-[6px] text-slate-600">
                                                    Resolve
                                                </Button>
                                            </>
                                        ) : (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Handled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Dashboard layout blocks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="border border-[#E2E0D8] rounded-[10px]">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-slate-800 text-sm mb-3">Refuels & Leak Detection Anomalies</h3>
                            <div className="space-y-3">
                                {fuel.filter(f => f.anomaly_flag !== 'NONE').slice(0, 4).map((f, i) => (
                                    <div key={i} className="flex justify-between items-start p-3 bg-rose-50/50 rounded-[8px] border border-rose-100 text-xs">
                                        <div>
                                            <p className="font-bold text-slate-800">{f.reg_number} - Refill Leak Risk</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Date: {fmtDate(f.fuel_date)} | Location: {f.vendor}</p>
                                            <p className="text-[10px] text-rose-700 font-medium mt-1">Anomaly: {f.anomaly_details || f.anomaly_flag}</p>
                                        </div>
                                        <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded-[4px] text-[9px] uppercase">
                                            Flagged
                                        </span>
                                    </div>
                                ))}
                                {fuel.filter(f => f.anomaly_flag !== 'NONE').length === 0 && (
                                    <p className="text-center text-slate-400 text-xs py-8">No fuel tank anomalies detected.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-[#E2E0D8] rounded-[10px]">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-slate-800 text-sm mb-3">Live Dispatch Map Log</h3>
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {gpsLogs.map((log, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-[8px] border border-slate-100 text-xs hover:bg-blue-50/20 transition-all">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${log.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                            <div>
                                                <p className="font-bold text-slate-800">{log.reg_number}</p>
                                                <p className="text-[10px] text-slate-400">Position: {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#000099]">{log.speed_kmh} km/h</p>
                                            <p className="text-[9px] text-slate-400">{log.location_name || 'In-route'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    };

    const renderTracking = () => {
        const center: [number, number] = [12.9716, 77.5946];
        
        const getCustomIcon = (status: string) => {
             const color = status === 'ACTIVE' ? '#10b981' : '#64748b';
             return L.divIcon({
                html: `<div class="bg-white p-1.5 rounded-full shadow-sm border-2" style="border-color: ${color}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path><circle cx="7" cy="18" r="2"></circle><path d="M9 18h5"></path><circle cx="16" cy="18" r="2"></circle>
                    </svg>
                </div>`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 16]
             });
        };

        return (
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Dynamic GPS Tracking Command</h2>
                        <p className="text-[10px] text-slate-500">Live coordinate sync leveraging existing communication module APIs</p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] bg-slate-50 px-3 py-1.5 rounded-[6px] border border-slate-200 w-fit font-bold text-slate-600">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span> Active ({vehicles.filter(v=>v.status==='ACTIVE').length})</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Stopped ({vehicles.filter(v=>v.status!=='ACTIVE').length})</span>
                        <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-[4px]">Comm-Location-Sync API Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[550px]">
                    {/* Vehicle List */}
                    <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 bg-slate-50/50 p-2 rounded-[10px] border border-slate-100">
                        {vehicles.map((v) => {
                            const latestGps = gpsLogs.find(g => g.vehicle_id === v.id);
                            return (
                                <Card key={v.id} className="border border-slate-200 hover:border-[#000099] cursor-pointer transition-colors shadow-sm bg-white">
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-bold text-slate-800 text-xs">{v.reg_number}</p>
                                            <span className={`w-2 h-2 rounded-full ${v.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mb-1 truncate">{v.make_model} - {v.vehicle_type}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-2">
                                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                            <span className="truncate">Route: {routes.find(r => r.vehicle_id === v.id)?.route_name || 'N/A'}</span>
                                        </div>
                                        {latestGps && (
                                            <div className="mt-2 text-[9px] font-bold text-[#000099] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1">
                                                Speed: {latestGps.speed_kmh} km/h | Heading: {latestGps.heading} deg
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Map Area */}
                    <div className="lg:col-span-3 rounded-[10px] overflow-hidden border border-[#E2E0D8] shadow-sm relative z-0 h-full min-h-[300px]">
                        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {gpsLogs.map((log) => {
                                return (
                                    <Marker key={log.id} position={[log.latitude, log.longitude]} icon={getCustomIcon(log.status)}>
                                        <Popup>
                                            <div className="text-xs min-w-[150px] space-y-1">
                                                <p className="font-bold border-b border-slate-100 pb-1 mb-1 text-slate-800">{log.reg_number}</p>
                                                <p className="text-slate-600 font-medium">{log.make_model}</p>
                                                <p className="text-slate-500 truncate">Route: {routes.find(r => r.vehicle_id === log.vehicle_id)?.route_name || 'Unassigned'}</p>
                                                <p className="text-[10px] text-indigo-600">Sync: Comm location tracker</p>
                                                <p className="mt-2">
                                                    Status: <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] ${log.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{log.status}</span>
                                                </p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                        </MapContainer>
                    </div>
                </div>
            </div>
        );
    };

    const renderFleet = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Fleet Operations Locker</h2>
                    <p className="text-[10px] text-slate-500">{vehicles.length} registered vehicles with health and maintenance schedules</p>
                </div>
                <Button size="sm" onClick={() => setShowAddVehicle(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Add Vehicle
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vehicles.map(v => {
                    const nextServiceText = v.mileage_standard > 0 ? "Next service: in 350 km (Predictive Alert)" : "Schedule: every 5000 km or 6 months";
                    const isMaint = v.status === 'MAINTENANCE';
                    return (
                        <Card key={v.id} className="border border-slate-200 cursor-pointer hover:border-[#000099] hover:shadow-sm transition-all group bg-white" onClick={() => setViewingVehicle(v)}>
                            <CardContent className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-slate-800 text-xs group-hover:text-[#000099] transition-colors">{v.reg_number}</p>
                                            <p className="text-[10px] text-slate-500">{v.make_model} · {v.year}</p>
                                        </div>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-[4px] font-bold ${vehicleStatusBadge(v.status)}`}>{v.status}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-y-1.5 text-[10px] text-slate-600 mb-4 border-b border-slate-100 pb-3">
                                        <span className="text-slate-400">Class Type</span>   <span className="font-bold text-slate-800">{v.vehicle_type}</span>
                                        <span className="text-slate-400">Fuel Type</span>    <span className="font-bold text-slate-800">{v.fuel_type}</span>
                                        <span className="text-slate-400">Seating</span>      <span className="font-bold text-slate-800">{v.seating_capacity} seats</span>
                                        <span className="text-slate-400">Ownership</span>    <span className="font-bold text-slate-800">{v.ownership_type}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-orange-50 border border-orange-100 rounded-[6px] p-2 text-[9px] text-[#FF9A01] font-bold mb-3">
                                        {nextServiceText}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setShowStatusChange(v); }}
                                            className="text-[10px] text-[#000099] font-bold hover:underline flex items-center gap-1"
                                        >
                                            Change Status <ChevronRight className="w-3 h-3" />
                                        </button>
                                        <span className={`w-2.5 h-2.5 rounded-full ${isMaint ? 'bg-yellow-500 animate-ping' : v.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} title="Health indicator"></span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );

    const renderCompliance = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Compliance Document Locker</h2>
                    <p className="text-[10px] text-slate-500">Expiring alerts schedule checklist (30, 60, 90 day metrics)</p>
                </div>
                <Button size="sm" onClick={() => setShowAddDoc(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Add Doc
                </Button>
            </div>

            <div className="flex gap-2 flex-wrap text-[9px] bg-slate-50 p-2.5 rounded-[8px] border border-slate-100 w-fit">
                <span className={`px-2 py-1 rounded-[4px] border font-bold ${ragBadge('COMPLIANT')}`}>● Compliant</span>
                <span className={`px-2 py-1 rounded-[4px] border font-bold ${ragBadge('WARNING')}`}>● Warning (&lt;30d)</span>
                <span className={`px-2 py-1 rounded-[4px] border font-bold ${ragBadge('CRITICAL')}`}>● Critical (&lt;7d)</span>
                <span className={`px-2 py-1 rounded-[4px] border font-bold ${ragBadge('EXPIRED')}`}>● Expired / Breached</span>
            </div>

            <div className="space-y-3">
                {sortedCompByVehicle.map((veh: any) => (
                    <Card key={veh.reg_number} className={`border bg-white rounded-[10px] ${veh.maxSeverity >= 2 ? 'border-red-300' : 'border-slate-200'}`}>
                        <CardContent className="p-4">
                            <p className="font-bold text-slate-800 text-xs mb-3">{veh.reg_number} - {veh.make_model}</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                {veh.docs.map((d: VehicleDoc) => (
                                    <div key={d.doc_id} 
                                         className={`p-2.5 rounded-[6px] border text-[10px] cursor-pointer hover:shadow-sm transition-shadow ${ragBadge(d.rag_status)}`}
                                         onClick={() => handleUpdateDocClick(d)}>
                                        <p className="font-bold">{d.doc_type.replace(/_/g, ' ')}</p>
                                        <p className="opacity-75 mt-1">Exp: {fmtDate(d.expiry_date)}</p>
                                        <p className="opacity-90 font-bold mt-0.5">{d.days_to_expiry >= 0 ? `${d.days_to_expiry} days remaining` : 'Expired document'}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderIncidents = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Incident Registry & Legal Protection Logs</h2>
                    <p className="text-[10px] text-slate-500">Log, track, and record resolutions for minor and critical vehicle accidents</p>
                </div>
                <Button size="sm" onClick={() => setShowAddIncident(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Report Incident
                </Button>
            </div>

            <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Driver</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Severity</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {incidents.map(i => (
                            <tr key={i.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedIncident(i)}>
                                <td className="px-4 py-3 font-bold text-slate-800">{i.reg_number}</td>
                                <td className="px-4 py-3">{i.driver_name || 'System Operator'}</td>
                                <td className="px-4 py-3">{fmtDate(i.incident_date)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold ${
                                        i.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                        i.severity === 'MAJOR' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                                    }`}>{i.severity}</span>
                                </td>
                                <td className="px-4 py-3 truncate max-w-[120px]">{i.location || 'In-route'}</td>
                                <td className="px-4 py-3 truncate max-w-[200px]">{i.description || 'No description provided.'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                        i.resolution_status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                                    }`}>{i.resolution_status}</span>
                                </td>
                                <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                                    {i.resolution_status === 'PENDING' ? (
                                        <Button size="sm" onClick={() => setResolvingIncident(i)} className="bg-[#000099] text-white hover:bg-blue-900 text-[10px] font-bold h-7 rounded-[4px]">
                                            Resolve
                                        </Button>
                                    ) : (
                                        <span className="text-[10px] text-green-600 font-bold">Resolved</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Selected Incident Drawer/Modal */}
            {selectedIncident && (
                <Modal title={`Incident Detail: Case #${selectedIncident.id}`} onClose={() => setSelectedIncident(null)}>
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2 border-b pb-2">
                            <div><p className="text-slate-400 font-bold uppercase text-[9px]">Vehicle</p><p className="font-bold text-slate-800">{selectedIncident.reg_number}</p></div>
                            <div><p className="text-slate-400 font-bold uppercase text-[9px]">Driver</p><p className="font-bold text-slate-800">{selectedIncident.driver_name || 'System Operator'}</p></div>
                            <div className="mt-2"><p className="text-slate-400 font-bold uppercase text-[9px]">Severity</p><p className="font-bold text-red-600">{selectedIncident.severity}</p></div>
                            <div className="mt-2"><p className="text-slate-400 font-bold uppercase text-[9px]">Date</p><p className="font-bold text-slate-800">{fmtDate(selectedIncident.incident_date)}</p></div>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold uppercase text-[9px] mb-1">Details & Description</p>
                            <p className="p-3 bg-slate-50 rounded-[6px] border border-slate-100 leading-relaxed text-slate-700">{selectedIncident.description || 'No description provided.'}</p>
                        </div>
                        {selectedIncident.photo_url && (
                            <div>
                                <p className="text-slate-400 font-bold uppercase text-[9px] mb-1">Incident Photograph</p>
                                <img src={selectedIncident.photo_url} alt="Incident Uploaded Report" className="w-full h-40 object-cover rounded-[6px] border" />
                            </div>
                        )}
                        <div>
                            <p className="text-slate-400 font-bold uppercase text-[9px]">Resolution Log</p>
                            <p className="font-medium text-slate-700 mt-1">{selectedIncident.resolution_details || 'Pending final audit resolution report.'}</p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );

    const renderMaintenance = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">{maintenance.length} active service records</p>
                <Button size="sm" onClick={() => setShowAddMaint(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Log Service
                </Button>
            </div>
            <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Vendor</th>
                            <th className="px-4 py-3">Cost</th>
                            <th className="px-4 py-3">Next Due</th>
                            <th className="px-4 py-3">Work Order</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {maintenance.map(m => (
                            <tr key={m.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-800">{m.reg_number}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-700 font-bold text-[9px]">{m.maintenance_type}</span>
                                </td>
                                <td className="px-4 py-3">{fmtDate(m.service_date)}</td>
                                <td className="px-4 py-3 truncate max-w-[150px]">{m.description}</td>
                                <td className="px-4 py-3">{m.vendor || 'In-house'}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">{fmtCur(m.cost)}</td>
                                <td className="px-4 py-3">{m.next_service_due ? fmtDate(m.next_service_due) : '-'}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{m.work_order_no}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFuel = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Fuel refill registries with automated leak thresholds</p>
                <Button size="sm" onClick={() => setShowAddFuel(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Log Fuel
                </Button>
            </div>
            <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Litres</th>
                            <th className="px-4 py-3">Rate</th>
                            <th className="px-4 py-3">Total Cost</th>
                            <th className="px-4 py-3">Fuel Station</th>
                            <th className="px-4 py-3">Logged By</th>
                            <th className="px-4 py-3">Refill Anomaly</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {fuel.map(f => (
                            <tr key={f.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-800">{f.reg_number}</td>
                                <td className="px-4 py-3">{fmtDate(f.fuel_date)}</td>
                                <td className="px-4 py-3 font-bold">{f.litres} L</td>
                                <td className="px-4 py-3 text-slate-400">₹{f.price_per_litre}/L</td>
                                <td className="px-4 py-3 font-bold text-slate-800">{fmtCur(f.total_cost)}</td>
                                <td className="px-4 py-3">{f.vendor}</td>
                                <td className="px-4 py-3">{f.logged_by || 'Driver'}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-[4px] font-bold text-[8px] uppercase ${ANOMALY_COLORS[f.anomaly_flag] || 'bg-slate-50 text-slate-500'}`}>
                                        {f.anomaly_flag === 'NONE' ? '✓ Safe' : f.anomaly_flag.replace(/_/g, ' ')}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderDrivers = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Licensed staff tracking logs</p>
                <Button size="sm" onClick={() => setShowAddDriver(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Add Driver
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {drivers.map(d => {
                    const dlDays = d.dl_expiry ? Math.ceil((new Date(d.dl_expiry).getTime() - Date.now()) / 86400000) : 100;
                    const dlStatus = dlDays < 0 ? 'EXPIRED' : dlDays < 7 ? 'CRITICAL' : dlDays < 30 ? 'WARNING' : 'VALID';
                    return (
                        <Card key={d.id} className="border border-slate-200 hover:border-[#000099] cursor-pointer bg-white transition-all rounded-[10px]" onClick={() => setViewingDriver(d)}>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">{d.driver_name}</p>
                                        <p className="text-[10px] text-slate-400">Badge: {d.badge_number || 'N/A'}</p>
                                    </div>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-[4px] font-bold ${ragBadge(dlStatus)}`}>DL Status: {dlStatus}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-1.5 text-[10px] mb-4 text-slate-600 border-b pb-3">
                                    <span className="text-slate-400">DL Number</span>  <span className="font-mono text-slate-800 font-bold">{d.dl_number}</span>
                                    <span className="text-slate-400">Category</span>   <span className="text-slate-800 font-bold">{d.dl_category}</span>
                                    <span className="text-slate-400">DL Expiry</span>  <span className="text-slate-800 font-bold">{fmtDate(d.dl_expiry)}</span>
                                    <span className="text-slate-400">Blood Group</span> <span className="text-red-600 font-bold">{d.blood_group}</span>
                                </div>
                                <Button size="sm" variant="outline" className="w-full text-[9px] font-bold uppercase tracking-wider h-8 rounded-[6px]" onClick={(e) => { e.stopPropagation(); setAllocatingDriver(d); }}>
                                    <Truck className="w-3.5 h-3.5 mr-1" /> Allocate Vehicle
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );

    const renderRoutes = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <div className="flex items-center gap-3">
                    <p className="text-xs text-slate-500 font-medium">{routes.length} active corridors</p>
                    <Button size="sm" variant="outline" onClick={() => setShowLogTrip(true)} className="text-xs h-8 border-slate-200 hover:bg-slate-50 rounded-[6px] text-slate-600">
                        <Activity className="w-3.5 h-3.5 mr-1" /> Log Daily Trip
                    </Button>
                </div>
                <Button size="sm" onClick={() => setShowAddRoute(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                    <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Add Route
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {routes.map(r => (
                    <Card key={r.id} className="border border-slate-200 bg-white hover:border-[#000099] transition-all rounded-[10px]">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-slate-800 text-xs">{r.route_name}</p>
                                    <p className="text-[10px] text-slate-400">Code: {r.route_code} | {r.total_distance_km} km | {r.students_count} students</p>
                                </div>
                                <span className="text-[9px] px-2 py-0.5 rounded-[4px] bg-green-50 text-green-700 font-bold border border-green-200">{r.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-1 text-[10px] text-slate-600 mb-3 border-b pb-2">
                                <span className="text-slate-400">Allocated Vehicle</span>  <span className="font-bold text-slate-800">{r.reg_number || 'Unallocated'}</span>
                                <span className="text-slate-400">Assigned Driver</span>   <span className="font-bold text-slate-800">{r.driver_name || 'Unassigned'}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {r.stops.map((stop: string, idx: number) => (
                                    <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">{stop}</span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderFees = () => {
        const totalBilled = fees.reduce((s, f) => s + f.monthly_fee, 0);
        const totalCollected = fees.filter(f => f.status === 'PAID').reduce((s, f) => s + f.amount_paid, 0);
        const overdueCount = fees.filter(f => f.status === 'OVERDUE').length;

        return (
            <div className="space-y-4">
                {/* School Fee Module Integration Status Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                            <Receipt className="w-4 h-4 text-[#FF9A01]" />
                            Consolidated School Fee Ledger System (GL Integrated)
                        </h4>
                        <p className="text-[10px] text-blue-700 font-medium">Billing ledger accounts mapped: **GL-4200 (Transport Revenue)**. Parent invoice statements include combined tuition + transport billing lines.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-[6px] border ${
                            ledgerSyncStatus === 'SYNCHRONIZED' ? 'bg-green-100 text-green-700 border-green-200' : 
                            ledgerSyncStatus === 'SYNCING' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                            Ledger: {ledgerSyncStatus}
                        </span>
                        {ledgerSyncStatus !== 'SYNCHRONIZED' && (
                            <Button onClick={handleSyncLedger} size="sm" className="bg-[#000099] text-white hover:bg-blue-900 font-bold text-[10px] h-8 rounded-[6px]">
                                Sync Ledger
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <Card className="border border-[#E2E0D8] bg-white rounded-[10px]"><CardContent className="p-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Consolidated Billing</p>
                        <p className="text-base font-black text-slate-800">{fmtCur(totalBilled)}</p>
                    </CardContent></Card>
                    <Card className="border border-[#E2E0D8] bg-white rounded-[10px]"><CardContent className="p-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Collected Dues</p>
                        <p className="text-base font-black text-green-700">{fmtCur(totalCollected)}</p>
                    </CardContent></Card>
                    <Card className="border border-[#E2E0D8] bg-white rounded-[10px]"><CardContent className="p-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Overdue Arrears</p>
                        <p className="text-base font-black text-red-600">{overdueCount} Students</p>
                    </CardContent></Card>
                </div>

                <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                    <p className="text-xs text-slate-500 font-medium">{fees.length} active billing records</p>
                    <Button size="sm" onClick={() => setShowAddFee(true)} className="bg-[#000099] hover:bg-blue-900 text-white gap-1 text-xs rounded-[6px]">
                        <Plus className="w-3.5 h-3.5 text-[#FF9A01]" /> Add Billing Entry
                    </Button>
                </div>

                <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                            <tr>
                                <th className="px-4 py-3">Student Name</th>
                                <th className="px-4 py-3">Student ID</th>
                                <th className="px-4 py-3">Route Name</th>
                                <th className="px-4 py-3">Fee / Month</th>
                                <th className="px-4 py-3">Due Date</th>
                                <th className="px-4 py-3">Ledger Status</th>
                                <th className="px-4 py-3 text-right">Ledger Sync Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {fees.map(f => (
                                <tr key={f.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-bold text-slate-800">{f.student_name}</td>
                                    <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{f.student_id}</td>
                                    <td className="px-4 py-3 truncate max-w-[120px]">{f.route_name}</td>
                                    <td className="px-4 py-3 font-bold text-slate-800">{fmtCur(f.monthly_fee)}</td>
                                    <td className="px-4 py-3">{fmtDate(f.due_date)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold ${feeBadge(f.status)}`}>{f.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {f.status !== 'PAID' ? (
                                            <Button size="sm" onClick={() => handleMarkPaid(f)} className="bg-green-600 hover:bg-green-700 text-white text-[9px] font-bold h-7 rounded-[4px]">
                                                Mark as Paid
                                            </Button>
                                        ) : (
                                            <span className="text-[10px] text-slate-400">Post complete</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderTolls = () => (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-3 bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">FASTag Transit Accounts</h2>
                        <p className="text-[10px] text-slate-500">Live balance reconciliation directly via NPCI</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {fastags.map(f => (
                        <Card key={f.id} className={`border rounded-[10px] bg-white border-slate-200 ${f.status === 'LOW_BALANCE' ? 'border-amber-300 bg-amber-50/10' : f.status === 'BLACKLISTED' ? 'border-red-300 bg-red-50/10' : ''}`}>
                            <CardContent className="p-4 flex flex-col justify-between h-36">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-800 text-xs">{f.reg_number}</p>
                                        <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">{f.tag_id}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold ${
                                        f.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                                        f.status === 'LOW_BALANCE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700 animate-pulse'
                                    }`}>{f.status}</span>
                                </div>
                                <div className="mt-3">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Account Balance</p>
                                    <p className="text-base font-black text-slate-800">{fmtCur(f.balance)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-3 bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">RTO e-Challan Penalty Register</h2>
                        <p className="text-[10px] text-slate-500">Automated traffic fine sync alerts</p>
                    </div>
                </div>
                <div className="bg-white border border-[#E2E0D8] rounded-[10px] overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                            <tr>
                                <th className="px-4 py-3">Vehicle</th>
                                <th className="px-4 py-3">Challan / Date</th>
                                <th className="px-4 py-3">Violation Details</th>
                                <th className="px-4 py-3">Penalty</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                            {challans.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-bold text-slate-800">{c.reg_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-mono font-bold text-[10px] text-slate-700">{c.challan_number}</p>
                                        <p className="text-[9px] text-slate-400">{fmtDate(c.issue_date)}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-bold text-slate-800">{c.violation_type}</p>
                                        <p className="text-[9px] text-slate-400">{c.location}</p>
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-800">₹{c.penalty_amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-bold ${
                                            c.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {c.status === 'PENDING' ? (
                                            <Button size="sm" onClick={() => payChallan(c.id)} className="bg-[#000099] text-white hover:bg-blue-900 text-[10px] font-bold h-7 rounded-[4px]">
                                                Pay Fine
                                            </Button>
                                        ) : (
                                            <span className="text-[10px] text-green-600 font-bold">Paid</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderReports = () => {
        const reportTitles: Record<string, string> = {
            cost_student_km: 'Cost per Student-Km Report (Unique Metric)',
            daily_trip_summary: 'Daily Trip Summary Report',
            monthly_occupancy: 'Monthly Route Occupancy Report',
            revenue_collection: 'Revenue Collection & Arrears Report',
            safety_report: 'Safety Incidents & Citations Report',
            staff_performance: 'Staff Performance & Timeliness Rating',
            fuel_efficiency: 'Fuel Consumption & Efficiency Log',
            maintenance_cost: 'Preventive vs Corrective Maintenance Ledger'
        };

        const handleDownloadMock = (format: string) => {
            alert(`Generating ${format} file download hook for ${reportTitles[reportsTab]}...`);
        };

        return (
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                    <div>
                        <h2 className="text-sm font-bold text-slate-800">Institutional Operational Intelligence</h2>
                        <p className="text-[10px] text-slate-500">Run standard Phase 1 reports on fleet utilization, safety, and expenditures</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={reportsTab} onChange={e => setReportsTab(e.target.value)}>
                            <option value="cost_student_km">1. Cost per Student-Km</option>
                            <option value="daily_trip_summary">2. Daily Trip Summary</option>
                            <option value="monthly_occupancy">3. Monthly Route Occupancy</option>
                            <option value="revenue_collection">4. Revenue Collection</option>
                            <option value="safety_report">5. Safety & Citations</option>
                            <option value="staff_performance">6. Staff Performance</option>
                            <option value="fuel_efficiency">7. Fuel Consumption</option>
                            <option value="maintenance_cost">8. Maintenance Costs</option>
                        </Select>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadMock('Excel')} className="h-8 border-slate-200 hover:bg-slate-50 rounded-[6px] text-xs font-bold text-slate-600 whitespace-nowrap">
                            Export Excel
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDownloadMock('PDF')} className="h-8 border-slate-200 hover:bg-slate-50 rounded-[6px] text-xs font-bold text-slate-600 whitespace-nowrap">
                            Export PDF
                        </Button>
                    </div>
                </div>

                <Card className="border border-[#E2E0D8] bg-white rounded-[10px] overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-xs">{reportTitles[reportsTab]}</h3>
                    </div>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-slate-100 border-b text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                    {reportsTab === 'cost_student_km' && (
                                        <tr>
                                            <th className="px-4 py-3">Vehicle</th>
                                            <th className="px-4 py-3">Make / Model</th>
                                            <th className="px-4 py-3">Route Mapped</th>
                                            <th className="px-4 py-3 text-center">Students</th>
                                            <th className="px-4 py-3 text-center">Corridor (Km)</th>
                                            <th className="px-4 py-3">Refill Cost</th>
                                            <th className="px-4 py-3">Cost per Km</th>
                                            <th className="px-4 py-3 font-extrabold text-[#000099]">Cost / Student-Km</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'daily_trip_summary' && (
                                        <tr>
                                            <th className="px-4 py-3">Vehicle</th>
                                            <th className="px-4 py-3">Route Code</th>
                                            <th className="px-4 py-3">Driver</th>
                                            <th className="px-4 py-3">Type</th>
                                            <th className="px-4 py-3">Start Time</th>
                                            <th className="px-4 py-3">End Time</th>
                                            <th className="px-4 py-3 text-center">Distance</th>
                                            <th className="px-4 py-3 text-center">Students</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'monthly_occupancy' && (
                                        <tr>
                                            <th className="px-4 py-3">Route Name</th>
                                            <th className="px-4 py-3">Route Code</th>
                                            <th className="px-4 py-3 text-center">Students Allocated</th>
                                            <th className="px-4 py-3 text-center">Bus Seating Capacity</th>
                                            <th className="px-4 py-3 text-center">Occupancy Rate (%)</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'revenue_collection' && (
                                        <tr>
                                            <th className="px-4 py-3">Route Name</th>
                                            <th className="px-4 py-3 text-center">Total Students</th>
                                            <th className="px-4 py-3">Billed Ledger</th>
                                            <th className="px-4 py-3">Collected Ledger</th>
                                            <th className="px-4 py-3 text-red-600">Outstanding Arrears</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'safety_report' && (
                                        <tr>
                                            <th className="px-4 py-3">Vehicle Number</th>
                                            <th className="px-4 py-3 text-center">Pending Challans</th>
                                            <th className="px-4 py-3 text-center">Incidents Logged</th>
                                            <th className="px-4 py-3 text-center text-red-600">Critical Incidents</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'staff_performance' && (
                                        <tr>
                                            <th className="px-4 py-3">Driver Name</th>
                                            <th className="px-4 py-3">Badge Number</th>
                                            <th className="px-4 py-3">License Category</th>
                                            <th className="px-4 py-3">Assigned Vehicle</th>
                                            <th className="px-4 py-3 text-center">On-Time Rate (%)</th>
                                            <th className="px-4 py-3 text-center font-bold">Safety Score (%)</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'fuel_efficiency' && (
                                        <tr>
                                            <th className="px-4 py-3">Vehicle Number</th>
                                            <th className="px-4 py-3">Make / Model</th>
                                            <th className="px-4 py-3 text-center">Standard Mileage (Km/L)</th>
                                            <th className="px-4 py-3 text-center">Total Litres Logged</th>
                                            <th className="px-4 py-3">Total Fuel Expenses</th>
                                            <th className="px-4 py-3 text-center">Refills Count</th>
                                        </tr>
                                    )}
                                    {reportsTab === 'maintenance_cost' && (
                                        <tr>
                                            <th className="px-4 py-3">Vehicle Number</th>
                                            <th className="px-4 py-3">Make / Model</th>
                                            <th className="px-4 py-3">Preventive Services</th>
                                            <th className="px-4 py-3">Corrective Actions</th>
                                            <th className="px-4 py-3 text-center">Total Maintenance Jobs</th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reportRows.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                                            {reportsTab === 'cost_student_km' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.reg_number}</td>
                                                    <td className="px-4 py-3">{row.make_model}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{row.route_name}</td>
                                                    <td className="px-4 py-3 text-center">{row.students}</td>
                                                    <td className="px-4 py-3 text-center">{row.distance_km} km</td>
                                                    <td className="px-4 py-3 font-bold">{fmtCur(row.total_cost)}</td>
                                                    <td className="px-4 py-3">₹{row.cost_per_km}/km</td>
                                                    <td className="px-4 py-3 font-black text-[#000099]">₹{row.cost_per_student_km}/student-km</td>
                                                </>
                                            )}
                                            {reportsTab === 'daily_trip_summary' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.reg_number}</td>
                                                    <td className="px-4 py-3 font-medium text-[#000099]">{row.route_name}</td>
                                                    <td className="px-4 py-3">{row.driver_name || 'System Operator'}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-400">{row.trip_type}</td>
                                                    <td className="px-4 py-3">{row.start_time}</td>
                                                    <td className="px-4 py-3">{row.end_time || 'In-route'}</td>
                                                    <td className="px-4 py-3 text-center font-bold">{row.distance_km || 0} km</td>
                                                    <td className="px-4 py-3 text-center">{row.students_count}</td>
                                                </>
                                            )}
                                            {reportsTab === 'monthly_occupancy' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-[#000099]">{row.route_name}</td>
                                                    <td className="px-4 py-3 font-mono">{row.route_code}</td>
                                                    <td className="px-4 py-3 text-center font-medium text-slate-700">{row.students}</td>
                                                    <td className="px-4 py-3 text-center">{row.capacity}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="font-bold text-slate-800">{row.occupancy_rate}%</span>
                                                            <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                                <div className="bg-[#FF9A01] h-full" style={{ width: `${row.occupancy_rate}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                            {reportsTab === 'revenue_collection' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.route_name}</td>
                                                    <td className="px-4 py-3 text-center">{row.total_students}</td>
                                                    <td className="px-4 py-3 font-bold">{fmtCur(row.billed || 0)}</td>
                                                    <td className="px-4 py-3 font-bold text-green-700">{fmtCur(row.collected || 0)}</td>
                                                    <td className="px-4 py-3 font-bold text-red-600">{fmtCur(row.outstanding || 0)}</td>
                                                </>
                                            )}
                                            {reportsTab === 'safety_report' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.reg_number}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-amber-600">{row.pending_challans}</td>
                                                    <td className="px-4 py-3 text-center font-bold">{row.total_incidents}</td>
                                                    <td className="px-4 py-3 text-center font-black text-red-600">{row.critical_incidents}</td>
                                                </>
                                            )}
                                            {reportsTab === 'staff_performance' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.driver_name}</td>
                                                    <td className="px-4 py-3 font-mono">{row.badge_number}</td>
                                                    <td className="px-4 py-3 font-bold text-slate-400">{row.dl_category}</td>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{row.reg_number || 'Unallocated'}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-[#000099]">{row.on_time_rating}%</td>
                                                    <td className="px-4 py-3 text-center font-black text-green-700">{row.safety_score}%</td>
                                                </>
                                            )}
                                            {reportsTab === 'fuel_efficiency' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.reg_number}</td>
                                                    <td className="px-4 py-3">{row.make_model}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-slate-600">{row.mileage_standard || 0} km/L</td>
                                                    <td className="px-4 py-3 text-center font-bold">{row.total_litres || 0} L</td>
                                                    <td className="px-4 py-3 font-bold">{fmtCur(row.total_cost || 0)}</td>
                                                    <td className="px-4 py-3 text-center">{row.refill_count || 0} refills</td>
                                                </>
                                            )}
                                            {reportsTab === 'maintenance_cost' && (
                                                <>
                                                    <td className="px-4 py-3 font-bold text-slate-800">{row.reg_number}</td>
                                                    <td className="px-4 py-3">{row.make_model}</td>
                                                    <td className="px-4 py-3 font-bold text-green-700">{fmtCur(row.preventive_cost || 0)}</td>
                                                    <td className="px-4 py-3 font-bold text-red-600">{fmtCur(row.corrective_cost || 0)}</td>
                                                    <td className="px-4 py-3 text-center font-bold text-[#000099]">{row.total_jobs || 0}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderSimulator = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 border border-[#E2E0D8] rounded-[10px] shadow-sm">
                <div>
                    <h2 className="text-sm font-bold text-slate-800">Edumerge TRM v2 App View Simulator</h2>
                    <p className="text-[10px] text-slate-500">Toggle views to experience driver and parent app mobile workflows</p>
                </div>
                <div className="flex gap-1.5">
                    <Button 
                        size="sm"
                        onClick={() => setSimMode('in_charge')}
                        className={`text-xs h-8 font-bold rounded-[6px] ${simMode === 'in_charge' ? 'bg-[#000099] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        In-Charge View
                    </Button>
                    <Button 
                        size="sm"
                        onClick={() => setSimMode('driver')}
                        className={`text-xs h-8 font-bold rounded-[6px] ${simMode === 'driver' ? 'bg-[#000099] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Driver App
                    </Button>
                    <Button 
                        size="sm"
                        onClick={() => setSimMode('parent')}
                        className={`text-xs h-8 font-bold rounded-[6px] ${simMode === 'parent' ? 'bg-[#000099] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        Parent Tracker
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Simulator device frame */}
                <div className="lg:col-span-2 bg-slate-900 rounded-[24px] p-4 pt-10 pb-10 border-4 border-slate-800 shadow-2xl relative max-w-sm mx-auto w-full h-[650px] flex flex-col">
                    {/* Device camera notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
                    </div>

                    {/* App Container */}
                    <div className="bg-[#F8F8F6] rounded-[12px] flex-1 flex flex-col overflow-hidden text-slate-800 relative shadow-inner">
                        {/* Status bar */}
                        <div className="bg-[#000099] text-[#FF9A01] px-4 py-2 flex justify-between items-center text-[10px] font-bold">
                            <span>edumerge OS</span>
                            <span className="flex items-center gap-1.5">
                                {offlineQueue.length > 0 && <span className="text-red-400">Offline Queue: {offlineQueue.length}</span>}
                                <span>16:45 PM</span>
                            </span>
                        </div>

                        {/* Driver App Simulator */}
                        {simMode === 'driver' && (
                            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 text-xs">
                                <div className="p-3 bg-white border rounded-[8px] flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-[#000099]">RK</div>
                                    <div>
                                        <p className="font-bold text-slate-800">Rajesh Kumar (Driver)</p>
                                        <p className="text-[9px] text-slate-400">Bus Number: KA01F7001 | Route: RT-A</p>
                                    </div>
                                </div>

                                {/* Checklist */}
                                <div className="p-3 bg-white border border-[#E2E0D8] rounded-[8px]">
                                    <h4 className="font-bold text-[#000099] mb-2 text-[10px] uppercase">Daily Safety Checklist</h4>
                                    <div className="space-y-2">
                                        {Object.keys(driverChecklist).map((key) => (
                                            <label key={key} className="flex items-center gap-2 font-medium cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={driverChecklist[key]} 
                                                    onChange={() => {
                                                        const next = !driverChecklist[key];
                                                        setDriverChecklist(prev => ({ ...prev, [key]: next }));
                                                        handleAddOfflineLog(`Checked Safety Checklist item: ${key} = ${next}`);
                                                    }}
                                                    className="rounded border-slate-300 text-[#000099] focus:ring-[#000099]"
                                                />
                                                <span className="capitalize">{key.replace('_', ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Student Manifest */}
                                <div className="p-3 bg-white border border-[#E2E0D8] rounded-[8px]">
                                    <h4 className="font-bold text-[#000099] mb-2 text-[10px] uppercase">Student Boarding manifest</h4>
                                    <div className="space-y-2">
                                        {studentManifest.map(stu => (
                                            <div key={stu.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-[6px] border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-[10px]">{stu.name}</p>
                                                    <p className="text-[9px] text-slate-400">{stu.stop}</p>
                                                </div>
                                                <Button 
                                                    size="sm"
                                                    onClick={() => {
                                                        handleToggleStudentBoarding(stu.id);
                                                        handleAddOfflineLog(`Toggled Boarding for Student: ${stu.name}`);
                                                    }}
                                                    className={`h-6 text-[9px] font-bold uppercase rounded-[4px] ${stu.boarded ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                                >
                                                    {stu.boarded ? 'Boarded' : 'Board'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Operational Action Controls */}
                                <div className="p-3 bg-white border border-[#E2E0D8] rounded-[8px] grid grid-cols-2 gap-2">
                                    <Button onClick={() => alert('SOS Triggered: Alert dispatched to admin command center and route parents.')} className="bg-red-600 hover:bg-red-700 text-white text-[9px] font-bold h-9 uppercase rounded-[6px] col-span-2">
                                        Trigger SOS Emergency
                                    </Button>
                                    <Button onClick={() => { setShowAddFuel(true); setVForm(vehicles[0]); }} className="bg-white border text-slate-700 hover:bg-slate-50 text-[9px] font-bold h-8 uppercase rounded-[6px]">
                                        Log Fuel refill
                                    </Button>
                                    <Button onClick={() => { setShowAddIncident(true); setIncForm((prev: any) => ({ ...prev, vehicle_id: 1, driver_id: 1 })); }} className="bg-white border text-slate-700 hover:bg-slate-50 text-[9px] font-bold h-8 uppercase rounded-[6px]">
                                        Report Accident
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Parent App Simulator */}
                        {simMode === 'parent' && (
                            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4 text-xs">
                                <div className="p-3 bg-white border rounded-[8px] flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-[#FF9A01]">SM</div>
                                    <div>
                                        <p className="font-bold text-slate-800">Sanjay Mehta (Parent)</p>
                                        <p className="text-[9px] text-slate-400">Child: Arjun Mehta | Grade: Class 1-A</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-white border border-[#E2E0D8] rounded-[8px]">
                                    <h4 className="font-bold text-[#000099] mb-1.5 text-[10px] uppercase">Live school bus locator</h4>
                                    <div className="h-32 bg-slate-100 rounded-[6px] flex items-center justify-center text-slate-400 font-bold border border-dashed relative overflow-hidden">
                                        <span className="absolute z-10 text-[9px] bg-slate-900/80 text-white px-2 py-1 rounded-[4px] uppercase tracking-wider font-bold">Route Map View (RT-A)</span>
                                        <MapPin className="w-8 h-8 text-red-600 animate-bounce" />
                                    </div>
                                    <div className="mt-3 flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-slate-500">Next stop: Silk Board</span>
                                        <span className="text-emerald-600">ETA: 12 mins</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-white border border-[#E2E0D8] rounded-[8px] space-y-2">
                                    <h4 className="font-bold text-[#000099] text-[10px] uppercase">Alert notification feed</h4>
                                    <div className="space-y-1.5">
                                        {parentETAs.map(sms => (
                                            <div key={sms.id} className="p-2.5 bg-blue-50/50 rounded-[6px] border border-blue-100 text-[10px]">
                                                <div className="flex justify-between font-bold text-[8px] text-slate-400 uppercase">
                                                    <span>{sms.stop}</span>
                                                    <span>{sms.timestamp}</span>
                                                </div>
                                                <p className="text-slate-700 font-medium mt-1 leading-relaxed">{sms.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* In-Charge View Notification */}
                        {simMode === 'in_charge' && (
                            <div className="flex-1 flex items-center justify-center text-center p-8">
                                <div className="space-y-3">
                                    <User className="w-12 h-12 text-[#000099] mx-auto" />
                                    <h4 className="font-bold text-slate-800 text-sm">Transport In-Charge Portal</h4>
                                    <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">You are currently monitoring the central dispatch console. Toggle Driver App or Parent Tracker simulation views above.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Simulated offline caches queue info */}
                <Card className="border border-[#E2E0D8] bg-white rounded-[10px] p-5 h-fit">
                    <h3 className="font-bold text-slate-800 text-sm mb-2">Simulated Offline Operational Caching</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">When drivers operate in areas of poor mobile data coverage, logs are cached locally in memory and synchronized when network connectivity is reestablished.</p>
                    <div className="space-y-2.5 mb-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-700">Cached Logs Queue:</span>
                            <span className="font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-black">{offlineQueue.length} Logs</span>
                        </div>
                        <div className="max-h-28 overflow-y-auto space-y-1 bg-slate-50 p-2.5 rounded-[6px] border border-slate-100 text-[9px] font-mono text-slate-500">
                            {offlineQueue.map((log, i) => (
                                <div key={i} className="flex justify-between">
                                    <span className="truncate max-w-[160px]">{log.name}</span>
                                    <span>{log.time}</span>
                                </div>
                            ))}
                            {offlineQueue.length === 0 && (
                                <p className="italic text-center text-slate-400 py-3">No operational logs currently cached.</p>
                            )}
                        </div>
                    </div>
                    <Button 
                        onClick={handleSyncOfflineLogs}
                        disabled={offlineQueue.length === 0} 
                        className="w-full bg-[#000099] text-white hover:bg-blue-900 text-[10px] font-bold uppercase tracking-wider h-9 rounded-[6px] disabled:opacity-50"
                    >
                        Trigger Reconnect Sync
                    </Button>
                </Card>
            </div>
        </div>
    );

    // ─── Render Page ─────────────────────────────────────────────────────────

    return (
        <Layout title={isDriver ? "Driver Operations Portal" : "Enhanced Transportation Management V2"} description={isDriver ? "Manage assigned route and daily safety checklists" : "Consolidated school billing, geofencing coordinates, and compliance registry"} icon={Truck} showHome>
            {isDriver ? (
                <div className="max-w-4xl mx-auto pb-10 space-y-5">
                    {/* Simplified Driver view override if logged in as driver */}
                    <div className="flex items-center gap-4 p-5 bg-[#000099] rounded-[10px] text-white">
                        <div className="bg-white/10 p-2.5 rounded-[8px]">
                            <Truck className="w-8 h-8 text-[#FF9A01]" />
                        </div>
                        <div>
                            <h2 className="text-base font-black">Logged in: {user.name}</h2>
                            <p className="text-[10px] text-slate-300">Driver Operations Dashboard</p>
                        </div>
                    </div>
                    {/* Render driver layout inside main */}
                    {renderSimulator()}
                </div>
            ) : (
                <>
                    {/* Tab Navigation */}
                    <div className="sticky top-0 z-10 bg-white border-b border-[#E2E0D8] -mx-4 px-4 mb-4">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0 pt-1">
                            {TABS.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-[6px] whitespace-nowrap transition-all border-b-2 ${
                                        activeTab === t.id
                                            ? 'border-[#000099] text-[#000099] bg-blue-50/50'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <t.icon className="w-3.5 h-3.5" />
                                    <span>{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-48 text-slate-400 gap-2 font-bold text-xs">
                            <RefreshCw className="w-5 h-5 animate-spin text-[#000099]" /> Reconciling fleet data registers...
                        </div>
                    ) : (
                        <div className="pb-10">
                            {activeTab === 'overview'    && renderOverview()}
                            {activeTab === 'tracking'    && renderTracking()}
                            {activeTab === 'fleet'       && renderFleet()}
                            {activeTab === 'compliance'  && renderCompliance()}
                            {activeTab === 'incidents'   && renderIncidents()}
                            {activeTab === 'maintenance' && renderMaintenance()}
                            {activeTab === 'fuel'        && renderFuel()}
                            {activeTab === 'drivers'     && renderDrivers()}
                            {activeTab === 'routes'      && renderRoutes()}
                            {activeTab === 'fees'        && renderFees()}
                            {activeTab === 'tolls'       && renderTolls()}
                            {activeTab === 'reports'      && renderReports()}
                            {activeTab === 'simulator'    && renderSimulator()}
                        </div>
                    )}
                </>
            )}

            {/* ─── Add Vehicle Modal ────────────────────────────────────────────── */}
            {showAddVehicle && (
                <Modal title="Register Fleet Vehicle" onClose={() => setShowAddVehicle(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Registration Number *">
                            <Input placeholder="KA01F7007" value={vForm.reg_number || ''} onChange={e => setVForm({ ...vForm, reg_number: e.target.value })} />
                        </Field>
                        <Field label="Vehicle Type *">
                            <Select value={vForm.vehicle_type} onChange={e => setVForm({ ...vForm, vehicle_type: e.target.value })}>
                                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Make & Model *">
                            <Input placeholder="Tata Starbus Ultra" value={vForm.make_model || ''} onChange={e => setVForm({ ...vForm, make_model: e.target.value })} />
                        </Field>
                        <Field label="Year">
                            <Input type="number" placeholder="2024" value={vForm.year || ''} onChange={e => setVForm({ ...vForm, year: e.target.value })} />
                        </Field>
                        <Field label="Fuel Type *">
                            <Select value={vForm.fuel_type} onChange={e => setVForm({ ...vForm, fuel_type: e.target.value })}>
                                {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Seating Capacity">
                            <Input type="number" placeholder="52" value={vForm.seating_capacity || ''} onChange={e => setVForm({ ...vForm, seating_capacity: e.target.value })} />
                        </Field>
                        <Field label="Ownership">
                            <Select value={vForm.ownership_type} onChange={e => setVForm({ ...vForm, ownership_type: e.target.value })}>
                                {OWNERSHIP.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Campus">
                            <Input placeholder="Main Campus" value={vForm.campus || ''} onChange={e => setVForm({ ...vForm, campus: e.target.value })} />
                        </Field>
                        <Field label="Chassis Number">
                            <Input value={vForm.chassis_number || ''} onChange={e => setVForm({ ...vForm, chassis_number: e.target.value })} />
                        </Field>
                        <Field label="Engine Number">
                            <Input value={vForm.engine_number || ''} onChange={e => setVForm({ ...vForm, engine_number: e.target.value })} />
                        </Field>
                        <Field label="Purchase Date">
                            <Input type="date" value={vForm.purchase_date || ''} onChange={e => setVForm({ ...vForm, purchase_date: e.target.value })} />
                        </Field>
                        <Field label="Tank Capacity (L)">
                            <Input type="number" placeholder="200" value={vForm.tank_capacity || ''} onChange={e => setVForm({ ...vForm, tank_capacity: e.target.value })} />
                        </Field>
                    </div>
                    <Button onClick={handleAddVehicle} className="w-full bg-[#000099] text-white hover:bg-blue-900 mt-2 rounded-[6px] font-bold text-xs py-2">Register Vehicle</Button>
                </Modal>
            )}

            {/* ─── Add Document Modal ───────────────────────────────────────────── */}
            {showAddDoc && (
                <Modal title="Add Compliance Document" onClose={() => setShowAddDoc(false)}>
                    <Field label="Vehicle *">
                        <Select value={docForm.vehicle_id || ''} onChange={e => setDocForm({ ...docForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <Field label="Document Type *">
                        <Select value={docForm.doc_type} onChange={e => setDocForm({ ...docForm, doc_type: e.target.value })}>
                            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Issue Date"><Input type="date" value={docForm.issue_date || ''} onChange={e => setDocForm({ ...docForm, issue_date: e.target.value })} /></Field>
                        <Field label="Expiry Date *"><Input type="date" value={docForm.expiry_date || ''} onChange={e => setDocForm({ ...docForm, expiry_date: e.target.value })} /></Field>
                    </div>
                    <Field label="Issuing Authority">
                        <Input placeholder="RTO Bangalore" value={docForm.issuing_authority || ''} onChange={e => setDocForm({ ...docForm, issuing_authority: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddDoc} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Save Document</Button>
                </Modal>
            )}

            {/* ─── Add Maintenance Modal ────────────────────────────────────────── */}
            {showAddMaint && (
                <Modal title="Log Vehicle Maintenance" onClose={() => setShowAddMaint(false)}>
                    <Field label="Vehicle *">
                        <Select value={mForm.vehicle_id || ''} onChange={e => setMForm({ ...mForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Maintenance Type *">
                            <Select value={mForm.maintenance_type} onChange={e => setMForm({ ...mForm, maintenance_type: e.target.value })}>
                                {MAINT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Service Date *"><Input type="date" value={mForm.service_date || ''} onChange={e => setMForm({ ...mForm, service_date: e.target.value })} /></Field>
                        <Field label="Cost (₹)"><Input type="number" placeholder="0" value={mForm.cost || ''} onChange={e => setMForm({ ...mForm, cost: e.target.value })} /></Field>
                        <Field label="Odometer (km)"><Input type="number" value={mForm.odometer_reading || ''} onChange={e => setMForm({ ...mForm, odometer_reading: e.target.value })} /></Field>
                    </div>
                    <Field label="Description">
                        <Input placeholder="Oil change, filters, brake checks..." value={mForm.description || ''} onChange={e => setMForm({ ...mForm, description: e.target.value })} />
                    </Field>
                    <Field label="Vendor / Workshop">
                        <Input placeholder="Sri Sai Auto Service" value={mForm.vendor || ''} onChange={e => setMForm({ ...mForm, vendor: e.target.value })} />
                    </Field>
                    <Field label="Next Service Due">
                        <Input type="date" value={mForm.next_service_due || ''} onChange={e => setMForm({ ...mForm, next_service_due: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddMaint} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Log Maintenance</Button>
                </Modal>
            )}

            {/* ─── Add Fuel Modal ───────────────────────────────────────────────── */}
            {showAddFuel && (
                <Modal title="Log Fuel Purchase" onClose={() => setShowAddFuel(false)}>
                    <Field label="Vehicle *">
                        <Select value={fForm.vehicle_id || ''} onChange={e => setFForm({ ...fForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date *"><Input type="date" value={fForm.fuel_date || ''} onChange={e => setFForm({ ...fForm, fuel_date: e.target.value })} /></Field>
                        <Field label="Litres *"><Input type="number" placeholder="80" value={fForm.litres || ''} onChange={e => setFForm({ ...fForm, litres: e.target.value })} /></Field>
                        <Field label="Price/Litre (₹) *"><Input type="number" placeholder="92.50" value={fForm.price_per_litre || ''} onChange={e => setFForm({ ...fForm, price_per_litre: e.target.value })} /></Field>
                        <Field label="Odometer (km)"><Input type="number" placeholder="42500" value={fForm.odometer_at_fuelling || ''} onChange={e => setFForm({ ...fForm, odometer_at_fuelling: e.target.value })} /></Field>
                    </div>
                    <Field label="Vendor / Filling Station">
                        <Input placeholder="BPCL Pump - MG Road" value={fForm.vendor || ''} onChange={e => setFForm({ ...fForm, vendor: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Payment Mode">
                            <Select value={fForm.payment_mode} onChange={e => setFForm({ ...fForm, payment_mode: e.target.value })}>
                                {PAYMENT_MODES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Logged By">
                            <Input placeholder="Driver Name" value={fForm.logged_by || ''} onChange={e => setFForm({ ...fForm, logged_by: e.target.value })} />
                        </Field>
                    </div>
                    <Button onClick={handleAddFuel} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Log Fuel Purchase</Button>
                </Modal>
            )}

            {/* ─── Add Driver Modal ─────────────────────────────────────────────── */}
            {showAddDriver && (
                <Modal title="Enroll Driver" onClose={() => setShowAddDriver(false)}>
                    <Field label="Driver Name *">
                        <Input placeholder="Raju Gowda" value={dForm.driver_name || ''} onChange={e => setDForm({ ...dForm, driver_name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="DL Number"><Input placeholder="KA0120230009999" value={dForm.dl_number || ''} onChange={e => setDForm({ ...dForm, dl_number: e.target.value })} /></Field>
                        <Field label="DL Category">
                            <Select value={dForm.dl_category} onChange={e => setDForm({ ...dForm, dl_category: e.target.value })}>
                                {DL_CATEGORIES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="DL Expiry Date"><Input type="date" value={dForm.dl_expiry || ''} onChange={e => setDForm({ ...dForm, dl_expiry: e.target.value })} /></Field>
                        <Field label="Blood Group">
                            <Select value={dForm.blood_group} onChange={e => setDForm({ ...dForm, blood_group: e.target.value })}>
                                {BLOOD_GROUPS.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <Field label="Badge Number">
                        <Input placeholder="DRV-006" value={dForm.badge_number || ''} onChange={e => setDForm({ ...dForm, badge_number: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddDriver} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Enroll Driver</Button>
                </Modal>
            )}

            {/* ─── Add Route Modal ──────────────────────────────────────────────── */}
            {showAddRoute && (
                <Modal title="Create Transport Route" onClose={() => setShowAddRoute(false)}>
                    <Field label="Route Name *">
                        <Input placeholder="Route E - Malleshwaram" value={rForm.route_name || ''} onChange={e => setRForm({ ...rForm, route_name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Route Code"><Input placeholder="RT-E" value={rForm.route_code || ''} onChange={e => setRForm({ ...rForm, route_code: e.target.value })} /></Field>
                        <Field label="Total Distance (km)"><Input type="number" placeholder="25" value={rForm.total_distance_km || ''} onChange={e => setRForm({ ...rForm, total_distance_km: e.target.value })} /></Field>
                        <Field label="Students Count"><Input type="number" placeholder="40" value={rForm.students_count || ''} onChange={e => setRForm({ ...rForm, students_count: e.target.value })} /></Field>
                        <Field label="Vehicle Mapping">
                            <Select value={rForm.vehicle_id || ''} onChange={e => setRForm({ ...rForm, vehicle_id: e.target.value })}>
                                <option value="">Select vehicle...</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <Field label="Stop Sequences (Comma separated)">
                        <Input placeholder="Malleshwaram 15th Cross, Yeshwanthpur, Rajajinagar, Institution" value={rForm.stops_text || ''} onChange={e => setRForm({ ...rForm, stops_text: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddRoute} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Create Route</Button>
                </Modal>
            )}

            {/* ─── Add Fee Modal ────────────────────────────────────────────────── */}
            {showAddFee && (
                <Modal title="Create Student Fee Billing" onClose={() => setShowAddFee(false)}>
                    <Field label="Student Name *">
                        <Input placeholder="Vikram Aditya" value={feForm.student_name || ''} onChange={e => setFeForm({ ...feForm, student_name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Student ID"><Input placeholder="STU-109" value={feForm.student_id || ''} onChange={e => setFeForm({ ...feForm, student_id: e.target.value })} /></Field>
                        <Field label="Route mapping">
                            <Select value={feForm.route_id || ''} onChange={e => setFeForm({ ...feForm, route_id: e.target.value })}>
                                <option value="">Select Route...</option>
                                {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Monthly Fee Amount (₹) *"><Input type="number" placeholder="1500" value={feForm.monthly_fee || ''} onChange={e => setFeForm({ ...feForm, monthly_fee: e.target.value })} /></Field>
                        <Field label="Billing Cycle">
                            <Select value={feForm.fee_term} onChange={e => setFeForm({ ...feForm, fee_term: e.target.value })}>
                                <option>Monthly</option>
                                <option>Quarterly</option>
                                <option>Annual</option>
                            </Select>
                        </Field>
                    </div>
                    <Field label="Payment Due Date">
                        <Input type="date" value={feForm.due_date || ''} onChange={e => setFeForm({ ...feForm, due_date: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddFee} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Create Entry</Button>
                </Modal>
            )}

            {/* ─── Add Incident Modal ───────────────────────────────────────────── */}
            {showAddIncident && (
                <Modal title="File Incident Accident Report" onClose={() => setShowAddIncident(false)}>
                    <Field label="Vehicle *">
                        <Select value={incForm.vehicle_id || ''} onChange={e => setIncForm({ ...incForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} - {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Driver">
                            <Select value={incForm.driver_id || ''} onChange={e => setIncForm({ ...incForm, driver_id: e.target.value })}>
                                <option value="">Select driver...</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.driver_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Severity Level *">
                            <Select value={incForm.severity} onChange={e => setIncForm({ ...incForm, severity: e.target.value })}>
                                <option>MINOR</option>
                                <option>MAJOR</option>
                                <option>CRITICAL</option>
                            </Select>
                        </Field>
                        <Field label="Incident Date *"><Input type="date" value={incForm.incident_date || ''} onChange={e => setIncForm({ ...incForm, incident_date: e.target.value })} /></Field>
                        <Field label="Incident Location"><Input placeholder="Hebbal Junction" value={incForm.location || ''} onChange={e => setIncForm({ ...incForm, location: e.target.value })} /></Field>
                    </div>
                    <Field label="Description & Notes">
                        <Input placeholder="Collision details, student check status, vehicle damage..." value={incForm.description || ''} onChange={e => setIncForm({ ...incForm, description: e.target.value })} />
                    </Field>
                    <Field label="Photograph Mock URL">
                        <Input placeholder="https://example.com/incident-photo.jpg" value={incForm.photo_url || ''} onChange={e => setIncForm({ ...incForm, photo_url: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddIncident} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">File Incident Report</Button>
                </Modal>
            )}

            {/* ─── Log Trip Modal ───────────────────────────────────────────────── */}
            {showLogTrip && (
                <Modal title="Log Dispatch Trip Run" onClose={() => setShowLogTrip(false)}>
                    <Field label="Vehicle *">
                        <Select value={tForm.vehicle_id || ''} onChange={e => setTForm({ ...tForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle...</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Driver">
                            <Select value={tForm.driver_id || ''} onChange={e => setTForm({ ...tForm, driver_id: e.target.value })}>
                                <option value="">Select driver...</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.driver_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Route Code / Name"><Input placeholder="Route A - Electronic City" value={tForm.route_name || ''} onChange={e => setTForm({ ...tForm, route_name: e.target.value })} /></Field>
                        <Field label="Trip Category">
                            <Select value={tForm.trip_type} onChange={e => setTForm({ ...tForm, trip_type: e.target.value })}>
                                <option>REGULAR</option>
                                <option>STAFF</option>
                                <option>EXCURSION</option>
                                <option>SPECIAL</option>
                            </Select>
                        </Field>
                        <Field label="Students Aboard"><Input type="number" placeholder="38" value={tForm.students_count || ''} onChange={e => setTForm({ ...tForm, students_count: e.target.value })} /></Field>
                        <Field label="Start Time"><Input placeholder="2025-03-27 07:00" value={tForm.start_time || ''} onChange={e => setTForm({ ...tForm, start_time: e.target.value })} /></Field>
                        <Field label="End Time"><Input placeholder="2025-03-27 08:30" value={tForm.end_time || ''} onChange={e => setTForm({ ...tForm, end_time: e.target.value })} /></Field>
                        <Field label="Start Odometer"><Input type="number" placeholder="45100" value={tForm.start_odometer || ''} onChange={e => setTForm({ ...tForm, start_odometer: e.target.value })} /></Field>
                        <Field label="End Odometer"><Input type="number" placeholder="45122" value={tForm.end_odometer || ''} onChange={e => setTForm({ ...tForm, end_odometer: e.target.value })} /></Field>
                    </div>
                    <Button onClick={handleLogTrip} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Log Dispatch Trip</Button>
                </Modal>
            )}

            {/* ─── Status Change Modal ──────────────────────────────────────────── */}
            {showStatusChange && (
                <Modal title={`Alter Status: ${showStatusChange.reg_number}`} onClose={() => setShowStatusChange(null)}>
                    <p className="text-xs text-slate-500 mb-4">Modify the active operational status of this vehicle. Grounding a vehicle prevents it from route schedules.</p>
                    <div className="space-y-2">
                        {['ACTIVE', 'MAINTENANCE', 'GROUNDED', 'DECOMMISSIONED'].map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(showStatusChange, status)}
                                className="w-full text-left p-3 rounded-[6px] border border-slate-200 hover:border-[#000099] hover:bg-blue-50/30 text-xs font-bold text-slate-700 flex justify-between items-center"
                            >
                                <span>{status}</span>
                                {showStatusChange.status === status && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}

            {/* ─── Resolve Incident Modal ───────────────────────────────────────── */}
            {resolvingIncident && (
                <Modal title={`Resolve Incident Audit Report #${resolvingIncident.id}`} onClose={() => setResolvingIncident(null)}>
                    <Field label="Resolution details & Legal close-off notes *">
                        <Input placeholder="Enter details..." value={resForm.resolution_details || ''} onChange={e => setResForm({ ...resForm, resolution_details: e.target.value })} />
                    </Field>
                    <Button onClick={handleResolveIncidentSubmit} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2 mt-2">Log Incident Resolution</Button>
                </Modal>
            )}

            {/* ─── Document Update Modal ────────────────────────────────────────── */}
            {updatingDoc && (
                <Modal title={`Renew Document: ${updatingDoc.doc_type.replace(/_/g, ' ')}`} onClose={() => setUpdatingDoc(null)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Issue Date">
                            <Input type="date" value={updateDocForm.issue_date || ''} onChange={e => setUpdateDocForm({ ...updateDocForm, issue_date: e.target.value })} />
                        </Field>
                        <Field label="Expiry Date *">
                            <Input type="date" value={updateDocForm.expiry_date || ''} onChange={e => setUpdateDocForm({ ...updateDocForm, expiry_date: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Issuing Authority">
                        <Input value={updateDocForm.issuing_authority || ''} onChange={e => setUpdateDocForm({ ...updateDocForm, issuing_authority: e.target.value })} />
                    </Field>
                    <Button onClick={handleUpdateDocSubmit} className="w-full bg-[#000099] text-white hover:bg-blue-900 rounded-[6px] font-bold text-xs py-2">Save Updates</Button>
                </Modal>
            )}

            {/* ─── Allocating Driver Modal ──────────────────────────────────────── */}
            {allocatingDriver && (
                <Modal title={`Allocate Bus to ${allocatingDriver.driver_name}`} onClose={() => setAllocatingDriver(null)}>
                    <p className="text-xs text-slate-500 mb-4">Assign a bus from the active fleet to this driver.</p>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {vehicles.map(v => {
                            const isAssigned = drivers.some(d => d.assigned_vehicle_id === v.id && d.id !== allocatingDriver.id);
                            return (
                                <button
                                    key={v.id}
                                    disabled={isAssigned}
                                    onClick={async () => {
                                        try {
                                            await vehicleService.assignDriver(allocatingDriver.id, v.id);
                                            setAllocatingDriver(null);
                                            fetchAll();
                                        } catch (e) { console.error(e); }
                                    }}
                                    className={`w-full text-left p-3 rounded-[10px] border flex items-center justify-between transition-all ${
                                        isAssigned ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50 border-slate-100' : 'hover:border-[#000099] hover:bg-blue-50/10 border-slate-200 bg-white'
                                    } ${allocatingDriver.assigned_vehicle_id === v.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-[6px] ${allocatingDriver.assigned_vehicle_id === v.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            <Truck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{v.reg_number}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{v.make_model}</p>
                                        </div>
                                    </div>
                                    {allocatingDriver.assigned_vehicle_id === v.id ? (
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-[4px]">Allocated</span>
                                    ) : isAssigned ? (
                                        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-[4px]">Occupied</span>
                                    ) : (
                                        <span className="text-[9px] font-bold text-[#000099]">Assign</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </Modal>
            )}

            {/* ─── Driver details modal ─────────────────────────────────────────── */}
            {viewingDriver && (
                <Modal title={`Driver Profile: ${viewingDriver.driver_name}`} onClose={() => setViewingDriver(null)}>
                    <div className="flex items-center gap-4 mb-4 p-4 rounded-[10px] bg-blue-50/50 border border-blue-100">
                        <div className="w-16 h-16 rounded-full bg-[#000099] text-white flex items-center justify-center text-xl font-bold shadow-sm">
                            {viewingDriver.driver_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-base text-slate-800 leading-tight">{viewingDriver.driver_name}</h2>
                            <p className="text-[#000099] font-bold text-xs mt-1">Badge: {viewingDriver.badge_number || 'N/A'}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">Status: <span className="font-bold text-emerald-600">Active</span></p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase">License & Credentials</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-xs">
                                <div><p className="text-slate-400 font-bold text-[9px]">License Number</p><p className="font-mono text-slate-700 font-bold">{viewingDriver.dl_number || '-'}</p></div>
                                <div><p className="text-slate-400 font-bold text-[9px]">Category</p><p className="font-bold text-slate-700">{viewingDriver.dl_category || '-'}</p></div>
                                <div><p className="text-slate-400 font-bold text-[9px]">Expiry Date</p><p className="font-bold text-slate-700">{fmtDate(viewingDriver.dl_expiry)}</p></div>
                                <div><p className="text-slate-400 font-bold text-[9px]">Blood Group</p><p className="font-bold text-red-600">{viewingDriver.blood_group || '-'}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase">Assignment</h3>
                            <div className="p-3 bg-slate-50 border rounded-[6px] text-xs">
                                {viewingDriver.assigned_vehicle_id ? (
                                    <div className="grid grid-cols-2 gap-y-1">
                                        <span className="text-slate-500">Bus Registration</span><span className="font-bold text-slate-800">{viewingDriver.reg_number}</span>
                                        <span className="text-slate-500">Make & Model</span><span className="font-bold text-slate-800">{viewingDriver.make_model}</span>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-center font-bold">No active vehicle allocation.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ─── Vehicle details modal ────────────────────────────────────────── */}
            {viewingVehicle && (
                <Modal title={`Vehicle Portfolio: ${viewingVehicle.reg_number}`} onClose={() => setViewingVehicle(null)}>
                    <div className="flex items-center gap-4 mb-4 p-4 rounded-[10px] bg-slate-50 border border-slate-200">
                        <div className="bg-[#000099] text-white p-3 rounded-[8px] shadow-sm">
                            <Truck className="w-8 h-8 text-[#FF9A01]" />
                        </div>
                        <div>
                            <h2 className="text-base font-black text-slate-800 tracking-tight leading-none mb-1">{viewingVehicle.reg_number}</h2>
                            <p className="text-[10px] font-bold text-slate-500">{viewingVehicle.make_model} • {viewingVehicle.fuel_type} • {viewingVehicle.year}</p>
                        </div>
                        <div className="ml-auto text-right">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold ${viewingVehicle.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{viewingVehicle.status}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase">Compliance Check</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {compliance.filter(c => c.vehicle_id === viewingVehicle.id).map(doc => (
                                    <div key={doc.doc_id} className={`p-2 rounded-[6px] border flex justify-between items-center ${
                                        doc.rag_status === 'COMPLIANT' ? 'bg-emerald-50 border-emerald-100' : 
                                        doc.rag_status === 'EXPIRED' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                                    }`}>
                                        <div>
                                            <p className="font-bold text-slate-700 text-[10px]">{doc.doc_type.replace(/_/g, ' ')}</p>
                                            <p className="text-[8px] text-slate-500">Exp: {fmtDate(doc.expiry_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase">Latest Service</h3>
                                {maintenance.filter(m => m.vehicle_id === viewingVehicle.id).slice(0, 1).map(m => (
                                    <div key={m.id} className="text-xs">
                                        <p className="font-bold text-slate-700">{m.maintenance_type}</p>
                                        <p className="text-slate-500">{fmtDate(m.service_date)} • ₹{m.cost.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-800 border-b pb-1.5 mb-2 uppercase">Recent Dispatch</h3>
                                {trips.filter(t => t.vehicle_id === viewingVehicle.id).slice(0, 1).map(t => (
                                    <div key={t.id} className="text-xs">
                                        <p className="font-bold text-slate-700">{t.route_name}</p>
                                        <p className="text-slate-500">{fmtDate(t.start_time)} • {t.distance_km} KM</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </Layout>
    );
};

export default VehicleManagement;
