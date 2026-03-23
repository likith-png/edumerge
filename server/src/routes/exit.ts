import { Router } from 'express';
import db from '../db';

const router = Router();

// Get all exits
router.get('/', (req, res) => {
    const sql = `
    SELECT exits.*, employees.name as employee_name, employees.department 
    FROM exits 
    LEFT JOIN employees ON exits.employee_id = employees.id
  `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Submit Resignation
router.post('/resign', (req, res) => {
    const { employee_id, reason, lwd_proposed, comments, resignation_type, attachment_url } = req.body;
    const resignation_date = new Date().toISOString().split('T')[0];

    // Check for existing active requests
    const checkSql = `SELECT * FROM exits WHERE employee_id = ? AND status NOT IN ('Rejected', 'Withdrawn')`;
    db.get(checkSql, [employee_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ error: "You already have an active exit request." });
        }

        // Fetch Configuration
        db.get(`SELECT value FROM configurations WHERE key = 'exit_config'`, (err, configRow: any) => {
            let config: any = {};
            if (configRow) {
                try {
                    config = JSON.parse(configRow.value);
                } catch (e) {
                    console.error("Error parsing config", e);
                }
            }

            // Calculate Notice Period based on Config or defaults
            let noticeDays = 60;
            if (config.noticePeriod) {
                noticeDays = config.noticePeriod.nonTeachingDays || 30;
            } else {
                // Fallback defaults
                if (resignation_type === 'Retirement') noticeDays = 90;
                else if (resignation_type === 'Contract End') noticeDays = 30;
                else if (resignation_type === 'Termination') noticeDays = 0;
            }

            // Determine Initial Stage & Notice Period Correctly using Employee Role
            db.get(`SELECT role FROM employees WHERE id = ?`, [employee_id], (err, emp: any) => {
                if (err) return res.status(500).json({ error: err.message });

                // Recalculate Notice Days with Role
                if (config.noticePeriod && emp) {
                    if (emp.role === 'Faculty') noticeDays = config.noticePeriod.teachingDays;
                    else if (emp.role === 'Admin') noticeDays = config.noticePeriod.nonTeachingDays; // Assuming Admin is non-teaching
                    else noticeDays = config.noticePeriod.contractDays; // Fallback
                }

                if (resignation_type === 'Termination') noticeDays = 0;

                const noticeDate = new Date(resignation_date);
                noticeDate.setDate(noticeDate.getDate() + noticeDays);
                const notice_period_end = noticeDate.toISOString().split('T')[0];

                let approval_stage = 'Manager Review';
                let current_approver_role = 'Reporting Manager';

                if (emp && emp.role === 'Faculty') {
                    approval_stage = 'HoD Review';
                    current_approver_role = 'Head of Department';
                }

                const meeting_status = config.workflow?.requireOneOnOne ? 'Pending' : 'Waived';
                const sql = `INSERT INTO exits (employee_id, resignation_date, reason, lwd_proposed, comments, resignation_type, notice_period_end, attachment_url, approval_stage, current_approver_role, meeting_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [employee_id, resignation_date, reason, lwd_proposed, comments, resignation_type || 'Voluntary', notice_period_end, attachment_url, approval_stage, current_approver_role, meeting_status];

                db.run(sql, params, function (err) {
                    if (err) {
                        return res.status(400).json({ error: err.message });
                    }

                    const exitId = this.lastID;

                    // Audit Log
                    db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
                        [exitId, 'Submitted', `Employee ${employee_id}`, `Resignation submitted. Type: ${resignation_type}, Proposed LWD: ${lwd_proposed}`]);

                    db.serialize(() => {
                        // 1. Generate NOC Requests based on Config
                        if (config.noc && config.noc.enabled) {
                            const departments: string[] = [];
                            if (config.noc.departments.it) departments.push('IT');
                            if (config.noc.departments.admin) departments.push('Admin');
                            if (config.noc.departments.finance) departments.push('Finance');
                            if (config.noc.departments.hod) departments.push('HOD');
                            if (config.noc.departments.library) departments.push('Library');
                            if (config.noc.departments.payroll) departments.push('Payroll');

                            if (departments.length > 0 && config.noc.systemBehavior?.autoCreateTasks) {
                                const nocStmt = db.prepare(`INSERT INTO noc_clearances (exit_id, department, status) VALUES (?, ?, 'Pending')`);
                                departments.forEach(dept => {
                                    nocStmt.run(exitId, dept);
                                });
                                nocStmt.finalize();
                            }
                        } else {
                            // Fallback if config disabled or missing
                            if (!configRow) {
                                const defaultDepts = ['IT', 'Admin', 'Finance', 'HOD', 'Library', 'Payroll'];
                                const nocStmt = db.prepare(`INSERT INTO noc_clearances (exit_id, department, status) VALUES (?, ?, 'Pending')`);
                                defaultDepts.forEach(dept => {
                                    nocStmt.run(exitId, dept);
                                });
                                nocStmt.finalize();
                            }
                        }

                        // 2. Auto-populate Handover Items
                        db.all(`SELECT name, type FROM assets WHERE assigned_to = ?`, [employee_id], (err, assets: any[]) => {
                            if (err) console.error("Error fetching assets for handover", err);

                            const handoverStmt = db.prepare(`INSERT INTO handover_items (exit_id, item_name, category, status) VALUES (?, ?, ?, 'Pending')`);

                            // A. From Assets
                            if (assets && assets.length > 0) {
                                assets.forEach(asset => {
                                    handoverStmt.run(exitId, `${asset.name} (${asset.type})`, 'Asset');
                                });
                            }

                            // B. Standard Academic Items (for Faculty)
                            if (emp && emp.role === 'Faculty') {
                                const academicItems = [
                                    { name: "Subjects Handled & Syllabus Status", category: "Academic" },
                                    { name: "Lesson Plans & Teaching Materials", category: "Academic" },
                                    { name: "Question Banks, Schemes & Rubrics", category: "Academic" },
                                    { name: "Lab Manuals & Research Docs", category: "Academic" }
                                ];
                                academicItems.forEach(item => {
                                    handoverStmt.run(exitId, item.name, item.category);
                                });
                            }

                            // C. Administrative Items (All Roles)
                            const adminItems = [
                                { name: "Department Files & Documents", category: "Administrative" },
                                { name: "System Access & Ownership Transfer", category: "Administrative" },
                                { name: "Vendor/Student Dependencies", category: "Administrative" }
                            ];
                            adminItems.forEach(item => {
                                handoverStmt.run(exitId, item.name, item.category);
                            });

                            handoverStmt.finalize();

                            // Final Response
                            res.json({
                                message: "Resignation submitted successfully",
                                id: exitId
                            });
                        });
                    });
                });
            });
        });
    });
});

// Involuntary Termination (HR Initiated)
router.post('/terminate', (req, res) => {
    const { employee_id, reason, lwd_proposed, comments } = req.body;
    const resignation_date = new Date().toISOString().split('T')[0];
    const resignation_type = 'Termination';

    // Check for existing active requests
    const checkSql = `SELECT * FROM exits WHERE employee_id = ? AND status NOT IN ('Rejected', 'Withdrawn', 'Completed')`;
    db.get(checkSql, [employee_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            return res.status(400).json({ error: "Employee already has an active exit process." });
        }

        // Fetch Configuration
        db.get(`SELECT value FROM configurations WHERE key = 'exit_config'`, (err, configRow: any) => {
            let config: any = {};
            if (configRow) {
                try { config = JSON.parse(configRow.value); } catch (e) { console.error("Error parsing config", e); }
            }

            // Notice period is immediate for termination
            const notice_period_end = resignation_date;

            // Immediate Approval since HR initiated
            const status = 'Approved';
            const approval_stage = 'Approved';
            const current_approver_role = null;

            db.get(`SELECT role FROM employees WHERE id = ?`, [employee_id], (err, emp: any) => {
                if (err) return res.status(500).json({ error: err.message });

                const sql = `INSERT INTO exits (employee_id, resignation_date, reason, lwd_proposed, lwd_approved, comments, resignation_type, notice_period_end, status, approval_stage, current_approver_role, meeting_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Waived')`;
                const params = [employee_id, resignation_date, reason, lwd_proposed, lwd_proposed, comments, resignation_type, notice_period_end, status, approval_stage, current_approver_role];

                db.run(sql, params, function (err) {
                    if (err) return res.status(400).json({ error: err.message });
                    const exitId = this.lastID;

                    // Audit Log
                    db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
                        [exitId, 'Terminated', 'HR Admin', `Involuntary termination initiated. Reason: ${reason}`]);

                    db.serialize(() => {
                        // 1. Generate NOC Requests
                        const defaultDepts = ['IT', 'Admin', 'Finance', 'HOD', 'Library', 'Payroll'];
                        const nocStmt = db.prepare(`INSERT INTO noc_clearances (exit_id, department, status) VALUES (?, ?, 'Pending')`);
                        defaultDepts.forEach(dept => nocStmt.run(exitId, dept));
                        nocStmt.finalize();

                        // 2. Auto-populate Handover Items
                        db.all(`SELECT name, type FROM assets WHERE assigned_to = ?`, [employee_id], (err, assets: any[]) => {
                            const handoverStmt = db.prepare(`INSERT INTO handover_items (exit_id, item_name, category, status) VALUES (?, ?, ?, 'Pending')`);
                            if (assets) assets.forEach(asset => handoverStmt.run(exitId, `${asset.name} (${asset.type})`, 'Asset'));

                            const adminItems = [
                                { name: "System Access & Ownership Transfer", category: "Administrative" },
                                { name: "ID Card & Physical Keys", category: "Administrative" }
                            ];
                            adminItems.forEach(item => handoverStmt.run(exitId, item.name, item.category));
                            handoverStmt.finalize();

                            res.json({ message: "Employee terminated and exit process initiated", id: exitId });
                        });
                    });
                });
            });
        });
    });
});

// --- Configuration APIs ---

// Get Configuration
router.get('/config', (req, res) => {
    db.get(`SELECT value FROM configurations WHERE key = 'exit_config'`, (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Configuration not found" });
        res.json({ data: JSON.parse(row.value) });
    });
});

// Update Configuration
router.post('/config', (req, res) => {
    const config = req.body;
    const value = JSON.stringify(config);
    db.run(`INSERT OR REPLACE INTO configurations (key, value, updated_at) VALUES ('exit_config', ?, CURRENT_TIMESTAMP)`, [value], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Configuration saved successfully" });
    });
});

// Approve/Reject Resignation (Manager/HR/Principal)
router.patch('/:id/status', (req, res) => {
    const { status, lwd_approved, comments, approver_role } = req.body; // Status: 'Approved' or 'Rejected'
    const { id } = req.params;

    db.get(`SELECT * FROM exits WHERE id = ?`, [id], (err, exit: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!exit) return res.status(404).json({ error: "Exit not found" });

        let newStatus = exit.status;
        let newStage = exit.approval_stage;
        let newApproverRole = exit.current_approver_role;

        if (status === 'Rejected') {
            newStatus = 'Rejected';
            newStage = 'Rejected';
            newApproverRole = null;
        } else if (status === 'Approved') {
            // Stage Progression Logic
            if (exit.approval_stage === 'HoD Review') {
                newStage = 'Principal Approval';
                newApproverRole = 'Principal';
            } else if (exit.approval_stage === 'Manager Review') {
                newStage = 'HR Validation';
                newApproverRole = 'HR';
            } else if (exit.approval_stage === 'Principal Approval') {
                newStage = 'HR Validation';
                newApproverRole = 'HR';
            } else if (exit.approval_stage === 'HR Validation') {
                newStatus = 'Approved'; // Final Approval
                newStage = 'Approved';
                newApproverRole = null;
            }
        }

        let sql = `UPDATE exits SET status = ?, approval_stage = ?, current_approver_role = ?, comments = ?`;
        const params = [newStatus, newStage, newApproverRole, comments];

        if (lwd_approved) {
            sql += `, lwd_approved = ?`;
            params.push(lwd_approved);
        }

        sql += ` WHERE id = ?`;
        params.push(id);

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            // Audit Log
            db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
                [id, status, approver_role || 'Admin', `Stage: ${exit.approval_stage} -> ${newStage}. Comments: ${comments}`]);

            // Auto-calculate shortfall if LWD is approved (or if it was already set and we are just approving)
            const finalLWD = lwd_approved || exit.lwd_approved;
            // Only calculate if we have a final LWD and notice period end
            if (finalLWD && exit.notice_period_end) {
                const lwdDate = new Date(finalLWD);
                const noticeEndDate = new Date(exit.notice_period_end);

                let shortfall_days = 0;
                if (lwdDate < noticeEndDate) {
                    const diffTime = Math.abs(noticeEndDate.getTime() - lwdDate.getTime());
                    shortfall_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }
                const daily_salary = 1000; // Mock
                const buyout_amount = shortfall_days * daily_salary;

                db.run(`UPDATE exits SET shortfall_days = ?, buyout_amount = ? WHERE id = ?`, [shortfall_days, buyout_amount, id]);
            }

            res.json({ message: "Exit status updated successfully", changes: this.changes });
        });
    });
});

// Defer Resignation (Extend LWD)
router.patch('/:id/defer', (req, res) => {
    const { deferment_date, reason } = req.body;
    const { id } = req.params;

    const sql = `UPDATE exits SET lwd_proposed = ?, deferment_date = ?, is_deferrable = 1 WHERE id = ?`;
    db.run(sql, [deferment_date, new Date().toISOString(), id], function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // Audit Log
        db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
            [id, 'Deferred', 'Employee', `LWD extended to ${deferment_date}. Reason: ${reason}`]);

        res.json({ message: "Resignation deferred successfully" });
    });
});

// Modify Resignation (Before Approval)
router.patch('/:id/modify', (req, res) => {
    const { reason, lwd_proposed } = req.body;
    const { id } = req.params;

    db.get(`SELECT status FROM exits WHERE id = ?`, [id], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: "Exit not found" });
        if (row.status !== 'Pending') return res.status(400).json({ error: "Cannot modify processed resignation" });

        const sql = `UPDATE exits SET reason = ?, lwd_proposed = ? WHERE id = ?`;
        db.run(sql, [reason, lwd_proposed, id], function (err) {
            if (err) return res.status(400).json({ error: err.message });

            // Audit Log
            db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
                [id, 'Modified', 'Employee', `Resignation details updated. Reason: ${reason}, LWD: ${lwd_proposed}`]);

            res.json({ message: "Resignation modified successfully" });
        });
    });
});

// Get Exit Details by ID
router.get('/:id', (req, res) => {
    const sql = `
        SELECT exits.*, employees.name as employee_name, employees.department,
               s.name as successor_name
        FROM exits 
        LEFT JOIN employees ON exits.employee_id = employees.id
        LEFT JOIN employees s ON exits.successor_id = s.id
        WHERE exits.id = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Exit record not found" });
        }

        // Fetch related data (NOC, Handover)
        const nocSql = `SELECT * FROM noc_clearances WHERE exit_id = ?`;
        db.all(nocSql, [req.params.id], (nocErr, nocRows) => {
            if (nocErr) {
                return res.status(500).json({ error: nocErr.message });
            }
            res.json({ data: row, noc: nocRows });
        });
    });
});

// Update NOC Status (Dept Head)
router.patch('/noc/:id', (req, res) => {
    const { status, remarks, cleared_by } = req.body;
    const { id } = req.params;

    const sql = `UPDATE noc_clearances SET status = ?, remarks = ?, cleared_by = ? WHERE id = ?`;
    const params = [status, remarks, cleared_by, id];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "NOC status updated successfully" });
    });
});

// Get NOC Requests (Filtered by Dept or All)
router.get('/noc/list', (req, res) => {
    const { department } = req.query;
    let sql = `
    SELECT noc_clearances.*, exits.employee_id, employees.name as employee_name, exits.resignation_date 
    FROM noc_clearances 
    JOIN exits ON noc_clearances.exit_id = exits.id
    JOIN employees ON exits.employee_id = employees.id
  `;
    const params: any[] = [];

    if (department) {
        sql += ` WHERE noc_clearances.department = ?`;
        params.push(department);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Get Handover Items (Sync with Assets)
router.get('/:id/handover', (req, res) => {
    const exitId = req.params.id;

    // First, check if we need to sync assets
    const checkSql = `SELECT count(*) as count FROM handover_items WHERE exit_id = ? AND category = 'Asset'`;
    db.get(checkSql, [exitId], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row.count === 0) {
            // No assets in handover yet, fetch from Assets table
            // Get employee_id from exit
            db.get(`SELECT employee_id FROM exits WHERE id = ?`, [exitId], (err, exitRow: any) => {
                if (err || !exitRow) return res.status(500).json({ error: "Exit record not found" });

                const employeeId = exitRow.employee_id;
                const assetSql = `SELECT name, type FROM assets WHERE assigned_to = ?`;
                db.all(assetSql, [employeeId], (err, assets: any[]) => {
                    if (err) return res.status(500).json({ error: err.message });

                    // Insert assets into handover_items
                    const insertSql = `INSERT INTO handover_items (exit_id, item_name, category, status) VALUES (?, ?, 'Asset', 'Pending')`;
                    const stmt = db.prepare(insertSql);
                    assets.forEach(asset => {
                        stmt.run(exitId, `${asset.name} (${asset.type})`);
                    });
                    stmt.finalize();

                    // Now fetch all items
                    fetchHandoverItems(res, exitId);
                });
            });
        } else {
            // Already synced or exists
            fetchHandoverItems(res, exitId);
        }
    });
});

function fetchHandoverItems(res: any, exitId: any) {
    const sql = `SELECT * FROM handover_items WHERE exit_id = ?`;
    db.all(sql, [exitId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
}

// Add Handover Item
router.post('/handover', (req, res) => {
    const { exit_id, item_name, category, assigned_to } = req.body;
    const sql = `INSERT INTO handover_items (exit_id, item_name, category, assigned_to) VALUES (?, ?, ?, ?)`;
    const params = [exit_id, item_name, category, assigned_to];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Handover item added", id: this.lastID });
    });
});

// Update Handover Item Status
router.patch('/handover/:id', (req, res) => {
    const { status, proof_url } = req.body;
    let sql = `UPDATE handover_items SET status = ?, last_updated = ?`;
    const params = [status, new Date().toISOString()];

    if (proof_url) {
        sql += `, proof_url = ?`;
        params.push(proof_url);
    }

    sql += ` WHERE id = ?`;
    params.push(req.params.id);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Item updated" });
    });
});

// Verify Handover Item (Successor/HOD)
router.patch('/handover/:id/verify', (req, res) => {
    const { verified_by } = req.body;
    db.run(`UPDATE handover_items SET status = 'Verified', last_updated = ? WHERE id = ?`,
        [new Date().toISOString(), req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Item verified successfully" });
        });
});

// Assign Successor
router.patch('/:id/successor', (req, res) => {
    const { successor_id } = req.body;
    const { id } = req.params;

    const sql = `UPDATE exits SET successor_id = ? WHERE id = ?`;
    db.run(sql, [successor_id, id], function (err) {
        if (err) return res.status(400).json({ error: err.message });

        // Audit Log
        db.run(`INSERT INTO audit_logs (exit_id, action, performed_by, details) VALUES (?, ?, ?, ?)`,
            [id, 'Successor Assigned', 'Admin/Manager', `Successor ID ${successor_id} assigned.`]);

        res.json({ message: "Successor updated successfully" });
    });
});

// --- Exit Interview APIs ---

// Get Interview Questions/Answers
router.get('/:id/interview', (req, res) => {
    const exitId = req.params.id;
    const checkSql = `SELECT count(*) as count FROM exit_interviews WHERE exit_id = ?`;
    db.get(checkSql, [exitId], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row.count === 0) {
            // Seed categorized questions
            const questions = [
                { q: "What is your primary reason for leaving?", cat: "General" },
                { q: "How would you rate your relationship with your manager?", cat: "Manager" },
                { q: "Did you have the tools and resources to do your job effectively?", cat: "Enablement" },
                { q: "How satisfied were you with the compensation and benefits?", cat: "Compensation" },
                { q: "How would you rate the company culture?", cat: "Culture" },
                { q: "What could we have done better to retain you?", cat: "General" },
                { q: "Would you recommend this company to a friend?", cat: "Culture" }
            ];
            const stmt = db.prepare(`INSERT INTO exit_interviews (exit_id, question, category, answer, rating) VALUES (?, ?, ?, '', 0)`);
            questions.forEach(item => stmt.run(exitId, item.q, item.cat));
            stmt.finalize();
        }

        db.all(`SELECT * FROM exit_interviews WHERE exit_id = ?`, [exitId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ data: rows });
        });
    });
});

// Update Interview Answer
router.patch('/interview/:id', (req, res) => {
    const { answer, rating } = req.body;
    db.run(`UPDATE exit_interviews SET answer = ?, rating = ? WHERE id = ?`, [answer, rating, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Response saved" });
    });
});

// Finalize Interview (HR)
router.patch('/:id/interview/finalize', (req, res) => {
    const { risk_rating, hr_notes, interview_mode } = req.body;
    const sql = `UPDATE exits SET interview_status = 'Completed', risk_rating = ?, hr_notes = ?, interview_mode = ? WHERE id = ?`;

    db.run(sql, [risk_rating, hr_notes, interview_mode, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Interview finalized" });
    });
});

// Analytics Data
router.get('/analytics/dashboard', (req, res) => {
    const analytics: any = {};

    // 1. Attrition by Department
    db.all(`SELECT e.department, COUNT(*) as count FROM exits x JOIN employees e ON x.employee_id = e.id WHERE x.status = 'Approved' GROUP BY e.department`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        analytics.attrition_by_dept = rows;

        // 2. Avg Ratings by Category
        db.all(`SELECT category, AVG(rating) as avg_rating FROM exit_interviews WHERE rating > 0 GROUP BY category`, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            analytics.sentiment_by_category = rows;

            // 3. Top Reasons (Word Cloudish)
            db.all(`SELECT reason, COUNT(*) as count FROM exits GROUP BY reason ORDER BY count DESC LIMIT 5`, (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });
                analytics.top_reasons = rows;

                // 4. Risk Profile
                db.all(`SELECT risk_rating, COUNT(*) as count FROM exits WHERE interview_status = 'Completed' GROUP BY risk_rating`, (err, rows) => {
                    if (err) return res.status(500).json({ error: err.message });
                    analytics.risk_profile = rows;

                    // 5. Operational Metrics (Pending Actions)
                    db.get(`SELECT 
                        (SELECT COUNT(*) FROM noc_clearances WHERE status = 'Pending') as pending_nocs,
                        (SELECT COUNT(*) FROM final_settlements WHERE status = 'Pending') as pending_settlements,
                        (SELECT COUNT(*) FROM handover_items WHERE status != 'Verified') as pending_handovers
                    `, (err, row) => {
                        if (err) return res.status(500).json({ error: err.message });
                        analytics.operational_metrics = row;

                        // 6. Academic Risk (High Risk in Academic Depts)
                        db.all(`SELECT e.department, COUNT(*) as count 
                                 FROM exits x 
                                 JOIN employees e ON x.employee_id = e.id 
                                 WHERE x.risk_rating = 'High' AND e.department IN ('Computer Science', 'Electronics', 'Mechanical', 'Civil') 
                                 GROUP BY e.department`, (err, rows) => {
                            if (err) return res.status(500).json({ error: err.message });
                            analytics.academic_risk = rows;

                            res.json({ data: analytics });
                        });
                    });
                });
            });
        });
    });
});


// --- Final Settlement APIs ---


// Update Settlement
router.patch('/settlement/:id', (req, res) => {
    const { salary_due, leave_encashment, bonus, deductions, net_payable, status, remarks } = req.body;
    const payment_date = status === 'Paid' ? new Date().toISOString().split('T')[0] : null;

    const sql = `UPDATE final_settlements SET salary_due=?, leave_encashment=?, bonus=?, deductions=?, net_payable=?, status=?, remarks=?, payment_date=? WHERE id=?`;
    const params = [salary_due, leave_encashment, bonus, deductions, net_payable, status, remarks, payment_date, req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Settlement updated" });
    });
});

// --- Notice Period Tracking APIs ---

// Calculate Shortfall & Buyout
router.patch('/:id/calculate-shortfall', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT lwd_approved, notice_period_end FROM exits WHERE id = ?`, [id], (err, exit: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!exit) return res.status(404).json({ error: "Exit not found" });

        if (!exit.lwd_approved || !exit.notice_period_end) {
            return res.status(400).json({ error: "LWD or Notice Period End not set" });
        }

        const lwdDate = new Date(exit.lwd_approved);
        const noticeEndDate = new Date(exit.notice_period_end);

        // Calculate shortfall
        let shortfall_days = 0;
        if (lwdDate < noticeEndDate) {
            const diffTime = Math.abs(noticeEndDate.getTime() - lwdDate.getTime());
            shortfall_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Calculate buyout (Mock: 1 day = 1000 currency units)
        // In a real system, this would fetch salary data
        const daily_salary = 1000;
        const buyout_amount = shortfall_days * daily_salary;

        const sql = `UPDATE exits SET shortfall_days = ?, buyout_amount = ? WHERE id = ?`;
        db.run(sql, [shortfall_days, buyout_amount, id], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Shortfall calculated", shortfall_days, buyout_amount });
        });
    });
});

// Request Waiver
router.patch('/:id/waiver', (req, res) => {
    const { reason } = req.body;
    const { id } = req.params;

    const sql = `UPDATE exits SET waiver_requested = 1, waiver_reason = ? WHERE id = ?`;
    db.run(sql, [reason, id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Waiver requested successfully" });
    });
});

// Approve/Reject Waiver (HR/Admin)
router.patch('/:id/waiver-approve', (req, res) => {
    const { approved } = req.body; // true or false
    const { id } = req.params;

    db.serialize(() => {
        const sql = `UPDATE exits SET waiver_approved = ? WHERE id = ?`;
        const val = approved ? 1 : 0;
        db.run(sql, [val, id], function (err) {
            if (err) return res.status(400).json({ error: err.message });

            if (approved) {
                db.run(`UPDATE exits SET buyout_amount = 0 WHERE id = ?`, [id]);
            }

            res.json({ message: `Waiver ${approved ? 'approved' : 'rejected'}` });
        });
    });
});

// ===== SETTLEMENT MANAGEMENT =====

// Helper function to calculate settlement
function calculateSettlementAmounts(employee: any, exit: any, inputData: any = {}) {
    const monthlySalary = inputData.monthly_salary || employee.salary || 50000;
    const joiningDate = new Date(employee.joining_date || new Date());
    const exitDate = new Date(exit.lwd_approved || exit.lwd_proposed);
    const yearsOfService = (exitDate.getTime() - joiningDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    // 0. Salary Due (Pro-rata for the last month)
    const lastDayOfMonth = new Date(exitDate.getFullYear(), exitDate.getMonth() + 1, 0).getDate();
    const daysWorkedInLastMonth = exitDate.getDate();
    const salaryDue = (monthlySalary / lastDayOfMonth) * daysWorkedInLastMonth;

    // 1. Leave Encashment
    const pendingLeaves = inputData.pending_leaves || 0;
    const dailyRate = monthlySalary / 30;
    const leaveEncashment = pendingLeaves * dailyRate;

    // 2. Bonus (Pro-rated for current financial year)
    let fiscalYearStart = new Date(exitDate.getFullYear(), 3, 1); // April 1st of current year
    if (exitDate < fiscalYearStart) {
        // If exitDate is before April 1st, fiscal year started previous year
        fiscalYearStart = new Date(exitDate.getFullYear() - 1, 3, 1);
    }
    const monthsWorked = inputData.months_worked || Math.min(
        12,
        Math.floor((exitDate.getTime() - fiscalYearStart.getTime()) / (1000 * 60 * 60 * 24 * 30))
    );
    const annualBonus = inputData.annual_bonus || monthlySalary; // Default to 1 month
    const bonus = (annualBonus / 12) * monthsWorked;

    // 3. Gratuity (Eligible after 5 years as per Act)
    const gratuityEligible = yearsOfService >= 5;
    let gratuity = 0;
    if (gratuityEligible) {
        // Formula: (Last Drawn Salary × Years of Service × 15) / 26
        gratuity = (monthlySalary * yearsOfService * 15) / 26;
        // Cap at ₹20 lakhs (as per current gratuity limit)
        gratuity = Math.min(gratuity, 2000000);
    }

    // 4. PF/ESI (Statutory)
    const pfAmount = inputData.pf_amount || monthlySalary * 0.12; // 12% default
    const esiAmount = inputData.esi_amount || 0;

    // 5. Other Dues
    const otherDues = inputData.other_dues || 0;

    // 6. Deductions
    let noticeShortfallDeduction = 0;
    if (exit.waiver_approved !== 1 && (exit.shortfall_days || 0) > 0) {
        noticeShortfallDeduction = ((exit.shortfall_days || 0) / 30) * monthlySalary;
    }
    const advanceDeductions = inputData.advance_deductions || 0;
    const otherDeductions = inputData.other_deductions || 0;

    // 7. Calculate Totals
    const grossSettlement = salaryDue + leaveEncashment + bonus + gratuity + pfAmount + esiAmount + otherDues;
    const totalDeductions = noticeShortfallDeduction + advanceDeductions + otherDeductions;
    const netSettlement = grossSettlement - totalDeductions;

    return {
        monthly_salary: monthlySalary,
        years_of_service: parseFloat(yearsOfService.toFixed(2)),
        joining_date: employee.joining_date,
        salary_due: parseFloat(salaryDue.toFixed(2)),
        pending_leaves: pendingLeaves,
        leave_encashment: parseFloat(leaveEncashment.toFixed(2)),
        bonus: parseFloat(bonus.toFixed(2)),
        bonus_remarks: `Pro-rated for ${monthsWorked} months in FY`,
        gratuity_eligible: gratuityEligible ? 1 : 0,
        gratuity: parseFloat(gratuity.toFixed(2)),
        pf_amount: parseFloat(pfAmount.toFixed(2)),
        esi_amount: parseFloat(esiAmount.toFixed(2)),
        other_dues: otherDues,
        other_dues_remarks: inputData.other_dues_remarks || '',
        notice_shortfall_deduction: parseFloat(noticeShortfallDeduction.toFixed(2)),
        advance_deductions: advanceDeductions,
        other_deductions: otherDeductions,
        deduction_remarks: inputData.deduction_remarks || '',
        gross_settlement: parseFloat(grossSettlement.toFixed(2)),
        total_deductions: parseFloat(totalDeductions.toFixed(2)),
        net_settlement: parseFloat(netSettlement.toFixed(2))
    };
}

// Calculate Settlement for an Exit
router.post('/:id/settlement/calculate', (req, res) => {
    const { id } = req.params;
    const inputData = req.body; // Optional overrides for salary, leaves, etc.

    // Get exit and employee details
    db.get(`SELECT exits.*, employees.* 
            FROM exits 
            LEFT JOIN employees ON exits.employee_id = employees.id 
            WHERE exits.id = ?`, [id], (err, record: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!record) return res.status(404).json({ error: 'Exit not found' });

        // Calculate settlement
        const calculated = calculateSettlementAmounts(record, record, inputData);

        // Check if settlement already exists
        db.get(`SELECT id FROM final_settlements WHERE exit_id = ?`, [id], (err, existing: any) => {
            const currentDate = new Date().toISOString();
            const calculatedBy = inputData.calculated_by || 1; // Should come from auth

            if (existing) {
                // Update existing
                const updateSql = `UPDATE final_settlements SET 
                    monthly_salary = ?, years_of_service = ?, joining_date = ?,
                    pending_leaves = ?, leave_encashment = ?,
                    bonus = ?, bonus_remarks = ?,
                    gratuity_eligible = ?, gratuity = ?,
                    pf_amount = ?, esi_amount = ?,
                    other_dues = ?, other_dues_remarks = ?,
                    notice_shortfall_deduction = ?, advance_deductions = ?,
                    other_deductions = ?, deduction_remarks = ?,
                    gross_settlement = ?, total_deductions = ?, net_settlement = ?, net_payable = ?,
                    salary_due = ?,
                    calculated_by = ?, calculated_date = ?, status = 'Calculated',
                    updated_at = ?
                    WHERE exit_id = ?`;

                const params = [
                    calculated.monthly_salary, calculated.years_of_service, calculated.joining_date,
                    calculated.pending_leaves, calculated.leave_encashment,
                    calculated.bonus, calculated.bonus_remarks,
                    calculated.gratuity_eligible, calculated.gratuity,
                    calculated.pf_amount, calculated.esi_amount,
                    calculated.other_dues, calculated.other_dues_remarks,
                    calculated.notice_shortfall_deduction, calculated.advance_deductions,
                    calculated.other_deductions, calculated.deduction_remarks,
                    calculated.gross_settlement, calculated.total_deductions, calculated.net_settlement, calculated.net_settlement,
                    calculated.salary_due,
                    calculatedBy, currentDate, currentDate, id
                ];

                db.run(updateSql, params, function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ message: 'Settlement calculated successfully', data: calculated, settlementId: existing.id });
                });
            } else {
                // Insert new
                const insertSql = `INSERT INTO final_settlements (
                    exit_id, employee_id,
                    monthly_salary, years_of_service, joining_date,
                    pending_leaves, leave_encashment,
                    bonus, bonus_remarks,
                    gratuity_eligible, gratuity,
                    pf_amount, esi_amount,
                    other_dues, other_dues_remarks,
                    notice_shortfall_deduction, advance_deductions,
                    other_deductions, deduction_remarks,
                    gross_settlement, total_deductions, net_settlement, net_payable,
                    salary_due,
                    status, calculated_by, calculated_date, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Calculated', ?, ?, ?)`;

                const params = [
                    id, record.employee_id,
                    calculated.monthly_salary, calculated.years_of_service, calculated.joining_date,
                    calculated.pending_leaves, calculated.leave_encashment,
                    calculated.bonus, calculated.bonus_remarks,
                    calculated.gratuity_eligible, calculated.gratuity,
                    calculated.pf_amount, calculated.esi_amount,
                    calculated.other_dues, calculated.other_dues_remarks,
                    calculated.notice_shortfall_deduction, calculated.advance_deductions,
                    calculated.other_deductions, calculated.deduction_remarks,
                    calculated.gross_settlement, calculated.total_deductions, calculated.net_settlement, calculated.net_settlement,
                    calculated.salary_due,
                    calculatedBy, currentDate, currentDate
                ];

                db.run(insertSql, params, function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    // Update exits table settlement status
                    db.run(`UPDATE exits SET settlement_status = 'In Progress' WHERE id = ?`, [id]);

                    res.json({ message: 'Settlement calculated successfully', data: calculated, settlementId: this.lastID });
                });
            }
        });
    });
});

// Get Settlement Details for an Exit
router.get('/:id/settlement', (req, res) => {
    const { id } = req.params;

    const sql = `SELECT fs.*, exits.*, employees.name as employee_name, employees.email, employees.department
                 FROM final_settlements fs
                 LEFT JOIN exits ON fs.exit_id = exits.id
                 LEFT JOIN employees ON exits.employee_id = employees.id
                 WHERE fs.exit_id = ?`;

    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Settlement not found' });
        res.json({ data: row });
    });
});

// Update Settlement (HR can modify calculated values)
router.put('/:id/settlement', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const currentDate = new Date().toISOString();

    const updateSql = `UPDATE final_settlements SET 
        pending_leaves = ?, leave_encashment = ?,
        bonus = ?, bonus_remarks = ?,
        gratuity = ?,
        pf_amount = ?, esi_amount = ?,
        other_dues = ?, other_dues_remarks = ?,
        advance_deductions = ?, other_deductions = ?, deduction_remarks = ?,
        gross_settlement = ?, total_deductions = ?, net_settlement = ?,
        updated_at = ?
        WHERE exit_id = ?`;

    // Recalculate totals
    const gross = (updates.leave_encashment || 0) + (updates.bonus || 0) + (updates.gratuity || 0) +
        (updates.pf_amount || 0) + (updates.esi_amount || 0) + (updates.other_dues || 0);
    const deductions = (updates.notice_shortfall_deduction || 0) + (updates.advance_deductions || 0) + (updates.other_deductions || 0);
    const net = gross - deductions;

    const params = [
        updates.pending_leaves, updates.leave_encashment,
        updates.bonus, updates.bonus_remarks,
        updates.gratuity,
        updates.pf_amount, updates.esi_amount,
        updates.other_dues, updates.other_dues_remarks,
        updates.advance_deductions, updates.other_deductions, updates.deduction_remarks,
        gross, deductions, net,
        currentDate, id
    ];

    db.run(updateSql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Settlement updated successfully' });
    });
});

// Approve Settlement
router.post('/:id/settlement/approve', (req, res) => {
    const { id } = req.params;
    const { approved_by } = req.body; // HR/Admin ID

    const currentDate = new Date().toISOString();

    const sql = `UPDATE final_settlements SET 
        status = 'Approved', 
        approved_by = ?, 
        approved_date = ?,
        updated_at = ?
        WHERE exit_id = ?`;

    db.run(sql, [approved_by || 1, currentDate, currentDate, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Update exits table
        db.run(`UPDATE exits SET settlement_status = 'Completed'  WHERE id = ?`, [id]);

        res.json({ message: 'Settlement approved successfully' });
    });
});

// Process Payment (Mark as Paid)
router.post('/:id/settlement/process', (req, res) => {
    const { id } = req.params;
    const { payment_reference } = req.body;

    const currentDate = new Date().toISOString().split('T')[0];

    const sql = `UPDATE final_settlements SET 
        status = 'Paid', 
        payment_date = ?, 
        payment_reference = ?,
        updated_at = ?
        WHERE exit_id = ?`;

    db.run(sql, [currentDate, payment_reference, new Date().toISOString(), id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Settlement marked as paid' });
    });
});

// Send Settlement to Employee (Email notification)
router.post('/:id/settlement/notify', (req, res) => {
    const { id } = req.params;

    // Get settlement and employee details
    const sql = `SELECT fs.*, employees.name, employees.email, exits.lwd_approved
                 FROM final_settlements fs
                 LEFT JOIN exits ON fs.exit_id = exits.id
                 LEFT JOIN employees ON exits.employee_id = employees.id
                 WHERE fs.exit_id = ?`;

    db.get(sql, [id], (err, settlement: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!settlement) return res.status(404).json({ error: 'Settlement not found' });

        // TODO: Implement email sending logic here
        // For now, just log and return success
        console.log(`Sending settlement email to ${settlement.email}:
            Employee: ${settlement.name}
            Net Settlement: ₹${settlement.net_settlement}
            Expected Payment: ${settlement.lwd_approved || 'TBD'}
        `);

        res.json({
            message: 'Settlement notification sent successfully',
            email: settlement.email,
            net_amount: settlement.net_settlement
        });
    });
});

export default router;
