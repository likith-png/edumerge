import { Router } from 'express';
import db from '../db';

const router = Router();

// Get all employees
router.get('/', (req, res) => {
    const sql = `SELECT id, name, email, role, department, designation, status FROM employees`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

export default router;
