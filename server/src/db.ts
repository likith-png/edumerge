import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';

const db = new sqlite3.Database('./hrms.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initTables();
  }
});

function initTables() {
  db.serialize(() => {
    // Employees Table (Mock for now to support Exits)
    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      department TEXT NOT NULL,
      joining_date TEXT
    )`);

    // Exits Table
    db.run(`CREATE TABLE IF NOT EXISTS exits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      resignation_date TEXT NOT NULL,
      resignation_type TEXT DEFAULT 'Voluntary', -- Voluntary, Contract End, Termination, Retirement
      reason TEXT NOT NULL,
      lwd_proposed TEXT NOT NULL,
      lwd_approved TEXT,
      notice_period_end TEXT,
      is_deferrable INTEGER DEFAULT 0,
      deferment_date TEXT,
      attachment_url TEXT,
      status TEXT DEFAULT 'Pending',
      comments TEXT,
      successor_id INTEGER,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

    // Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exit_id INTEGER NOT NULL,
      action TEXT NOT NULL, -- Submitted, Approved, Rejected, Modified, Deferred
      performed_by TEXT, -- User ID or Name
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT,
      FOREIGN KEY (exit_id) REFERENCES exits (id)
    )`);

    // Migration for existing exits table (idempotent)
    const migrationSql = [
      "ALTER TABLE exits ADD COLUMN resignation_type TEXT DEFAULT 'Voluntary'",
      "ALTER TABLE exits ADD COLUMN notice_period_end TEXT",
      "ALTER TABLE exits ADD COLUMN is_deferrable INTEGER DEFAULT 0",
      "ALTER TABLE exits ADD COLUMN deferment_date TEXT",
      "ALTER TABLE exits ADD COLUMN attachment_url TEXT",
      "ALTER TABLE exits ADD COLUMN successor_id INTEGER",
      "ALTER TABLE exits ADD COLUMN approval_stage TEXT DEFAULT 'Pending'",
      "ALTER TABLE exits ADD COLUMN current_approver_role TEXT",
      "ALTER TABLE exits ADD COLUMN shortfall_days INTEGER DEFAULT 0",
      "ALTER TABLE exits ADD COLUMN buyout_amount REAL DEFAULT 0",
      "ALTER TABLE exits ADD COLUMN waiver_requested INTEGER DEFAULT 0",
      "ALTER TABLE exits ADD COLUMN waiver_reason TEXT",
      "ALTER TABLE exits ADD COLUMN waiver_approved INTEGER DEFAULT 0",
      "ALTER TABLE handover_items ADD COLUMN proof_url TEXT",
      "ALTER TABLE handover_items ADD COLUMN last_updated TEXT",
      "ALTER TABLE exits ADD COLUMN interview_status TEXT DEFAULT 'Pending'", // Pending, Completed
      "ALTER TABLE exits ADD COLUMN interview_mode TEXT DEFAULT 'Self'", // Self, HR, Hybrid
      "ALTER TABLE exits ADD COLUMN risk_rating TEXT DEFAULT 'Low'", // Low, Medium, High
      "ALTER TABLE exits ADD COLUMN hr_notes TEXT",
      // Settlement-related fields in exits table
      "ALTER TABLE exits ADD COLUMN settlement_eligible INTEGER DEFAULT 0",
      "ALTER TABLE exits ADD COLUMN settlement_status TEXT DEFAULT 'Not Started'", // Not Started, In Progress, Completed
      "ALTER TABLE exits ADD COLUMN handover_completion_date TEXT",
      "ALTER TABLE exits ADD COLUMN noc_completion_date TEXT",
      // Comprehensive settlement fields for final_settlements table
      "ALTER TABLE final_settlements ADD COLUMN employee_id INTEGER",
      // Employee data for calculations  
      "ALTER TABLE final_settlements ADD COLUMN monthly_salary REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN years_of_service REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN joining_date TEXT",
      // Leave encashment
      "ALTER TABLE final_settlements ADD COLUMN pending_leaves REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN leave_encashment REAL DEFAULT 0",
      // Bonus
      "ALTER TABLE final_settlements ADD COLUMN bonus REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN bonus_remarks TEXT",
      // Gratuity
      "ALTER TABLE final_settlements ADD COLUMN gratuity_eligible INTEGER DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN gratuity REAL DEFAULT 0",
      // Statutory (PF/ESI)
      "ALTER TABLE final_settlements ADD COLUMN pf_amount REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN esi_amount REAL DEFAULT 0",
      // Other dues and deductions
      "ALTER TABLE final_settlements ADD COLUMN other_dues REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN other_dues_remarks TEXT",
      "ALTER TABLE final_settlements ADD COLUMN notice_shortfall_deduction REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN advance_deductions REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN other_deductions REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN deduction_remarks TEXT",
      // Settlement summary
      "ALTER TABLE final_settlements ADD COLUMN gross_settlement REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN total_deductions REAL DEFAULT 0",
      "ALTER TABLE final_settlements ADD COLUMN net_settlement REAL DEFAULT 0",
      // Workflow & approval
      "ALTER TABLE final_settlements ADD COLUMN calculated_by INTEGER",
      "ALTER TABLE final_settlements ADD COLUMN calculated_date TEXT",
      "ALTER TABLE final_settlements ADD COLUMN approved_by INTEGER",
      "ALTER TABLE final_settlements ADD COLUMN approved_date TEXT",
      "ALTER TABLE final_settlements ADD COLUMN payment_reference TEXT",
      "ALTER TABLE final_settlements ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE final_settlements ADD COLUMN updated_at TEXT DEFAULT CURRENT_TIMESTAMP"
    ];

    migrationSql.forEach(sql => {
      db.run(sql, (err) => {
        // Ignore errors if columns already exist
        if (err && !err.message.includes("duplicate column name")) {
          // console.error("Migration warning:", err.message);
        }
      });
    });

    // Handover Items Table
    db.run(`CREATE TABLE IF NOT EXISTS handover_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exit_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL, -- Asset, Document, Knowledge, Access
      status TEXT DEFAULT 'Pending', -- Pending, Completed, Verified
      assigned_to INTEGER, -- Employee ID of successor
      proof_url TEXT,
      last_updated TEXT,
      FOREIGN KEY (exit_id) REFERENCES exits (id)
    )`);

    // NOC Clearances Table
    db.run(`CREATE TABLE IF NOT EXISTS noc_clearances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exit_id INTEGER NOT NULL,
      department TEXT NOT NULL, -- IT, Library, Finance, Admin
      status TEXT DEFAULT 'Pending', -- Pending, Cleared, Rejected
      remarks TEXT,
      cleared_by INTEGER,
      FOREIGN KEY (exit_id) REFERENCES exits (id)
    )`);

    // Exit Interviews Table
    db.run(`CREATE TABLE IF NOT EXISTS exit_interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exit_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      category TEXT DEFAULT 'General', -- new column
      answer TEXT,
      rating INTEGER,
      FOREIGN KEY (exit_id) REFERENCES exits (id)
    )`);

    // Final Settlements Table
    db.run(`CREATE TABLE IF NOT EXISTS final_settlements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exit_id INTEGER NOT NULL,
      salary_due REAL DEFAULT 0,
      leave_encashment REAL DEFAULT 0,
      bonus REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      net_payable REAL DEFAULT 0,
      status TEXT DEFAULT 'Pending', -- Pending, Processed, Paid
      payment_date TEXT,
      remarks TEXT,
      FOREIGN KEY (exit_id) REFERENCES exits (id)
    )`);

    // Assets Table (Mock Asset Management Module)
    db.run(`CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- Laptop, Peripheral, Access, vehicle
      serial_number TEXT UNIQUE,
      assigned_to INTEGER, -- Employee ID
      assigned_date TEXT,
      FOREIGN KEY (assigned_to) REFERENCES employees (id)
    )`);

    // Seed some dummy employees if empty
    db.get("SELECT count(*) as count FROM employees", (err, row: any) => {
      if (err) {
        console.error("Error checking employees table", err);
        return;
      }
      if (row.count === 0) {
        console.log("Seeding dummy employees...");
        const stmt = db.prepare("INSERT INTO employees (name, email, role, department, joining_date, status, designation) VALUES (?, ?, ?, ?, ?, ?, ?)");
        stmt.run("Ms. Reshma Binu Prasad", "reshma@example.com", "Faculty", "Computer Science", "2024-01-10", "Probation", "Asst. Professor");
        stmt.run("Ms. Sanchaiyata Majumdar", "sanchaiyata@example.com", "Faculty", "Computer Science", "2024-01-15", "Probation", "Lecturer");
        stmt.run("Dr. R Sedhunivas", "sedhunivas@example.com", "Admin", "Administration", "2023-11-20", "Probation", "Registrar");
        stmt.run("Dr. Ranjita Saikia", "ranjita@example.com", "Faculty", "Science", "2023-10-01", "Probation", "Professor");
        stmt.run("Mr. Manjit Singh", "manjit@example.com", "Faculty", "Physical Education", "2024-02-01", "Probation", "Instructor");
        stmt.run("Mr. Edwin Vimal A", "edwin@example.com", "Faculty", "Mathematics", "2023-12-15", "Probation", "Lecturer");
        stmt.finalize();

        // Seed Assets for first employee (Ms. Reshma Binu Prasad, id = 1)
        console.log("Seeding dummy assets...");
        const assetStmt = db.prepare("INSERT INTO assets (name, type, serial_number, assigned_to, assigned_date) VALUES (?, ?, ?, ?, ?)");
        assetStmt.run("MacBook Pro M2", "Laptop", "MBP-2023-001", 1, "2020-07-01");
        assetStmt.run("Office Key Card", "Access", "KC-8821", 1, "2020-07-01");
        assetStmt.finalize();
      }
    });


    // Configurations Table (Key-Value Store for settings)
    db.run(`CREATE TABLE IF NOT EXISTS configurations (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed Default Exit Config if missing
    db.get(`SELECT count(*) as count FROM configurations WHERE key = 'exit_config'`, (err, row: any) => {
      if (!row || row.count === 0) {
        const defaultConfig = {
          general: {
            enableExitManagement: true,
            allowedEmployeeTypes: { teaching: true, nonTeaching: true, contract: true },
            allowedExitTypes: { voluntary: true, contractEnd: true, retirement: true, termination: true },
            minServicePeriod: 6
          },
          noticePeriod: {
            teachingDays: 90, nonTeachingDays: 30, contractDays: 15,
            allowBuyout: true, allowEarlyRelease: true, allowExtension: false, allowLeave: true, maxLeaveDays: 5
          },
          workflow: {
            type: 'Sequential',
            approvalMatrix: { teaching: ['HoD', 'Principal', 'HR'], nonTeaching: ['Manager', 'HR'] },
            optionalManagementApproval: false, slaDays: 3, autoApproveBreach: false
          },
          academic: {
            restrictExamPeriods: true, restrictAdmissionCycles: true, restrictAudits: false,
            principalOverride: true, mandatoryReplacement: true
          },
          handover: {
            enabled: true,
            mandatoryFor: { teaching: true, admin: true },
            approvalRequired: { successor: true, hod: true, hr: false }
          },
          noc: {
            enabled: true,
            departments: {
              library: true, it: true, assets: true, inventory: true,
              finance: true, hostel: false, transport: false
            },
            slaDays: 2, autoClearNoAssets: true,
            systemBehavior: { autoCreateTasks: true, escalateOverdue: true }
          },
          interview: {
            mandatory: true, mode: 'Hybrid', anonymous: false, hrReviewMandatory: true
          },
          settlement: {
            payrollIntegration: true,
            components: { salaryLwd: true, encashment: true, deductions: true, gratuity: true },
            approvalLevels: { hr: true, finance: true, management: false }
          },
          documents: {
            autoGenerate: { relievingLetter: true, experienceCert: true, serviceCert: true },
            digitalSignature: true, manualUpload: false
          },
          access: {
            autoRevoke: true, timing: 'On LWD', auditRetention: 5, complianceMode: true
          },
          notifications: {
            channels: { email: true, inApp: true, sms: false },
            alerts: { submitted: true, approvalPending: true, handoverIncomplete: true, nocOverdue: true }
          },
          integrations: {
            orgStructure: true, academicCalendar: true, payroll: true, accessManagement: true, workforcePlanning: true
          }
        };
        const stmt = db.prepare("INSERT INTO configurations (key, value) VALUES (?, ?)");
        stmt.run('exit_config', JSON.stringify(defaultConfig));
        stmt.finalize();
      }
    });


    // Onboarding Workflow Table
    db.run(`CREATE TABLE IF NOT EXISTS onboarding_workflow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      current_stage INTEGER DEFAULT 1, -- 1: Docs, 2: Verification, 3: Assets, 4: Training, 5: Probation
      stage_status TEXT DEFAULT 'Pending', -- Pending, In Progress, Completed, Rejected
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

    // Onboarding Documents Table
    db.run(`CREATE TABLE IF NOT EXISTS onboarding_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      document_name TEXT NOT NULL,
      file_url TEXT,
      status TEXT DEFAULT 'Pending', -- Pending, Uploaded, Verified, Rejected
      remarks TEXT,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

    // Onboarding Training Progress Table
    db.run(`CREATE TABLE IF NOT EXISTS onboarding_training (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      module_name TEXT NOT NULL,
      status TEXT DEFAULT 'Pending', -- Pending, Completed
      completion_date TEXT,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

    // Migration to add status to employees table if not exists
    const employeeMigration = [
      "ALTER TABLE employees ADD COLUMN status TEXT DEFAULT 'Active'",
      "ALTER TABLE employees ADD COLUMN designation TEXT",
      "ALTER TABLE employees ADD COLUMN institution TEXT"
    ];

    employeeMigration.forEach(sql => {
      db.run(sql, (err) => {
        if (err && !err.message.includes("duplicate column name")) {
          // console.error("Employee Migration warning:", err.message);
        }
      });
    });

    // Probation Reviews Table
    db.run(`CREATE TABLE IF NOT EXISTS probation_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      review_cycle TEXT NOT NULL, -- 30_Day, 60_Day, 90_Day, Final
      status TEXT DEFAULT 'Pending', -- Pending, Submitted, Reviewed
      manager_feedback TEXT,
      manager_rating INTEGER, -- 1-5
      hr_comments TEXT,
      review_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

    // Probation Outcomes Table
    db.run(`CREATE TABLE IF NOT EXISTS probation_outcomes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      decision TEXT NOT NULL, -- Confirmed, Extended, PIP, Terminated
      extended_until TEXT,
      pip_reason TEXT,
      letter_generated INTEGER DEFAULT 0,
      decision_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
    )`);

  });
}

export default db;
