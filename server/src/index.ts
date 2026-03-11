import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import exitRoutes from './routes/exit';
import employeeRoutes from './routes/employee';
import researchRoutes from './routes/research';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(helmet());
app.use(cors());
app.use(express.json());

// API Routes
import onboardingRoutes from './routes/onboarding';

import talentRoutes from './routes/talent';
import probationRoutes from './routes/probation';

app.use('/api', apiRoutes);
app.use('/api/exit', exitRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/talent', talentRoutes);
app.use('/api/probation', probationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
