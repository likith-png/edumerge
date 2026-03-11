"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const exit_1 = __importDefault(require("./routes/exit"));
const employee_1 = __importDefault(require("./routes/employee"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
const onboarding_1 = __importDefault(require("./routes/onboarding"));
const talent_1 = __importDefault(require("./routes/talent"));
const probation_1 = __importDefault(require("./routes/probation"));
app.use('/api', api_1.default);
app.use('/api/exit', exit_1.default);
app.use('/api/employee', employee_1.default);
app.use('/api/onboarding', onboarding_1.default);
app.use('/api/talent', talent_1.default);
app.use('/api/probation', probation_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
