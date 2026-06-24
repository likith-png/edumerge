import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  ShieldCheck,
  FileText,
  Check,
  X,
  ChevronRight,
  Info,
  Percent,
  Coins,
  RefreshCw,
  Building2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';

interface ResourceSection {
  id: number;
  resource_id: number;
  name: string;
}

interface RateCard {
  hourly_rate: number;
  daily_rate: number;
  security_deposit: number;
}

interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  is_splittable: boolean;
  internal_only: boolean;
  buffer_minutes: number;
  rate_card: RateCard | null;
  sections: ResourceSection[];
  approval_flow: string[];
}

interface ApprovalStep {
  id: number;
  reservation_id: number;
  level: number;
  approver_role: string;
  status: string;
  comments: string | null;
}

interface CollectionDemand {
  id: number;
  reservation_id: number;
  demand_no: string;
  amount: number;
  status: string;
  created_at: string;
}

interface OverrideLog {
  id: number;
  reservation_id: number;
  reason_code: string;
  reason_text: string;
  cancelled_by: string;
  timestamp: string;
}

interface EventRef {
  id: number;
  reservation_id: number;
  event_id: string;
  event_title: string;
}

interface Reservation {
  id: number;
  resource_id: number;
  resource_name: string;
  section_id: number | null;
  section_name: string | null;
  requester_type: 'internal' | 'external';
  requester_name: string;
  requester_email: string;
  start_ts: string;
  end_ts: string;
  recurrence: 'none' | 'weekly';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  payment_mode: string;
  group_id: string;
  approval_steps: ApprovalStep[];
  collection_demand: CollectionDemand | null;
  override_log: OverrideLog | null;
  event_ref: EventRef | null;
}

interface UtilizationStat {
  id: number;
  name: string;
  type: string;
  capacity: number;
  used_hours: number;
  available_hours: number;
  utilization_percentage: number;
  revenue_earned: number;
  under_used: boolean;
}

// Helper to expand a reservation into instances based on weekly recurrence
function expandReservation(resv: { start_ts: string; end_ts: string; recurrence: string }): { start: number; end: number; dateStr: string }[] {
  const start = new Date(resv.start_ts).getTime();
  const end = new Date(resv.end_ts).getTime();
  const instances = [];

  if (resv.recurrence === 'weekly') {
    for (let i = 0; i < 5; i++) {
      const offset = i * 7 * 24 * 60 * 60 * 1000;
      const instStart = start + offset;
      const instEnd = end + offset;
      instances.push({
        start: instStart,
        end: instEnd,
        dateStr: ''
      });
    }
  } else {
    instances.push({
      start,
      end,
      dateStr: ''
    });
  }
  return instances;
}

// Calculate vacant time windows (gaps) for a room from 08:00 to 20:00 on selected date
function getAvailableSlots(resource: Resource, selectedDateStr: string, activeReservations: Reservation[]): { startStr: string; endStr: string }[] {
  const dayStart = new Date(`${selectedDateStr}T08:00:00`).getTime();
  const dayEnd = new Date(`${selectedDateStr}T20:00:00`).getTime();

  // Find active bookings on selected date
  const filterDateStart = new Date(`${selectedDateStr}T00:00:00`).getTime();
  const filterDateEnd = new Date(`${selectedDateStr}T23:59:59`).getTime();

  const resourceBookings = activeReservations.filter(resv => {
    if (resv.resource_id !== resource.id) return false;
    if (resv.status === 'Cancelled' || resv.status === 'Rejected') return false;

    const instances = expandReservation({
      start_ts: resv.start_ts,
      end_ts: resv.end_ts,
      recurrence: resv.recurrence
    });

    return instances.some(inst => inst.start <= filterDateEnd && inst.end >= filterDateStart);
  });

  // Collect booked intervals clamped to 08:00 - 20:00 operational hours
  const intervals: { start: number; end: number }[] = [];
  resourceBookings.forEach(resv => {
    const instances = expandReservation({
      start_ts: resv.start_ts,
      end_ts: resv.end_ts,
      recurrence: resv.recurrence
    });

    instances.forEach(inst => {
      if (inst.start <= filterDateEnd && inst.end >= filterDateStart) {
        const startClamp = Math.max(inst.start, dayStart);
        const endClamp = Math.min(inst.end, dayEnd);
        if (startClamp < endClamp) {
          intervals.push({ start: startClamp, end: endClamp });
        }
      }
    });
  });

  // Sort by start times
  intervals.sort((a, b) => a.start - b.start);

  // Merge overlaps
  const mergedIntervals: { start: number; end: number }[] = [];
  intervals.forEach(curr => {
    if (mergedIntervals.length === 0) {
      mergedIntervals.push(curr);
    } else {
      const last = mergedIntervals[mergedIntervals.length - 1];
      if (curr.start <= last.end) {
        last.end = Math.max(last.end, curr.end);
      } else {
        mergedIntervals.push(curr);
      }
    }
  });

  // Compute gaps respecting space buffer
  const bufferMs = (resource.buffer_minutes || 0) * 60 * 1000;
  const gaps: { start: number; end: number }[] = [];
  let lastEnd = dayStart;

  mergedIntervals.forEach(block => {
    const gapStart = lastEnd === dayStart ? dayStart : lastEnd + bufferMs;
    if (block.start > gapStart) {
      gaps.push({ start: gapStart, end: block.start });
    }
    lastEnd = Math.max(lastEnd, block.end);
  });

  const finalGapStart = lastEnd === dayStart ? dayStart : lastEnd + bufferMs;
  if (dayEnd > finalGapStart) {
    gaps.push({ start: finalGapStart, end: dayEnd });
  }

  const formatHM = (ms: number) => {
    const d = new Date(ms);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return gaps.map(g => ({
    startStr: formatHM(g.start),
    endStr: formatHM(g.end)
  }));
}

// Calculate if space is currently occupied on selected date (checks current hour if selectedDate is today)
function getRoomStatusOnDate(resource: Resource, selectedDateStr: string, activeReservations: Reservation[]): { isOccupied: boolean; activeBookingsCount: number; currentBooking: Reservation | null } {
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDateStr === todayStr;

  const filterDateStart = new Date(`${selectedDateStr}T00:00:00`).getTime();
  const filterDateEnd = new Date(`${selectedDateStr}T23:59:59`).getTime();

  const resourceBookings = activeReservations.filter(resv => {
    if (resv.resource_id !== resource.id) return false;
    if (resv.status === 'Cancelled' || resv.status === 'Rejected') return false;

    const instances = expandReservation({
      start_ts: resv.start_ts,
      end_ts: resv.end_ts,
      recurrence: resv.recurrence
    });

    return instances.some(inst => inst.start <= filterDateEnd && inst.end >= filterDateStart);
  });

  if (isToday) {
    const nowMs = Date.now();
    for (const resv of resourceBookings) {
      const instances = expandReservation({
        start_ts: resv.start_ts,
        end_ts: resv.end_ts,
        recurrence: resv.recurrence
      });
      const activeInst = instances.find(inst => nowMs >= inst.start && nowMs <= inst.end);
      if (activeInst) {
        return { isOccupied: true, activeBookingsCount: resourceBookings.length, currentBooking: resv };
      }
    }
  }

  return { 
    isOccupied: isToday ? false : resourceBookings.length > 0, 
    activeBookingsCount: resourceBookings.length,
    currentBooking: resourceBookings[0] || null 
  };
}

const ResourceReservation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'internal' | 'external' | 'admin' | 'analytics'>('calendar');
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [utilization, setUtilization] = useState<UtilizationStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Override notification log
  const [dispatchedNotification, setDispatchedNotification] = useState<{
    recipient_email: string;
    recipient_name: string;
    subject: string;
    message: string;
    refund_flag: boolean;
    refund_amount: number;
    event_ref: { event_id: string; event_title: string } | null;
  } | null>(null);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  // Form states - Internal Cart
  const [internalName, setInternalName] = useState('Dr. Rajesh (HOD Science)');
  const [internalEmail, setInternalEmail] = useState('rajesh@edumerge.edu.in');
  const [internalCart, setInternalCart] = useState<any[]>([]);

  // Cart addition draft state - Internal
  const [intResourceId, setIntResourceId] = useState<string>('');
  const [intSectionId, setIntSectionId] = useState<string>('null');
  const [intStartDate, setIntStartDate] = useState('2026-06-25');
  const [intStartTime, setIntStartTime] = useState('09:00');
  const [intEndDate, setIntEndDate] = useState('2026-06-25');
  const [intEndTime, setIntEndTime] = useState('11:00');
  const [intRecurrence, setIntRecurrence] = useState<'none' | 'weekly'>('none');
  const [intEventTitle, setIntEventTitle] = useState('');

  // Form states - External Checkout
  const [extName, setExtName] = useState('Global Coding Ltd');
  const [extEmail, setExtEmail] = useState('events@globalcoding.com');
  const [extPaymentMode, setExtPaymentMode] = useState('UPI');
  const [extCart, setExtCart] = useState<any[]>([]);

  // Cart addition draft state - External
  const [extResourceId, setExtResourceId] = useState<string>('');
  const [extSectionId, setExtSectionId] = useState<string>('null');
  const [extStartDate, setExtStartDate] = useState('2026-07-06');
  const [extStartTime, setExtStartTime] = useState('10:00');
  const [extEndDate, setExtEndDate] = useState('2026-07-06');
  const [extEndTime, setExtEndTime] = useState('16:00');
  const [extEventTitle, setExtEventTitle] = useState('Technical Hiring Symposium');

  // Form states - Admin Room Setup (Creation Form)
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('Classroom');
  const [newRoomCapacity, setNewRoomCapacity] = useState('40');
  const [newRoomBuffer, setNewRoomBuffer] = useState('15');
  const [newRoomSplittable, setNewRoomSplittable] = useState(false);
  const [newRoomSectionsInput, setNewRoomSectionsInput] = useState('Section A, Section B');
  const [newRoomInternalOnly, setNewRoomInternalOnly] = useState(true);
  
  // Rate Card details for new room
  const [newRoomHourly, setNewRoomHourly] = useState('500');
  const [newRoomDaily, setNewRoomDaily] = useState('4000');
  const [newRoomDeposit, setNewRoomDeposit] = useState('1000');

  // Configurable Approval Flow steps setup
  const [approvalFlowSetup, setApprovalFlowSetup] = useState<string[]>(["HOD", "Admin Office", "Principal"]);
  const [selectedFlowRoleToAdd, setSelectedFlowRoleToAdd] = useState('Principal');

  // Conflict Previews
  const [clashList, setClashList] = useState<any[]>([]);
  const [clashStatus, setClashStatus] = useState<'idle' | 'clean' | 'conflicted'>('idle');

  // Admin Override Modal states
  const [selectedResvForOverride, setSelectedResvForOverride] = useState<Reservation | null>(null);
  const [overrideReasonCode, setOverrideReasonCode] = useState('MAINTENANCE');
  const [overrideReasonText, setOverrideReasonText] = useState('Facility closed for urgent maintenance work.');

  // Admin Step Approval details
  const [approverRole, setApproverRole] = useState<'HOD' | 'Admin Office' | 'Principal'>('HOD');
  const [approvalComment, setApprovalComment] = useState('Recommended for educational purposes.');

  // Calendar filter state
  const [calendarDateFilter, setCalendarDateFilter] = useState('2026-06-25');

  // Initial Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const resResources = await fetch('/api/reservation/resources');
      const dataResources = await resResources.json();
      setResources(dataResources);

      if (dataResources.length > 0) {
        if (!intResourceId) setIntResourceId(dataResources[0].id.toString());
        if (!extResourceId) setExtResourceId(dataResources[0].id.toString());
      }

      const resReservations = await fetch('/api/reservation/reservations');
      const dataReservations = await resReservations.json();
      setReservations(dataReservations);

      const resUtil = await fetch('/api/reservation/utilization');
      const dataUtil = await resUtil.json();
      setUtilization(dataUtil);
    } catch (err: any) {
      showToast('Error loading details from servers: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createIsoString = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}:00`).toISOString();
  };

  const getSelectedResourceCostDetails = (resId: string, startD: string, startT: string, endD: string, endT: string) => {
    const rc = resources.find(r => r.id === parseInt(resId));
    if (!rc || !rc.rate_card) return null;

    try {
      const startIso = createIsoString(startD, startT);
      const endIso = createIsoString(endD, endT);
      const durationMs = new Date(endIso).getTime() - new Date(startIso).getTime();
      const hours = Math.ceil(durationMs / (1000 * 60 * 60));
      
      let baseAmount = 0;
      if (hours >= 24) {
        const days = Math.ceil(hours / 24);
        baseAmount = days * rc.rate_card.daily_rate;
      } else {
        baseAmount = Math.min(hours * rc.rate_card.hourly_rate, rc.rate_card.daily_rate);
      }
      const security = rc.rate_card.security_deposit;
      return {
        hours,
        hourly_rate: rc.rate_card.hourly_rate,
        daily_rate: rc.rate_card.daily_rate,
        security_deposit: security,
        base_amount: baseAmount,
        total: baseAmount + security
      };
    } catch {
      return null;
    }
  };

  const runConflictPreCheck = async (cartItems: any[]) => {
    if (cartItems.length === 0) {
      setClashStatus('idle');
      setClashList([]);
      return;
    }

    try {
      const response = await fetch('/api/reservation/check-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookings: cartItems })
      });
      const result = await response.json();
      if (result.conflict) {
        setClashStatus('conflicted');
        setClashList(result.clashDetails);
        showToast('Conflicts detected in selected schedule slots!', 'error');
      } else {
        setClashStatus('clean');
        setClashList([]);
        showToast('Slots are available; buffer rules satisfied.');
      }
    } catch (err: any) {
      showToast('Clash check failed: ' + err.message, 'error');
    }
  };

  // Add Item to Internal Cart
  const addInternalCartItem = () => {
    if (!intResourceId) return;
    const res = resources.find(r => r.id === parseInt(intResourceId));
    if (!res) return;

    const start_ts = createIsoString(intStartDate, intStartTime);
    const end_ts = createIsoString(intEndDate, intEndTime);

    if (new Date(end_ts).getTime() <= new Date(start_ts).getTime()) {
      showToast('Booking end time must occur after the start time.', 'error');
      return;
    }

    const newItem = {
      resource_id: res.id,
      resource_name: res.name,
      section_id: intSectionId === 'null' ? null : parseInt(intSectionId),
      section_name: intSectionId === 'null' ? 'Whole Space' : res.sections.find(s => s.id === parseInt(intSectionId))?.name || '',
      start_ts,
      end_ts,
      recurrence: intRecurrence,
      event_title: intEventTitle || null
    };

    const updatedCart = [...internalCart, newItem];
    setInternalCart(updatedCart);
    setIntEventTitle('');
    runConflictPreCheck(updatedCart);
  };

  // Add Item to External Cart
  const addExternalCartItem = () => {
    if (!extResourceId) return;
    const res = resources.find(r => r.id === parseInt(extResourceId));
    if (!res) return;

    const start_ts = createIsoString(extStartDate, extStartTime);
    const end_ts = createIsoString(extEndDate, extEndTime);

    if (new Date(end_ts).getTime() <= new Date(start_ts).getTime()) {
      showToast('Booking end time must occur after the start time.', 'error');
      return;
    }

    const costDetails = getSelectedResourceCostDetails(extResourceId, extStartDate, extStartTime, extEndDate, extEndTime);

    const newItem = {
      resource_id: res.id,
      resource_name: res.name,
      section_id: extSectionId === 'null' ? null : parseInt(extSectionId),
      section_name: extSectionId === 'null' ? 'Whole Space' : res.sections.find(s => s.id === parseInt(extSectionId))?.name || '',
      start_ts,
      end_ts,
      recurrence: 'none',
      event_title: extEventTitle || null,
      cost: costDetails ? costDetails.total : 0,
      hours: costDetails ? costDetails.hours : 0
    };

    const updatedCart = [...extCart, newItem];
    setExtCart(updatedCart);
    setExtEventTitle('');
    runConflictPreCheck(updatedCart);
  };

  const removeInternalCartItem = (idx: number) => {
    const updated = internalCart.filter((_, i) => i !== idx);
    setInternalCart(updated);
    runConflictPreCheck(updated);
  };

  const removeExternalCartItem = (idx: number) => {
    const updated = extCart.filter((_, i) => i !== idx);
    setExtCart(updated);
    runConflictPreCheck(updated);
  };

  // Submit Cart Booking
  const submitCartBooking = async (type: 'internal' | 'external') => {
    const isInternal = type === 'internal';
    const cart = isInternal ? internalCart : extCart;
    
    if (cart.length === 0) {
      showToast('Your booking request cart is currently empty.', 'error');
      return;
    }

    const payload = {
      requester_type: type,
      requester_name: isInternal ? internalName : extName,
      requester_email: isInternal ? internalEmail : extEmail,
      payment_mode: isInternal ? 'Notional' : extPaymentMode,
      bookings: cart.map(item => ({
        resource_id: item.resource_id,
        section_id: item.section_id,
        start_ts: item.start_ts,
        end_ts: item.end_ts,
        recurrence: item.recurrence,
        event_title: item.event_title
      }))
    };

    try {
      const response = await fetch('/api/reservation/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.conflicts) {
          setClashStatus('conflicted');
          setClashList(result.conflicts);
        }
        throw new Error(result.error || 'Failed to submit booking');
      }

      showToast(`Group booking created successfully. Group ID: ${result.group_id}`);
      if (isInternal) {
        setInternalCart([]);
      } else {
        setExtCart([]);
      }
      setClashStatus('idle');
      setClashList([]);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Admin Room Creation Submit
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !newRoomType || !newRoomCapacity) {
      showToast('Room Name, Type and Capacity are mandatory.', 'error');
      return;
    }

    const payload = {
      name: newRoomName,
      type: newRoomType,
      capacity: parseInt(newRoomCapacity),
      is_splittable: newRoomSplittable,
      internal_only: newRoomInternalOnly,
      buffer_minutes: parseInt(newRoomBuffer) || 0,
      approval_flow: approvalFlowSetup,
      sections: newRoomSplittable ? newRoomSectionsInput.split(',').map(s => s.trim()).filter(Boolean) : [],
      hourly_rate: newRoomInternalOnly ? 0 : parseFloat(newRoomHourly) || 0,
      daily_rate: newRoomInternalOnly ? 0 : parseFloat(newRoomDaily) || 0,
      security_deposit: newRoomInternalOnly ? 0 : parseFloat(newRoomDeposit) || 0
    };

    try {
      const response = await fetch('/api/reservation/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to create room');

      showToast(`Room space "${newRoomName}" added successfully.`);
      // Reset forms
      setNewRoomName('');
      setNewRoomSplittable(false);
      setNewRoomSectionsInput('Section A, Section B');
      setNewRoomInternalOnly(true);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Admin Approval Step Action
  const handleApproveStep = async (resvId: number, level: number, status: 'Approved' | 'Rejected') => {
    const payload = {
      reservation_id: resvId,
      level,
      status,
      comments: approvalComment
    };

    try {
      const response = await fetch('/api/reservation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      showToast(`Action submitted successfully. ${result.message}`);
      setApprovalComment('');
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Admin Override-Cancel Action
  const handleOverrideCancel = async () => {
    if (!selectedResvForOverride) return;

    const payload = {
      reservation_id: selectedResvForOverride.id,
      reason_code: overrideReasonCode,
      reason_text: overrideReasonText,
      cancelled_by: approverRole === 'Admin Office' ? 'Admin Office' : 'Principal'
    };

    try {
      const response = await fetch('/api/reservation/override-cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      showToast(`Reservation successfully overridden and cancelled.`);
      setDispatchedNotification(result.notification);
      setSelectedResvForOverride(null);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Report Export: Excel Log
  const exportExcelReport = () => {
    const dataRows = reservations.map(r => ({
      "Space Name": r.resource_name,
      "Section/Division": r.section_name || 'Whole space',
      "Requester Type": r.requester_type.toUpperCase(),
      "Requester Name": r.requester_name,
      "Requester Email": r.requester_email,
      "Start DateTime": formatUIDate(r.start_ts) + ' ' + formatUITime(r.start_ts),
      "End DateTime": formatUIDate(r.end_ts) + ' ' + formatUITime(r.end_ts),
      "Recurrence Rule": r.recurrence,
      "Booking Status": r.status,
      "Payment Mode": r.payment_mode,
      "Group ID": r.group_id,
      "Fee Raised (Rs.)": r.collection_demand ? r.collection_demand.amount : 0,
      "Invoice Bill Code": r.collection_demand ? r.collection_demand.demand_no : 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservations Log");
    XLSX.writeFile(workbook, "Campus_Space_Reservations_Report.xlsx");
    showToast("Excel spreadsheet generated successfully.");
  };

  // Report Export: PDF report
  const exportPDFReport = () => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      
      // Header Titles
      doc.setFontSize(16);
      doc.text("edumerge ERP - Campus Space Registry Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated Date: ${formatUIDate(new Date().toISOString())}`, 14, 21);
      doc.text("Module: Space Reservation & Fee Integration Module", 14, 26);

      // Section 1: Room-wise stats Table
      doc.setFontSize(12);
      doc.text("1. Space Occupancy & Revenue Summary", 14, 35);

      const uHeaders = [["Room Name", "Space Type", "Capacity", "Occupied (Hrs)", "Usage Ratio", "Total Revenue (Rs.)"]];
      const uBody = utilization.map(s => [
        s.name,
        s.type,
        s.capacity.toString(),
        `${s.used_hours} hrs`,
        `${s.utilization_percentage}%`,
        `Rs. ${s.revenue_earned.toLocaleString('en-IN')}`
      ]);

      autoTable(doc, {
        startY: 38,
        head: uHeaders,
        body: uBody,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138] },
        styles: { fontSize: 8 }
      });

      // Section 2: Bookings Log Table
      const nextY = (doc as any).lastAutoTable.finalY + 12;
      doc.text("2. Active Schedule Bookings Registry", 14, nextY);

      const activeResvs = reservations.filter(r => r.status === 'Approved' || r.status === 'Pending');
      const bHeaders = [["Space Name", "Booker", "Schedules (Local)", "Recurrence", "Demand No", "Subtotal (Rs.)"]];
      const bBody = activeResvs.map(r => [
        r.resource_name,
        `${r.requester_name}\n(${r.requester_type})`,
        `${formatUIDate(r.start_ts)}\n${formatUITime(r.start_ts)} - ${formatUITime(r.end_ts)}`,
        r.recurrence,
        r.collection_demand ? r.collection_demand.demand_no : 'N/A',
        r.collection_demand ? `Rs. ${r.collection_demand.amount.toLocaleString('en-IN')}` : 'Notional'
      ]);

      autoTable(doc, {
        startY: nextY + 3,
        head: bHeaders,
        body: bBody,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 }
      });

      doc.save("Campus_Space_Registry_Analytics_Report.pdf");
      showToast("PDF reports generated and downloaded successfully.");
    } catch (err: any) {
      showToast("PDF generation failed: " + err.message, 'error');
    }
  };

  const formatUIDate = (isoStr: string) => {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatUITime = (isoStr: string) => {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  // Add flow step helper
  const addFlowStepSetup = () => {
    if (!selectedFlowRoleToAdd) return;
    setApprovalFlowSetup([...approvalFlowSetup, selectedFlowRoleToAdd]);
  };

  const removeFlowStepSetup = (idx: number) => {
    setApprovalFlowSetup(approvalFlowSetup.filter((_, i) => i !== idx));
  };

  return (
    <Layout
      title="Resource Reservation System"
      description="Single source of truth for campus space-and-time calendars"
      showHome={true}
      headerActions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="border-slate-200">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Sync Feeds
          </Button>
          <Badge className="bg-purple-50 text-purple-600 border border-purple-200 font-semibold px-2.5 py-1">
            edumerge ERP Portal
          </Badge>
        </div>
      }
    >
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-16 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border ${
          toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Main Page Layout Split */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Navigation Panel - Fixed Navy and Blue design */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800">
            <div className="flex items-center gap-2.5 mb-4">
              <Building2 className="h-5 w-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-sm tracking-wide">Campus Registrar</h3>
                <p className="text-slate-400 text-[10px] uppercase font-medium tracking-wider">Institution Central</p>
              </div>
            </div>
            <Separator className="bg-slate-800 my-2" />
            <div className="space-y-1 mt-3">
              <Button
                variant={activeTab === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-xs font-semibold ${
                  activeTab === 'calendar' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setActiveTab('calendar')}
              >
                <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                Live Space Search
              </Button>
              <Button
                variant={activeTab === 'internal' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-xs font-semibold ${
                  activeTab === 'internal' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setActiveTab('internal')}
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                Internal Staff Requests
              </Button>
              <Button
                variant={activeTab === 'external' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-xs font-semibold ${
                  activeTab === 'external' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setActiveTab('external')}
              >
                <Coins className="h-3.5 w-3.5 mr-2" />
                External Rental Booking
              </Button>
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-xs font-semibold ${
                  activeTab === 'admin' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setActiveTab('admin')}
              >
                <FileText className="h-3.5 w-3.5 mr-2" />
                Registry & Approvals
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                size="sm"
                className={`w-full justify-start text-xs font-semibold ${
                  activeTab === 'analytics' 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                onClick={() => setActiveTab('analytics')}
              >
                <Percent className="h-3.5 w-3.5 mr-2" />
                Space Utilisation & Reports
              </Button>
            </div>
          </div>

          {/* Conflict engine output banner */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              Conflict Engine Service
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Active checking is running on all resource, section, buffer, and weekly schedules.
            </p>
            
            <div className="mt-3">
              {clashStatus === 'clean' && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded border border-emerald-100 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Checked: No Clashes Detected
                </div>
              )}

              {clashStatus === 'conflicted' && (
                <div className="space-y-1.5">
                  <div className="p-2 bg-red-50 text-red-800 text-[10px] font-semibold rounded border border-red-100 flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5 text-red-600" />
                    Conflict Warning
                  </div>
                  <div className="max-h-36 overflow-y-auto border border-red-100 rounded p-1 bg-red-50/20 text-[9px] text-red-700 space-y-1 divide-y divide-red-100">
                    {clashList.map((cl, i) => (
                      <div key={i} className="pt-1 first:pt-0">
                        <span className="font-bold">[{cl.resourceName}]</span> {cl.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {clashStatus === 'idle' && (
                <div className="p-2 bg-slate-50 text-slate-600 text-[10px] rounded border border-slate-100 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                  Add bookings to cart to test
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Dashboard Area */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-xs font-semibold">Updating reservation logs...</p>
            </div>
          ) : (
            <>
              {/* Tab 1: Live Space Search (Room wise status & vacancy) */}
              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-800">Room-wise Availability Monitor</CardTitle>
                        <CardDescription className="text-xs">Select calendar date to inspect spaces occupancy status and find gap-slots</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="calDate" className="text-xs font-semibold text-slate-600">Selected Date:</Label>
                        <Input
                          id="calDate"
                          type="date"
                          value={calendarDateFilter}
                          onChange={(e) => setCalendarDateFilter(e.target.value)}
                          className="h-8 text-xs w-36"
                        />
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Room Status Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map(res => {
                      const stat = getRoomStatusOnDate(res, calendarDateFilter, reservations);
                      const gaps = getAvailableSlots(res, calendarDateFilter, reservations);
                      const bookingsOnDate = reservations.filter(r => {
                        if (r.resource_id !== res.id) return false;
                        if (r.status === 'Cancelled' || r.status === 'Rejected') return false;
                        
                        const instances = expandReservation({
                          start_ts: r.start_ts,
                          end_ts: r.end_ts,
                          recurrence: r.recurrence
                        });
                        const filterDateStart = new Date(`${calendarDateFilter}T00:00:00`).getTime();
                        const filterDateEnd = new Date(`${calendarDateFilter}T23:59:59`).getTime();
                        return instances.some(inst => inst.start <= filterDateEnd && inst.end >= filterDateStart);
                      });

                      return (
                        <Card key={res.id} className={`border-slate-200 shadow-sm relative overflow-hidden bg-white ${
                          stat.isOccupied ? 'border-red-150' : 'border-emerald-150'
                        }`}>
                          <div className={`absolute top-0 left-0 w-1.5 h-full ${
                            stat.isOccupied ? 'bg-red-500' : 'bg-emerald-500'
                          }`}></div>
                          
                          <CardHeader className="py-3 px-4 pl-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-sm font-bold text-slate-800">{res.name}</CardTitle>
                              <CardDescription className="text-[10px]">{res.type} &bull; Capacity: {res.capacity} students</CardDescription>
                            </div>
                            <Badge className={
                              stat.isOccupied 
                                ? 'bg-red-50 text-red-700 border border-red-200 font-bold' 
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold'
                            }>
                              {stat.isOccupied ? 'Occupied Now' : 'Vacant Now'}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pl-6 space-y-4">
                            {/* Today's Schedule timeline */}
                            <div className="space-y-1">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Scheduled Slots ({formatUIDate(calendarDateFilter)})</span>
                              {bookingsOnDate.length === 0 ? (
                                <p className="text-xs text-slate-500 font-medium">None scheduled.</p>
                              ) : (
                                <div className="space-y-1.5 max-h-24 overflow-y-auto mt-1">
                                  {bookingsOnDate.map(b => (
                                    <div key={b.id} className="flex items-center justify-between bg-slate-50 p-2 rounded text-[11px] border border-slate-150">
                                      <div className="font-semibold text-slate-700">
                                        {formatUITime(b.start_ts)} - {formatUITime(b.end_ts)} {b.recurrence === 'weekly' && '(Weekly)'}
                                      </div>
                                      <div className="text-[10px] text-slate-500">
                                        Req: {b.requester_name} ({b.requester_type})
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Next Available slots gap display */}
                            <div className="space-y-1.5 pt-2 border-t border-slate-150">
                              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-slate-400" />
                                Available Gap Slots (08:00 - 20:00)
                              </span>
                              {gaps.length === 0 ? (
                                <p className="text-xs text-red-500 font-medium italic">No availability slots remaining today.</p>
                              ) : (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {gaps.map((gp, i) => (
                                    <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-800 hover:bg-blue-100 text-[10px] border border-blue-100 font-bold px-2 py-0.5">
                                      {gp.startStr} to {gp.endStr}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <p className="text-[9px] text-slate-400 mt-1 italic font-medium">
                                *Gap calculations include resource buffer rule of {res.buffer_minutes}m.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Internal Staff Flow */}
              {activeTab === 'internal' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Form Block */}
                  <div className="xl:col-span-2 space-y-4">
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-bold text-slate-800">Submit Internal Space Request</CardTitle>
                        <CardDescription className="text-xs">Submit a reservation that routes through the room's default configured approval level path</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Requester Name</Label>
                            <Input
                              type="text"
                              value={internalName}
                              onChange={(e) => setInternalName(e.target.value)}
                              className="h-9 text-xs"
                              placeholder="e.g. Dr. Rajesh (HOD Science)"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Requester Email</Label>
                            <Input
                              type="email"
                              value={internalEmail}
                              onChange={(e) => setInternalEmail(e.target.value)}
                              className="h-9 text-xs"
                              placeholder="e.g. rajesh@edumerge.edu.in"
                            />
                          </div>
                        </div>

                        <Separator className="bg-slate-100 my-2" />

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-4">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                            <Plus className="h-4 w-4 text-blue-600" />
                            Add Space Schedule Block
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Select Campus Resource</Label>
                              <Select
                                value={intResourceId}
                                onValueChange={(val) => {
                                  setIntResourceId(val);
                                  setIntSectionId('null');
                                }}
                              >
                                <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                  <SelectValue placeholder="Choose Resource" />
                                </SelectTrigger>
                                <SelectContent>
                                  {resources.map(r => (
                                    <SelectItem key={r.id} value={r.id.toString()} className="text-xs">
                                      {r.name} ({r.type})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Section dropdown for splittable space */}
                            {intResourceId && resources.find(r => r.id === parseInt(intResourceId))?.is_splittable && (
                              <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-slate-600">Select Section (Splittable)</Label>
                                <Select value={intSectionId} onValueChange={setIntSectionId}>
                                  <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                    <SelectValue placeholder="Select Section" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="null" className="text-xs">Whole Resource (Locks Sections)</SelectItem>
                                    {resources.find(r => r.id === parseInt(intResourceId))?.sections.map(s => (
                                      <SelectItem key={s.id} value={s.id.toString()} className="text-xs">
                                        {s.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Start Date</Label>
                              <Input
                                type="date"
                                value={intStartDate}
                                onChange={(e) => setIntStartDate(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Start Time</Label>
                              <Input
                                type="time"
                                value={intStartTime}
                                onChange={(e) => setIntStartTime(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">End Date</Label>
                              <Input
                                type="date"
                                value={intEndDate}
                                onChange={(e) => setIntEndDate(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">End Time</Label>
                              <Input
                                type="time"
                                value={intEndTime}
                                onChange={(e) => setIntEndTime(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Recurrence Rule</Label>
                              <Select value={intRecurrence} onValueChange={(val: any) => setIntRecurrence(val)}>
                                <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none" className="text-xs">No Recurrence (Single Booking)</SelectItem>
                                  <SelectItem value="weekly" className="text-xs">Weekly Recurrence (5 instances)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Associated Event Link Title (Optional)</Label>
                              <Input
                                type="text"
                                value={intEventTitle}
                                onChange={(e) => setIntEventTitle(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                                placeholder="e.g. Annual Science Fest 2026"
                              />
                            </div>
                          </div>

                          {intResourceId && (
                            <div className="p-3 bg-blue-50/40 border border-blue-200 rounded-lg text-xs space-y-1">
                              <div className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                                Configured Space approval flow template:
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5 text-slate-600 font-semibold text-[10px]">
                                {(() => {
                                  const rObj = resources.find(r => r.id === parseInt(intResourceId));
                                  const flow = rObj?.approval_flow || ["HOD", "Admin Office", "Principal"];
                                  return flow.map((role, idx) => (
                                    <React.Fragment key={idx}>
                                      {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400" />}
                                      <Badge variant="outline" className="bg-white text-slate-800 border-slate-300 py-0.5 text-[9px]">
                                        L{idx+1}: {role}
                                      </Badge>
                                    </React.Fragment>
                                  ));
                                })()}
                              </div>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200 mt-2 font-semibold"
                            onClick={addInternalCartItem}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add Schedule Block to Booking Group
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="space-y-4">
                    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
                      <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-sm font-bold text-slate-800 flex items-center justify-between">
                          <span>Atomic Booking Group</span>
                          <Badge className="bg-blue-600 text-white font-bold">{internalCart.length} Items</Badge>
                        </CardTitle>
                        <CardDescription className="text-[10px]">
                          Bookings commit atomically; if any resource clashes, all are rejected.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow flex flex-col justify-between">
                        {internalCart.length === 0 ? (
                          <div className="text-center py-20 text-slate-400">
                            <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-semibold">Your booking group is empty</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Define times and add spaces from the left form</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              {internalCart.map((item, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative hover:border-blue-300 transition-colors">
                                  <button
                                    onClick={() => removeInternalCartItem(idx)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  <div className="text-xs font-bold text-slate-800">{item.resource_name}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">Section: {item.section_name}</div>
                                  <div className="text-[10px] text-slate-500">Date: {formatUIDate(item.start_ts)}</div>
                                  <div className="text-[10px] text-slate-500">
                                    Time: {formatUITime(item.start_ts)} to {formatUITime(item.end_ts)}
                                  </div>
                                  {item.recurrence === 'weekly' && (
                                    <Badge className="text-[8px] mt-1.5 bg-purple-50 text-purple-700 border border-purple-200">
                                      Weekly (5 Weeks)
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-1/2 text-xs font-semibold text-slate-600"
                                  onClick={() => runConflictPreCheck(internalCart)}
                                >
                                  Test Conflicts
                                </Button>
                                <Button
                                  size="sm"
                                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                                  onClick={() => submitCartBooking('internal')}
                                >
                                  Submit Group
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Tab 3: External Paid Checkout */}
              {activeTab === 'external' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Form Block */}
                  <div className="xl:col-span-2 space-y-4">
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-bold text-slate-800">Rent Campus space (External Clients)</CardTitle>
                        <CardDescription className="text-xs">Raise invoices and security deposits instantly in edumerge Fee Management module</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Company / Organization Name</Label>
                            <Input
                              type="text"
                              value={extName}
                              onChange={(e) => setExtName(e.target.value)}
                              className="h-9 text-xs"
                              placeholder="e.g. Rotary Club Bangalore"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Client Email Address</Label>
                            <Input
                              type="email"
                              value={extEmail}
                              onChange={(e) => setExtEmail(e.target.value)}
                              className="h-9 text-xs"
                              placeholder="e.g. rotary@blr.org"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Collection Payment Mode</Label>
                            <Select value={extPaymentMode} onValueChange={setExtPaymentMode}>
                              <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UPI" className="text-xs">UPI (Instant Dispatch)</SelectItem>
                                <SelectItem value="Card" className="text-xs">Credit/Debit Card</SelectItem>
                                <SelectItem value="NetBanking" className="text-xs">NetBanking Link</SelectItem>
                                <SelectItem value="Cash" className="text-xs">Cash Payment (Receipt Counter)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <Separator className="bg-slate-100 my-2" />

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-4">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                            <Coins className="h-4 w-4 text-blue-600" />
                            Configure Space & Fee Collection details
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Choose Rentable Resource</Label>
                              <Select
                                value={extResourceId}
                                onValueChange={(val) => {
                                  setExtResourceId(val);
                                  setExtSectionId('null');
                                }}
                              >
                                <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                  <SelectValue placeholder="Choose Resource" />
                                </SelectTrigger>
                                <SelectContent>
                                  {resources.filter(r => !r.internal_only).map(r => (
                                    <SelectItem key={r.id} value={r.id.toString()} className="text-xs">
                                      {r.name} ({r.type})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Section dropdown for splittable space */}
                            {extResourceId && resources.find(r => r.id === parseInt(extResourceId))?.is_splittable && (
                              <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-slate-600">Select Section (Splittable)</Label>
                                <Select value={extSectionId} onValueChange={setExtSectionId}>
                                  <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                    <SelectValue placeholder="Select Section" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="null" className="text-xs">Whole Resource (Locks Sections)</SelectItem>
                                    {resources.find(r => r.id === parseInt(extResourceId))?.sections.map(s => (
                                      <SelectItem key={s.id} value={s.id.toString()} className="text-xs">
                                        {s.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Start Date</Label>
                              <Input
                                type="date"
                                value={extStartDate}
                                onChange={(e) => setExtStartDate(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Start Time</Label>
                              <Input
                                type="time"
                                value={extStartTime}
                                onChange={(e) => setExtStartTime(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">End Date</Label>
                              <Input
                                type="date"
                                value={extEndDate}
                                onChange={(e) => setExtEndDate(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">End Time</Label>
                              <Input
                                type="time"
                                value={extEndTime}
                                onChange={(e) => setExtEndTime(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Associated Calendar Event Title</Label>
                              <Input
                                type="text"
                                value={extEventTitle}
                                onChange={(e) => setExtEventTitle(e.target.value)}
                                className="h-9 text-xs bg-white border-slate-200"
                                placeholder="e.g. Rotary Club AGM Session"
                              />
                            </div>
                          </div>

                          {/* Rate display details card */}
                          {extResourceId && (
                            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg text-xs space-y-2">
                              <div className="font-bold text-slate-800 flex items-center gap-1">
                                <Info className="h-3.5 w-3.5 text-blue-600" />
                                Space Rental Cost Calculations
                              </div>
                              {(() => {
                                const details = getSelectedResourceCostDetails(extResourceId, extStartDate, extStartTime, extEndDate, extEndTime);
                                if (!details) return <p className="text-[10px] text-slate-500">Fill scheduling dates to calculate price.</p>;
                                return (
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
                                    <div>
                                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">Duration</span>
                                      <p className="font-bold text-slate-800">{details.hours} Hours</p>
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">Hourly Rate</span>
                                      <p className="font-bold text-slate-800">Rs. {details.hourly_rate.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-slate-500 uppercase tracking-wide">Security Deposit</span>
                                      <p className="font-bold text-slate-800">Rs. {details.security_deposit.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="bg-blue-600 text-white rounded p-1.5 text-center">
                                      <span className="text-[8px] uppercase font-bold opacity-80">Total Charge</span>
                                      <p className="font-bold text-[13px]">Rs. {details.total.toLocaleString('en-IN')}</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200 font-semibold"
                            onClick={addExternalCartItem}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Add Rental Booking
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="space-y-4">
                    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
                      <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-sm font-bold text-slate-800 flex items-center justify-between">
                          <span>Rental Checkout List</span>
                          <Badge className="bg-blue-600 text-white font-bold">{extCart.length} Items</Badge>
                        </CardTitle>
                        <CardDescription className="text-[10px]">
                          Invoice demands will be raised under edumerge Fee Management module.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow flex flex-col justify-between">
                        {extCart.length === 0 ? (
                          <div className="text-center py-20 text-slate-400">
                            <Coins className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                            <p className="text-xs font-semibold">No rental bookings added</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Use the configuration details on the left to add items</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {extCart.map((item, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg relative hover:border-blue-300 transition-colors">
                                  <button
                                    onClick={() => removeExternalCartItem(idx)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                  <div className="text-xs font-bold text-slate-800">{item.resource_name}</div>
                                  <div className="text-[10px] text-slate-500 mt-0.5">Section: {item.section_name}</div>
                                  <div className="text-[10px] text-slate-500">Date: {formatUIDate(item.start_ts)}</div>
                                  <div className="text-[10px] text-slate-500">
                                    Time: {formatUITime(item.start_ts)} to {formatUITime(item.end_ts)} ({item.hours} hrs)
                                  </div>
                                  <div className="mt-2 flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-500 text-[10px]">Rental:</span>
                                    <span className="text-blue-600">Rs. {item.cost.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                                <span>Group Total Charge:</span>
                                <span className="text-base text-blue-600">
                                  Rs. {extCart.reduce((sum, item) => sum + item.cost, 0).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-1/2 text-xs font-semibold text-slate-600"
                                  onClick={() => runConflictPreCheck(extCart)}
                                >
                                  Test Availability
                                </Button>
                                <Button
                                  size="sm"
                                  className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                                  onClick={() => submitCartBooking('external')}
                                >
                                  Raise Demands & Book
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Tab 4: Admin Controls */}
              {activeTab === 'admin' && (
                <div className="space-y-6">
                  {/* Persona Switcher for demonstration */}
                  <Card className="border-slate-200 shadow-sm bg-blue-50/20">
                    <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between border-b border-slate-100">
                      <div>
                        <CardTitle className="text-xs font-bold text-slate-800">Review Persona Settings (Simulator)</CardTitle>
                        <CardDescription className="text-[10px]">Change active simulation role to test approval flows and cancellation overrides</CardDescription>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <label className="text-slate-600 flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="persona"
                            checked={approverRole === 'HOD'}
                            onChange={() => setApproverRole('HOD')}
                          />
                          HOD Science
                        </label>
                        <label className="text-slate-600 flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="persona"
                            checked={approverRole === 'Admin Office'}
                            onChange={() => setApproverRole('Admin Office')}
                          />
                          Admin Office Manager
                        </label>
                        <label className="text-slate-600 flex items-center gap-1.5">
                          <input
                            type="radio"
                            name="persona"
                            checked={approverRole === 'Principal'}
                            onChange={() => setApproverRole('Principal')}
                          />
                          Principal
                        </label>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Room Setup Registry builder form */}
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="h-4.5 w-4.5 text-blue-600" />
                        Institutional Space Registry & Workflow Flow Configurator
                      </CardTitle>
                      <CardDescription className="text-xs">Create new spaces and configure custom multi-level approval steps</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <form onSubmit={handleCreateRoom} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Space Room Name</Label>
                            <Input
                              type="text"
                              value={newRoomName}
                              onChange={(e) => setNewRoomName(e.target.value)}
                              className="h-9 text-xs"
                              placeholder="e.g. Physics Seminar Hall C"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Space Type</Label>
                            <Select value={newRoomType} onValueChange={setNewRoomType}>
                              <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Classroom" className="text-xs">Classroom</SelectItem>
                                <SelectItem value="Seminar Hall" className="text-xs">Seminar Hall</SelectItem>
                                <SelectItem value="Auditorium" className="text-xs">Auditorium</SelectItem>
                                <SelectItem value="Lab" className="text-xs">Lab / Workshop</SelectItem>
                                <SelectItem value="Sports Ground" className="text-xs">Sports Ground</SelectItem>
                                <SelectItem value="Conference Room" className="text-xs">Conference Room</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Capacity</Label>
                              <Input
                                type="number"
                                value={newRoomCapacity}
                                onChange={(e) => setNewRoomCapacity(e.target.value)}
                                className="h-9 text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-slate-600">Buffer (Min)</Label>
                              <Input
                                type="number"
                                value={newRoomBuffer}
                                onChange={(e) => setNewRoomBuffer(e.target.value)}
                                className="h-9 text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {/* Switches */}
                          <div className="space-y-3.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-slate-800">Splittable Resource Room</span>
                                <p className="text-[10px] text-slate-500">Divides space into independent sections calendars</p>
                              </div>
                              <Switch checked={newRoomSplittable} onCheckedChange={setNewRoomSplittable} />
                            </div>

                            {newRoomSplittable && (
                              <div className="space-y-1 pt-1.5 animate-in fade-in duration-200">
                                <Label className="text-[10px] font-bold text-slate-600">Section Names (comma-separated)</Label>
                                <Input
                                  type="text"
                                  value={newRoomSectionsInput}
                                  onChange={(e) => setNewRoomSectionsInput(e.target.value)}
                                  className="h-8 text-[11px] bg-white border-slate-200"
                                />
                              </div>
                            )}

                            <Separator className="bg-slate-200 my-1" />

                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-xs font-bold text-slate-800">Internal Only Use</span>
                                <p className="text-[10px] text-slate-500">Only school departments can book this space (free)</p>
                              </div>
                              <Switch checked={newRoomInternalOnly} onCheckedChange={setNewRoomInternalOnly} />
                            </div>

                            {!newRoomInternalOnly && (
                              <div className="grid grid-cols-3 gap-2 pt-2.5 animate-in fade-in duration-200">
                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-slate-600">Hourly (Rs.)</Label>
                                  <Input type="number" value={newRoomHourly} onChange={(e) => setNewRoomHourly(e.target.value)} className="h-8 text-xs bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-slate-600">Daily (Rs.)</Label>
                                  <Input type="number" value={newRoomDaily} onChange={(e) => setNewRoomDaily(e.target.value)} className="h-8 text-xs bg-white" />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-slate-600">Deposit (Rs.)</Label>
                                  <Input type="number" value={newRoomDeposit} onChange={(e) => setNewRoomDeposit(e.target.value)} className="h-8 text-xs bg-white" />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Configurable approval flow steps builder */}
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <span className="text-xs font-bold text-slate-800">Configure Flow Step Chain</span>
                            <p className="text-[10px] text-slate-500">Determine roles required to approve reservations in sequence</p>
                            
                            <div className="flex gap-2">
                              <Select value={selectedFlowRoleToAdd} onValueChange={setSelectedFlowRoleToAdd}>
                                <SelectTrigger className="h-8 text-xs bg-white border-slate-200 flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="HOD" className="text-xs">HOD</SelectItem>
                                  <SelectItem value="Admin Office" className="text-xs">Admin Office</SelectItem>
                                  <SelectItem value="Principal" className="text-xs">Principal</SelectItem>
                                  <SelectItem value="Registrar" className="text-xs">Registrar</SelectItem>
                                  <SelectItem value="Vice Principal" className="text-xs">Vice Principal</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-semibold text-slate-600 bg-white"
                                onClick={addFlowStepSetup}
                              >
                                Add Step
                              </Button>
                            </div>

                            {/* Visual representation of steps */}
                            <div className="pt-2">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">Workflow Chain Preview</span>
                              {approvalFlowSetup.length === 0 ? (
                                <p className="text-[10px] text-slate-400 italic">No steps configured (Auto approved bookings)</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {approvalFlowSetup.map((step, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold">
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-blue-600 text-white font-bold h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px]">
                                          {idx + 1}
                                        </Badge>
                                        <span className="text-slate-800 font-bold">{step}</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFlowStepSetup(idx)}
                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                      >
                                        <X className="h-4.5 w-4.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                          >
                            Create Space Resource
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Override Notification details display if triggered */}
                  {dispatchedNotification && (
                    <Card className="border-emerald-200 bg-emerald-50/30 shadow-sm animate-in fade-in duration-300">
                      <CardHeader className="py-3 px-4 border-b border-emerald-100 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <CardTitle className="text-sm font-bold text-emerald-950">Dispatched Notification Log (Stubbed System)</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-emerald-800 hover:bg-emerald-100"
                          onClick={() => setDispatchedNotification(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 text-xs text-slate-700 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 border-b border-emerald-100/50">
                          <div>
                            <span className="font-semibold text-slate-500">Recipient Email:</span>
                            <span className="ml-1.5 font-bold text-slate-800">{dispatchedNotification.recipient_email}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-500">Subject Line:</span>
                            <span className="ml-1.5 font-bold text-slate-800">{dispatchedNotification.subject}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500">Message Body:</span>
                          <p className="mt-1 bg-white p-2.5 rounded border border-emerald-200 text-slate-800 font-medium italic">
                            "{dispatchedNotification.message}"
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4 pt-2">
                          {dispatchedNotification.refund_flag && (
                            <Badge className="bg-red-50 text-red-800 border border-red-200 px-2 py-1 font-bold">
                              Refund Due Alert: Rs. {dispatchedNotification.refund_amount.toLocaleString('en-IN')}
                            </Badge>
                          )}
                          {dispatchedNotification.event_ref && (
                            <Badge className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 font-bold">
                              Linked Event Affected: {dispatchedNotification.event_ref.event_title} ({dispatchedNotification.event_ref.event_id})
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Override-Cancel setup box */}
                  {selectedResvForOverride && (
                    <Card className="border-red-200 bg-red-50/20 shadow-sm animate-in zoom-in-95 duration-200">
                      <CardHeader className="py-3 px-4 border-b border-red-100 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <CardTitle className="text-sm font-bold text-slate-800">Admin Override: Cancel Reservation</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-600 hover:bg-red-100"
                          onClick={() => setSelectedResvForOverride(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                          <div className="font-bold text-slate-800">Target booking: {selectedResvForOverride.resource_name}</div>
                          <div className="text-slate-500">Booker: {selectedResvForOverride.requester_name} ({selectedResvForOverride.requester_email})</div>
                          <div className="text-slate-500">Schedule: {formatUIDate(selectedResvForOverride.start_ts)} at {formatUITime(selectedResvForOverride.start_ts)}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Reason Code</Label>
                            <Select value={overrideReasonCode} onValueChange={setOverrideReasonCode}>
                              <SelectTrigger className="h-9 text-xs bg-white border-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="MAINTENANCE" className="text-xs">Campus Facility Maintenance</SelectItem>
                                <SelectItem value="DOUBLE_BOOKING" className="text-xs">Schedule Clash Resolution</SelectItem>
                                <SelectItem value="VIP_VISIT" className="text-xs">VIP Institutional Event Override</SelectItem>
                                <SelectItem value="EXAM_WINDOW" className="text-xs">Semester Examination Override</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-600">Cancellation Message Explanation</Label>
                            <Input
                              type="text"
                              value={overrideReasonText}
                              onChange={(e) => setOverrideReasonText(e.target.value)}
                              className="h-9 text-xs bg-white border-slate-200"
                              placeholder="Explanation sent to booker"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => setSelectedResvForOverride(null)}
                          >
                            Discard
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                            onClick={handleOverrideCancel}
                          >
                            Submit Override & Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reservations Queue Table */}
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-800">Campus Reservations registry</CardTitle>
                        <CardDescription className="text-xs">Approve pending workflows or execute override cancellations</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-left text-xs text-slate-600 border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="p-3 font-semibold text-slate-700">Space & Booker</th>
                              <th className="p-3 font-semibold text-slate-700">Details</th>
                              <th className="p-3 font-semibold text-slate-700">Approval Steps Pipeline</th>
                              <th className="p-3 font-semibold text-slate-700">Fee status</th>
                              <th className="p-3 font-semibold text-slate-700">Audit / Event</th>
                              <th className="p-3 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {reservations.map((resv) => {
                              const activePendingStep = resv.approval_steps.find(
                                s => s.status === 'Pending' && s.approver_role === approverRole
                              );

                              let isStepActionable = false;
                              if (activePendingStep && resv.status === 'Pending') {
                                isStepActionable = resv.approval_steps
                                  .filter(s => s.level < activePendingStep.level)
                                  .every(s => s.status === 'Approved');
                              }

                              return (
                                <tr key={resv.id} className="hover:bg-blue-50/10 transition-colors">
                                  <td className="p-3">
                                    <div className="font-bold text-slate-800">{resv.resource_name}</div>
                                    {resv.section_name && (
                                      <div className="text-[10px] text-blue-600 font-semibold">{resv.section_name}</div>
                                    )}
                                    <div className="text-[10px] text-slate-500 font-medium mt-1">
                                      Req: {resv.requester_name}
                                    </div>
                                    <div className="text-[10px] text-slate-400">{resv.requester_email}</div>
                                  </td>
                                  <td className="p-3">
                                    <div className="font-semibold text-slate-700">
                                      {formatUIDate(resv.start_ts)}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {formatUITime(resv.start_ts)} to {formatUITime(resv.end_ts)}
                                    </div>
                                    <Badge variant="outline" className="text-[9px] mt-1.5 bg-slate-50 border-slate-200 font-semibold">
                                      Group ID: {resv.group_id}
                                    </Badge>
                                  </td>
                                  <td className="p-3">
                                    <div className="space-y-1.5">
                                      {resv.approval_steps.map((step) => (
                                        <div key={step.id} className="flex items-center gap-1.5 text-[10px]">
                                          <Badge className={`text-[9px] px-1 py-0 ${
                                            step.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                            step.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                            'bg-red-50 text-red-700 border border-red-200'
                                          }`}>
                                            {step.status}
                                          </Badge>
                                          <span className="font-bold text-slate-700">L{step.level} {step.approver_role}</span>
                                          {step.comments && (
                                            <span className="text-[9px] text-slate-400 font-medium italic">
                                              ({step.comments})
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    {resv.collection_demand ? (
                                      <div className="space-y-1">
                                        <div className="font-bold text-blue-600">
                                          Rs. {resv.collection_demand.amount.toLocaleString('en-IN')}
                                        </div>
                                        <div className="text-[9px] font-medium text-slate-500">
                                          Bill No: {resv.collection_demand.demand_no}
                                        </div>
                                        <Badge className={`text-[9px] px-1 py-0 ${
                                          resv.collection_demand.status === 'Collected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                          resv.collection_demand.status === 'Raised' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                          'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                          {resv.collection_demand.status}
                                        </Badge>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">Notional Payment</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-[10px]">
                                    {resv.override_log && (
                                      <div className="p-1.5 bg-red-50 border border-red-100 rounded text-red-800 space-y-0.5">
                                        <div className="font-bold text-[9px]">OVERRIDE CANCELLED</div>
                                        <div>Code: {resv.override_log.reason_code}</div>
                                        <div className="text-[9px] text-slate-500">{resv.override_log.reason_text}</div>
                                      </div>
                                    )}
                                    {resv.event_ref && (
                                      <div className="p-1.5 bg-blue-50 border border-blue-100 rounded text-blue-800 mt-1">
                                        <div className="font-bold text-[9px]">LINKED EVENT</div>
                                        <div>ID: {resv.event_ref.event_id}</div>
                                        <div>{resv.event_ref.event_title}</div>
                                      </div>
                                    )}
                                    {!resv.override_log && !resv.event_ref && (
                                      <span className="text-slate-400 italic">None</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex flex-col gap-1 items-end justify-center">
                                      {/* Approval controls */}
                                      {isStepActionable && (
                                        <div className="space-y-1 w-full max-w-[120px]">
                                          <input
                                            type="text"
                                            placeholder="Approval comment..."
                                            value={approvalComment}
                                            onChange={(e) => setApprovalComment(e.target.value)}
                                            className="w-full text-[9px] p-1 border rounded h-6"
                                          />
                                          <div className="flex gap-1">
                                            <Button
                                              size="sm"
                                              className="h-6 text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex-1"
                                              onClick={() => handleApproveStep(resv.id, activePendingStep!.level, 'Approved')}
                                            >
                                              Approve
                                            </Button>
                                            <Button
                                              size="sm"
                                              className="h-6 text-[9px] bg-red-600 hover:bg-red-700 text-white font-bold flex-1"
                                              onClick={() => handleApproveStep(resv.id, activePendingStep!.level, 'Rejected')}
                                            >
                                              Reject
                                            </Button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Override Cancel button for Approved/Pending */}
                                      {(resv.status === 'Approved' || resv.status === 'Pending') && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-6 text-[9px] border-red-200 text-red-700 hover:bg-red-50"
                                          onClick={() => {
                                            setSelectedResvForOverride(resv);
                                            setOverrideReasonText('Facility closed for urgent maintenance work.');
                                          }}
                                        >
                                          Admin Override
                                        </Button>
                                      )}

                                      {resv.status === 'Rejected' && (
                                        <Badge className="bg-red-100 text-red-800 font-bold border border-red-200">
                                          Rejected
                                        </Badge>
                                      )}
                                      {resv.status === 'Cancelled' && (
                                        <Badge className="bg-slate-100 text-slate-500 font-bold border border-slate-200">
                                          Cancelled
                                        </Badge>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tab 5: Space Utilization & Report Downloads */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* PDF/Excel Report Downloads Console */}
                  <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-blue-50/50 via-white to-slate-50/50">
                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-sm font-bold text-slate-800">Analytical Reports Export Center</CardTitle>
                      </div>
                      <CardDescription className="text-xs">Compile and download institution-level PDF analytics summaries and Excel logs</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-wrap gap-4">
                      <Button
                        onClick={exportPDFReport}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download PDF Summary Report
                      </Button>
                      <Button
                        onClick={exportExcelReport}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-500"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export Excel Booking Log
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Utilization Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {utilization.map(stat => (
                      <Card key={stat.id} className={`border-slate-200 shadow-sm relative overflow-hidden bg-white ${
                        stat.under_used ? 'ring-2 ring-red-100 bg-red-50/10' : ''
                      }`}>
                        {stat.under_used && (
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            <Badge className="bg-red-50 text-red-800 border border-red-200 text-[8px] font-bold">
                              UNDER-UTILIZED ( &lt;10% )
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="py-3 px-4 border-b border-slate-100">
                          <CardTitle className="text-sm font-bold text-slate-800">{stat.name}</CardTitle>
                          <CardDescription className="text-[10px]">{stat.type} (Cap: {stat.capacity})</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Usage Ratio</span>
                              <p className="text-lg font-bold text-slate-900">{stat.utilization_percentage}%</p>
                              <p className="text-[9px] text-slate-500 font-medium">
                                {stat.used_hours} hrs of {stat.available_hours} hrs
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Revenue Earned</span>
                              <p className="text-lg font-bold text-blue-600">Rs. {stat.revenue_earned.toLocaleString('en-IN')}</p>
                              <p className="text-[9px] text-slate-500 font-medium">Fee management invoices</p>
                            </div>
                          </div>

                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stat.under_used ? 'bg-red-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${stat.utilization_percentage}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Summary Card */}
                  <Card className="border-slate-200 shadow-sm bg-white">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-bold text-slate-800">Institutional Space Analytics Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                          <Coins className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue Collections</span>
                          <p className="text-lg font-bold text-slate-900">
                            Rs. {utilization.reduce((sum, s) => sum + s.revenue_earned, 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total active bookings</span>
                          <p className="text-lg font-bold text-slate-900">
                            {reservations.filter(r => r.status === 'Approved' || r.status === 'Pending').length} slots
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-lg border border-slate-200 flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Under-utilized spaces</span>
                          <p className="text-lg font-bold text-slate-900">
                            {utilization.filter(s => s.under_used).length} rooms
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourceReservation;
