import { Router } from 'express';
import db from '../db';
import crypto from 'crypto';

const router = Router();

// 1. Get consolidation configuration
router.get('/config', (req, res) => {
    db.get("SELECT value FROM academic_config WHERE key = 'one_time_send'", (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) {
            return res.json({
                oneTimeSendEnabled: false,
                sendTime: "19:00",
                appliesTo: ["homework", "classwork"]
            });
        }
        try {
            res.json(JSON.parse(row.value));
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse configuration' });
        }
    });
});

// 2. Save consolidation configuration
router.post('/config', (req, res) => {
    const config = req.body;
    db.run("INSERT OR REPLACE INTO academic_config (key, value, updated_at) VALUES ('one_time_send', ?, CURRENT_TIMESTAMP)", [JSON.stringify(config)], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Configuration saved successfully', data: config });
    });
});

// 3. Get all recipient groups
router.get('/groups', (req, res) => {
    db.all("SELECT * FROM academic_groups WHERE is_active = 1", [], (err, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        const data = rows.map(r => ({
            ...r,
            students: JSON.parse(r.students),
            teachers: JSON.parse(r.teachers)
        }));
        res.json({ data });
    });
});

// 4. Create new communication
router.post('/communications', (req, res) => {
    const { type, title, description, subject, senderId, senderName, recipientGroups, deadline } = req.body;
    
    if (!title || !type || !recipientGroups || recipientGroups.length === 0 || !deadline) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const uuid = `comm-${crypto.randomUUID()}`;

    // Get configuration to check oneTimeSend settings
    db.get("SELECT value FROM academic_config WHERE key = 'one_time_send'", (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        
        let oneTimeSendEnabled = false;
        let sendTime = "19:00";
        let appliesTo: string[] = [];
        
        if (row) {
            try {
                const config = JSON.parse(row.value);
                oneTimeSendEnabled = config.oneTimeSendEnabled;
                sendTime = config.sendTime;
                appliesTo = config.appliesTo || [];
            } catch (e) {
                console.error("Failed to parse config", e);
            }
        }

        let sentTime = new Date().toISOString();
        let isScheduled = false;

        if (oneTimeSendEnabled && appliesTo.includes(type)) {
            const [hour, minute] = sendTime.split(':').map(Number);
            const scheduledDate = new Date();
            scheduledDate.setHours(hour, minute, 0, 0);

            // If consolidated send time has already passed today, schedule for tomorrow
            if (scheduledDate.getTime() < Date.now()) {
                scheduledDate.setDate(scheduledDate.getDate() + 1);
            }
            sentTime = scheduledDate.toISOString();
            isScheduled = true;
        }

        const sql = `INSERT INTO academic_communications 
                     (uuid, type, title, description, subject, sender_id, sender_name, recipient_groups, sent_time, deadline, read_by) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const params = [
            uuid,
            type,
            title,
            description || '',
            subject,
            senderId,
            senderName,
            JSON.stringify(recipientGroups),
            sentTime,
            new Date(deadline).toISOString(),
            JSON.stringify([]) // readBy starts empty
        ];

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                message: isScheduled ? `Scheduled successfully for ${sendTime}` : 'Communication sent successfully',
                id: this.lastID,
                uuid,
                isScheduled,
                scheduledTime: isScheduled ? sentTime : null
            });
        });
    });
});

// 5. Get all communications (supports filters for role and persona)
router.get('/communications', (req, res) => {
    const { role, studentId } = req.query;
    
    // Standard SELECT
    const sql = `SELECT * FROM academic_communications WHERE is_archived = 0 ORDER BY sent_time DESC`;

    db.all(sql, [], (err, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        
        let data = rows.map(r => ({
            ...r,
            recipient_groups: JSON.parse(r.recipient_groups),
            read_by: JSON.parse(r.read_by)
        }));

        const now = new Date().getTime();

        // If STUDENT role, filter out scheduled communications that haven't posted yet
        // and only keep communications addressed to their groups
        if (role === 'STUDENT' && studentId) {
            // Find which groups this student belongs to
            db.all("SELECT uuid, students FROM academic_groups", [], (grpErr, groups: any[]) => {
                if (grpErr) return res.status(500).json({ error: grpErr.message });
                
                const studentGroups = groups.filter(g => {
                    try {
                        const students = JSON.parse(g.students);
                        return students.some((s: any) => s.id === studentId);
                    } catch (e) {
                        return false;
                    }
                }).map(g => g.uuid);

                // Filter communications
                data = data.filter(c => {
                    const isReleased = new Date(c.sent_time).getTime() <= now;
                    const isForGroup = c.recipient_groups.some((rg: any) => studentGroups.includes(rg.groupId));
                    return isReleased && isForGroup;
                });

                return res.json({ data });
            });
        } else {
            // If teacher/management, they can see all (including future scheduled ones)
            res.json({ data });
        }
    });
});

// 6. Get single communication details
router.get('/communications/:uuid', (req, res) => {
    const { uuid } = req.params;
    db.get("SELECT * FROM academic_communications WHERE uuid = ?", [uuid], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Communication not found' });
        
        res.json({
            data: {
                ...row,
                recipient_groups: JSON.parse(row.recipient_groups),
                read_by: JSON.parse(row.read_by)
            }
        });
    });
});

// 7. Update communication (only if deadline not passed)
router.patch('/communications/:uuid', (req, res) => {
    const { uuid } = req.params;
    const { title, description, deadline } = req.body;

    db.get("SELECT deadline FROM academic_communications WHERE uuid = ?", [uuid], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Communication not found' });

        const deadlineTime = new Date(row.deadline).getTime();
        if (deadlineTime < Date.now()) {
            return res.status(400).json({ error: 'Cannot edit communication: deadline has passed' });
        }

        const sql = `UPDATE academic_communications SET title = ?, description = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP WHERE uuid = ?`;
        db.run(sql, [title, description, new Date(deadline).toISOString(), uuid], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Communication updated successfully' });
        });
    });
});

// 8. Delete communication
router.delete('/communications/:uuid', (req, res) => {
    const { uuid } = req.params;
    db.run("DELETE FROM academic_communications WHERE uuid = ?", [uuid], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Communication deleted successfully' });
    });
});

// 9. Mark as read (for students)
router.patch('/communications/:uuid/read', (req, res) => {
    const { uuid } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({ error: 'Student ID is required' });
    }

    db.get("SELECT read_by FROM academic_communications WHERE uuid = ?", [uuid], (err, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Communication not found' });

        try {
            const readBy = JSON.parse(row.read_by);
            if (readBy.some((r: any) => r.studentId === studentId)) {
                return res.json({ message: 'Already marked as read' });
            }

            readBy.push({ studentId, readTime: new Date().toISOString() });

            db.run("UPDATE academic_communications SET read_by = ? WHERE uuid = ?", [JSON.stringify(readBy), uuid], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: updateErr.message });
                res.json({ message: 'Marked as read successfully', readBy });
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to process read status' });
        }
    });
});

// 10. Get audit / activity logs (Management view)
router.get('/logs', (req, res) => {
    db.all("SELECT * FROM academic_communications ORDER BY sent_time DESC", [], (err, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const logs = rows.map(r => ({
            id: r.id,
            uuid: r.uuid,
            type: r.type,
            title: r.title,
            description: r.description,
            subject: r.subject,
            senderName: r.sender_name,
            senderId: r.sender_id,
            sentTime: r.sent_time,
            deadline: r.deadline,
            recipientGroups: JSON.parse(r.recipient_groups),
            readByCount: JSON.parse(r.read_by).length
        }));
        
        res.json({ data: logs });
    });
});

// 11. Generate academic reports (class-wise statistics)
router.get('/reports', (req, res) => {
    db.all("SELECT * FROM academic_communications", [], (err, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // We will parse all communications and build class-wise and subject-wise counts
        // Format of Class-Wise summary report:
        // {
        //   "Class 10-A": {
        //      subjects: { "Mathematics": 12, "Science": 8 },
        //      total: 20
        //   }
        // }
        const classWise: Record<string, { subjects: Record<string, number>, total: number }> = {};
        const subjectWise: Record<string, number> = {};
        const departmentWise: Record<string, number> = {
            "Science": 0,
            "Mathematics": 0,
            "Languages": 0
        };

        rows.forEach(r => {
            const groups = JSON.parse(r.recipient_groups);
            const subject = r.subject;
            
            // Map subjects to simple departments
            let dept = "Science";
            if (subject === "Mathematics") dept = "Mathematics";
            else if (subject === "English" || subject === "Hindi") dept = "Languages";

            // Count for subjectWise
            subjectWise[subject] = (subjectWise[subject] || 0) + 1;
            
            // Count for departmentWise
            departmentWise[dept] = (departmentWise[dept] || 0) + 1;

            groups.forEach((g: any) => {
                const groupName = g.groupName;
                if (!classWise[groupName]) {
                    classWise[groupName] = { subjects: {}, total: 0 };
                }
                
                classWise[groupName].subjects[subject] = (classWise[groupName].subjects[subject] || 0) + 1;
                classWise[groupName].total += 1;
            });
        });

        res.json({
            data: {
                classWise,
                subjectWise,
                departmentWise,
                grandTotal: rows.length
            }
        });
    });
});

// 12. Helper to fetch subjects from teacher profile (auto-filled value)
router.get('/subjects/:teacherId', (req, res) => {
    const { teacherId } = req.params;
    // Mock map representing the auto-filled subject from profile details
    if (teacherId === 'hod-001') {
        return res.json({ subjects: ["Science", "Physics"] });
    }
    // Default teacher subject is Mathematics
    res.json({ subjects: ["Mathematics"] });
});

export default router;
