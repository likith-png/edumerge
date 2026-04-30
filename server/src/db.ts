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
      joining_date TEXT,
      salary REAL DEFAULT 0
    )`);

    // Exits Table
    db.run(`CREATE TABLE IF NOT EXISTS exits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      resignation_date TEXT NOT NULL,
      resignation_type TEXT DEFAULT 'Voluntary', -- Voluntary, Contract End, Termination, Retirement, Forced Resignation
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
      "ALTER TABLE exits ADD COLUMN meeting_status TEXT DEFAULT 'Pending'", // Pending, Completed, Waived
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

    // Research Publications Table
    db.run(`CREATE TABLE IF NOT EXISTS research_publications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL, -- Journal, Conference, Book, Book Chapter
      journal_name TEXT,
      impact_factor REAL,
      authorship TEXT NOT NULL, -- Principal, Corresponding, Co-Author
      date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending Approval', -- Draft, Pending Approval, Approved, Rejected
      reviewer_comments TEXT,
      submission_mode TEXT DEFAULT 'Online', -- Online, Offline
      attachment_path TEXT,
      approved_by INTEGER,
      approved_at TEXT,
      issn_isbn TEXT,
      indexing TEXT,
      is_peer_reviewed INTEGER DEFAULT 0,
      ugc_care_listed INTEGER DEFAULT 0,
      citations INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees (id)
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
        const stmt = db.prepare("INSERT INTO employees (name, email, role, department, joining_date, status, designation, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run("Ms. Reshma Binu Prasad", "reshma@example.com", "Faculty", "Computer Science", "2024-01-10", "Probation", "Asst. Professor", 75000);
        stmt.run("Ms. Sanchaiyata Majumdar", "sanchaiyata@example.com", "Faculty", "Computer Science", "2024-01-15", "Probation", "Lecturer", 55000);
        stmt.run("Dr. R Sedhunivas", "sedhunivas@example.com", "Admin", "Administration", "2023-11-20", "Probation", "Registrar", 95000);
        stmt.run("Dr. Ranjita Saikia", "ranjita@example.com", "Faculty", "Science", "2023-10-01", "Probation", "Professor", 120000);
        stmt.run("Mr. Manjit Singh", "manjit@example.com", "Faculty", "Physical Education", "2024-02-01", "Probation", "Instructor", 45000);
        stmt.run("Mr. Edwin Vimal A", "edwin@example.com", "Faculty", "Mathematics", "2023-12-15", "Probation", "Lecturer", 55000);
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

    // Seed Default Onboarding Config if missing 
    db.get(`SELECT count(*) as count FROM configurations WHERE key = "onboarding_stages"`, (err, row: any) => { 
      if (!row || row.count === 0) { 
        const defaultStages = [ 
          { id: 1, name: "Document Submission", sla: 2 }, 
          { id: 2, name: "Verification & BGV", sla: 3 }, 
          { id: 3, name: "Orientation & Training", sla: 5 }, 
          { id: 4, name: "Asset Allocation", sla: 2 }, 
          { id: 5, name: "Final Sign-off", sla: 1 } 
        ]; 
        const defaultSettings = { globalSla: 10, notifyManager: true, allowSelfOnboarding: true }; 
        const stmt = db.prepare("INSERT INTO configurations (key, value) VALUES (?, ?)"); 
        stmt.run("onboarding_stages", JSON.stringify(defaultStages)); 
        stmt.run("onboarding_general_settings", JSON.stringify(defaultSettings)); 
        stmt.finalize(); 
      } 
    }); 

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
              it: true, admin: true, finance: true, hod: true, library: true, payroll: true
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
      "ALTER TABLE employees ADD COLUMN institution TEXT",
      "ALTER TABLE employees ADD COLUMN salary REAL DEFAULT 0",
      "ALTER TABLE research_publications ADD COLUMN issn_isbn TEXT",
      "ALTER TABLE research_publications ADD COLUMN indexing TEXT",
      "ALTER TABLE research_publications ADD COLUMN is_peer_reviewed INTEGER DEFAULT 0",
      "ALTER TABLE research_publications ADD COLUMN ugc_care_listed INTEGER DEFAULT 0",
      "ALTER TABLE research_publications ADD COLUMN citations INTEGER DEFAULT 0"
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

    // Recruitment: Job Openings Table 
    db.run(`CREATE TABLE IF NOT EXISTS job_openings ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title TEXT NOT NULL, 
      department TEXT NOT NULL, 
      designation TEXT, 
      vacancies INTEGER DEFAULT 1, 
      experience_required TEXT, 
      status TEXT DEFAULT "Open", -- Open, Closed, On Hold 
      created_at TEXT DEFAULT CURRENT_TIMESTAMP 
    )`); 

    // Recruitment: Applicants Table 
    db.run(`CREATE TABLE IF NOT EXISTS applicants ( 
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      job_id INTEGER, 
      name TEXT NOT NULL, 
      email TEXT NOT NULL, 
      phone TEXT, 
      education TEXT, 
      experience_years REAL, 
      source TEXT, 
      current_stage TEXT DEFAULT "Applied", -- Applied, Screened, Interviewed, Offered, Hired, Rejected 
      resume_url TEXT, 
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP, 
      FOREIGN KEY (job_id) REFERENCES job_openings (id) 
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

    // ─── Vehicle Management Tables ───────────────────────────────────────────

    // Vehicle Asset Registry
    db.run(`CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_number TEXT UNIQUE NOT NULL,
      vehicle_type TEXT NOT NULL,
      make_model TEXT NOT NULL,
      year INTEGER,
      fuel_type TEXT NOT NULL,
      seating_capacity INTEGER DEFAULT 0,
      ownership_type TEXT DEFAULT 'OWNED',
      status TEXT DEFAULT 'ACTIVE',
      chassis_number TEXT,
      engine_number TEXT,
      purchase_date TEXT,
      campus TEXT DEFAULT 'Main Campus',
      operator_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Vehicle Compliance Documents
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      doc_type TEXT NOT NULL,
      issue_date TEXT,
      expiry_date TEXT NOT NULL,
      issuing_authority TEXT,
      document_url TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Maintenance Records
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      maintenance_type TEXT NOT NULL,
      service_date TEXT NOT NULL,
      description TEXT,
      vendor TEXT,
      cost REAL DEFAULT 0,
      odometer_reading INTEGER,
      next_service_due TEXT,
      next_service_km INTEGER,
      status TEXT DEFAULT 'COMPLETED',
      work_order_no TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Fuel Logs
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_fuel (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      fuel_date TEXT NOT NULL,
      litres REAL NOT NULL,
      price_per_litre REAL NOT NULL,
      total_cost REAL NOT NULL,
      odometer_at_fuelling INTEGER,
      vendor TEXT,
      payment_mode TEXT DEFAULT 'CASH',
      logged_by TEXT,
      anomaly_flag TEXT DEFAULT 'NONE',
      anomaly_details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Driver Profiles
    db.run(`CREATE TABLE IF NOT EXISTS driver_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      driver_name TEXT NOT NULL,
      dl_number TEXT,
      dl_category TEXT,
      dl_expiry TEXT,
      blood_group TEXT,
      badge_number TEXT,
      assigned_vehicle_id INTEGER,
      medical_fitness_expiry TEXT,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_vehicle_id) REFERENCES vehicles(id)
    )`);

    // Transport Routes
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_name TEXT NOT NULL,
      route_code TEXT,
      vehicle_id INTEGER,
      driver_id INTEGER,
      stops TEXT,
      total_distance_km REAL DEFAULT 0,
      students_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Transport Fees
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      student_id TEXT,
      route_id INTEGER,
      monthly_fee REAL NOT NULL,
      fee_term TEXT DEFAULT 'Monthly',
      status TEXT DEFAULT 'PENDING',
      due_date TEXT,
      paid_date TEXT,
      amount_paid REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (route_id) REFERENCES vehicle_routes(id)
    )`);

    // Trip Logs
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      driver_id INTEGER,
      route_name TEXT,
      trip_type TEXT DEFAULT 'REGULAR',
      start_time TEXT,
      end_time TEXT,
      start_odometer INTEGER,
      end_odometer INTEGER,
      distance_km REAL,
      trip_status TEXT DEFAULT 'COMPLETED',
      students_count INTEGER DEFAULT 0,
      trip_cost REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // GPS Tracking Logs
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_gps_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      speed_kmh REAL DEFAULT 0,
      heading INTEGER DEFAULT 0,
      ignition INTEGER DEFAULT 1,
      event_type TEXT DEFAULT 'MOVING',
      location_name TEXT,
      odometer INTEGER DEFAULT 0,
      recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Vehicle migrations
    const vehicleMigrations = [
      "ALTER TABLE vehicles ADD COLUMN tank_capacity REAL DEFAULT 0",
      "ALTER TABLE vehicles ADD COLUMN mileage_standard REAL DEFAULT 0"
    ];
    vehicleMigrations.forEach(sql => {
      db.run(sql, (err) => {
        if (err && !err.message.includes("duplicate column name")) {}
      });
    });

    // ─── FASTag and Challans ──────────────────────────────────────────────────
    
    db.run(`CREATE TABLE IF NOT EXISTS vehicle_fastag (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL UNIQUE,
      tag_id TEXT NOT NULL,
      provider TEXT DEFAULT 'ICICI Bank',
      balance REAL DEFAULT 0,
      status TEXT DEFAULT 'ACTIVE',
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehicle_fastag_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      plaza_name TEXT,
      transaction_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vehicle_challans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER NOT NULL,
      driver_id INTEGER,
      challan_number TEXT NOT NULL UNIQUE,
      violation_type TEXT,
      location TEXT,
      penalty_amount REAL,
      status TEXT DEFAULT 'PENDING',
      issue_date TEXT,
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )`);

    // Seed vehicle data
    db.get("SELECT count(*) as count FROM vehicles", (err, row: any) => {
      if (!err && row.count === 0) {
        console.log("Seeding vehicle management data...");

        // Seed vehicles
        const vStmt = db.prepare(`INSERT INTO vehicles
          (reg_number, vehicle_type, make_model, year, fuel_type, seating_capacity, ownership_type, status, chassis_number, engine_number, purchase_date, campus, tank_capacity, mileage_standard)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        vStmt.run("KA01F7001", "BUS", "Tata Starbus", 2021, "DIESEL", 52, "OWNED", "ACTIVE", "MAT600481MH1012345", "492DTCII12345", "2021-06-15", "Main Campus", 200, 6.5);
        vStmt.run("KA01F7002", "BUS", "Ashok Leyland Lynx", 2020, "DIESEL", 48, "OWNED", "ACTIVE", "MBLY61ATXMN007890", "H4D12345", "2020-03-10", "Main Campus", 180, 7.0);
        vStmt.run("KA01F7003", "BUS", "Tata Starbus", 2019, "DIESEL", 52, "OWNED", "MAINTENANCE", "MAT600481MH1098765", "492DTCII98765", "2019-09-20", "Main Campus", 200, 6.0);
        vStmt.run("KA01F7004", "VAN", "Force Traveller", 2022, "DIESEL", 17, "OWNED", "ACTIVE", "MAZ3F22E2NM001234", "Z22E2NM01234", "2022-01-05", "Main Campus", 70, 10.5);
        vStmt.run("KA01F7005", "BUS", "SML Isuzu", 2020, "DIESEL", 36, "HIRED", "ACTIVE", "MBLBF4LH7LH007651", "4HK16543", "2020-07-18", "Branch Campus", 160, 7.5);
        vStmt.run("KA01F7006", "CAR", "Toyota Innova Crysta", 2023, "DIESEL", 7, "OWNED", "ACTIVE", "MBJBF4BHXP0012345", "2GD54321", "2023-04-01", "Main Campus", 55, 14.0);
        vStmt.finalize();

        // Seed documents (some expired, some warning, some ok)
        const today = new Date();
        const fut60 = new Date(today); fut60.setDate(today.getDate() + 60);
        const fut20 = new Date(today); fut20.setDate(today.getDate() + 20);
        const fut5  = new Date(today); fut5.setDate(today.getDate() + 5);
        const past  = new Date(today); past.setDate(today.getDate() - 10);
        const fut365 = new Date(today); fut365.setFullYear(today.getFullYear() + 1);

        const dFmt = (d: Date) => d.toISOString().split('T')[0];

        const docStmt = db.prepare(`INSERT INTO vehicle_documents
          (vehicle_id, doc_type, issue_date, expiry_date, issuing_authority, status)
          VALUES (?, ?, ?, ?, ?, ?)`);

        // Vehicle 1 - all green
        docStmt.run(1, "INSURANCE",       dFmt(past), dFmt(fut365), "Oriental Insurance", "ACTIVE");
        docStmt.run(1, "PUC",             dFmt(past), dFmt(fut60),  "RTO Bangalore",      "ACTIVE");
        docStmt.run(1, "FITNESS_CERT",    dFmt(past), dFmt(fut365), "ATS Bangalore",      "ACTIVE");
        docStmt.run(1, "PERMIT",          dFmt(past), dFmt(fut365), "RTO Karnataka",      "ACTIVE");
        docStmt.run(1, "SPEED_GOVERNOR",  dFmt(past), dFmt(fut60),  "RTO Bangalore",      "ACTIVE");

        // Vehicle 2 - some amber (expiring in 20 days)
        docStmt.run(2, "INSURANCE",       dFmt(past), dFmt(fut365), "New India Assurance", "ACTIVE");
        docStmt.run(2, "PUC",             dFmt(past), dFmt(fut20),  "RTO Bangalore",       "ACTIVE");
        docStmt.run(2, "FITNESS_CERT",    dFmt(past), dFmt(fut20),  "ATS Bangalore",       "ACTIVE");
        docStmt.run(2, "PERMIT",          dFmt(past), dFmt(fut365), "RTO Karnataka",       "ACTIVE");
        docStmt.run(2, "SPEED_GOVERNOR",  dFmt(past), dFmt(fut365), "RTO Bangalore",       "ACTIVE");

        // Vehicle 3 - critical (5 days)
        docStmt.run(3, "INSURANCE",       dFmt(past), dFmt(fut5),   "Oriental Insurance",  "ACTIVE");
        docStmt.run(3, "PUC",             dFmt(past), dFmt(fut5),   "RTO Bangalore",       "ACTIVE");
        docStmt.run(3, "FITNESS_CERT",    dFmt(past), dFmt(fut365), "ATS Bangalore",       "ACTIVE");
        docStmt.run(3, "PERMIT",          dFmt(past), dFmt(fut365), "RTO Karnataka",       "ACTIVE");

        // Vehicle 4 - one expired
        docStmt.run(4, "INSURANCE",       dFmt(past), dFmt(fut365), "Bajaj Allianz",       "ACTIVE");
        docStmt.run(4, "PUC",             dFmt(past), dFmt(past),   "RTO Bangalore",       "ACTIVE");
        docStmt.run(4, "FITNESS_CERT",    dFmt(past), dFmt(fut60),  "ATS Bangalore",       "ACTIVE");

        // Vehicle 5 & 6 - all green
        docStmt.run(5, "INSURANCE",       dFmt(past), dFmt(fut365), "HDFC Ergo",           "ACTIVE");
        docStmt.run(5, "PUC",             dFmt(past), dFmt(fut60),  "RTO Bangalore",       "ACTIVE");
        docStmt.run(5, "FITNESS_CERT",    dFmt(past), dFmt(fut365), "ATS Bangalore",       "ACTIVE");
        docStmt.run(6, "INSURANCE",       dFmt(past), dFmt(fut365), "HDFC Ergo",           "ACTIVE");
        docStmt.run(6, "PUC",             dFmt(past), dFmt(fut60),  "RTO Bangalore",       "ACTIVE");
        docStmt.finalize();

        // Seed maintenance records
        const mStmt = db.prepare(`INSERT INTO vehicle_maintenance
          (vehicle_id, maintenance_type, service_date, description, vendor, cost, odometer_reading, next_service_due, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        mStmt.run(1, "PREVENTIVE", "2025-01-10", "Engine oil change, filter replacement", "Sri Sai Auto Service", 4500, 42000, "2025-04-10", "COMPLETED");
        mStmt.run(1, "TYRE",       "2025-02-15", "Tyre rotation and balancing",           "MRF Tyres Dealer",     2800, 44500, "2025-05-15", "COMPLETED");
        mStmt.run(2, "PREVENTIVE", "2025-01-20", "Full service - oil, filter, brake check","City Auto Workshop",  6200, 38000, "2025-04-20", "COMPLETED");
        mStmt.run(3, "CORRECTIVE", "2025-03-01", "Engine overheating - cooling fan replaced","Tata Motors ASC",  12500, 51000, null,         "COMPLETED");
        mStmt.run(4, "PREVENTIVE", "2025-02-05", "Scheduled service",                     "Force Motors Service", 3800, 28000, "2025-05-05", "COMPLETED");
        mStmt.run(5, "SAFETY",     "2025-03-10", "Pre-trip brake and tyre inspection",    "In-house",               800, 33000, null,         "COMPLETED");
        mStmt.finalize();

        // Seed fuel logs
        const fStmt = db.prepare(`INSERT INTO vehicle_fuel
          (vehicle_id, fuel_date, litres, price_per_litre, total_cost, odometer_at_fuelling, vendor, payment_mode, logged_by, anomaly_flag)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        fStmt.run(1, "2025-03-25", 80,  92.5, 7400,  45200, "BPCL Pump - MG Road",    "VOUCHER", "Driver-Raju",   "NONE");
        fStmt.run(1, "2025-03-18", 75,  92.0, 6900,  44800, "BPCL Pump - MG Road",    "VOUCHER", "Driver-Raju",   "NONE");
        fStmt.run(2, "2025-03-26", 70,  92.5, 6475,  39200, "HP Pump - Koramangala",  "VOUCHER", "Driver-Suresh", "NONE");
        fStmt.run(2, "2025-03-20", 120, 92.0, 11040, 38700, "HP Pump - Koramangala",  "VOUCHER", "Driver-Suresh", "OVER_FUELLING");
        fStmt.run(3, "2025-03-22", 85,  92.5, 7863,  51500, "Shell Pump - Whitefield", "CASH",   "Driver-Kumar",  "UNAPPROVED_VENDOR");
        fStmt.run(4, "2025-03-24", 35,  92.0, 3220,  28500, "BPCL Pump - MG Road",    "VOUCHER", "Driver-Mohan",  "NONE");
        fStmt.run(5, "2025-03-27", 65,  92.5, 6013,  33500, "HP Pump - Koramangala",  "VOUCHER", "Driver-Anand",  "NONE");
        fStmt.finalize();

        // Seed driver profiles
        const drStmt = db.prepare(`INSERT INTO driver_profiles
          (employee_id, driver_name, dl_number, dl_category, dl_expiry, blood_group, badge_number, assigned_vehicle_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        drStmt.run(1, "Rajesh Kumar",    "KA0120190012345", "HMV", dFmt(fut365), "O+", "DRV-001", 1, "ACTIVE");
        drStmt.run(2, "Suresh Naidu",    "KA0120200023456", "HMV", dFmt(fut60),  "A+", "DRV-002", 2, "ACTIVE");
        drStmt.run(3, "Kumar Swamy",     "KA0120180034567", "HMV", dFmt(fut20),  "B+", "DRV-003", 3, "ACTIVE");
        drStmt.run(4, "Mohan Das",       "KA0120210045678", "LMV", dFmt(fut365), "O-", "DRV-004", 4, "ACTIVE");
        drStmt.run(5, "Anand Krishnan",  "KA0120190056789", "HMV", dFmt(fut5),   "A-", "DRV-005", 5, "ACTIVE");
        drStmt.finalize();

        // Seed routes
        const rStmt = db.prepare(`INSERT INTO vehicle_routes
          (route_name, route_code, vehicle_id, driver_id, stops, total_distance_km, students_count, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        rStmt.run("Route A - Electronic City",   "RT-A", 1, 1, JSON.stringify(["Electronic City Phase 1","Silk Board","BTM Layout","Lakkasandra","Institution"]),  22, 38, "ACTIVE");
        rStmt.run("Route B - Koramangala",       "RT-B", 2, 2, JSON.stringify(["Koramangala 8th Block","Koramangala 4th Block","St Johns Road","Richmond Road","Institution"]), 18, 35, "ACTIVE");
        rStmt.run("Route C - Whitefield",        "RT-C", 5, 5, JSON.stringify(["Whitefield","ITPL","Mahadevapura","KR Puram","Institution"]), 28, 30, "ACTIVE");
        rStmt.run("Route D - Yelahanka",         "RT-D", 4, 4, JSON.stringify(["Yelahanka New Town","Hebbal","Manyata Tech Park","RT Nagar","Institution"]),  20, 12, "ACTIVE");
        rStmt.finalize();

        // Seed fees
        const feStmt = db.prepare(`INSERT INTO vehicle_fees
          (student_name, student_id, route_id, monthly_fee, fee_term, status, due_date, paid_date, amount_paid)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        feStmt.run("Arjun Mehta",     "STU-101", 1, 1200, "Monthly", "PAID",    "2025-03-05", "2025-03-03", 1200);
        feStmt.run("Priya Sharma",    "STU-102", 1, 1200, "Monthly", "PAID",    "2025-03-05", "2025-03-04", 1200);
        feStmt.run("Rahul Nair",      "STU-103", 2, 1000, "Monthly", "PENDING", "2025-03-05", null,         0);
        feStmt.run("Divya Krishnan",  "STU-104", 2, 1000, "Monthly", "OVERDUE", "2025-02-28", null,         0);
        feStmt.run("Arun Kumar",      "STU-105", 3, 1500, "Monthly", "PAID",    "2025-03-05", "2025-03-02", 1500);
        feStmt.run("Sneha Reddy",     "STU-106", 3, 1500, "Monthly", "PENDING", "2025-03-05", null,         0);
        feStmt.run("Vikram Iyer",     "STU-107", 4, 800,  "Monthly", "OVERDUE", "2025-02-28", null,         0);
        feStmt.run("Kavya Pillai",    "STU-108", 1, 1200, "Monthly", "PAID",    "2025-03-05", "2025-03-05", 1200);
        feStmt.finalize();

        // Seed trips
        const trStmt = db.prepare(`INSERT INTO vehicle_trips
          (vehicle_id, driver_id, route_name, trip_type, start_time, end_time, start_odometer, end_odometer, distance_km, trip_status, students_count, trip_cost)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        trStmt.run(1, 1, "Route A - Electronic City", "REGULAR", "2025-03-27 07:00", "2025-03-27 08:30", 45100, 45122, 22, "COMPLETED", 38, 310);
        trStmt.run(2, 2, "Route B - Koramangala",     "REGULAR", "2025-03-27 07:00", "2025-03-27 08:15", 39100, 39118, 18, "COMPLETED", 35, 252);
        trStmt.run(5, 5, "Route C - Whitefield",      "REGULAR", "2025-03-27 06:45", "2025-03-27 08:20", 33400, 33428, 28, "COMPLETED", 30, 392);
        trStmt.run(4, 4, "Route D - Yelahanka",       "REGULAR", "2025-03-27 07:00", "2025-03-27 08:10", 28400, 28420, 20, "COMPLETED", 12, 280);
        trStmt.run(6, null, "Staff Transport",        "STAFF",   "2025-03-27 08:00", "2025-03-27 08:45", 12100, 12115, 15, "COMPLETED", 0,  210);
        trStmt.finalize();
        
        // Seed FASTag and Challans
        const ftStmt = db.prepare(`INSERT INTO vehicle_fastag (vehicle_id, tag_id, provider, balance, status) VALUES (?, ?, ?, ?, ?)`);
        ftStmt.run(1, "FT-123456", "ICICI Bank", 1200, "ACTIVE");
        ftStmt.run(2, "FT-234567", "ICICI Bank", 150, "LOW_BALANCE"); // low balance
        ftStmt.run(3, "FT-345678", "HDFC Bank", 2500, "ACTIVE");
        ftStmt.run(4, "FT-456789", "SBI FASTag", 50, "BLACKLISTED"); // critically low
        ftStmt.finalize();

        const chStmt = db.prepare(`INSERT INTO vehicle_challans (vehicle_id, driver_id, challan_number, violation_type, location, penalty_amount, status, issue_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
        chStmt.run(1, 1, "CH-KA01-9921", "Over-speeding", "Silk Board Junction", 1000, "PENDING", dFmt(past));
        chStmt.run(2, 2, "CH-KA01-7734", "Signal Jump", "Koramangala 8th Block", 500, "PAID", dFmt(past));
        chStmt.run(4, 4, "CH-KA01-1122", "No Parking", "Hebbal Underpass", 1500, "PENDING", dFmt(fut5)); // Mock
        chStmt.finalize();
      }
    });

    // Seed dummy research data
    db.get("SELECT count(*) as count FROM research_publications", (err, row: any) => {
      if (!err && row.count <= 3) { // Update if only few exist
        console.log("Seeding comprehensive research publications...");
        const stmt = db.prepare(`INSERT INTO research_publications 
          (employee_id, title, type, journal_name, impact_factor, authorship, date, status, issn_isbn, indexing, is_peer_reviewed, ugc_care_listed, citations) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        
        // Employee 1
        stmt.run(1, "Quantum-inspired Genetic Algorithms", "Journal", "Elsevier: Cloud Computing", 5.8, "Principal", "2023-12-10", "Approved", "1234-5678", "Scopus", 1, 1, 45);
        stmt.run(1, "Deep Learning for Pulmonary Nodule Detection", "Journal", "Springer Nature", 4.2, "Principal", "2024-01-15", "Approved", "2233-4455", "Web of Science", 1, 1, 120);
        stmt.run(1, "Blockchain in Decentralized Finance", "Conference", "IEEE Crypto 2024", 0, "Corresponding", "2024-02-20", "Pending Approval", "9988-7766", "Scopus", 1, 0, 12);
        
        // Employee 2
        stmt.run(2, "AI for Sustainable Energy Grids", "Journal", "Renewable Energy Focus", 3.5, "Principal", "2024-02-10", "Approved", "5566-7788", "UGC CARE", 1, 1, 88);
        stmt.run(2, "Machine Learning in Agriculture", "Book Chapter", "Wiley: Smart Farming", 0, "Co-Author", "2023-10-05", "Approved", "ISBN-978-3-16", "Other", 1, 0, 15);
        
        // Employee 3
        stmt.run(3, "Modern Database Architectures", "Book", "Pearson Education", 0, "Principal", "2023-08-25", "Approved", "ISBN-978-0-13", "Other", 1, 0, 250);
        
        // Employee 4
        stmt.run(4, "Advanced Signal Processing", "Journal", "Signal Review", 2.9, "Principal", "2024-03-01", "Pending Approval", "1122-3344", "UGC CARE", 1, 1, 5);

        stmt.finalize();
      }
    });

  });
}

export default db;
