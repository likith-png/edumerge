import { Router } from 'express';

const router = Router();

router.get('/modules', (req, res) => {
    res.json({
        message: "Modules list",
        modules: [
            "Onboarding",
            "Appraisal",
            "Feedback",
            "Engagement & Culture",
            "Exit Management",
            "Organisation Structure",
            "Policy (Videos/Cultural/POSH)",
            "Learning & Development"
        ]
    });
});

export default router;
