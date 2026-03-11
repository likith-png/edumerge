"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// 1. Initiate Onboarding (Create Employee + Workflow)
router.post('/initiate', (req, res) => {
    const { name, email, role, department, designation, joining_date, institution } = req.body;
    if (!name || !email || !role || !department) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // 1. Ensure Employee exists (or create)
    const stmt = db_1.default.prepare("INSERT OR REPLACE INTO employees (name, email, role, department, designation, joining_date, status, institution) VALUES (?, ?, ?, ?, ?, ?, 'Onboarding', ?)");
    stmt.run(name, email, role, department, designation, joining_date, institution, function (err) {
        if (err) {
            console.error("SQL Error in initiation:", err);
            return res.status(500).json({ error: err.message });
        }
        const employeeId = this.lastID;
        // Initialize Workflow
        const wfStmt = db_1.default.prepare("INSERT INTO onboarding_workflow (employee_id, current_stage, stage_status) VALUES (?, 1, 'Pending')");
        wfStmt.run(employeeId, (wfErr) => {
            if (wfErr) {
                console.error("Failed to init workflow", wfErr);
            }
        });
        wfStmt.finalize();
        res.status(201).json({ id: employeeId, message: "Onboarding initiated successfully" });
    });
    stmt.finalize();
});
// 2. Get Dashboard Stats & List
router.get('/dashboard', (req, res) => {
    const sql = `
        SELECT 
            e.id, e.name, e.department, e.designation, e.joining_date, e.status,
            ow.current_stage, ow.stage_status, ow.updated_at
        FROM employees e
        LEFT JOIN onboarding_workflow ow ON e.id = ow.employee_id
        WHERE e.status = 'Onboarding'
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Helper to calc SLA breach (if stage not updated in 5 days)
        const checkSlaBreach = (updatedAt) => {
            if (!updatedAt)
                return false;
            const lastUpdate = new Date(updatedAt).getTime();
            const now = new Date().getTime();
            const diffDays = (now - lastUpdate) / (1000 * 3600 * 24);
            return diffDays > 5;
        };
        const stats = {
            total: rows.length,
            stage1: rows.filter(r => r.current_stage === 1).length,
            stage2: rows.filter(r => r.current_stage === 2).length,
            stage3: rows.filter(r => r.current_stage === 3).length,
            stage4: rows.filter(r => r.current_stage === 4).length,
            stage5: rows.filter(r => r.current_stage === 5).length,
            // New Metrics
            slaBreaches: rows.filter(r => checkSlaBreach(r.updated_at)).length,
            probationDue: rows.filter(r => r.current_stage === 5).length, // Simplified: Everyone in Stage 5 is "Due"
            // Mocking Percentages for Demo (To be replaced with real aggregations later)
            documentPendingPercent: 34,
            assetPendingPercent: 12,
            trainingCompletionPercent: 78,
            earlyDropoff: 2 // Mock count
        };
        res.json({ stats, candidates: rows });
    });
});
// 3. Get Single Candidate Onboarding Details
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const employeeSql = `
        SELECT e.*, ow.current_stage, ow.stage_status 
        FROM employees e
        LEFT JOIN onboarding_workflow ow ON e.id = ow.employee_id
        WHERE e.id = ?
    `;
    db_1.default.get(employeeSql, [id], (err, employee) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        // Fetch documents
        db_1.default.all("SELECT * FROM onboarding_documents WHERE employee_id = ?", [id], (docErr, documents) => {
            if (docErr) {
                res.status(500).json({ error: docErr.message });
                return;
            }
            // Fetch Assets
            db_1.default.all("SELECT * FROM assets WHERE assigned_to = ?", [id], (assetErr, assets) => {
                if (assetErr) {
                    res.status(500).json({ error: assetErr.message });
                    return;
                }
                // Fetch Training
                db_1.default.all("SELECT * FROM onboarding_training WHERE employee_id = ?", [id], (trainErr, training) => {
                    res.json({
                        employee,
                        documents,
                        assets,
                        training
                    });
                });
            });
        });
    });
});
// 4. Update Workflow Stage
router.post('/:id/advance', (req, res) => {
    const { id } = req.params;
    const { stage, status } = req.body; // stage can be number 1-5
    const sql = "UPDATE onboarding_workflow SET current_stage = ?, stage_status = ?, updated_at = CURRENT_TIMESTAMP WHERE employee_id = ?";
    db_1.default.run(sql, [stage, status, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // If workflow is marked as Completed (last stage finished) -> Move Employee to Probation & Propagate Data
        if (status === 'Completed') {
            db_1.default.serialize(() => {
                // 1. Update Employee Status
                db_1.default.run("UPDATE employees SET status = 'Probation' WHERE id = ?", [id]);
                // 2. Fetch Module Integrations Configuration
                db_1.default.get("SELECT value FROM configurations WHERE key = 'onboarding_integrations'", (err, row) => {
                    if (!err && row) {
                        try {
                            const integrations = JSON.parse(row.value);
                            // 3. Initialize Probation Reviews (30/60/90 Day)
                            const cycles = ['30_Day', '60_Day', '90_Day'];
                            const probStmt = db_1.default.prepare("INSERT INTO probation_reviews (employee_id, review_cycle, status) VALUES (?, ?, 'Pending')");
                            cycles.forEach(cycle => probStmt.run(id, cycle));
                            probStmt.finalize();
                            // 4. Initialize Mandatory Trainings
                            if (integrations.mandatoryTraining && Array.isArray(integrations.mandatoryTraining)) {
                                const trainStmt = db_1.default.prepare("INSERT INTO onboarding_training (employee_id, module_name, status) VALUES (?, ?, 'Pending')");
                                integrations.mandatoryTraining.forEach((module) => trainStmt.run(id, module));
                                trainStmt.finalize();
                            }
                        }
                        catch (e) {
                            console.error("Failed to parse onboarding integrations for propagation", e);
                        }
                    }
                });
            });
        }
        res.json({ message: "Workflow updated" });
    });
});
// 5. Upload Document (Mock URL)
router.post('/:id/document', (req, res) => {
    const { id } = req.params;
    const { document_name, file_url } = req.body;
    const sql = "INSERT INTO onboarding_documents (employee_id, document_name, file_url, status) VALUES (?, ?, ?, 'Uploaded')";
    db_1.default.run(sql, [id, document_name, file_url], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, message: "Document uploaded" });
    });
});
// 6. Verify Document (HR)
router.post('/document/:docId/verify', (req, res) => {
    const { docId } = req.params;
    const { status, remarks } = req.body; // status: Verified or Rejected
    db_1.default.run("UPDATE onboarding_documents SET status = ?, remarks = ? WHERE id = ?", [status, remarks, docId], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Document status updated" });
    });
});
// 7. Update Training Status
router.post('/:id/training', (req, res) => {
    const { id } = req.params;
    const { module_name, status } = req.body;
    // specific logic: insert or update
    db_1.default.get("SELECT id FROM onboarding_training WHERE employee_id = ? AND module_name = ?", [id, module_name], (err, row) => {
        if (row) {
            db_1.default.run("UPDATE onboarding_training SET status = ?, completion_date = CURRENT_TIMESTAMP WHERE id = ?", [status, row.id]);
        }
        else {
            db_1.default.run("INSERT INTO onboarding_training (employee_id, module_name, status, completion_date) VALUES (?, ?, ?, CURRENT_TIMESTAMP)", [id, module_name, status]);
        }
        res.json({ message: "Training updated" });
    });
});
// 8. Get Onboarding Configuration
router.get('/config', (req, res) => {
    const keys = ['onboarding_stages', 'onboarding_docs', 'onboarding_general_settings', 'onboarding_integrations'];
    const sql = `SELECT key, value FROM configurations WHERE key IN (${keys.map(() => '?').join(',')})`;
    db_1.default.all(sql, keys, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const config = {};
        rows.forEach(row => {
            try {
                config[row.key] = JSON.parse(row.value);
            }
            catch (e) {
                config[row.key] = row.value;
            }
        });
        res.json(config);
    });
});
// 9. Save Onboarding Configuration
router.post('/config', (req, res) => {
    const configs = req.body; // Expecting { key: value } pairs
    const stmt = db_1.default.prepare("INSERT OR REPLACE INTO configurations (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
    db_1.default.serialize(() => {
        Object.keys(configs).forEach(key => {
            const value = typeof configs[key] === 'string' ? configs[key] : JSON.stringify(configs[key]);
            stmt.run(key, value);
        });
        stmt.finalize((err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Configuration saved successfully" });
        });
    });
});
exports.default = router;
