import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
    Truck, AlertTriangle, CheckCircle, Fuel,
    Wrench, Users, MapPin, DollarSign, BarChart2, Plus,
    Shield, Activity, TrendingUp, RefreshCw, ChevronRight,
    Navigation, AlertCircle, Zap, Receipt,
    CheckCircle2, FileText
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle, VehicleDoc, MaintenanceRecord, FuelLog, DriverProfile, Route, FeeRecord, Trip, FastagLog, ChallanRecord } from '../services/vehicleService';
import { usePersona } from '../contexts/PersonaContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'overview',     label: 'Overview',    icon: BarChart2  },
    { id: 'tracking',     label: 'Tracking',    icon: Navigation },
    { id: 'fleet',        label: 'Fleet',       icon: Truck      },
    { id: 'compliance',   label: 'Compliance',  icon: Shield     },
    { id: 'maintenance',  label: 'Maintenance', icon: Wrench     },
    { id: 'fuel',         label: 'Fuel',        icon: Fuel       },
    { id: 'drivers',      label: 'Drivers',     icon: Users      },
    { id: 'routes',       label: 'Routes',      icon: MapPin     },
    { id: 'fees',         label: 'Fees',        icon: DollarSign },
    { id: 'tolls',        label: 'Tolls & Fines', icon: Receipt  },
    { id: 'analytics',    label: 'Analytics',   icon: TrendingUp },
];

const VEHICLE_TYPES  = ['BUS', 'VAN', 'CAR', 'TEMPO', 'TWO_WHEELER', 'OTHER'];
const FUEL_TYPES     = ['DIESEL', 'CNG', 'PETROL', 'ELECTRIC'];
const OWNERSHIP      = ['OWNED', 'HIRED', 'LEASED'];
const DOC_TYPES      = ['INSURANCE', 'PUC', 'FITNESS_CERT', 'PERMIT', 'SPEED_GOVERNOR', 'ROAD_TAX', 'CCTV', 'DRIVER_DL', 'EMERGENCY_EXIT'];
const MAINT_TYPES    = ['PREVENTIVE', 'CORRECTIVE', 'REGULATORY', 'SAFETY', 'TYRE', 'BATTERY'];
const PAYMENT_MODES  = ['VOUCHER', 'CASH', 'CARD', 'FUEL_CARD'];
const DL_CATEGORIES  = ['HMV', 'LMV', 'MCWG'];
const BLOOD_GROUPS   = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const PIE_COLORS     = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];
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

const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtCur  = (n: number) => `₹${n?.toLocaleString('en-IN') ?? 0}`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, icon: Icon }: any) => (
    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
            {sub && <p className="text-[10px] font-medium text-slate-400 mt-1">{sub}</p>}
        </div>
    </div>
);

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-semibold text-slate-800">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>
            <div className="p-5 space-y-3">{children}</div>
        </div>
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
        {children}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);

const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => (
    <select {...props} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
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
    const [analytics, setAnalytics]     = useState<any>({});

    // Modal state
    const [showAddVehicle,    setShowAddVehicle]    = useState(false);
    const [showAddDoc,        setShowAddDoc]        = useState(false);
    const [showAddMaint,      setShowAddMaint]      = useState(false);
    const [showAddFuel,       setShowAddFuel]       = useState(false);
    const [showAddDriver,     setShowAddDriver]     = useState(false);
    const [showAddRoute,      setShowAddRoute]      = useState(false);
    const [showAddFee,        setShowAddFee]        = useState(false);
    const [showLogTrip,       setShowLogTrip]       = useState(false);
    const [showStatusChange,  setShowStatusChange]  = useState<Vehicle | null>(null);
    const [updatingDoc,       setUpdatingDoc]       = useState<VehicleDoc | null>(null);
    const [viewingDriver,     setViewingDriver]     = useState<DriverProfile | null>(null);
    const [viewingVehicle,    setViewingVehicle]    = useState<Vehicle | null>(null);
    const [allocatingDriver,  setAllocatingDriver]  = useState<DriverProfile | null>(null);

    // Form state
    const [vForm, setVForm]   = useState<any>({ vehicle_type: 'BUS', fuel_type: 'DIESEL', ownership_type: 'OWNED', campus: 'Main Campus' });
    const [dForm, setDForm]   = useState<any>({ dl_category: 'HMV', blood_group: 'O+' });
    const [mForm, setMForm]   = useState<any>({ maintenance_type: 'PREVENTIVE', status: 'COMPLETED' });
    const [fForm, setFForm]   = useState<any>({ payment_mode: 'VOUCHER' });
    const [rForm, setRForm]   = useState<any>({ stops_text: '' });
    const [feForm, setFeForm] = useState<any>({ fee_term: 'Monthly' });
    const [tForm, setTForm]   = useState<any>({ trip_type: 'REGULAR' });
    const [docForm, setDocForm] = useState<any>({ doc_type: 'INSURANCE' });
    const [updateDocForm, setUpdateDocForm] = useState<any>({});

    // ─── Fetch helpers ────────────────────────────────────────────────────────

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [dash, fleet, comp, maint, fuelD, drv, rts, feeD, tripD, ana, tollsFines] = await Promise.all([
                vehicleService.getDashboard(),
                vehicleService.getFleet(),
                vehicleService.getCompliance(),
                vehicleService.getMaintenance(),
                vehicleService.getFuel(),
                vehicleService.getDrivers(),
                vehicleService.getRoutes(),
                vehicleService.getFees(),
                vehicleService.getTrips(),
                vehicleService.getAnalytics(),
                vehicleService.getTollsAndFines(),
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
            setAnalytics(ana);
            setFastags(tollsFines.fastags || []);
            setChallans(tollsFines.challans || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

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
        fetchAll();
    };

    const handleStatusChange = async (vehicle: Vehicle, status: string) => {
        await vehicleService.updateStatus(vehicle.id, status);
        setShowStatusChange(null);
        fetchAll();
    };

    // ─── Derived data ─────────────────────────────────────────────────────────

    const compByVehicle = compliance.reduce((acc: any, d) => {
        if (!acc[d.vehicle_id]) acc[d.vehicle_id] = { reg_number: d.reg_number, make_model: d.make_model, docs: [], maxSeverity: 0 };
        acc[d.vehicle_id].docs.push(d);
        
        const sevMap: any = { 'EXPIRED': 3, 'CRITICAL': 2, 'WARNING': 1, 'COMPLIANT': 0 };
        const sev = sevMap[d.rag_status] || 0;
        if (sev > acc[d.vehicle_id].maxSeverity) acc[d.vehicle_id].maxSeverity = sev;
        
        return acc;
    }, {});

    const sortedCompByVehicle = Object.values(compByVehicle).sort((a: any, b: any) => b.maxSeverity - a.maxSeverity);

    const vehicleStatusData = [
        { name: 'Active',      value: dashboard.fleet?.active        || 0 },
        { name: 'Maintenance', value: dashboard.fleet?.in_maintenance || 0 },
        { name: 'Grounded',    value: dashboard.fleet?.grounded       || 0 },
    ].filter(d => d.value > 0);

    const anomalyCount  = fuel.filter(f => f.anomaly_flag !== 'NONE').length;
    const overdueCount  = fees.filter(f => f.status === 'OVERDUE').length;
    const dlExpiring    = drivers.filter(d => {
        const days = Math.ceil((new Date(d.dl_expiry).getTime() - Date.now()) / 86400000);
        return days <= 30;
    }).length;

    // ─── Tab Renderers ────────────────────────────────────────────────────────

    const renderOverview = () => (
        <div className="space-y-4">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard label="Total Fleet"        value={dashboard.fleet?.total        || 0} sub={`${dashboard.fleet?.active || 0} active`}             icon={Truck}     color="bg-blue-500" />
                <KpiCard label="Compliance Issues"  value={(dashboard.compliance?.expired || 0) + (dashboard.compliance?.critical || 0)} sub="expired + critical" icon={Shield}    color="bg-red-500"  />
                <KpiCard label="Monthly Fuel Cost"  value={fmtCur(dashboard.fuel?.monthly_cost || 0)} sub="last 30 days"                                   icon={Fuel}      color="bg-amber-500" />
                <KpiCard label="Breakdowns (30d)"   value={dashboard.breakdowns           || 0} sub="corrective jobs"                                         icon={Wrench}    color="bg-purple-500" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiCard label="Fuel Anomalies"     value={anomalyCount}    sub="flagged events"    icon={AlertTriangle} color="bg-orange-500" />
                <KpiCard label="Overdue Fees"       value={overdueCount}    sub="students"           icon={DollarSign}   color="bg-rose-500"   />
                <KpiCard label="Monthly Trips"      value={dashboard.monthly_trips || 0} sub="completed"    icon={Navigation}   color="bg-teal-500"   />
                <KpiCard label="DL Expiring (30d)"  value={dlExpiring}      sub="drivers"            icon={Users}        color="bg-indigo-500" />
            </div>

            {/* Fleet status + Compliance alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border border-slate-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-700 mb-3 text-sm">Fleet Status Distribution</h3>
                        {vehicleStatusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={vehicleStatusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={11}>
                                        {vehicleStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p className="text-slate-400 text-sm text-center py-4">No data</p>}
                    </CardContent>
                </Card>

                <Card className="border border-slate-200">
                    <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-700 mb-3 text-sm">Compliance Alerts</h3>
                        <div className="space-y-2">
                            {compliance.filter(d => ['EXPIRED', 'CRITICAL', 'WARNING'].includes(d.rag_status)).slice(0, 6).map((d, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-xs font-medium text-slate-700">{d.reg_number} — {d.doc_type.replace('_', ' ')}</p>
                                        <p className="text-xs text-slate-400">Expires {fmtDate(d.expiry_date)}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ragBadge(d.rag_status)}`}>{d.rag_status}</span>
                                </div>
                            ))}
                            {compliance.filter(d => ['EXPIRED', 'CRITICAL', 'WARNING'].includes(d.rag_status)).length === 0 && (
                                <div className="text-center py-6 text-green-600 text-sm"><CheckCircle className="w-6 h-6 mx-auto mb-1" />All documents compliant</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Trips */}
            <Card className="border border-slate-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-700 mb-3 text-sm">Recent Trips</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b text-slate-500">
                                <th className="pb-2 text-left font-medium">Vehicle</th>
                                <th className="pb-2 text-left font-medium">Route</th>
                                <th className="pb-2 text-left font-medium hidden sm:table-cell">Driver</th>
                                <th className="pb-2 text-left font-medium">Date</th>
                                <th className="pb-2 text-left font-medium hidden sm:table-cell">Distance</th>
                                <th className="pb-2 text-left font-medium">Students</th>
                            </tr></thead>
                            <tbody>
                                {trips.slice(0, 5).map(t => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-2 font-medium text-slate-700">{t.reg_number}</td>
                                        <td className="py-2 text-slate-600 max-w-[120px] truncate">{t.route_name || '—'}</td>
                                        <td className="py-2 text-slate-500 hidden sm:table-cell">{t.driver_name || '—'}</td>
                                        <td className="py-2 text-slate-500">{t.start_time ? t.start_time.split(' ')[0] : '—'}</td>
                                        <td className="py-2 text-slate-500 hidden sm:table-cell">{t.distance_km ? `${t.distance_km} km` : '—'}</td>
                                        <td className="py-2 text-slate-700">{t.students_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderFleet = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{vehicles.length} vehicles registered</p>
                <Button size="sm" onClick={() => setShowAddVehicle(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Vehicle
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {vehicles.map(v => (
                    <Card key={v.id} className="border border-slate-200 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all group" onClick={() => setViewingVehicle(v)}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{v.reg_number}</p>
                                    <p className="text-xs text-slate-500">{v.make_model} · {v.year}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${vehicleStatusBadge(v.status)}`}>{v.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-1 text-xs text-slate-600 mb-3">
                                <span className="text-slate-400">Type</span>       <span className="font-medium">{v.vehicle_type}</span>
                                <span className="text-slate-400">Fuel</span>       <span className="font-medium">{v.fuel_type}</span>
                                <span className="text-slate-400">Capacity</span>  <span className="font-medium">{v.seating_capacity} seats</span>
                                <span className="text-slate-400">Ownership</span> <span className="font-medium">{v.ownership_type}</span>
                                <span className="text-slate-400">Campus</span>    <span className="font-medium truncate">{v.campus}</span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowStatusChange(v); }}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                Change Status <ChevronRight className="w-3 h-3" />
                            </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderCompliance = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 text-xs">
                    <span className={`px-2 py-1 rounded-full border font-medium ${ragBadge('COMPLIANT')}`}>● Compliant</span>
                    <span className={`px-2 py-1 rounded-full border font-medium ${ragBadge('WARNING')}`}>● Warning (&lt;30d)</span>
                    <span className={`px-2 py-1 rounded-full border font-medium ${ragBadge('CRITICAL')}`}>● Critical (&lt;7d)</span>
                    <span className={`px-2 py-1 rounded-full border font-medium ${ragBadge('EXPIRED')}`}>● Expired</span>
                </div>
                <Button size="sm" onClick={() => setShowAddDoc(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Doc
                </Button>
            </div>
            <div className="space-y-3">
                {sortedCompByVehicle.map((veh: any) => (
                    <Card key={veh.reg_number} className={`border ${veh.maxSeverity >= 2 ? 'border-amber-400 bg-rose-50/10 shadow-sm' : 'border-slate-200'}`}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-3">
                                <p className="font-semibold text-slate-700 text-sm">{veh.reg_number} — {veh.make_model}</p>
                                {veh.maxSeverity >= 2 && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-sm animate-pulse">
                                        Needs Attention
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                {veh.docs.map((d: VehicleDoc) => (
                                    <div key={d.doc_id} 
                                         className={`p-2 rounded-lg border text-xs cursor-pointer hover:shadow-sm transition-shadow ${ragBadge(d.rag_status)}`}
                                         onClick={() => handleUpdateDocClick(d)}>
                                        <p className="font-medium">{d.doc_type.replace(/_/g, ' ')}</p>
                                        <p className="opacity-75 mt-0.5">{fmtDate(d.expiry_date)}</p>
                                        <p className="opacity-75">{d.days_to_expiry >= 0 ? `${d.days_to_expiry}d left` : 'Expired'}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderMaintenance = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{maintenance.length} service records</p>
                <Button size="sm" onClick={() => setShowAddMaint(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Log Service
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead><tr className="border-b text-slate-500 bg-slate-50">
                        {['Vehicle', 'Type', 'Date', 'Description', 'Vendor', 'Cost', 'Next Due', 'W/O'].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {maintenance.map(m => (
                            <tr key={m.id} className="border-b hover:bg-slate-50">
                                <td className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap">{m.reg_number}</td>
                                <td className="px-3 py-2">
                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{m.maintenance_type}</span>
                                </td>
                                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmtDate(m.service_date)}</td>
                                <td className="px-3 py-2 text-slate-600 max-w-[160px] truncate">{m.description || '—'}</td>
                                <td className="px-3 py-2 text-slate-500">{m.vendor || '—'}</td>
                                <td className="px-3 py-2 font-medium text-slate-700">{fmtCur(m.cost)}</td>
                                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{m.next_service_due ? fmtDate(m.next_service_due) : '—'}</td>
                                <td className="px-3 py-2 text-slate-400 font-mono text-xs">{m.work_order_no}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFuel = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-3 text-xs">
                    <span className="text-slate-500">{fuel.length} logs</span>
                    {anomalyCount > 0 && (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                            <AlertTriangle className="w-3 h-3" /> {anomalyCount} anomalies
                        </span>
                    )}
                </div>
                <Button size="sm" onClick={() => setShowAddFuel(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Log Fuel
                </Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead><tr className="border-b text-slate-500 bg-slate-50">
                        {['Vehicle', 'Date', 'Litres', 'Rate', 'Total', 'Vendor', 'Logged By', 'Anomaly'].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {fuel.map(f => (
                            <tr key={f.id} className="border-b hover:bg-slate-50">
                                <td className="px-3 py-2 font-medium text-slate-700 whitespace-nowrap">{f.reg_number}</td>
                                <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmtDate(f.fuel_date)}</td>
                                <td className="px-3 py-2 text-slate-700">{f.litres}L</td>
                                <td className="px-3 py-2 text-slate-500">₹{f.price_per_litre}/L</td>
                                <td className="px-3 py-2 font-medium text-slate-700">{fmtCur(f.total_cost)}</td>
                                <td className="px-3 py-2 text-slate-500 max-w-[100px] truncate">{f.vendor || '—'}</td>
                                <td className="px-3 py-2 text-slate-500">{f.logged_by || '—'}</td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-0.5 rounded-full font-medium text-xs ${ANOMALY_COLORS[f.anomaly_flag] || 'bg-slate-50 text-slate-500'}`}>
                                        {f.anomaly_flag === 'NONE' ? '✓ OK' : f.anomaly_flag.replace(/_/g, ' ')}
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
            <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">{drivers.length} drivers enrolled</p>
                <Button size="sm" onClick={() => setShowAddDriver(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Driver
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {drivers.map(d => {
                    const dlDays = d.dl_expiry ? Math.ceil((new Date(d.dl_expiry).getTime() - Date.now()) / 86400000) : null;
                    const dlStatus = dlDays == null ? 'UNKNOWN' : dlDays < 0 ? 'EXPIRED' : dlDays < 7 ? 'CRITICAL' : dlDays < 30 ? 'WARNING' : 'VALID';
                    return (
                        <Card key={d.id} className="border border-slate-200 cursor-pointer hover:shadow-sm transition-all hover:border-blue-300 group" onClick={() => setViewingDriver(d)}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{d.driver_name}</p>
                                            <p className="text-xs text-slate-400">{d.badge_number || 'No Badge'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ragBadge(dlStatus)}`}>DL: {dlStatus}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-1 text-xs mb-4">
                                    <span className="text-slate-400">DL Number</span>  <span className="font-mono text-slate-600">{d.dl_number || '—'}</span>
                                    <span className="text-slate-400">Category</span>   <span className="text-slate-600">{d.dl_category || '—'}</span>
                                    <span className="text-slate-400">DL Expiry</span>  <span className="text-slate-600">{fmtDate(d.dl_expiry)}</span>
                                    <span className="text-slate-400">Blood Grp</span>  <span className="font-medium text-red-600">{d.blood_group || '—'}</span>
                                    <span className="text-slate-400">Vehicle</span>    <span className="text-slate-600 truncate">{d.reg_number || 'Unassigned'}</span>
                                </div>
                                <Button size="sm" variant="outline" className="w-full text-[10px] uppercase font-bold tracking-widest h-8" onClick={(e) => { e.stopPropagation(); setAllocatingDriver(d); }}>
                                    <Truck className="w-3 h-3 mr-1" /> {d.assigned_vehicle_id ? 'Change Bus' : 'Allocate Bus'}
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <p className="text-xs text-slate-500">{routes.length} routes configured</p>
                    <Button size="sm" variant="outline" onClick={() => setShowLogTrip(true)} className="gap-1 text-xs border-slate-300">
                        <Activity className="w-3.5 h-3.5" /> Log Trip
                    </Button>
                </div>
                <Button size="sm" onClick={() => setShowAddRoute(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add Route
                </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {routes.map(r => (
                    <Card key={r.id} className="border border-slate-200 hover:border-blue-400 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{r.route_name}</p>
                                    <p className="text-xs text-slate-400">{r.route_code} · {r.total_distance_km} km · {r.students_count} students</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-1 text-xs mb-3">
                                <span className="text-slate-400">Vehicle</span>  <span className="font-medium text-slate-700">{r.reg_number || '—'}</span>
                                <span className="text-slate-400">Driver</span>   <span className="font-medium text-slate-700">{r.driver_name || '—'}</span>
                            </div>
                            {r.stops && (
                                <div className="flex flex-wrap gap-1">
                                    {(Array.isArray(r.stops) ? r.stops : []).map((stop: string, i: number) => (
                                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{stop.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Trip Log */}
            <Card className="border border-slate-200">
                <CardContent className="p-4">
                    <h3 className="font-semibold text-slate-700 text-sm mb-3">Trip Log</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead><tr className="border-b text-slate-500">
                                {['Vehicle', 'Route', 'Type', 'Start', 'Distance', 'Students', 'Status'].map(h => (
                                    <th key={h} className="pb-2 text-left font-medium pr-4 whitespace-nowrap">{h}</th>
                                ))}
                            </tr></thead>
                            <tbody>
                                {trips.slice(0, 10).map(t => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                                        <td className="py-2 font-medium text-slate-700 pr-4">{t.reg_number}</td>
                                        <td className="py-2 text-slate-600 pr-4 max-w-[120px] truncate">{t.route_name || '—'}</td>
                                        <td className="py-2 pr-4"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t.trip_type}</span></td>
                                        <td className="py-2 text-slate-500 pr-4 whitespace-nowrap">{t.start_time ? t.start_time.split(' ')[0] : '—'}</td>
                                        <td className="py-2 text-slate-500 pr-4">{t.distance_km ? `${t.distance_km}km` : '—'}</td>
                                        <td className="py-2 text-slate-700 pr-4">{t.students_count}</td>
                                        <td className="py-2"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{t.trip_status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderFees = () => {
        const totalBilled = fees.reduce((s, f) => s + f.monthly_fee, 0);
        const totalCollected = fees.filter(f => f.status === 'PAID').reduce((s, f) => s + f.amount_paid, 0);
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <Card className="border border-slate-200"><CardContent className="p-3">
                        <p className="text-xs text-slate-500">Total Billed</p>
                        <p className="text-lg font-bold text-slate-800">{fmtCur(totalBilled)}</p>
                    </CardContent></Card>
                    <Card className="border border-slate-200"><CardContent className="p-3">
                        <p className="text-xs text-slate-500">Collected</p>
                        <p className="text-lg font-bold text-green-700">{fmtCur(totalCollected)}</p>
                    </CardContent></Card>
                    <Card className="border border-slate-200"><CardContent className="p-3">
                        <p className="text-xs text-slate-500">Overdue</p>
                        <p className="text-lg font-bold text-red-600">{overdueCount} students</p>
                    </CardContent></Card>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500">{fees.length} fee records</p>
                    <Button size="sm" onClick={() => setShowAddFee(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                        <Plus className="w-3.5 h-3.5" /> Add Fee Record
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead><tr className="border-b text-slate-500 bg-slate-50">
                            {['Student', 'ID', 'Route', 'Fee/Month', 'Due Date', 'Status', 'Action'].map(h => (
                                <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {fees.map(f => (
                                <tr key={f.id} className="border-b hover:bg-slate-50">
                                    <td className="px-3 py-2 font-medium text-slate-700">{f.student_name}</td>
                                    <td className="px-3 py-2 text-slate-400 font-mono">{f.student_id || '—'}</td>
                                    <td className="px-3 py-2 text-slate-500 max-w-[120px] truncate">{f.route_name || '—'}</td>
                                    <td className="px-3 py-2 font-medium text-slate-700">{fmtCur(f.monthly_fee)}</td>
                                    <td className="px-3 py-2 text-slate-500 whitespace-nowrap">{fmtDate(f.due_date)}</td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-0.5 rounded-full font-medium ${feeBadge(f.status)}`}>{f.status}</span>
                                    </td>
                                    <td className="px-3 py-2">
                                        {f.status !== 'PAID' && (
                                            <button onClick={() => handleMarkPaid(f)} className="text-blue-600 hover:underline text-xs">Mark Paid</button>
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

    const renderAnalytics = () => {
        const fuelByVehicle = (analytics.fuel_trend || []).reduce((acc: any, f: any) => {
            const key = `V${f.vehicle_id}`;
            if (!acc[key]) acc[key] = { name: key, cost: 0 };
            acc[key].cost += f.fuel_cost;
            return acc;
        }, {});
        const fuelBarData = Object.values(fuelByVehicle);

        const maintPieData = (analytics.maintenance_types || []).map((m: any) => ({
            name: m.maintenance_type, value: m.count
        }));

        const utilizationData = (analytics.vehicle_utilisation || []).map((v: any) => ({
            name: v.reg_number, trips: v.trip_count, km: Math.round(v.total_km || 0)
        }));

        const feeData = (analytics.fee_status || []).map((f: any) => ({
            name: f.status, value: f.count, amount: f.amount
        }));

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Card className="border border-slate-200"><CardContent className="p-3">
                        <p className="text-xs text-slate-500 mb-1">Total Fuel Cost</p>
                        <p className="text-xl font-bold text-slate-800">{fmtCur(analytics.cost_summary?.fuel_total || 0)}</p>
                    </CardContent></Card>
                    <Card className="border border-slate-200"><CardContent className="p-3">
                        <p className="text-xs text-slate-500 mb-1">Total Maintenance Cost</p>
                        <p className="text-xl font-bold text-slate-800">{fmtCur(analytics.cost_summary?.maint_total || 0)}</p>
                    </CardContent></Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="border border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-700 text-sm mb-3">Fuel Cost by Vehicle</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={fuelBarData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip formatter={(v: any) => fmtCur(v)} />
                                    <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-700 text-sm mb-3">Maintenance Types</h3>
                            {maintPieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={maintPieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={10}>
                                            {maintPieData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-center text-slate-400 py-4 text-sm">No data</p>}
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-700 text-sm mb-3">Vehicle Utilisation</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={utilizationData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="trips" name="Trips" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="km"    name="Km"    fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200">
                        <CardContent className="p-4">
                            <h3 className="font-semibold text-slate-700 text-sm mb-3">Fee Collection Status</h3>
                            {feeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={feeData} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                                            {feeData.map((_: any, i: number) => <Cell key={i} fill={['#10b981', '#f59e0b', '#ef4444'][i % 3]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <p className="text-center text-slate-400 py-4 text-sm">No data</p>}
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Live GPS Tracking</h2>
                        <p className="text-xs text-slate-500">Real-time mapping powered by OpenStreetMap</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active ({vehicles.filter(v=>v.status==='ACTIVE').length})</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Idle/Other ({vehicles.filter(v=>v.status!=='ACTIVE').length})</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
                    {/* Vehicle List */}
                    <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2 no-scrollbar bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                        {vehicles.map((v) => (
                            <Card key={v.id} className="border border-slate-200 hover:border-blue-400 cursor-pointer transition-colors shadow-sm">
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-slate-800 text-sm">{v.reg_number}</p>
                                        <span className={`w-2 h-2 rounded-full ${v.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1 truncate">{v.make_model} - {v.vehicle_type}</p>
                                    <div className="flex items-center gap-1 text-xs text-slate-600">
                                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                        <span className="truncate">Route: {routes.find(r => r.vehicle_id === v.id)?.route_name || 'N/A'}</span>
                                    </div>
                                    {v.status === 'ACTIVE' && (
                                        <div className="mt-2 text-[10px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                            <Navigation className="w-2 h-2" /> Moving (~40 km/h)
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        {vehicles.length === 0 && (
                            <div className="text-center text-slate-400 text-sm py-10">No vehicles available</div>
                        )}
                    </div>

                    {/* Map Area */}
                    <div className="lg:col-span-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0 h-full min-h-[300px]">
                        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {vehicles.map((v, i) => {
                                const lat = center[0] + (Math.sin(i * 123) * 0.05);
                                const lng = center[1] + (Math.cos(i * 321) * 0.05);
                                return (
                                    <Marker key={v.id} position={[lat, lng]} icon={getCustomIcon(v.status)}>
                                        <Popup>
                                            <div className="text-sm min-w-[150px]">
                                                <p className="font-bold border-b border-slate-100 pb-1 mb-1 text-slate-800">{v.reg_number}</p>
                                                <p className="text-xs text-slate-600 font-medium mb-0.5">{v.make_model}</p>
                                                <p className="text-xs text-slate-500 mb-2 truncate">Rt: {routes.find(r => r.vehicle_id === v.id)?.route_name || 'Unassigned'}</p>
                                                <p className="text-xs flex items-center gap-1">
                                                    Status: <span className={`px-1.5 py-0.5 rounded font-medium ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{v.status}</span>
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

    const renderTolls = () => {
        const handlePayChallan = async (id: number) => {
            if (!confirm('Mark this challan as paid?')) return;
            try {
                await vehicleService.payChallan(id);
                const tollsFines = await vehicleService.getTollsAndFines();
                setFastags(tollsFines.fastags || []);
                setChallans(tollsFines.challans || []);
            } catch (e) {
                console.error(e);
                alert('Failed to update challan');
            }
        };

        return (
            <div className="space-y-6 pb-10">
                {/* FASTag Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" /> FASTag Management
                        </h2>
                        <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Real-time Balance from NPCI</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {fastags.map(f => (
                            <Card key={f.id} className={`border border-slate-200 ${f.status === 'LOW_BALANCE' ? 'bg-amber-50/30' : f.status === 'BLACKLISTED' ? 'bg-red-50/30' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-slate-800">{f.reg_number}</p>
                                            <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{f.tag_id}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            f.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                                            f.status === 'LOW_BALANCE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {f.status}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Current Balance</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-slate-800">₹{f.balance.toLocaleString('en-IN')}</span>
                                            {f.status !== 'ACTIVE' && (
                                                <AlertTriangle className={`w-3.5 h-3.5 ${f.status === 'BLACKLISTED' ? 'text-red-500' : 'text-amber-500'} animate-pulse`} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-[10px] text-slate-400 font-medium">{f.provider}</span>
                                        <button className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">Recharge</button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Challans Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-blue-500" /> RTO e-Challans
                        </h2>
                        <div className="flex gap-2">
                             <div className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5">
                                <Activity className="w-3 h-3" /> {challans.filter(c => c.status === 'PENDING').length} Pending
                             </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-4 py-3">Vehicle / Driver</th>
                                    <th className="px-4 py-3">Challan / Date</th>
                                    <th className="px-4 py-3">Violation / Location</th>
                                    <th className="px-4 py-3">Penalty</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {challans.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-slate-700">{c.reg_number}</div>
                                            <div className="text-[10px] text-slate-400">{c.driver_name || 'System Auto'}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-mono text-xs text-slate-600">{c.challan_number}</div>
                                            <div className="text-[10px] text-slate-400">{fmtDate(c.issue_date)}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-slate-700 text-xs">{c.violation_type}</div>
                                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-slate-300" /> {c.location}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="font-bold text-slate-800">₹{c.penalty_amount}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                c.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700 animate-pulse'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {c.status === 'PENDING' ? (
                                                <Button size="sm" variant="outline" className="h-8 text-[10px] uppercase font-bold tracking-wider hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" onClick={() => handlePayChallan(c.id)}>
                                                    Pay Penalty
                                                </Button>
                                            ) : (
                                                <div className="flex items-center justify-end text-emerald-500 gap-1 font-bold text-[10px] uppercase">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {challans.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-slate-400 italic">No traffic violations found. Drive safe!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <Layout title={isDriver ? "Driver Portal" : "Vehicle Management"} description={isDriver ? "Manage assigned vehicle and trips" : "Complete fleet tracking and compliance management"} icon={Truck} showHome>
            {isDriver ? (
                <div className="space-y-6 max-w-4xl mx-auto pb-10">
                    <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-xl mb-6 shadow-md shadow-slate-200">
                        <div className="bg-white/10 p-3 rounded-lg text-white">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Welcome, {user.name}</h2>
                            <p className="text-slate-300 text-sm font-medium">Driver Operations Portal</p>
                        </div>
                    </div>

                    {(() => {
                        const myProfile = drivers.find(d => d.driver_name === user.name);
                        const myVehicle = vehicles.find(v => v.id === myProfile?.assigned_vehicle_id);
                        const myDocs = compliance.filter(c => c.vehicle_id === myProfile?.assigned_vehicle_id);
                        const myTripsCount = trips.filter(t => t.vehicle_id === myProfile?.assigned_vehicle_id).length;
                        const myIssuesCount = maintenance.filter(m => m.vehicle_id === myProfile?.assigned_vehicle_id).length;

                        if (!myVehicle) return (
                            <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                                <p className="text-slate-400 font-medium">No vehicle currently assigned to your profile.</p>
                                <p className="text-xs text-slate-300 mt-1">Please contact the transport administrator.</p>
                            </div>
                        );

                        return (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gapx-4 py-4 mb-4">
                                    {/* My Vehicle Card */}
                                    <div className="bg-white rounded-2xl border border-slate-200 px-4 py-4 shadow-sm overflow-hidden relative">
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-60"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">My Assigned Vehicle</span>
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{myVehicle.reg_number}</h3>
                                                <p className="text-sm font-medium text-slate-500">{myVehicle.make_model} • {myVehicle.fuel_type}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${myVehicle.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {myVehicle.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Trips</p>
                                                <p className="text-xl font-black text-slate-700">{myTripsCount}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Issues Reported</p>
                                                <p className="text-xl font-black text-slate-700">{myIssuesCount}</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex gap-2">
                                            <Button className="flex-1 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest h-10 rounded-xl" onClick={() => setViewingVehicle(myVehicle)}>
                                                Full Details
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Quick Actions for My Vehicle */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Button 
                                            className="bg-white border text-slate-700 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 h-auto py-6 flex flex-col gap-3 rounded-2xl shadow-sm transition-all"
                                            onClick={() => { setShowLogTrip(true); setVForm(myVehicle); }}
                                        >
                                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600 mb-1">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <span className="font-semibold text-sm text-center">Log a Trip</span>
                                        </Button>
                                        <Button 
                                            className="bg-white border text-slate-700 border-slate-200 hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700 h-auto py-6 flex flex-col gap-3 rounded-2xl shadow-sm transition-all"
                                            onClick={() => { setShowAddMaint(true); setVForm(myVehicle); }}
                                        >
                                            <div className="bg-amber-100 p-3 rounded-xl text-amber-600 mb-1">
                                                <Wrench className="w-6 h-6" />
                                            </div>
                                            <span className="font-semibold text-sm text-center">Report Issue</span>
                                        </Button>
                                        <Button 
                                            className="bg-white border text-slate-700 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 h-auto py-6 flex flex-col gap-3 rounded-2xl shadow-sm transition-all"
                                            onClick={() => { setShowAddFuel(true); setVForm(myVehicle); }}
                                        >
                                            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 mb-1">
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <span className="font-semibold text-sm text-center">Log Fuel</span>
                                        </Button>
                                        <Button 
                                            className="bg-indigo-50 border-2 border-indigo-100/50 text-indigo-700 hover:bg-indigo-100 h-auto py-6 flex flex-col gap-3 rounded-2xl shadow-sm transition-all"
                                        >
                                            <div className="bg-indigo-200 p-3 rounded-xl text-indigo-700 mb-1">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <span className="font-semibold text-sm text-center">Duty Rota</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* My Documents Section */}
                                <Card className="border border-slate-200 shadow-sm">
                                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                            <Shield className="w-4 h-4 text-indigo-500"/> My Vehicle Documents
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400">{myDocs.length} Total</span>
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {myDocs.map(doc => (
                                                <div key={doc.doc_id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all hover:shadow-sm ${
                                                    doc.rag_status === 'COMPLIANT' ? 'bg-white border-slate-200' : 
                                                    doc.rag_status === 'EXPIRED' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                                                }`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl ${
                                                            doc.rag_status === 'COMPLIANT' ? 'bg-slate-100 text-slate-500' : 
                                                            doc.rag_status === 'EXPIRED' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                                                        }`}>
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm leading-none mb-1">{doc.doc_type.replace(/_/g, ' ')}</p>
                                                            <p className="text-[10px] font-medium text-slate-400">Expires: {fmtDate(doc.expiry_date)}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* My Challan Alerts */}
                                {challans.filter(c => c.vehicle_id === myProfile?.assigned_vehicle_id && c.status === 'PENDING').length > 0 && (
                                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mt-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-red-500 p-3 rounded-xl text-white shadow-sm shadow-red-200 shake-animation">
                                                <AlertCircle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-red-800">Vehicle Traffic Challan Alert</h3>
                                                <p className="text-red-600 text-sm">Your assigned vehicle has {challans.filter(c => c.vehicle_id === myProfile?.assigned_vehicle_id && c.status === 'PENDING').length} pending fines.</p>
                                            </div>
                                        </div>
                                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm shadow-red-100 px-6 h-12">
                                            View & Pay
                                        </Button>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            ) : (
                <>
                    {/* Tab Bar */}
            {/* Tab Bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-4 px-4 mb-4">
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-0 pt-1">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg whitespace-nowrap transition-colors border-b-2 ${
                                activeTab === t.id
                                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <t.icon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.label}</span>
                            <span className="sm:hidden">{t.label.slice(0, 4)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" /> Loading fleet data…
                </div>
            ) : (
                <>
                    {activeTab === 'overview'    && renderOverview()}
                    {activeTab === 'tracking'    && renderTracking()}
                    {activeTab === 'fleet'       && renderFleet()}
                    {activeTab === 'compliance'  && renderCompliance()}
                    {activeTab === 'maintenance' && renderMaintenance()}
                    {activeTab === 'fuel'        && renderFuel()}
                    {activeTab === 'drivers'     && renderDrivers()}
                    {activeTab === 'routes'      && renderRoutes()}
                    {activeTab === 'fees'        && renderFees()}
                    {activeTab === 'tolls'       && renderTolls()}
                    {activeTab === 'analytics'   && renderAnalytics()}
                </>
            )}
            </>
        )}

            {/* ─── Add Vehicle Modal ────────────────────────────────────────────── */}
            {showAddVehicle && (
                <Modal title="Register Vehicle" onClose={() => setShowAddVehicle(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Registration Number *">
                            <Input placeholder="KA01F0000" value={vForm.reg_number || ''} onChange={e => setVForm({ ...vForm, reg_number: e.target.value })} />
                        </Field>
                        <Field label="Vehicle Type *">
                            <Select value={vForm.vehicle_type} onChange={e => setVForm({ ...vForm, vehicle_type: e.target.value })}>
                                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Make & Model *">
                            <Input placeholder="Tata Starbus" value={vForm.make_model || ''} onChange={e => setVForm({ ...vForm, make_model: e.target.value })} />
                        </Field>
                        <Field label="Year">
                            <Input type="number" placeholder="2023" value={vForm.year || ''} onChange={e => setVForm({ ...vForm, year: e.target.value })} />
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
                    <Button onClick={handleAddVehicle} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">Register Vehicle</Button>
                </Modal>
            )}

            {/* ─── Add Document Modal ───────────────────────────────────────────── */}
            {showAddDoc && (
                <Modal title="Add Compliance Document" onClose={() => setShowAddDoc(false)}>
                    <Field label="Vehicle *">
                        <Select value={docForm.vehicle_id || ''} onChange={e => setDocForm({ ...docForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle…</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} — {v.make_model}</option>)}
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
                    <Button onClick={handleAddDoc} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Document</Button>
                </Modal>
            )}

            {/* ─── Add Maintenance Modal ────────────────────────────────────────── */}
            {showAddMaint && (
                <Modal title="Log Maintenance" onClose={() => setShowAddMaint(false)}>
                    <Field label="Vehicle *">
                        <Select value={mForm.vehicle_id || ''} onChange={e => setMForm({ ...mForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle…</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} — {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Type *">
                            <Select value={mForm.maintenance_type} onChange={e => setMForm({ ...mForm, maintenance_type: e.target.value })}>
                                {MAINT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Service Date *"><Input type="date" value={mForm.service_date || ''} onChange={e => setMForm({ ...mForm, service_date: e.target.value })} /></Field>
                        <Field label="Cost (₹)"><Input type="number" placeholder="0" value={mForm.cost || ''} onChange={e => setMForm({ ...mForm, cost: e.target.value })} /></Field>
                        <Field label="Odometer (km)"><Input type="number" value={mForm.odometer_reading || ''} onChange={e => setMForm({ ...mForm, odometer_reading: e.target.value })} /></Field>
                    </div>
                    <Field label="Description">
                        <Input placeholder="Oil change, filter replacement…" value={mForm.description || ''} onChange={e => setMForm({ ...mForm, description: e.target.value })} />
                    </Field>
                    <Field label="Vendor / Workshop">
                        <Input placeholder="Sri Sai Auto Service" value={mForm.vendor || ''} onChange={e => setMForm({ ...mForm, vendor: e.target.value })} />
                    </Field>
                    <Field label="Next Service Due">
                        <Input type="date" value={mForm.next_service_due || ''} onChange={e => setMForm({ ...mForm, next_service_due: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddMaint} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Log Maintenance</Button>
                </Modal>
            )}

            {/* ─── Add Fuel Modal ───────────────────────────────────────────────── */}
            {showAddFuel && (
                <Modal title="Log Fuelling Event" onClose={() => setShowAddFuel(false)}>
                    <Field label="Vehicle *">
                        <Select value={fForm.vehicle_id || ''} onChange={e => setFForm({ ...fForm, vehicle_id: e.target.value })}>
                            <option value="">Select vehicle…</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} — {v.make_model}</option>)}
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date *"><Input type="date" value={fForm.fuel_date || ''} onChange={e => setFForm({ ...fForm, fuel_date: e.target.value })} /></Field>
                        <Field label="Litres *"><Input type="number" placeholder="80" value={fForm.litres || ''} onChange={e => setFForm({ ...fForm, litres: e.target.value })} /></Field>
                        <Field label="Price/Litre (₹) *"><Input type="number" placeholder="92.50" value={fForm.price_per_litre || ''} onChange={e => setFForm({ ...fForm, price_per_litre: e.target.value })} /></Field>
                        <Field label="Odometer (km)"><Input type="number" value={fForm.odometer_at_fuelling || ''} onChange={e => setFForm({ ...fForm, odometer_at_fuelling: e.target.value })} /></Field>
                    </div>
                    <Field label="Fuel Vendor / Pump">
                        <Input placeholder="BPCL Pump - MG Road" value={fForm.vendor || ''} onChange={e => setFForm({ ...fForm, vendor: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Payment Mode">
                            <Select value={fForm.payment_mode} onChange={e => setFForm({ ...fForm, payment_mode: e.target.value })}>
                                {PAYMENT_MODES.map(p => <option key={p}>{p}</option>)}
                            </Select>
                        </Field>
                        <Field label="Logged By (Driver)">
                            <Input placeholder="Driver name" value={fForm.logged_by || ''} onChange={e => setFForm({ ...fForm, logged_by: e.target.value })} />
                        </Field>
                    </div>
                    <Button onClick={handleAddFuel} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Log Fuel Event</Button>
                </Modal>
            )}

            {/* ─── Add Driver Modal ─────────────────────────────────────────────── */}
            {showAddDriver && (
                <Modal title="Enrol Driver" onClose={() => setShowAddDriver(false)}>
                    <Field label="Driver Name *">
                        <Input placeholder="Rajesh Kumar" value={dForm.driver_name || ''} onChange={e => setDForm({ ...dForm, driver_name: e.target.value })} />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="DL Number"><Input placeholder="KA0120190012345" value={dForm.dl_number || ''} onChange={e => setDForm({ ...dForm, dl_number: e.target.value })} /></Field>
                        <Field label="DL Category">
                            <Select value={dForm.dl_category} onChange={e => setDForm({ ...dForm, dl_category: e.target.value })}>
                                {DL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </Select>
                        </Field>
                        <Field label="DL Expiry"><Input type="date" value={dForm.dl_expiry || ''} onChange={e => setDForm({ ...dForm, dl_expiry: e.target.value })} /></Field>
                        <Field label="Blood Group">
                            <Select value={dForm.blood_group} onChange={e => setDForm({ ...dForm, blood_group: e.target.value })}>
                                {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                            </Select>
                        </Field>
                        <Field label="Badge Number"><Input placeholder="DRV-006" value={dForm.badge_number || ''} onChange={e => setDForm({ ...dForm, badge_number: e.target.value })} /></Field>
                        <Field label="Assign to Vehicle">
                            <Select value={dForm.assigned_vehicle_id || ''} onChange={e => setDForm({ ...dForm, assigned_vehicle_id: e.target.value })}>
                                <option value="">None</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}
                            </Select>
                        </Field>
                    </div>
                    <Button onClick={handleAddDriver} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Enrol Driver</Button>
                </Modal>
            )}

            {/* ─── Add Route Modal ──────────────────────────────────────────────── */}
            {showAddRoute && (
                <Modal title="Add Route" onClose={() => setShowAddRoute(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Route Name *"><Input placeholder="Route E - Jayanagar" value={rForm.route_name || ''} onChange={e => setRForm({ ...rForm, route_name: e.target.value })} /></Field>
                        <Field label="Route Code"><Input placeholder="RT-E" value={rForm.route_code || ''} onChange={e => setRForm({ ...rForm, route_code: e.target.value })} /></Field>
                        <Field label="Assign Vehicle">
                            <Select value={rForm.vehicle_id || ''} onChange={e => setRForm({ ...rForm, vehicle_id: e.target.value })}>
                                <option value="">None</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}
                            </Select>
                        </Field>
                        <Field label="Assign Driver">
                            <Select value={rForm.driver_id || ''} onChange={e => setRForm({ ...rForm, driver_id: e.target.value })}>
                                <option value="">None</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.driver_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Total Distance (km)"><Input type="number" value={rForm.total_distance_km || ''} onChange={e => setRForm({ ...rForm, total_distance_km: e.target.value })} /></Field>
                        <Field label="Students Count"><Input type="number" value={rForm.students_count || ''} onChange={e => setRForm({ ...rForm, students_count: e.target.value })} /></Field>
                    </div>
                    <Field label="Stops (comma-separated)">
                        <Input placeholder="Stop 1, Stop 2, Institution" value={rForm.stops_text || ''} onChange={e => setRForm({ ...rForm, stops_text: e.target.value })} />
                    </Field>
                    <Button onClick={handleAddRoute} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Save Route</Button>
                </Modal>
            )}

            {/* ─── Add Fee Modal ────────────────────────────────────────────────── */}
            {showAddFee && (
                <Modal title="Add Fee Record" onClose={() => setShowAddFee(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Student Name *"><Input placeholder="Arjun Mehta" value={feForm.student_name || ''} onChange={e => setFeForm({ ...feForm, student_name: e.target.value })} /></Field>
                        <Field label="Student ID"><Input placeholder="STU-109" value={feForm.student_id || ''} onChange={e => setFeForm({ ...feForm, student_id: e.target.value })} /></Field>
                        <Field label="Route">
                            <Select value={feForm.route_id || ''} onChange={e => setFeForm({ ...feForm, route_id: e.target.value })}>
                                <option value="">None</option>
                                {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Monthly Fee (₹) *"><Input type="number" placeholder="1200" value={feForm.monthly_fee || ''} onChange={e => setFeForm({ ...feForm, monthly_fee: e.target.value })} /></Field>
                        <Field label="Fee Term">
                            <Select value={feForm.fee_term} onChange={e => setFeForm({ ...feForm, fee_term: e.target.value })}>
                                {['Monthly', 'Semester', 'Annual'].map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Due Date"><Input type="date" value={feForm.due_date || ''} onChange={e => setFeForm({ ...feForm, due_date: e.target.value })} /></Field>
                    </div>
                    <Button onClick={handleAddFee} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Add Fee Record</Button>
                </Modal>
            )}

            {/* ─── Log Trip Modal ───────────────────────────────────────────────── */}
            {showLogTrip && (
                <Modal title="Log Trip" onClose={() => setShowLogTrip(false)}>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Vehicle *">
                            <Select value={tForm.vehicle_id || ''} onChange={e => setTForm({ ...tForm, vehicle_id: e.target.value })}>
                                <option value="">Select…</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}
                            </Select>
                        </Field>
                        <Field label="Driver">
                            <Select value={tForm.driver_id || ''} onChange={e => setTForm({ ...tForm, driver_id: e.target.value })}>
                                <option value="">None</option>
                                {drivers.map(d => <option key={d.id} value={d.id}>{d.driver_name}</option>)}
                            </Select>
                        </Field>
                        <Field label="Route Name"><Input placeholder="Route A" value={tForm.route_name || ''} onChange={e => setTForm({ ...tForm, route_name: e.target.value })} /></Field>
                        <Field label="Trip Type">
                            <Select value={tForm.trip_type} onChange={e => setTForm({ ...tForm, trip_type: e.target.value })}>
                                {['REGULAR', 'ADHOC', 'STAFF', 'FIELD_TRIP'].map(t => <option key={t}>{t}</option>)}
                            </Select>
                        </Field>
                        <Field label="Start Time *"><Input type="datetime-local" value={tForm.start_time || ''} onChange={e => setTForm({ ...tForm, start_time: e.target.value })} /></Field>
                        <Field label="End Time"><Input type="datetime-local" value={tForm.end_time || ''} onChange={e => setTForm({ ...tForm, end_time: e.target.value })} /></Field>
                        <Field label="Start Odometer"><Input type="number" value={tForm.start_odometer || ''} onChange={e => setTForm({ ...tForm, start_odometer: e.target.value })} /></Field>
                        <Field label="End Odometer"><Input type="number" value={tForm.end_odometer || ''} onChange={e => setTForm({ ...tForm, end_odometer: e.target.value })} /></Field>
                        <Field label="Students Count"><Input type="number" value={tForm.students_count || ''} onChange={e => setTForm({ ...tForm, students_count: e.target.value })} /></Field>
                    </div>
                    <Button onClick={handleLogTrip} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Log Trip</Button>
                </Modal>
            )}

            {/* ─── Status Change Modal ──────────────────────────────────────────── */}
            {showStatusChange && (
                <Modal title={`Change Status — ${showStatusChange.reg_number}`} onClose={() => setShowStatusChange(null)}>
                    <p className="text-xs text-slate-500 mb-3">Current: <span className={`px-2 py-0.5 rounded-full font-medium ${vehicleStatusBadge(showStatusChange.status)}`}>{showStatusChange.status}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                        {['ACTIVE', 'MAINTENANCE', 'GROUNDED', 'DECOMMISSIONED'].map(s => (
                            <button key={s} onClick={() => handleStatusChange(showStatusChange, s)}
                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${showStatusChange.status === s ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300 text-slate-600'}`}>
                                {s}
                            </button>
                        ))}
                    </div>
                </Modal>
            )}

            {/* ─── Update Document Modal ────────────────────────────────────────── */}
            {updatingDoc && (
                <Modal title={`Update Document: ${updatingDoc.doc_type.replace(/_/g, ' ')}`} onClose={() => setUpdatingDoc(null)}>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-xs">
                        <p><span className="font-semibold">Vehicle:</span> {updatingDoc.reg_number}</p>
                        <p><span className="font-semibold">Current Expiry:</span> {fmtDate(updatingDoc.expiry_date)}</p>
                    </div>
                    <div className="space-y-3">
                        <Field label="Upload Updated Document File *">
                            <input type="file" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Issue Date">
                                <Input type="date" 
                                       max={new Date().toISOString().split('T')[0]} 
                                       value={updateDocForm.issue_date || ''} 
                                       onChange={e => setUpdateDocForm({ ...updateDocForm, issue_date: e.target.value })} 
                                />
                            </Field>
                            <Field label="New Expiry Date *">
                                <Input type="date" 
                                       min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} 
                                       value={updateDocForm.expiry_date || ''} 
                                       onChange={e => setUpdateDocForm({ ...updateDocForm, expiry_date: e.target.value })} 
                                />
                            </Field>
                        </div>
                        <Field label="Issuing Authority">
                            <Input placeholder="RTO Office, Insurance Co." value={updateDocForm.issuing_authority || ''} onChange={e => setUpdateDocForm({ ...updateDocForm, issuing_authority: e.target.value })} />
                        </Field>
                    </div>
                    <Button onClick={handleUpdateDocSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                        Save and Update Compliance
                    </Button>
                </Modal>
            )}

            {/* ─── Driver Details Modal ─────────────────────────────────────────── */}
            {viewingDriver && (
                <Modal title={`Driver Profile — ${viewingDriver.driver_name}`} onClose={() => setViewingDriver(null)}>
                    <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                            {viewingDriver.driver_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-800">{viewingDriver.driver_name}</h2>
                            <p className="text-blue-600 font-medium text-sm">Badge: {viewingDriver.badge_number || 'N/A'}</p>
                            <p className="text-slate-500 text-xs mt-1">Status: <span className="font-semibold text-emerald-600">Active</span></p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">License & Medical</h3>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <div>
                                    <p className="text-xs text-slate-400">License Number</p>
                                    <p className="font-mono font-medium text-slate-700">{viewingDriver.dl_number || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">License Category</p>
                                    <p className="font-medium text-slate-700">{viewingDriver.dl_category || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Expiry Date</p>
                                    <p className="font-medium text-slate-700">{fmtDate(viewingDriver.dl_expiry)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Blood Group</p>
                                    <p className="font-medium text-red-600">{viewingDriver.blood_group || '—'}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-700 border-b border-slate-200 pb-2 mb-3">Assignment Details</h3>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                                {viewingDriver.assigned_vehicle_id ? (
                                    <>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-500 text-xs">Vehicle Registration</span>
                                            <span className="font-bold text-slate-800">{viewingDriver.reg_number}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-slate-500 text-xs">Make & Model</span>
                                            <span className="font-medium text-slate-700">{viewingDriver.make_model}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-500 text-center py-2">No vehicle currently assigned.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ─── Bus Details Modal ────────────────────────────────────────────── */}
            {viewingVehicle && (
                <Modal title={`Vehicle Portfolio — ${viewingVehicle.reg_number}`} onClose={() => setViewingVehicle(null)}>
                    <div className="flex flex-col gapx-4 py-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="bg-blue-600 text-white p-3 rounded-xl shadow-sm">
                                <Truck className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{viewingVehicle.reg_number}</h2>
                                <p className="text-xs font-medium text-slate-500">{viewingVehicle.make_model} • {viewingVehicle.fuel_type} • {viewingVehicle.year}</p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${viewingVehicle.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {viewingVehicle.status}
                                </span>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">{viewingVehicle.ownership_type}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Compliance Summary */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Compliance Documents</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {compliance.filter(c => c.vehicle_id === viewingVehicle.id).map(doc => (
                                        <div key={doc.doc_id} className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                                            doc.rag_status === 'COMPLIANT' ? 'bg-emerald-50 border-emerald-100' : 
                                            doc.rag_status === 'EXPIRED' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
                                        }`}>
                                            <div>
                                                <p className="font-bold text-slate-700">{doc.doc_type.replace(/_/g, ' ')}</p>
                                                <p className="text-[10px] text-slate-500">Exp: {fmtDate(doc.expiry_date)}</p>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${
                                                doc.rag_status === 'COMPLIANT' ? 'bg-emerald-500' : 
                                                doc.rag_status === 'EXPIRED' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}></div>
                                        </div>
                                    ))}
                                    {compliance.filter(c => c.vehicle_id === viewingVehicle.id).length === 0 && (
                                        <p className="col-span-2 text-center text-xs text-slate-400 py-4 italic">No documents uploaded for this vehicle.</p>
                                    )}
                                </div>
                            </div>

                            {/* Maintenance/Usage */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Latest Maintenance</h3>
                                    {maintenance.filter(m => m.vehicle_id === viewingVehicle.id).slice(0, 1).map(m => (
                                        <div key={m.id} className="text-xs">
                                            <p className="font-bold text-slate-700 mb-0.5">{m.maintenance_type}</p>
                                            <p className="text-slate-500">{fmtDate(m.service_date)} • ₹{m.cost.toLocaleString()}</p>
                                        </div>
                                    ))}
                                    {maintenance.filter(m => m.vehicle_id === viewingVehicle.id).length === 0 && <p className="text-xs text-slate-400 italic">No history</p>}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">Recent Trip</h3>
                                    {trips.filter(t => t.vehicle_id === viewingVehicle.id).slice(0, 1).map(t => (
                                        <div key={t.id} className="text-xs">
                                            <p className="font-bold text-slate-700 mb-0.5">{t.route_name}</p>
                                            <p className="text-slate-500">{fmtDate(t.start_time)} • {t.distance_km} KM</p>
                                        </div>
                                    ))}
                                    {trips.filter(t => t.vehicle_id === viewingVehicle.id).length === 0 && <p className="text-xs text-slate-400 italic">No trips yet</p>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest h-10 rounded-xl" onClick={() => { setShowAddMaint(true); setVForm(viewingVehicle); setViewingVehicle(null); }}>
                                Log News Service
                            </Button>
                            <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest h-10 rounded-xl" onClick={() => setViewingVehicle(null)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ─── Allocation Modal ─────────────────────────────────────────────── */}
            {allocatingDriver && (
                <Modal title={`Allocate Bus to ${allocatingDriver.driver_name}`} onClose={() => setAllocatingDriver(null)}>
                    <div className="space-y-4">
                        <p className="text-xs text-slate-500 mb-4">Select a vehicle from the active fleet to assign to this driver.</p>
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
                                            } catch (e) {
                                                console.error(e);
                                                alert('Selection failed');
                                            }
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                                            isAssigned ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50 border-slate-100' : 'hover:border-blue-500 hover:bg-blue-50 border-slate-200'
                                        } ${allocatingDriver.assigned_vehicle_id === v.id ? 'border-emerald-500 bg-emerald-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${allocatingDriver.assigned_vehicle_id === v.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                <Truck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{v.reg_number}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{v.make_model}</p>
                                            </div>
                                        </div>
                                        {allocatingDriver.assigned_vehicle_id === v.id ? (
                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-widest">Selected</span>
                                        ) : isAssigned ? (
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest">Occupied</span>
                                        ) : (
                                            <p className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Assign</p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest" onClick={() => setAllocatingDriver(null)}>
                            Cancel
                        </Button>
                    </div>
                </Modal>
            )}
        </Layout>
    );
};

export default VehicleManagement;
