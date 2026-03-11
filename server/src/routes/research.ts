import { Router } from 'express';
import db from '../db';

const router = Router();

// Submit a new paper (Faculty)
router.post('/submit', (req, res) => {
    const { employee_id, title, type, journal_name, impact_factor, authorship, date, submission_mode, attachment_path } = req.body;
    const sql = `INSERT INTO research_publications (employee_id, title, type, journal_name, impact_factor, authorship, date, status, submission_mode, attachment_path) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending Approval', ?, ?)`;
    const params = [employee_id || 1, title, type, journal_name, impact_factor, authorship, date, submission_mode || 'Online', attachment_path];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Publication submitted successfully', id: this.lastID });
    });
});

// Get papers for the logged-in employee (Faculty)
router.get('/my/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    db.all(`SELECT * FROM research_publications WHERE employee_id = ? ORDER BY date DESC`, [employeeId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Get all papers (R&D / HR / Admin)
router.get('/all', (req, res) => {
    const sql = `
        SELECT rp.*, e.name as employee_name, e.department, e.designation 
        FROM research_publications rp
        JOIN employees e ON rp.employee_id = e.id
        ORDER BY rp.created_at DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
    });
});

// Get analytics (HR)
router.get('/analytics', (req, res) => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'Pending Approval' THEN 1 ELSE 0 END) as pending
        FROM research_publications
    `;
    db.get(sql, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: row });
    });
});

// Review a paper (R&D)
router.patch('/review/:id', (req, res) => {
    const { id } = req.params;
    const { status, reviewer_comments, approved_by } = req.body;
    const sql = `UPDATE research_publications SET status = ?, reviewer_comments = ?, approved_by = ?, approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    db.run(sql, [status, reviewer_comments, approved_by, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Publication ${status} successfully` });
    });
});

export default router;
