import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExitManagement from './pages/ExitManagement';
import HRDashboard from './pages/HRDashboard';
import LearningDevelopment from './pages/LearningDevelopment';
import TalentDashboard from './pages/TalentDashboard';
import ProbationDashboard from './pages/ProbationDashboard';
import OnboardingProDashboard from './pages/OnboardingProDashboard';
import OnboardingProPortal from './pages/OnboardingProPortal';
import ProbationConfig from './pages/ProbationConfig';
import ExitConfig from './pages/ExitConfig';
import PolicyGuides from './pages/PolicyGuides';
import OrganisationStructure from './pages/OrganisationStructure';
import EngagementCulture from './pages/EngagementCulture';
import TaskManagement from './pages/TaskManagement';
import Feedback from './pages/Feedback';
import CertificatesPrototype from './pages/CertificatesPrototype';
import LMSAnalytics from './pages/LMSAnalytics';
import SkillPathways from './pages/SkillPathways';
import AppraisalFlowView from './pages/AppraisalFlowView';
import AppraisalSetupWizard from './pages/AppraisalSetupWizard';
import KRADefinitionEngine from './pages/KRADefinitionEngine';
import KRAKPIApprovalDashboard from './pages/KRAKPIApprovalDashboard';
import GoalSetting from './pages/GoalSetting';
import TeacherAppraisalForm from './pages/TeacherAppraisalForm';
import KPIConfiguration from './pages/KPIConfiguration';
import HODReviewForm from './pages/HODReviewForm';
import AppraisalAnalytics from './pages/AppraisalAnalytics';
import AppraisalWorkflowHub from './pages/AppraisalWorkflowHub';
import AppraisalCycleSetup from './pages/AppraisalCycleSetup';
import PerformanceTrackingDashboard from './pages/PerformanceTrackingDashboard';
import GoalApprovalDashboard from './pages/GoalApprovalDashboard';
import Feedback360Workflow from './pages/Feedback360Workflow';
import CalibrationDashboard from './pages/CalibrationDashboard';
import MidYearReview from './pages/MidYearReview';
import StaffPortfolio from './pages/StaffPortfolio';
import StaffPortfolioDetail from './pages/StaffPortfolioDetail';
import ManagerTeamDashboard from './pages/ManagerTeamDashboard';
import CapacityIntelligenceSystem from './pages/CapacityIntelligenceSystem';
import ReportsDashboard from './pages/ReportsDashboard';
import LessonPlan from './pages/LessonPlan';
import AlumniPortal from './pages/AlumniPortal';
import LeaveDashboard from './pages/LeaveDashboard';
import LeaveApprovals from './pages/LeaveApprovals';
import LeaveConfiguration from './pages/LeaveConfiguration';
import YearlyLeaveBook from './pages/YearlyLeaveBook';
import ResearchPublication from './pages/ResearchPublication';
import ControlTower from './pages/ControlTower';

import { PersonaProvider } from './contexts/PersonaContext';

function App() {
  return (
    <PersonaProvider>
      <Router basename="/V2/HRMS_Demo">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding-pro" element={<OnboardingProDashboard />} />
          <Route path="/onboarding-pro/portal" element={<OnboardingProPortal />} />
          <Route path="/feedback" element={<Feedback />} />

          <Route path="/exit" element={<ExitManagement />} />
          <Route path="/org-structure" element={<OrganisationStructure />} />
          <Route path="/engagement" element={<EngagementCulture />} />
          <Route path="/policy" element={<PolicyGuides />} />
          <Route path="/learning-development" element={<LearningDevelopment />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/talent-dashboard" element={<TalentDashboard />} />
          <Route path="/capacity-intelligence" element={<CapacityIntelligenceSystem />} />
          <Route path="/reports" element={<ReportsDashboard />} />
          <Route path="/probation-dashboard" element={<ProbationDashboard />} />
          <Route path="/lesson-plan" element={<LessonPlan />} />
          <Route path="/task-management" element={<TaskManagement />} />
          <Route path="/probation/config" element={<ProbationConfig />} />
          <Route path="/exit/config" element={<ExitConfig />} />
          <Route path="/certificates" element={<CertificatesPrototype />} />
          <Route path="/lms-analytics" element={<LMSAnalytics />} />
          <Route path="/skill-pathways" element={<SkillPathways />} />
          <Route path="/appraisal" element={<AppraisalFlowView />} />
          <Route path="/appraisal/setup-wizard" element={<AppraisalSetupWizard />} />
          <Route path="/appraisal/workflow" element={<AppraisalWorkflowHub />} />
          <Route path="/appraisal/cycle-setup" element={<AppraisalCycleSetup />} />
          <Route path="/appraisal/tracking" element={<PerformanceTrackingDashboard />} />
          <Route path="/appraisal/goal-approval" element={<GoalApprovalDashboard />} />
          <Route path="/appraisal/feedback360" element={<Feedback360Workflow />} />
          <Route path="/appraisal/calibration" element={<CalibrationDashboard />} />
          <Route path="/appraisal/mid-year" element={<MidYearReview />} />
          <Route path="/staff-portfolio" element={<StaffPortfolio />} />
          <Route path="/staff-portfolio/:staffId" element={<StaffPortfolioDetail />} />
          <Route path="/appraisal/kra" element={<KRADefinitionEngine />} />
          <Route path="/appraisal/kra-kpi-approvals" element={<KRAKPIApprovalDashboard />} />
          <Route path="/appraisal/kpi" element={<KPIConfiguration />} />
          <Route path="/appraisal/goals" element={<GoalSetting />} />
          <Route path="/appraisal/teacher-form" element={<TeacherAppraisalForm />} />
          <Route path="/appraisal/hod-review" element={<HODReviewForm />} />
          <Route path="/manager-dashboard" element={<ManagerTeamDashboard />} />
          <Route path="/appraisal/analytics" element={<AppraisalAnalytics />} />

          {/* Leave Management Module */}
          <Route path="/leave/dashboard" element={<LeaveDashboard />} />
          <Route path="/leave/approvals" element={<LeaveApprovals />} />
          <Route path="/leave/config" element={<LeaveConfiguration />} />
          <Route path="/leave/reports/yearly-book" element={<YearlyLeaveBook />} />

          {/* Alumni Portal */}
          <Route path="/alumni-portal" element={<AlumniPortal />} />

          {/* Research & Publication */}
          <Route path="/research-publication" element={<ResearchPublication />} />

          {/* HRMS Control Tower */}
          <Route path="/control-tower" element={<ControlTower />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </PersonaProvider>
  );
}

export default App;
