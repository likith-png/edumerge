"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// ─── DASHBOARD ────────────────────────────────────────────────────────────────
router.get('/dashboard', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const d7 = new Date();
    d7.setDate(d7.getDate() + 7);
    const d30 = new Date();
    d30.setDate(d30.getDate() + 30);
    db_1.default.get(`SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) as in_maintenance,
        SUM(CASE WHEN status = 'GROUNDED' THEN 1 ELSE 0 END) as grounded
    FROM vehicles`, [], (err, fleet) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.get(`SELECT COUNT(*) as expired FROM vehicle_documents WHERE expiry_date < ?`, [today], (err2, expired) => {
            db_1.default.get(`SELECT COUNT(*) as critical FROM vehicle_documents WHERE expiry_date >= ? AND expiry_date < ?`, [today, d7.toISOString().split('T')[0]], (err3, critical) => {
                db_1.default.get(`SELECT COUNT(*) as warning FROM vehicle_documents WHERE expiry_date >= ? AND expiry_date < ?`, [d7.toISOString().split('T')[0], d30.toISOString().split('T')[0]], (err4, warning) => {
                    db_1.default.get(`SELECT COALESCE(SUM(total_cost),0) as total_fuel_cost FROM vehicle_fuel WHERE fuel_date >= date('now', '-30 days')`, [], (err5, fuel) => {
                        db_1.default.get(`SELECT COUNT(*) as breakdowns FROM vehicle_maintenance WHERE maintenance_type = 'CORRECTIVE' AND service_date >= date('now', '-30 days')`, [], (err6, breakdowns) => {
                            db_1.default.get(`SELECT COUNT(*) as overdue FROM vehicle_fees WHERE status = 'OVERDUE'`, [], (err7, fees) => {
                                db_1.default.get(`SELECT COUNT(*) as trips FROM vehicle_trips WHERE trip_status = 'COMPLETED' AND start_time >= date('now', '-30 days')`, [], (err8, trips) => {
                                    res.json({
                                        fleet: fleet || {},
                                        compliance: {
                                            expired: (expired === null || expired === void 0 ? void 0 : expired.expired) || 0,
                                            critical: (critical === null || critical === void 0 ? void 0 : critical.critical) || 0,
                                            warning: (warning === null || warning === void 0 ? void 0 : warning.warning) || 0
                                        },
                                        fuel: { monthly_cost: (fuel === null || fuel === void 0 ? void 0 : fuel.total_fuel_cost) || 0 },
                                        breakdowns: (breakdowns === null || breakdowns === void 0 ? void 0 : breakdowns.breakdowns) || 0,
                                        overdue_fees: (fees === null || fees === void 0 ? void 0 : fees.overdue) || 0,
                                        monthly_trips: (trips === null || trips === void 0 ? void 0 : trips.trips) || 0
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
// ─── FLEET / VEHICLE REGISTRY ─────────────────────────────────────────────────
router.get('/fleet', (req, res) => {
    db_1.default.all(`SELECT * FROM vehicles ORDER BY created_at DESC`, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/fleet', (req, res) => {
    const { reg_number, vehicle_type, make_model, year, fuel_type, seating_capacity, ownership_type, chassis_number, engine_number, purchase_date, campus, operator_name, tank_capacity, mileage_standard } = req.body;
    if (!reg_number || !vehicle_type || !make_model || !fuel_type) {
        return res.status(400).json({ error: 'reg_number, vehicle_type, make_model and fuel_type are required' });
    }
    db_1.default.run(`INSERT INTO vehicles
        (reg_number, vehicle_type, make_model, year, fuel_type, seating_capacity, ownership_type, status,
         chassis_number, engine_number, purchase_date, campus, operator_name, tank_capacity, mileage_standard)
        VALUES (?,?,?,?,?,?,?,'ACTIVE',?,?,?,?,?,?,?)`, [reg_number, vehicle_type, make_model, year || null, fuel_type,
        seating_capacity || 0, ownership_type || 'OWNED',
        chassis_number || null, engine_number || null,
        purchase_date || null, campus || 'Main Campus',
        operator_name || null, tank_capacity || 0, mileage_standard || 0], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Vehicle registered successfully', id: this.lastID });
    });
});
router.patch('/fleet/:id/status', (req, res) => {
    const { status } = req.body;
    const allowed = ['ACTIVE', 'MAINTENANCE', 'GROUNDED', 'DECOMMISSIONED'];
    if (!allowed.includes(status))
        return res.status(400).json({ error: 'Invalid status' });
    db_1.default.run(`UPDATE vehicles SET status = ? WHERE id = ?`, [status, req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Status updated' });
    });
});
// ─── COMPLIANCE DOCUMENTS ─────────────────────────────────────────────────────
router.get('/compliance', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const sql = `
        SELECT
            v.id as vehicle_id, v.reg_number, v.vehicle_type, v.make_model, v.status as vehicle_status,
            d.id as doc_id, d.doc_type, d.expiry_date, d.issue_date, d.issuing_authority,
            CASE
                WHEN d.expiry_date < date('now') THEN 'EXPIRED'
                WHEN d.expiry_date < date('now', '+7 days') THEN 'CRITICAL'
                WHEN d.expiry_date < date('now', '+30 days') THEN 'WARNING'
                ELSE 'COMPLIANT'
            END as rag_status,
            CAST(julianday(d.expiry_date) - julianday('now') AS INTEGER) as days_to_expiry
        FROM vehicles v
        LEFT JOIN vehicle_documents d ON v.id = d.vehicle_id
        ORDER BY v.id, d.doc_type
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/documents', (req, res) => {
    const { vehicle_id, doc_type, issue_date, expiry_date, issuing_authority } = req.body;
    if (!vehicle_id || !doc_type || !expiry_date) {
        return res.status(400).json({ error: 'vehicle_id, doc_type and expiry_date are required' });
    }
    db_1.default.run(`INSERT INTO vehicle_documents (vehicle_id, doc_type, issue_date, expiry_date, issuing_authority)
            VALUES (?,?,?,?,?)`, [vehicle_id, doc_type, issue_date || null, expiry_date, issuing_authority || null], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Document added', id: this.lastID });
    });
});
router.patch('/documents/:id', (req, res) => {
    const { issue_date, expiry_date, issuing_authority } = req.body;
    db_1.default.run(`UPDATE vehicle_documents SET issue_date=?, expiry_date=?, issuing_authority=? WHERE id=?`, [issue_date, expiry_date, issuing_authority, req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Document updated' });
    });
});
// ─── MAINTENANCE ──────────────────────────────────────────────────────────────
router.get('/maintenance', (req, res) => {
    const sql = `
        SELECT m.*, v.reg_number, v.vehicle_type, v.make_model
        FROM vehicle_maintenance m
        JOIN vehicles v ON m.vehicle_id = v.id
        ORDER BY m.service_date DESC
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/maintenance', (req, res) => {
    const { vehicle_id, maintenance_type, service_date, description, vendor, cost, odometer_reading, next_service_due, next_service_km } = req.body;
    if (!vehicle_id || !maintenance_type || !service_date) {
        return res.status(400).json({ error: 'vehicle_id, maintenance_type and service_date required' });
    }
    const workOrderNo = `WO-${Date.now()}`;
    db_1.default.run(`INSERT INTO vehicle_maintenance
        (vehicle_id, maintenance_type, service_date, description, vendor, cost,
         odometer_reading, next_service_due, next_service_km, status, work_order_no)
        VALUES (?,?,?,?,?,?,?,?,?,'COMPLETED',?)`, [vehicle_id, maintenance_type, service_date, description || null,
        vendor || null, cost || 0, odometer_reading || null,
        next_service_due || null, next_service_km || null, workOrderNo], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        const workOrderId = this.lastID;
        // Automatically change fleet vehicle status to MAINTENANCE
        db_1.default.run(`UPDATE vehicles SET status='MAINTENANCE' WHERE id=?`, [vehicle_id], (updateErr) => {
            if (updateErr)
                console.error("Could not update vehicle status:", updateErr);
            res.status(201).json({ message: 'Maintenance logged', id: workOrderId, work_order_no: workOrderNo });
        });
    });
});
// ─── FUEL MANAGEMENT ─────────────────────────────────────────────────────────
router.get('/fuel', (req, res) => {
    const sql = `
        SELECT f.*, v.reg_number, v.vehicle_type, v.make_model, v.tank_capacity, v.mileage_standard
        FROM vehicle_fuel f
        JOIN vehicles v ON f.vehicle_id = v.id
        ORDER BY f.fuel_date DESC
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/fuel', (req, res) => {
    const { vehicle_id, fuel_date, litres, price_per_litre, odometer_at_fuelling, vendor, payment_mode, logged_by } = req.body;
    if (!vehicle_id || !fuel_date || !litres || !price_per_litre) {
        return res.status(400).json({ error: 'vehicle_id, fuel_date, litres and price_per_litre required' });
    }
    const total_cost = parseFloat((litres * price_per_litre).toFixed(2));
    // Check anomalies
    db_1.default.get(`SELECT tank_capacity, mileage_standard FROM vehicles WHERE id=?`, [vehicle_id], (err, veh) => {
        if (err)
            return res.status(500).json({ error: err.message });
        let anomaly_flag = 'NONE';
        let anomaly_details = null;
        if (veh && veh.tank_capacity > 0 && litres > veh.tank_capacity * 1.05) {
            anomaly_flag = 'OVER_FUELLING';
            anomaly_details = `Litres (${litres}) exceeds tank capacity (${veh.tank_capacity})`;
        }
        const APPROVED_VENDORS = ['BPCL', 'HP', 'IOC', 'Indian Oil', 'Hindustan Petroleum'];
        const isApproved = APPROVED_VENDORS.some(av => (vendor || '').toUpperCase().includes(av.toUpperCase()) || (vendor || '').toLowerCase().includes('bpcl') || (vendor || '').toLowerCase().includes('hp pump'));
        if (anomaly_flag === 'NONE' && !isApproved && vendor) {
            anomaly_flag = 'UNAPPROVED_VENDOR';
            anomaly_details = `Vendor "${vendor}" is not in approved list`;
        }
        db_1.default.run(`INSERT INTO vehicle_fuel
            (vehicle_id, fuel_date, litres, price_per_litre, total_cost, odometer_at_fuelling,
             vendor, payment_mode, logged_by, anomaly_flag, anomaly_details)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [vehicle_id, fuel_date, litres, price_per_litre, total_cost,
            odometer_at_fuelling || null, vendor || null,
            payment_mode || 'CASH', logged_by || null, anomaly_flag, anomaly_details], function (err2) {
            if (err2)
                return res.status(500).json({ error: err2.message });
            res.status(201).json({ message: 'Fuel log added', id: this.lastID, anomaly_flag, total_cost });
        });
    });
});
// ─── DRIVERS ─────────────────────────────────────────────────────────────────
router.get('/drivers', (req, res) => {
    const sql = `
        SELECT dp.*, v.reg_number, v.make_model
        FROM driver_profiles dp
        LEFT JOIN vehicles v ON dp.assigned_vehicle_id = v.id
        ORDER BY dp.created_at DESC
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/drivers', (req, res) => {
    const { driver_name, dl_number, dl_category, dl_expiry, blood_group, badge_number, assigned_vehicle_id } = req.body;
    if (!driver_name)
        return res.status(400).json({ error: 'driver_name required' });
    db_1.default.run(`INSERT INTO driver_profiles
        (employee_id, driver_name, dl_number, dl_category, dl_expiry, blood_group, badge_number, assigned_vehicle_id)
        VALUES (0,?,?,?,?,?,?,?)`, [driver_name, dl_number || null, dl_category || null, dl_expiry || null,
        blood_group || null, badge_number || null, assigned_vehicle_id || null], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Driver added', id: this.lastID });
    });
});
router.patch('/drivers/:id/assign', (req, res) => {
    const { vehicle_id } = req.body;
    db_1.default.run(`UPDATE driver_profiles SET assigned_vehicle_id=? WHERE id=?`, [vehicle_id, req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Driver assigned to vehicle' });
    });
});
// ─── ROUTES ───────────────────────────────────────────────────────────────────
router.get('/routes', (req, res) => {
    const sql = `
        SELECT r.*, v.reg_number, v.make_model, dp.driver_name
        FROM vehicle_routes r
        LEFT JOIN vehicles v ON r.vehicle_id = v.id
        LEFT JOIN driver_profiles dp ON r.driver_id = dp.id
        ORDER BY r.route_name
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        const parsed = rows.map((r) => (Object.assign(Object.assign({}, r), { stops: r.stops ? JSON.parse(r.stops) : [] })));
        res.json({ data: parsed });
    });
});
router.post('/routes', (req, res) => {
    const { route_name, route_code, vehicle_id, driver_id, stops, total_distance_km, students_count } = req.body;
    if (!route_name)
        return res.status(400).json({ error: 'route_name required' });
    db_1.default.run(`INSERT INTO vehicle_routes
        (route_name, route_code, vehicle_id, driver_id, stops, total_distance_km, students_count)
        VALUES (?,?,?,?,?,?,?)`, [route_name, route_code || null, vehicle_id || null, driver_id || null,
        JSON.stringify(stops || []), total_distance_km || 0, students_count || 0], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Route added', id: this.lastID });
    });
});
// ─── TRANSPORT FEES ───────────────────────────────────────────────────────────
router.get('/fees', (req, res) => {
    const sql = `
        SELECT f.*, r.route_name, r.route_code
        FROM vehicle_fees f
        LEFT JOIN vehicle_routes r ON f.route_id = r.id
        ORDER BY f.status DESC, f.due_date ASC
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/fees', (req, res) => {
    const { student_name, student_id, route_id, monthly_fee, fee_term, due_date } = req.body;
    if (!student_name || !monthly_fee)
        return res.status(400).json({ error: 'student_name and monthly_fee required' });
    db_1.default.run(`INSERT INTO vehicle_fees (student_name, student_id, route_id, monthly_fee, fee_term, status, due_date)
            VALUES (?,?,?,?,?,'PENDING',?)`, [student_name, student_id || null, route_id || null, monthly_fee,
        fee_term || 'Monthly', due_date || null], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Fee record added', id: this.lastID });
    });
});
router.patch('/fees/:id/pay', (req, res) => {
    const { amount_paid } = req.body;
    const today = new Date().toISOString().split('T')[0];
    db_1.default.run(`UPDATE vehicle_fees SET status='PAID', paid_date=?, amount_paid=? WHERE id=?`, [today, amount_paid, req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Payment recorded' });
    });
});
// ─── TRIPS ────────────────────────────────────────────────────────────────────
router.get('/trips', (req, res) => {
    const sql = `
        SELECT t.*, v.reg_number, v.make_model, dp.driver_name
        FROM vehicle_trips t
        LEFT JOIN vehicles v ON t.vehicle_id = v.id
        LEFT JOIN driver_profiles dp ON t.driver_id = dp.id
        ORDER BY t.start_time DESC
        LIMIT 50
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/trips', (req, res) => {
    const { vehicle_id, driver_id, route_name, trip_type, start_time, end_time, start_odometer, end_odometer, students_count } = req.body;
    if (!vehicle_id || !start_time)
        return res.status(400).json({ error: 'vehicle_id and start_time required' });
    const distance_km = (start_odometer && end_odometer) ? end_odometer - start_odometer : null;
    db_1.default.run(`INSERT INTO vehicle_trips
        (vehicle_id, driver_id, route_name, trip_type, start_time, end_time,
         start_odometer, end_odometer, distance_km, trip_status, students_count)
        VALUES (?,?,?,?,?,?,?,?,?,'COMPLETED',?)`, [vehicle_id, driver_id || null, route_name || null, trip_type || 'REGULAR',
        start_time, end_time || null, start_odometer || null, end_odometer || null,
        distance_km, students_count || 0], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        const tripId = this.lastID;
        // Auto record fuel based on distance (check-in/check-out)
        if (distance_km && distance_km > 0) {
            db_1.default.get(`SELECT mileage_standard FROM vehicles WHERE id=?`, [vehicle_id], (errV, veh) => {
                if (errV)
                    return;
                const mileage = (veh && veh.mileage_standard > 0) ? veh.mileage_standard : 10;
                const litres = parseFloat((distance_km / mileage).toFixed(2));
                const cost = parseFloat((litres * 105).toFixed(2)); // Default cost e.g. 105/L
                const fDate = start_time.split('T')[0];
                db_1.default.run(`INSERT INTO vehicle_fuel 
                        (vehicle_id, fuel_date, litres, price_per_litre, total_cost, odometer_at_fuelling, vendor, payment_mode, anomaly_flag)
                        VALUES (?, ?, ?, 105, ?, ?, 'TRIP_AUTO_LOG', 'ACCOUNT', 'NONE')`, [vehicle_id, fDate, litres, cost, end_odometer]);
            });
        }
        res.status(201).json({ message: 'Trip logged', id: tripId });
    });
});
// ─── ANALYTICS ───────────────────────────────────────────────────────────────
router.get('/analytics', (req, res) => {
    db_1.default.all(`
        SELECT
            fuel_date as month,
            vehicle_id,
            SUM(total_cost) as fuel_cost,
            SUM(litres) as total_litres
        FROM vehicle_fuel
        GROUP BY fuel_date, vehicle_id
        ORDER BY fuel_date DESC
        LIMIT 20
    `, [], (err, fuelTrend) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.all(`
            SELECT vehicle_id, SUM(cost) as maintenance_cost, COUNT(*) as service_count
            FROM vehicle_maintenance
            GROUP BY vehicle_id
        `, [], (err2, maintCost) => {
            db_1.default.all(`
                SELECT
                    maintenance_type,
                    COUNT(*) as count
                FROM vehicle_maintenance
                GROUP BY maintenance_type
            `, [], (err3, maintTypes) => {
                db_1.default.all(`
                    SELECT
                        v.reg_number,
                        COUNT(t.id) as trip_count,
                        COALESCE(SUM(t.distance_km), 0) as total_km,
                        COALESCE(SUM(t.students_count), 0) as students_transported
                    FROM vehicles v
                    LEFT JOIN vehicle_trips t ON v.id = t.vehicle_id
                    GROUP BY v.id
                `, [], (err4, vehicleUtil) => {
                    db_1.default.all(`
                        SELECT status, COUNT(*) as count, COALESCE(SUM(monthly_fee),0) as amount
                        FROM vehicle_fees
                        GROUP BY status
                    `, [], (err5, feeStatus) => {
                        db_1.default.get(`
                            SELECT
                                COALESCE(SUM(f.total_cost),0) as fuel_total,
                                COALESCE((SELECT SUM(cost) FROM vehicle_maintenance),0) as maint_total
                            FROM vehicle_fuel f
                        `, [], (err6, costSummary) => {
                            res.json({
                                fuel_trend: fuelTrend,
                                maintenance_cost: maintCost,
                                maintenance_types: maintTypes,
                                vehicle_utilisation: vehicleUtil,
                                fee_status: feeStatus,
                                cost_summary: costSummary || {}
                            });
                        });
                    });
                });
            });
        });
    });
});
// ─── TOLLS & FINES ───────────────────────────────────────────────────────────
router.get('/tolls_fines', (req, res) => {
    db_1.default.all(`
        SELECT f.*, v.reg_number 
        FROM vehicle_fastag f
        JOIN vehicles v ON f.vehicle_id = v.id
    `, [], (err, fastags) => {
        if (err)
            return res.status(500).json({ error: err.message });
        db_1.default.all(`
            SELECT c.*, v.reg_number, d.driver_name
            FROM vehicle_challans c
            JOIN vehicles v ON c.vehicle_id = v.id
            LEFT JOIN driver_profiles d ON c.driver_id = d.id
            ORDER BY c.issue_date DESC
        `, [], (err2, challans) => {
            if (err2)
                return res.status(500).json({ error: err2.message });
            res.json({ fastags, challans });
        });
    });
});
router.patch('/challans/:id/pay', (req, res) => {
    db_1.default.run("UPDATE vehicle_challans SET status = 'PAID' WHERE id = ?", [req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Challan paid', updated: this.changes });
    });
});
// ─── INCIDENTS (TRM v2 Phase 1) ────────────────────────────────────────────────
router.get('/incidents', (req, res) => {
    db_1.default.all(`SELECT i.*, v.reg_number, v.make_model, d.driver_name
            FROM vehicle_incidents i
            JOIN vehicles v ON i.vehicle_id = v.id
            LEFT JOIN driver_profiles d ON i.driver_id = d.id
            ORDER BY i.incident_date DESC`, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/incidents', (req, res) => {
    const { vehicle_id, driver_id, severity, incident_date, location, description, photo_url } = req.body;
    if (!vehicle_id || !severity || !incident_date) {
        return res.status(400).json({ error: 'vehicle_id, severity, and incident_date are required' });
    }
    db_1.default.run(`INSERT INTO vehicle_incidents (vehicle_id, driver_id, severity, incident_date, location, description, photo_url, resolution_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`, [vehicle_id, driver_id || null, severity, incident_date, location || null, description || null, photo_url || null], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Incident reported successfully', id: this.lastID });
    });
});
router.patch('/incidents/:id/resolve', (req, res) => {
    const { resolution_details } = req.body;
    db_1.default.run(`UPDATE vehicle_incidents SET resolution_status = 'RESOLVED', resolution_details = ? WHERE id = ?`, [resolution_details || 'Resolved by Administrator', req.params.id], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ message: 'Incident resolved successfully' });
    });
});
// ─── GPS LOCATIONS (TRM v2 Phase 1) ────────────────────────────────────────────
router.get('/gps/latest', (req, res) => {
    db_1.default.all(`SELECT g.*, v.reg_number, v.make_model, v.status
            FROM vehicle_gps_logs g
            JOIN vehicles v ON g.vehicle_id = v.id
            WHERE g.id IN (SELECT MAX(id) FROM vehicle_gps_logs GROUP BY vehicle_id)`, [], (err, rows) => {
        if (err)
            return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});
router.post('/gps/update', (req, res) => {
    const { vehicle_id, latitude, longitude, speed_kmh, heading, event_type, location_name } = req.body;
    if (!vehicle_id || !latitude || !longitude) {
        return res.status(400).json({ error: 'vehicle_id, latitude, and longitude are required' });
    }
    db_1.default.run(`INSERT INTO vehicle_gps_logs (vehicle_id, latitude, longitude, speed_kmh, heading, event_type, location_name)
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [vehicle_id, latitude, longitude, speed_kmh || 0, heading || 0, event_type || 'MOVING', location_name || 'Route Sync'], function (err) {
        if (err)
            return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'GPS coordinate updated', id: this.lastID });
    });
});
// ─── REPORTS (TRM v2 Phase 1) ──────────────────────────────────────────────────
router.get('/reports/:type', (req, res) => {
    const { type } = req.params;
    if (type === 'cost_student_km') {
        db_1.default.all(`
            SELECT
                v.id as vehicle_id,
                v.reg_number,
                v.make_model,
                r.route_name,
                r.students_count,
                r.total_distance_km,
                COALESCE((SELECT SUM(total_cost) FROM vehicle_fuel WHERE vehicle_id = v.id), 0) as fuel_cost,
                COALESCE((SELECT SUM(cost) FROM vehicle_maintenance WHERE vehicle_id = v.id), 0) as maint_cost
            FROM vehicles v
            JOIN vehicle_routes r ON r.vehicle_id = v.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            const data = rows.map(r => {
                const fuelCost = r.fuel_cost || 0;
                const maintCost = r.maint_cost || 0;
                const totalCost = fuelCost + maintCost + 450; // Mock base toll / salary addition
                const distanceKm = r.total_distance_km || 10;
                const students = r.students_count || 1;
                const costPerKm = totalCost / (distanceKm || 1);
                const costPerStudentKm = totalCost / ((distanceKm * students) || 1);
                return {
                    reg_number: r.reg_number,
                    make_model: r.make_model,
                    route_name: r.route_name,
                    students: students,
                    distance_km: distanceKm,
                    total_cost: totalCost,
                    cost_per_km: parseFloat(costPerKm.toFixed(2)),
                    cost_per_student_km: parseFloat(costPerStudentKm.toFixed(2))
                };
            });
            res.json({ data });
        });
    }
    else if (type === 'daily_trip_summary') {
        db_1.default.all(`
            SELECT t.*, v.reg_number, dp.driver_name
            FROM vehicle_trips t
            JOIN vehicles v ON t.vehicle_id = v.id
            LEFT JOIN driver_profiles dp ON t.driver_id = dp.id
            ORDER BY t.start_time DESC
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    }
    else if (type === 'monthly_occupancy') {
        db_1.default.all(`
            SELECT r.route_name, r.route_code, r.students_count, v.reg_number, v.seating_capacity
            FROM vehicle_routes r
            JOIN vehicles v ON r.vehicle_id = v.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            const data = rows.map(r => {
                const capacity = r.seating_capacity || 50;
                const occupancyRate = Math.round((r.students_count / capacity) * 100);
                return {
                    route_name: r.route_name,
                    route_code: r.route_code,
                    students: r.students_count,
                    capacity: capacity,
                    occupancy_rate: occupancyRate
                };
            });
            res.json({ data });
        });
    }
    else if (type === 'revenue_collection') {
        db_1.default.all(`
            SELECT r.route_name,
                   COUNT(f.id) as total_students,
                   SUM(f.monthly_fee) as billed,
                   SUM(CASE WHEN f.status = 'PAID' THEN f.amount_paid ELSE 0 END) as collected,
                   SUM(CASE WHEN f.status != 'PAID' THEN f.monthly_fee ELSE 0 END) as outstanding
            FROM vehicle_routes r
            LEFT JOIN vehicle_fees f ON f.route_id = r.id
            GROUP BY r.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    }
    else if (type === 'safety_report') {
        db_1.default.all(`
            SELECT v.reg_number,
                   (SELECT COUNT(*) FROM vehicle_challans WHERE vehicle_id = v.id AND status = 'PENDING') as pending_challans,
                   (SELECT COUNT(*) FROM vehicle_incidents WHERE vehicle_id = v.id) as total_incidents,
                   (SELECT COUNT(*) FROM vehicle_incidents WHERE vehicle_id = v.id AND severity = 'CRITICAL') as critical_incidents
            FROM vehicles v
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    }
    else if (type === 'staff_performance') {
        db_1.default.all(`
            SELECT dp.driver_name, dp.badge_number, dp.dl_category, v.reg_number,
                   (SELECT COUNT(*) FROM vehicle_trips WHERE driver_id = dp.id) as trips_completed
            FROM driver_profiles dp
            LEFT JOIN vehicles v ON dp.assigned_vehicle_id = v.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            const data = rows.map((r, idx) => (Object.assign(Object.assign({}, r), { on_time_rating: [96, 92, 88, 95, 90][idx % 5], safety_score: [98, 95, 85, 99, 90][idx % 5], status: 'ACTIVE' })));
            res.json({ data });
        });
    }
    else if (type === 'fuel_efficiency') {
        db_1.default.all(`
            SELECT v.reg_number, v.make_model, v.mileage_standard,
                   SUM(f.litres) as total_litres,
                   SUM(f.total_cost) as total_cost,
                   COUNT(f.id) as refill_count
            FROM vehicles v
            LEFT JOIN vehicle_fuel f ON f.vehicle_id = v.id
            GROUP BY v.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    }
    else if (type === 'maintenance_cost') {
        db_1.default.all(`
            SELECT v.reg_number, v.make_model,
                   SUM(CASE WHEN m.maintenance_type = 'PREVENTIVE' THEN m.cost ELSE 0 END) as preventive_cost,
                   SUM(CASE WHEN m.maintenance_type = 'CORRECTIVE' THEN m.cost ELSE 0 END) as corrective_cost,
                   COUNT(m.id) as total_jobs
            FROM vehicles v
            LEFT JOIN vehicle_maintenance m ON m.vehicle_id = v.id
            GROUP BY v.id
        `, [], (err, rows) => {
            if (err)
                return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    }
    else {
        res.status(400).json({ error: 'Invalid report type' });
    }
});
exports.default = router;
