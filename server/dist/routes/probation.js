"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// 1. Get Probation Dashboard Stats & List
router.get('/dashboard', (req, res) => {
    const sql = `
        SELECT 
            e.id, e.name, e.department, e.designation, e.joining_date, e.status,
            pr.review_cycle, pr.status as review_status, pr.review_date
        FROM employees e
        LEFT JOIN probation_reviews pr ON e.id = pr.employee_id
        WHERE e.status = 'Probation' OR e.status = 'Probation Extended' OR e.status = 'PIP' OR e.status = 'Confirmed'
    `;
    db_1.default.all(sql, [], (err, rows) => {
        if (err) {
            console.error("SQL Error in probation dashboard:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        try {
            const now = new Date();
            const pendingReviews = (rows || []).filter(r => {
                if (!r.joining_date)
                    return false;
                const joinDate = new Date(r.joining_date);
                if (isNaN(joinDate.getTime()))
                    return false;
                const diffDays = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 3600 * 24));
                // Simple logic: if approaching 30, 60, or 90 days and no review, it's pending/due
                return (diffDays >= 25 && diffDays <= 35) || (diffDays >= 55 && diffDays <= 65) || (diffDays >= 85);
            });
            const stats = {
                totalProbation: rows ? rows.length : 0,
                reviewsDue: pendingReviews.length,
                highRisk: 0, // Mock
                confirmedThisMonth: 0 // Mock
            };
            res.json({ stats, employees: rows || [] });
        }
        catch (jsErr) {
            console.error("JS Error in probation dashboard:", jsErr);
            res.status(500).json({ error: "Internal server error during data processing" });
        }
    });
});
// 2. Submit Manager Review
router.post('/review', (req, res) => {
    const { employee_id, review_cycle, manager_feedback, manager_rating } = req.body;
    const sql = `INSERT INTO probation_reviews (employee_id, review_cycle, status, manager_feedback, manager_rating, review_date) 
                 VALUES (?, ?, 'Submitted', ?, ?, CURRENT_DATE)`;
    db_1.default.run(sql, [employee_id, review_cycle, manager_feedback, manager_rating], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Review submitted successfully" });
    });
});
// 3. HR Decision & Outcome
router.post('/decision', (req, res) => {
    const { employee_id, decision, extended_until, pip_reason } = req.body;
    const sql = `INSERT INTO probation_outcomes (employee_id, decision, extended_until, pip_reason, letter_generated) 
                 VALUES (?, ?, ?, ?, 1)`;
    db_1.default.run(sql, [employee_id, decision, extended_until, pip_reason], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        // Update Employee Status based on decision
        let newStatus = 'Active';
        if (decision === 'Extended')
            newStatus = 'Probation Extended';
        if (decision === 'Terminated')
            newStatus = 'Terminated';
        if (decision === 'PIP')
            newStatus = 'PIP';
        db_1.default.run("UPDATE employees SET status = ? WHERE id = ?", [newStatus, employee_id], (updateErr) => {
            if (updateErr)
                console.error("Failed to update employee status", updateErr);
        });
        res.json({ message: "Decision recorded and status updated", letterUrl: "http://mock-letter-url.com/pdf" });
    });
});
exports.default = router;
