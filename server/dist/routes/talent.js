"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
router.get('/stats', (req, res) => {
    // 1. Offer -> Confirmation Conversion %
    // Logic: Count employees with status 'Active' vs Total Employees (Active + Onboarding + Exited who dropped early)
    // For simplicity: Active / (Active + Onboarding + Exited < 90 days)
    // 2. Avg Onboarding Duration
    // Logic: Avg time from joining_date to onboarding_workflow.updated_at (where stage=5 and status='Completed')
    // 3. Department-wise Onboarding Time
    // 4. Early Attrition (0-90 Days)
    // Logic: Count exits where (resignation_date - joining_date) <= 90 days
    const queries = {
        totalOnboarded: "SELECT COUNT(*) as count FROM onboarding_workflow WHERE current_stage = 5 AND stage_status = 'Completed'",
        totalInitiated: "SELECT COUNT(*) as count FROM onboarding_workflow",
        // Avg Duration (Mocking logic as we don't have historical completion logs)
        // We'll use a random distribution for demo if real data is missing
        earlyAttrition: `
            SELECT COUNT(*) as count 
            FROM exits ex
            JOIN employees em ON ex.employee_id = em.id
            WHERE (julianday(ex.resignation_date) - julianday(em.joining_date)) <= 90
        `
    };
    db_1.default.serialize(() => {
        const stats = {
            conversionRate: 0,
            avgOnboardingDays: 0,
            earlyAttritionCount: 0,
            departmentAvgTime: []
        };
        db_1.default.get(queries.totalOnboarded, (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "DB Error" });
            }
            const completed = (row === null || row === void 0 ? void 0 : row.count) || 0;
            db_1.default.get(queries.totalInitiated, (err, row) => {
                const total = (row === null || row === void 0 ? void 0 : row.count) || 1; // avoid division by zero
                stats.conversionRate = Math.round((completed / total) * 100) || 85; // Default mock if 0
                db_1.default.get(queries.earlyAttrition, (err, row) => {
                    stats.earlyAttritionCount = (row === null || row === void 0 ? void 0 : row.count) || 0;
                    // Mocking complex aggregations for now as we lack sufficient seed data
                    stats.avgOnboardingDays = 14;
                    stats.departmentAvgTime = [
                        { department: 'Engineering', days: 12 },
                        { department: 'Sales', days: 18 },
                        { department: 'Product', days: 15 },
                        { department: 'HR', days: 10 },
                        { department: 'Marketing', days: 14 }
                    ];
                    // Talent Acquisition Mock Data
                    stats.recruitment = {
                        openPositions: 12,
                        timeToHire: 28, // days
                        offersReleased: 45,
                        offersAccepted: 38,
                        pipeline: [
                            { stage: 'Applied', count: 450 },
                            { stage: 'Screened', count: 210 },
                            { stage: 'Interviewed', count: 85 },
                            { stage: 'Offered', count: 45 },
                            { stage: 'Hired', count: 38 }
                        ],
                        sources: [
                            { name: 'LinkedIn', value: 45 },
                            { name: 'Referral', value: 30 },
                            { name: 'Career Page', value: 15 },
                            { name: 'Agency', value: 10 }
                        ]
                    };
                    res.json(stats);
                });
            });
        });
    });
});
exports.default = router;
