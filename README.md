# edumerge - Resource Reservation Module Prototype

This single-repository project contains a fully runnable prototype of the **Resource Reservation** module for edumerge, an ERP platform for Indian schools and colleges.

---

## Technical Stack
- **Client**: React 18, Vite, Tailwind CSS, Lucide Icons, Shadcn UI primitives.
- **Server**: Node.js, Express, SQLite3 (raw SQL driver matches real stack).
- **Database Initializer & Seed**: Located inside `server/src/db.ts` (runs automatically on boot, loading 6 resources, 2 sections, 6 rate cards, and 15 reservations across workflows).

---

## How to Run Locally

### 1. One-Command Setup & Launch
In the root directory, install all dependencies for both client and server and run both concurrently:
```bash
# Install root, client, and server dependencies
npm run install:all

# Run client & server concurrently
npm start
```
- **Client** dev server starts on: `http://localhost:5173/V2/HRMS_Demo`
- **Server** API starts on: `http://localhost:5002`

---

## Seed Database Configuration
On startup, the system automatically initializes a local SQLite file (`server/hrms.db`) and seeds:
- **6 Resources**:
  - `Seminar Hall A` (150 capacity, 30 min buffer)
  - `Main Auditorium` (500 capacity, 60 min buffer)
  - `Sports Ground` (1000 capacity, 45 min buffer)
  - `Computer Lab 1` (60 capacity, 15 min buffer, **Splittable** into Section A & Section B)
  - `Classroom 301` (40 capacity, 10 min buffer, internal only)
  - `Classroom 302` (40 capacity, 10 min buffer, internal only)
- **2 Sections**:
  - `Computer Lab 1 - Section A`
  - `Computer Lab 1 - Section B`
- **Rate Cards**: Configured with hourly, daily, and security deposit fees.
- **15 Reservations**: Pre-seeded internal and external workflows under varying approval levels and conflict contexts.

---

## Acceptance Checks & Manual Verification Procedure

You can verify all core business constraints directly on the page under **Operations -> Resource Reservation**:

### 1. Overlapping Booking Validation
- **Action**: Go to the **Internal Staff Requests** tab. Under "Requester Name" type "Prof. Roy", select "Seminar Hall A", and enter the date **25 June 2026** from **11:00** to **13:00**. Click "Add Schedule Block" and click "Test Conflicts" (or "Submit Group").
- **Constraint**: Since `Dr. A. K. Sen` has a seeded booking on that space from **10:00 to 12:00**, the reservation will be blocked.
- **Result**: The Conflict Engine panel on the left will turn red and list the exact clash message.

### 2. Buffer Minutes Enforcement
- **Action**: Request "Seminar Hall A" on **25 June 2026** from **12:15** to **14:00**.
- **Constraint**: The previous booking ends at **12:00**, and the resource requires a **30-minute buffer**. A booking starting at 12:15 violates this buffer.
- **Result**: The Conflict Engine blocks submission and shows that the slot clashing with Sen's booking includes the buffer constraint.

### 3. Weekly Recurrence Clash Isolation
- **Action**: Request "Seminar Hall A" as **Weekly Recurrence** starting **29 June 2026** at **10:00**.
- **Constraint**: The system expands this into 5 weekly dates. Let's say one of the future dates (e.g., 5 July 2026) has another approved booking.
- **Result**: The server conflict service returns the exact clashing date (e.g. 5 July 2026), listing it clearly in the visual clash report.

### 4. Multi-Resource Group Atomicity
- **Action**: Add two schedule blocks in the **Atomic Booking Group** cart:
  1. Classroom 301 (vacant)
  2. Seminar Hall A (during a clashing slot on 25 June)
- **Constraint**: The submission must fail atomically.
- **Result**: Clicking "Submit Group" triggers a server rollback. Neither booking is recorded, and no rows are written.

### 5. Admin Override & Booker Notification
- **Action**: Switch to the **Approvals & Overrides** tab. Simulator Role: "Admin Office". Find `Rotary Club Bangalore` (Reservation ID 13). Click "Admin Override". Enter a reason (e.g., "Facility Audit") and click "Submit".
- **Result**: The reservation is cancelled, an immutable audit log is created in the DB (`override_logs`), and a green notification alert is displayed showing Booker email, the message, and a refund due banner.

### 6. Paid Booking Refund Flag
- **Action**: Cancel any approved paid external booking (e.g., ID 10 `Infotech Solutions` or ID 11 `Acme Sports Club`).
- **Result**: The cancellation receipt flags `refund_flag: true` along with the exact fee collection amount due to be refunded. If a calendar event was linked (like `EVT-8821` for Infotech), the event title is embedded in the notification logs.
