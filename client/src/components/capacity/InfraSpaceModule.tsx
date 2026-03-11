import React, { useState } from 'react';
import {
    Building2, Map, Bus, BedDouble, AlertTriangle,
    Plus, ArrowRight, Search, Filter,
    Activity, Zap
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

// Mock Data
const academicBlocks = [
    { id: 'A', name: 'Science Block A', capacity: 1200, utilized: 1150, status: 'High', type: 'Classrooms & Labs' },
    { id: 'B', name: 'Commerce Block B', capacity: 800, utilized: 640, status: 'Optimal', type: 'Classrooms' },
    { id: 'C', name: 'Arts & Design Block C', capacity: 500, utilized: 480, status: 'High', type: 'Studios' },
    { id: 'D', name: 'Innovation Hub', capacity: 300, utilized: 150, status: 'Low', type: 'Research Labs' }
];

const hostelBlocks = [
    { id: 'H1', name: 'Boys Hostel 1', capacity: 400, occupied: 410, waitlist: 45, status: 'Overflow', gender: 'Male' },
    { id: 'H2', name: 'Boys Hostel 2', capacity: 350, occupied: 340, waitlist: 0, status: 'Optimal', gender: 'Male' },
    { id: 'H3', name: 'Girls Hostel 1', capacity: 500, occupied: 495, waitlist: 12, status: 'Near Capacity', gender: 'Female' },
    { id: 'H4', name: 'Premium Suites', capacity: 100, occupied: 60, waitlist: 0, status: 'Available', gender: 'Co-ed' }
];

const transportRoutes = [
    { route: 'North City Express', buses: 4, totalCapacity: 160, registered: 155, status: 'Optimal' },
    { route: 'Tech Park Shuttle', buses: 2, totalCapacity: 80, registered: 85, status: 'Overflow' },
    { route: 'Suburban Line', buses: 3, totalCapacity: 120, registered: 90, status: 'Low' }
];

const maintenanceAlerts = [
    { id: 1, facility: 'Science Block A - Elevators', issue: 'Scheduled Servicing', downtime: '2 Days', impact: 'Moderate' },
    { id: 2, facility: 'Girls Hostel 1 - Solar Heaters', issue: 'Repair Required', downtime: 'Immediate', impact: 'High' }
];

const InfraSpaceModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'academic' | 'residential' | 'transport'>('academic');
    const [searchQuery, setSearchQuery] = useState('');

    const renderAcademicSpace = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500 mb-1">Total Academic Capacity</div>
                        <div className="text-2xl font-black text-slate-800">2,800 <span className="text-sm font-medium text-slate-500">seats</span></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">85% Aggregate Utilization</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-white">
                    <CardContent className="p-4">
                        <div className="text-sm font-medium text-slate-500 mb-1">Critical Zones</div>
                        <div className="text-2xl font-black text-red-600 items-center flex gap-2">
                            2 <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="text-xs text-slate-500 mt-3">Blocks operating &gt; 95% capacity</div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm ring-1 ring-slate-100 bg-gradient-to-br from-indigo-50 to-blue-50">
                    <CardContent className="p-4 flex flex-col justify-center h-full">
                        <button onClick={() => alert("Add Facility workflow coming soon!")} className="flex items-center justify-center gap-2 w-full bg-white text-indigo-700 py-2.5 rounded-xl font-bold text-sm shadow-sm ring-1 ring-indigo-100 hover:bg-indigo-50 transition-colors">
                            <Plus className="w-4 h-4" /> Add Facility
                        </button>
                    </CardContent>
                </Card>
            </div>

            {/* Block List */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Campus Blocks</h4>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search blocks..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {academicBlocks.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map((block) => (
                        <div key={block.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                                    ${block.status === 'High' ? 'bg-amber-100 text-amber-700' :
                                        block.status === 'Optimal' ? 'bg-emerald-100 text-emerald-700' :
                                            'bg-blue-100 text-blue-700'}`}>
                                    {block.id}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{block.name}</div>
                                    <div className="text-xs text-slate-500">{block.type}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-700">{block.utilized} / {block.capacity}</div>
                                    <div className="text-xs text-slate-500">Allocated</div>
                                </div>
                                <div className="w-24">
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
                                        <div className={`h-1.5 rounded-full ${(block.utilized / block.capacity) > 0.9 ? 'bg-red-500' :
                                            (block.utilized / block.capacity) > 0.75 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`} style={{ width: `${(block.utilized / block.capacity) * 100}%` }}></div>
                                    </div>
                                    <div className="text-[10px] text-right font-medium text-slate-500">{Math.round((block.utilized / block.capacity) * 100)}% Used</div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderResidentialSpace = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Alert Banner */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                    <h5 className="font-bold text-red-800 text-sm">Action Required: Hostel Overflow</h5>
                    <p className="text-sm text-red-600 mt-1">Boys Hostel 1 is operating at 102% capacity with 45 students waitlisted. Consider reallocating to Premium Suites or opening tied-up external accommodations.</p>
                    <div className="mt-3 flex gap-2">
                        <button onClick={() => alert("Opening Waitlist Manager...")} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition">Manage Waitlist</button>
                        <button onClick={() => alert("Viewing Current Room Allocations...")} className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-bold rounded-lg hover:bg-red-50 transition">View Allocations</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {hostelBlocks.map((hostel) => (
                    <Card key={hostel.id} className="border-none shadow-sm ring-1 ring-slate-200 bg-white overflow-hidden group">
                        <CardContent className="p-0">
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <BedDouble className="w-5 h-5 text-indigo-500" />
                                    <h5 className="font-bold text-slate-800">{hostel.name}</h5>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${hostel.status === 'Overflow' ? 'bg-red-100 text-red-700' :
                                    hostel.status === 'Near Capacity' ? 'bg-amber-100 text-amber-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {hostel.status}
                                </span>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-2xl font-black text-slate-800">{hostel.occupied}</div>
                                        <div className="text-xs text-slate-500">Occupied of {hostel.capacity}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-700">{hostel.waitlist}</div>
                                        <div className="text-xs text-slate-500">Waitlisted</div>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div className={`h-2 rounded-full ${hostel.occupied > hostel.capacity ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min((hostel.occupied / hostel.capacity) * 100, 100)}%` }}></div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">{hostel.gender}</span>
                                    <button onClick={() => alert("Opening Hostel Details...")} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Details <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const renderTransportFleet = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-slate-500 text-sm mb-1">Active Fleet</div>
                    <div className="text-2xl font-black text-slate-800">24 <span className="text-sm font-medium text-slate-500">Buses</span></div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-slate-500 text-sm mb-1">Total Routes</div>
                    <div className="text-2xl font-black text-slate-800">12</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="text-slate-500 text-sm mb-1">Registrations</div>
                    <div className="text-2xl font-black text-slate-800">840</div>
                </div>
            </div>

            <h4 className="font-bold text-slate-800 mb-4">Route Utilization</h4>
            <div className="space-y-3">
                {transportRoutes.map((route, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                <Bus className="w-5 h-5" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-800">{route.route}</h5>
                                <p className="text-xs text-slate-500">{route.buses} Buses Allocated</p>
                            </div>
                        </div>
                        <div className="w-64">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium text-slate-600">{route.registered} Registered</span>
                                <span className="text-slate-500">Capacity: {route.totalCapacity}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${route.registered > route.totalCapacity ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((route.registered / route.totalCapacity) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <button onClick={() => alert(`Viewing detailed utilization for ${route.route}`)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Nav Tabs */}
            <div className="flex gap-1 p-2 bg-slate-200/50 rounded-xl mx-6 mt-6 mb-4">
                <button
                    onClick={() => setActiveTab('academic')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'academic' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
                >
                    <Building2 className="w-4 h-4" /> Academic Spaces
                </button>
                <button
                    onClick={() => setActiveTab('residential')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'residential' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
                >
                    <BedDouble className="w-4 h-4" /> Residential (Hostels)
                </button>
                <button
                    onClick={() => setActiveTab('transport')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'transport' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/50'}`}
                >
                    <Bus className="w-4 h-4" /> Transport Fleet
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="flex gap-6 h-full">
                    {/* Left Column: Primary Content based on Tab */}
                    <div className="flex-1">
                        {activeTab === 'academic' && renderAcademicSpace()}
                        {activeTab === 'residential' && renderResidentialSpace()}
                        {activeTab === 'transport' && renderTransportFleet()}
                    </div>

                    {/* Right Column: Persistent Context Pipeline */}
                    <div className="w-80 space-y-6 flex-shrink-0">
                        {/* Maintenance Pipeline */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <h4 className="font-bold text-slate-800 text-sm">Live Operations</h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {maintenanceAlerts.map(alert => (
                                    <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-slate-700 text-sm">{alert.facility}</div>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${alert.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{alert.impact}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mb-2">{alert.issue}</div>
                                        <div className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                            <Activity className="w-3 h-3" /> Est. Downtime: {alert.downtime}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                                <button onClick={() => alert("Loading Master Maintenance Log...")} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">View Maintenance Log</button>
                            </div>
                        </div>

                        {/* Interactive Map Placeholder */}
                        <div className="bg-slate-800 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer h-48 flex flex-col items-center justify-center text-center">
                            <Map className="w-8 h-8 text-slate-400 mb-3 group-hover:scale-110 transition-transform duration-500" />
                            <h5 className="font-bold text-slate-100 text-sm mb-1">Interactive Campus Map</h5>
                            <p className="text-xs text-slate-400">View real-time heatmaps of space utilization across the institution.</p>
                            <button onClick={() => alert("Booting Interactive Map Viewer...")} className="mt-4 px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors border border-white/20">
                                Launch Map Viewer
                            </button>
                            {/* Decorative grid pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfraSpaceModule;
