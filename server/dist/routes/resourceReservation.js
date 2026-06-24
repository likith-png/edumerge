"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Helper to format Date to "DD Month YYYY" in UTC
function formatDisplayDate(dateMs) {
    const dateObj = new Date(dateMs);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${dateObj.getUTCDate()} ${months[dateObj.getUTCMonth()]} ${dateObj.getUTCFullYear()}`;
}
// Helper to expand a reservation into instances based on weekly recurrence
// Expands to 5 instances (current + 4 weeks) for checking conflicts
function expandReservation(resv) {
    const start = new Date(resv.start_ts).getTime();
    const end = new Date(resv.end_ts).getTime();
    const duration = end - start;
    const instances = [];
    if (resv.recurrence === 'weekly') {
        for (let i = 0; i < 5; i++) {
            const offset = i * 7 * 24 * 60 * 60 * 1000;
            const instStart = start + offset;
            const instEnd = end + offset;
            instances.push({
                start: instStart,
                end: instEnd,
                dateStr: formatDisplayDate(instStart)
            });
        }
    }
    else {
        instances.push({
            start,
            end,
            dateStr: formatDisplayDate(start)
        });
    }
    return instances;
}
function checkConflicts(candidates_1) {
    return __awaiter(this, arguments, void 0, function* (candidates, ignoreIds = []) {
        return new Promise((resolve, reject) => {
            // 1. Fetch all resources details to get buffer_minutes and name
            db_1.default.all("SELECT id, name, is_splittable, buffer_minutes FROM resources", [], (err, resources) => {
                if (err)
                    return reject(err);
                const resourceMap = new Map();
                resources.forEach(r => resourceMap.set(r.id, r));
                // 2. Fetch all existing active (Approved or Pending) reservations from DB
                const query = `
        SELECT r.*, res.name as resource_name, res.buffer_minutes, res.is_splittable
        FROM reservations r
        JOIN resources res ON r.resource_id = res.id
        WHERE r.status IN ('Approved', 'Pending')
      `;
                db_1.default.all(query, [], (err, dbReservations) => {
                    if (err)
                        return reject(err);
                    // Filter out ignored IDs (e.g. if we are editing or ignoring current set)
                    const activeReservations = dbReservations.filter(r => !ignoreIds.includes(r.id));
                    const clashDetails = [];
                    // 3. For each candidate, expand its instances
                    candidates.forEach((cand, candIdx) => {
                        const candRes = resourceMap.get(cand.resource_id);
                        if (!candRes)
                            return;
                        const candBufferMs = (candRes.buffer_minutes || 0) * 60 * 1000;
                        const candInstances = expandReservation(cand);
                        // Compare candidate with DB reservations
                        activeReservations.forEach(dbResv => {
                            const dbBufferMs = (dbResv.buffer_minutes || 0) * 60 * 1000;
                            // Check resource match and splittability logic
                            // Two bookings conflict on space if they share the same resource_id AND:
                            // - neither is splittable, OR
                            // - it is splittable but either section_id is null (booking whole space), OR
                            // - both section_ids are not null and they are equal (booking same section)
                            const resourceMatch = cand.resource_id === dbResv.resource_id;
                            if (!resourceMatch)
                                return;
                            const isSplittable = candRes.is_splittable === 1 || dbResv.is_splittable === 1;
                            let spaceConflict = false;
                            if (!isSplittable) {
                                spaceConflict = true;
                            }
                            else {
                                // splittable rules:
                                // booking whole (section_id is null) blocks all sections, and section booking blocks whole booking
                                if (cand.section_id === null || dbResv.section_id === null) {
                                    spaceConflict = true;
                                }
                                else if (cand.section_id === dbResv.section_id) {
                                    spaceConflict = true;
                                }
                            }
                            if (!spaceConflict)
                                return;
                            // Expand DB reservation instances
                            const dbInstances = expandReservation(dbResv);
                            // Check overlap between all instances
                            candInstances.forEach(candInst => {
                                dbInstances.forEach(dbInst => {
                                    // Rule (a) overlap check:
                                    // A.start < B.end + buffer AND B.start < A.end + buffer
                                    // Buffer applied is the max of the two, or candidate buffer, let's use the resource's buffer:
                                    // Since they are on the same resource, they share the same resource buffer!
                                    const bufferMs = candBufferMs; // resource specific buffer
                                    const overlap = (candInst.start < dbInst.end + bufferMs) && (dbInst.start < candInst.end + bufferMs);
                                    if (overlap) {
                                        clashDetails.push({
                                            date: candInst.dateStr,
                                            resourceName: candRes.name,
                                            message: `Clashes with booking for "${dbResv.requester_name}" on ${dbInst.dateStr} from ${new Date(dbInst.start).getUTCHours().toString().padStart(2, '0')}:${new Date(dbInst.start).getUTCMinutes().toString().padStart(2, '0')} to ${new Date(dbInst.end).getUTCHours().toString().padStart(2, '0')}:${new Date(dbInst.end).getUTCMinutes().toString().padStart(2, '0')} (includes ${candRes.buffer_minutes}m buffer).`
                                        });
                                    }
                                });
                            });
                        });
                        // 4. Compare candidate with *other candidates* in the same request (atomicity check)
                        candidates.forEach((otherCand, otherIdx) => {
                            if (candIdx >= otherIdx)
                                return; // avoid double checks and self-check
                            const otherRes = resourceMap.get(otherCand.resource_id);
                            if (!otherRes)
                                return;
                            const resourceMatch = cand.resource_id === otherCand.resource_id;
                            if (!resourceMatch)
                                return;
                            const isSplittable = candRes.is_splittable === 1 || otherRes.is_splittable === 1;
                            let spaceConflict = false;
                            if (!isSplittable) {
                                spaceConflict = true;
                            }
                            else {
                                if (cand.section_id === null || otherCand.section_id === null) {
                                    spaceConflict = true;
                                }
                                else if (cand.section_id === otherCand.section_id) {
                                    spaceConflict = true;
                                }
                            }
                            if (!spaceConflict)
                                return;
                            const otherInstances = expandReservation(otherCand);
                            const bufferMs = candBufferMs;
                            candInstances.forEach(candInst => {
                                otherInstances.forEach(otherInst => {
                                    const overlap = (candInst.start < otherInst.end + bufferMs) && (otherInst.start < candInst.end + bufferMs);
                                    if (overlap) {
                                        clashDetails.push({
                                            date: candInst.dateStr,
                                            resourceName: candRes.name,
                                            message: `Internal overlap: multiple bookings requested in the same cart conflict with each other on ${candInst.dateStr}.`
                                        });
                                    }
                                });
                            });
                        });
                    });
                    resolve({
                        conflict: clashDetails.length > 0,
                        clashDetails
                    });
                });
            });
        });
    });
}
// 1. Get Resources with Sections and RateCards
router.get('/resources', (req, res) => {
    const resourceQuery = `
    SELECT r.*, rc.hourly_rate, rc.daily_rate, rc.security_deposit
    FROM resources r
    LEFT JOIN rate_cards rc ON r.id = rc.resource_id
  `;
    const sectionQuery = `SELECT * FROM resource_sections`;
    db_1.default.all(resourceQuery, [], (err, resources) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.all(sectionQuery, [], (err, sections) => {
            if (err)
                return res.status(500).json({ error: err.message });
            // Group sections
            const result = resources.map(r => {
                let parsedFlow = [];
                try {
                    parsedFlow = r.approval_flow ? JSON.parse(r.approval_flow) : ["HOD", "Admin Office", "Principal"];
                }
                catch (_a) {
                    parsedFlow = ["HOD", "Admin Office", "Principal"];
                }
                return Object.assign(Object.assign({}, r), { is_splittable: r.is_splittable === 1, internal_only: r.internal_only === 1, approval_flow: parsedFlow, rate_card: r.hourly_rate !== null ? {
                        hourly_rate: r.hourly_rate,
                        daily_rate: r.daily_rate,
                        security_deposit: r.security_deposit
                    } : null, sections: sections.filter(s => s.resource_id === r.id) });
            });
            res.json(result);
        });
    });
});
// 1b. Create New Resource (Room)
router.post('/resources', (req, res) => {
    const { name, type, capacity, is_splittable, internal_only, buffer_minutes, approval_flow, sections, hourly_rate, daily_rate, security_deposit } = req.body;
    if (!name || !type || !capacity) {
        return res.status(400).json({ error: "Missing required details: name, type, capacity are required." });
    }
    const flowStr = approval_flow && Array.isArray(approval_flow)
        ? JSON.stringify(approval_flow)
        : JSON.stringify(["HOD", "Admin Office", "Principal"]);
    const sql = `
    INSERT INTO resources (name, type, capacity, is_splittable, internal_only, buffer_minutes, approval_flow)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
    db_1.default.run(sql, [
        name,
        type,
        capacity,
        is_splittable ? 1 : 0,
        internal_only ? 1 : 0,
        buffer_minutes || 0,
        flowStr
    ], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        const resourceId = this.lastID;
        // Insert sections if splittable
        if (is_splittable && sections && Array.isArray(sections) && sections.length > 0) {
            const secStmt = db_1.default.prepare("INSERT INTO resource_sections (resource_id, name) VALUES (?, ?)");
            sections.forEach(secName => {
                if (secName && secName.trim()) {
                    secStmt.run(resourceId, secName.trim());
                }
            });
            secStmt.finalize();
        }
        // Insert rate card if not internal only
        if (!internal_only) {
            db_1.default.run(`
        INSERT INTO rate_cards (resource_id, hourly_rate, daily_rate, security_deposit)
        VALUES (?, ?, ?, ?)
      `, [
                resourceId,
                hourly_rate || 0,
                daily_rate || 0,
                security_deposit || 0
            ], (err) => {
                if (err)
                    console.error("Error creating rate card: ", err);
            });
        }
        res.status(201).json({
            message: "Resource room created successfully",
            resource_id: resourceId
        });
    });
});
// 2. Get Reservations with related entities
router.get('/reservations', (req, res) => {
    const resvQuery = `
    SELECT r.*, res.name as resource_name, s.name as section_name
    FROM reservations r
    JOIN resources res ON r.resource_id = res.id
    LEFT JOIN resource_sections s ON r.section_id = s.id
  `;
    db_1.default.all(resvQuery, [], (err, reservations) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.all("SELECT * FROM approval_steps ORDER BY level ASC", [], (err, steps) => {
            if (err)
                return res.status(500).json({ error: err.message });
            db_1.default.all("SELECT * FROM collection_demands", [], (err, demands) => {
                if (err)
                    return res.status(500).json({ error: err.message });
                db_1.default.all("SELECT * FROM override_logs", [], (err, logs) => {
                    if (err)
                        return res.status(500).json({ error: err.message });
                    db_1.default.all("SELECT * FROM event_refs", [], (err, events) => {
                        if (err)
                            return res.status(500).json({ error: err.message });
                        const result = reservations.map(r => {
                            return Object.assign(Object.assign({}, r), { approval_steps: steps.filter(s => s.reservation_id === r.id), collection_demand: demands.find(d => d.reservation_id === r.id) || null, override_log: logs.find(l => l.reservation_id === r.id) || null, event_ref: events.find(e => e.reservation_id === r.id) || null });
                        });
                        res.json(result);
                    });
                });
            });
        });
    });
});
// 3. Dry-run conflict check API
router.post('/check-conflicts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookings, ignoreIds = [] } = req.body;
    if (!bookings || !Array.isArray(bookings)) {
        return res.status(400).json({ error: "Missing bookings array" });
    }
    try {
        const result = yield checkConflicts(bookings, ignoreIds);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// 4. Book Resources (Supports atomic multi-resource requests)
router.post('/book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requester_type, requester_name, requester_email, payment_mode, bookings } = req.body;
    if (!requester_type || !requester_name || !requester_email || !bookings || !Array.isArray(bookings) || bookings.length === 0) {
        return res.status(400).json({ error: "Missing required details or bookings list" });
    }
    try {
        // A. Validate Conflicts across all bookings in the list
        const check = yield checkConflicts(bookings);
        if (check.conflict) {
            return res.status(400).json({
                error: "Conflict detected during atomic check. Booking rejected.",
                conflicts: check.clashDetails
            });
        }
        // B. Calculate unique group_id for atomicity grouping
        const group_id = 'grp-' + Math.random().toString(36).substring(2, 10);
        // C. Write atomically
        // Begin transaction
        db_1.default.serialize(() => {
            db_1.default.run("BEGIN TRANSACTION");
            let insertErrors = false;
            let completedInserts = 0;
            // Fetch rate cards to compute demands for external bookings
            db_1.default.all("SELECT * FROM rate_cards", [], (err, rateCards) => {
                if (err || insertErrors) {
                    db_1.default.run("ROLLBACK");
                    return res.status(500).json({ error: "Failed to load rate card data" });
                }
                // Fetch resources to get custom approval flow templates
                db_1.default.all("SELECT id, approval_flow FROM resources", [], (err, resourcesList) => {
                    if (err || insertErrors) {
                        db_1.default.run("ROLLBACK");
                        return res.status(500).json({ error: "Failed to load resource flow data" });
                    }
                    bookings.forEach(booking => {
                        const { resource_id, section_id, start_ts, end_ts, recurrence, event_title } = booking;
                        const status = 'Pending'; // initial status is always Pending
                        const insertResvSql = `
              INSERT INTO reservations (resource_id, section_id, requester_type, requester_name, requester_email, start_ts, end_ts, recurrence, status, payment_mode, group_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
                        db_1.default.run(insertResvSql, [
                            resource_id,
                            section_id,
                            requester_type,
                            requester_name,
                            requester_email,
                            start_ts,
                            end_ts,
                            recurrence,
                            status,
                            payment_mode || (requester_type === 'internal' ? 'Notional' : 'Offline'),
                            group_id
                        ], function (err) {
                            if (err) {
                                insertErrors = true;
                                return;
                            }
                            const reservationId = this.lastID;
                            // Parse custom approval flow
                            const resDbRecord = resourcesList.find(r => r.id === resource_id);
                            let flow = [];
                            try {
                                flow = resDbRecord && resDbRecord.approval_flow ? JSON.parse(resDbRecord.approval_flow) : [];
                            }
                            catch (_a) {
                                flow = [];
                            }
                            // Fallbacks if no flow configured
                            if (!Array.isArray(flow) || flow.length === 0) {
                                flow = requester_type === 'internal'
                                    ? ["HOD", "Admin Office", "Principal"]
                                    : ["Admin Office"];
                            }
                            const stepStmt = db_1.default.prepare(`
                INSERT INTO approval_steps (reservation_id, level, approver_role, status)
                VALUES (?, ?, ?, 'Pending')
              `);
                            flow.forEach((role, idx) => {
                                stepStmt.run(reservationId, idx + 1, role, 'Pending');
                            });
                            stepStmt.finalize();
                            // Check if external and generate Fee demand
                            if (requester_type === 'external') {
                                const rc = rateCards.find(card => card.resource_id === resource_id);
                                if (rc) {
                                    // Compute cost:
                                    const durationMs = new Date(end_ts).getTime() - new Date(start_ts).getTime();
                                    const hours = Math.ceil(durationMs / (1000 * 60 * 60));
                                    let amount = 0;
                                    if (hours >= 24) {
                                        const days = Math.ceil(hours / 24);
                                        amount = days * rc.daily_rate;
                                    }
                                    else {
                                        amount = Math.min(hours * rc.hourly_rate, rc.daily_rate);
                                    }
                                    amount += rc.security_deposit;
                                    // Insert Collection Demand
                                    const demandNo = `DEMAND-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
                                    db_1.default.run(`
                    INSERT INTO collection_demands (reservation_id, demand_no, amount, status)
                    VALUES (?, ?, ?, 'Raised')
                  `, [reservationId, demandNo, amount]);
                                }
                            }
                            // Create Event Link if provided
                            if (event_title) {
                                const eventId = `EVT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                                db_1.default.run(`
                  INSERT INTO event_refs (reservation_id, event_id, event_title)
                  VALUES (?, ?, ?)
                `, [reservationId, eventId, event_title]);
                            }
                            completedInserts++;
                            if (completedInserts === bookings.length) {
                                if (insertErrors) {
                                    db_1.default.run("ROLLBACK");
                                    res.status(500).json({ error: "Failed to write all reservations. Transaction rolled back." });
                                }
                                else {
                                    db_1.default.run("COMMIT");
                                    res.json({
                                        message: "Reservations submitted successfully.",
                                        group_id,
                                        count: bookings.length
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// 5. Approve Approval Step (advances the chain)
router.post('/approve', (req, res) => {
    const { reservation_id, level, status, comments } = req.body;
    if (!reservation_id || !level || !status) {
        return res.status(400).json({ error: "Missing reservation_id, level or status" });
    }
    // Update step
    const updateStepSql = `
    UPDATE approval_steps 
    SET status = ?, comments = ? 
    WHERE reservation_id = ? AND level = ?
  `;
    db_1.default.run(updateStepSql, [status, comments || null, reservation_id, level], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        // Handle rejection
        if (status === 'Rejected') {
            db_1.default.run("UPDATE reservations SET status = 'Rejected' WHERE id = ?", [reservation_id], (err) => {
                if (err)
                    return res.status(500).json({ error: err.message });
                res.json({ message: "Reservation rejected and updated successfully." });
            });
            return;
        }
        // Handle approval
        // Check if there are higher levels pending
        const checkStepsSql = `
      SELECT * FROM approval_steps 
      WHERE reservation_id = ? AND level > ? AND status = 'Pending'
      ORDER BY level ASC
    `;
        db_1.default.all(checkStepsSql, [reservation_id, level], (err, pendingSteps) => {
            if (err)
                return res.status(500).json({ error: err.message });
            if (pendingSteps && pendingSteps.length > 0) {
                // More steps remain, keep reservation state as Pending
                res.json({ message: `Step approved. Awaiting level ${pendingSteps[0].level} (${pendingSteps[0].approver_role}) review.` });
            }
            else {
                // Final level approved! Set reservation to Approved
                db_1.default.run("UPDATE reservations SET status = 'Approved' WHERE id = ?", [reservation_id], (err) => {
                    if (err)
                        return res.status(500).json({ error: err.message });
                    // Also set collection demand status if external
                    res.json({ message: "Reservation fully approved." });
                });
            }
        });
    });
});
// 6. Admin Override and Cancel
router.post('/override-cancel', (req, res) => {
    const { reservation_id, reason_code, reason_text, cancelled_by } = req.body;
    if (!reservation_id || !reason_code || !reason_text || !cancelled_by) {
        return res.status(400).json({ error: "Missing cancellation details" });
    }
    // 1. Fetch reservation & resource details
    const getDetailsSql = `
    SELECT r.*, res.name as resource_name
    FROM reservations r
    JOIN resources res ON r.resource_id = res.id
    WHERE r.id = ?
  `;
    db_1.default.get(getDetailsSql, [reservation_id], (err, resv) => {
        if (err)
            return res.status(500).json({ error: err.message });
        if (!resv)
            return res.status(404).json({ error: "Reservation not found" });
        // 2. Update reservation status to Cancelled
        db_1.default.run("UPDATE reservations SET status = 'Cancelled' WHERE id = ?", [reservation_id], (err) => {
            if (err)
                return res.status(500).json({ error: err.message });
            // 3. Write Override Log
            db_1.default.run(`
        INSERT INTO override_logs (reservation_id, reason_code, reason_text, cancelled_by)
        VALUES (?, ?, ?, ?)
      `, [reservation_id, reason_code, reason_text, cancelled_by], (err) => {
                if (err)
                    return res.status(500).json({ error: err.message });
                // 4. Fetch Collection Demand to check for refunds
                db_1.default.get("SELECT * FROM collection_demands WHERE reservation_id = ?", [reservation_id], (err, demand) => {
                    if (err)
                        return res.status(500).json({ error: err.message });
                    // Cancel the demand if present
                    if (demand) {
                        db_1.default.run("UPDATE collection_demands SET status = 'Cancelled' WHERE id = ?", [demand.id]);
                    }
                    // 5. Fetch linked EventRef
                    db_1.default.get("SELECT * FROM event_refs WHERE reservation_id = ?", [reservation_id], (err, event) => {
                        if (err)
                            return res.status(500).json({ error: err.message });
                        const hasPaid = resv.requester_type === 'external' || (demand && demand.amount > 0);
                        const refundFlag = hasPaid;
                        const refundAmount = demand ? demand.amount : 0;
                        const notifyPayload = {
                            recipient_email: resv.requester_email,
                            recipient_name: resv.requester_name,
                            subject: `Notification: Reservation Cancelled for ${resv.resource_name}`,
                            message: `Dear ${resv.requester_name}, your booking of ${resv.resource_name} from ${formatDisplayDate(new Date(resv.start_ts).getTime())} has been cancelled by the administration. Reason: ${reason_text}.`,
                            refund_flag: refundFlag,
                            refund_amount: refundAmount,
                            event_ref: event ? {
                                event_id: event.event_id,
                                event_title: event.event_title
                            } : null
                        };
                        res.json({
                            message: "Reservation successfully overridden and cancelled.",
                            notification: notifyPayload
                        });
                    });
                });
            });
        });
    });
});
// 7. Get Utilization and Revenue Analytics
router.get('/utilization', (req, res) => {
    // We compute stats per resource
    const query = `
    SELECT 
      res.id,
      res.name,
      res.type,
      res.capacity,
      res.is_splittable,
      res.buffer_minutes,
      rc.hourly_rate,
      rc.daily_rate,
      rc.security_deposit
    FROM resources res
    LEFT JOIN rate_cards rc ON res.id = rc.resource_id
  `;
    db_1.default.all(query, [], (err, resources) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.all("SELECT * FROM reservations WHERE status = 'Approved'", [], (err, approvals) => {
            if (err)
                return res.status(500).json({ error: err.message });
            db_1.default.all("SELECT * FROM collection_demands WHERE status != 'Cancelled'", [], (err, demands) => {
                if (err)
                    return res.status(500).json({ error: err.message });
                const stats = resources.map(res => {
                    // A. Calculate used hours
                    // Filter approved bookings for this resource
                    const resBookings = approvals.filter(b => b.resource_id === res.id);
                    let totalHrs = 0;
                    resBookings.forEach(b => {
                        const start = new Date(b.start_ts).getTime();
                        const end = new Date(b.end_ts).getTime();
                        const durationHrs = (end - start) / (1000 * 60 * 60);
                        // If it is weekly, expand it to 5 instances
                        if (b.recurrence === 'weekly') {
                            totalHrs += durationHrs * 5;
                        }
                        else {
                            totalHrs += durationHrs;
                        }
                    });
                    // B. Institutional Capacity: Assume 30-day block with 8 hours/day = 240 operating hours limit
                    const availableHours = 240;
                    const utilizationPercentage = Math.min(Math.round((totalHrs / availableHours) * 100), 100);
                    // C. Calculate revenue earned
                    // Sum amounts of active demands linked to this resource
                    // Find reservations of this resource, then sum demand amounts
                    const associatedResIds = approvals.filter(b => b.resource_id === res.id).map(b => b.id);
                    const resourceDemands = demands.filter(d => associatedResIds.includes(d.reservation_id));
                    const revenueEarned = resourceDemands.reduce((sum, d) => sum + d.amount, 0);
                    // D. Flag under-used space: true if utilization < 10%
                    const underUsed = utilizationPercentage < 10;
                    return {
                        id: res.id,
                        name: res.name,
                        type: res.type,
                        capacity: res.capacity,
                        used_hours: Math.round(totalHrs * 10) / 10,
                        available_hours: availableHours,
                        utilization_percentage: utilizationPercentage,
                        revenue_earned: revenueEarned,
                        under_used: underUsed
                    };
                });
                res.json(stats);
            });
        });
    });
});
exports.default = router;
