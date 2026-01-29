# Automated Hardware & Peripheral Verification System
## Process Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           LOGIN & AUTHENTICATION                                     │
│                                                                                      │
│  ┌──────────┐                                                                       │
│  │  User    │──────► Select Role ─────┬─► Finance User                             │
│  │  Login   │                          ├─► Asset Manager                            │
│  └──────────┘                          ├─► Debasish (Network & Servers)            │
│                                        ├─► Pradeep (Audio Video)                    │
│                                        ├─► Revant (Furniture & Other)               │
│                                        └─► Employee                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        FINANCE USER WORKFLOW                                         │
│                                                                                      │
│  ┌──────────────────┐                                                               │
│  │ Finance Dashboard│                                                               │
│  └────────┬─────────┘                                                               │
│           │                                                                          │
│           ├──► View KPIs                                                            │
│           │    • Total Assets                                                       │
│           │    • Verification Completion Rate                                       │
│           │    • Pending Verifications                                              │
│           │    • Overdue + Exceptions                                               │
│           │                                                                          │
│           ├──► Analytics Dashboard (ALL Asset Categories)                           │
│           │    ┌──────────────────────────────────────┐                            │
│           │    │ • Asset Distribution Pie Chart        │                            │
│           │    │ • Verification Status Donut Chart     │                            │
│           │    │ • Asset Value Bar Chart               │                            │
│           │    │ • 7-Month Verification Trend          │                            │
│           │    └──────────────────────────────────────┘                            │
│           │    Includes Data From:                                                  │
│           │    - Hardware Assets                                                    │
│           │    - Network Equipment (Debasish)                                       │
│           │    - Servers (Debasish)                                                 │
│           │    - Audio Video Equipment (Pradeep)                                    │
│           │    - Furniture & Fixtures (Revant)                                      │
│           │    - Other Equipment (Revant)                                           │
│           │                                                                          │
│           ├──► Create Verification Campaign                                         │
│           │    │                                                                     │
│           │    ├─► Step 1: Campaign Details                                         │
│           │    │   (Name, Type, Deadline)                                           │
│           │    │                                                                     │
│           │    ├─► Step 2: Select Teams                                             │
│           │    │   (Engineering, Sales, HR, etc.)                                   │
│           │    │                                                                     │
│           │    ├─► Step 3: Select Asset Types                                       │
│           │    │   (Laptops, Monitors, Mobiles)                                     │
│           │    │                                                                     │
│           │    └─► Step 4: Review & Launch                                          │
│           │        │                                                                 │
│           │        └──► Campaign Created ──► Email Notifications Sent               │
│           │                                                                          │
│           ├──► View Active Campaigns                                                │
│           │    • Campaign Progress                                                  │
│           │    • Verified/Pending/Overdue Stats                                     │
│           │    • Team-wise Breakdown                                                │
│           │                                                                          │
│           ├──► Export Reports                                                       │
│           │    • Export Pending & Exceptions (Excel)                                │
│           │    • Export Dashboard Analytics                                         │
│           │                                                                          │
│           └──► View Verification Status by Team                                     │
│                • Filter by Team/Asset Type/Status                                   │
│                • View Progress Charts                                               │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      ASSET MANAGER WORKFLOW                                          │
│                                                                                      │
│  ┌─────────────────────┐                                                            │
│  │ Asset Manager       │                                                            │
│  │ Dashboard           │                                                            │
│  └──────────┬──────────┘                                                            │
│             │                                                                        │
│             ├──► View Dashboard Overview                                            │
│             │    • Total Employees                                                  │
│             │    • Assigned Hardware                                                │
│             │    • Pending Assignments                                              │
│             │    • Verification Status                                              │
│             │                                                                        │
│             ├──► Import Hardware from ServiceNow                                    │
│             │    │                                                                   │
│             │    ├─► Upload CSV File                                                │
│             │    │   ┌────────────────────────────────┐                            │
│             │    │   │ CSV Format:                     │                            │
│             │    │   │ - Service Tag                   │                            │
│             │    │   │ - Asset Type                    │                            │
│             │    │   │ - Model                         │                            │
│             │    │   │ - Purchase Date                 │                            │
│             │    │   │ - Employee ID                   │                            │
│             │    │   │ - Employee Name                 │                            │
│             │    │   │ - Team                          │                            │
│             │    │   │ - Location                      │                            │
│             │    │   └────────────────────────────────┘                            │
│             │    │                                                                   │
│             │    ├─► Validate Data                                                  │
│             │    │   (Check for duplicates, format errors)                          │
│             │    │                                                                   │
│             │    └─► Import Confirmed ──► Hardware Assigned                         │
│             │                                                                        │
│             ├──► Assign Peripherals (Manual)                                        │
│             │    │                                                                   │
│             │    ├─► Search Employee                                                │
│             │    │   (By ID or Name)                                                │
│             │    │                                                                   │
│             │    ├─► View Employee Details                                          │
│             │    │   • Current Hardware                                             │
│             │    │   • Current Peripherals                                          │
│             │    │   • Verification Status                                          │
│             │    │                                                                   │
│             │    ├─► Select Peripheral Type                                         │
│             │    │   • Mouse                                                        │
│             │    │   • Keyboard                                                     │
│             │    │   • Headset                                                      │
│             │    │   • Webcam                                                       │
│             │    │   • Docking Station                                              │
│             │    │   • Other                                                        │
│             │    │                                                                   │
│             │    ├─► Enter Peripheral Details                                       │
│             │    │   (Serial Number, Brand, Model)                                  │
│             │    │                                                                   │
│             │    └─► Confirm Assignment                                             │
│             │        │                                                               │
│             │        └──► Peripheral Assigned ──► Update Employee Record            │
│             │                                                                        │
│             ├──► Review Verification Exceptions                                     │
│             │    • View Exception Cases                                             │
│             │    • Approve/Reject Exceptions                                        │
│             │    • Add Comments                                                     │
│             │                                                                        │
│             └──► View All Employees                                                 │
│                  • Filter by Team/Location/Status                                   │
│                  • View Hardware & Peripheral Details                               │
│                  • Export Employee Data                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│              DEBASISH - NETWORK EQUIPMENT & SERVERS WORKFLOW                         │
│                                                                                      │
│  ┌──────────────────────┐                                                           │
│  │ Network & Servers    │                                                           │
│  │ Dashboard            │                                                           │
│  └──────────┬───────────┘                                                           │
│             │                                                                        │
│             ├──► View Dashboard Overview                                            │
│             │    • Total Network Equipment                                          │
│             │    • Total Servers                                                    │
│             │    • Total Value                                                      │
│             │    • Last Updated Date                                                │
│             │                                                                        │
│             ├──► View Power BI Dashboard (Placeholder)                              │
│             │    • Monthly Audit Reports                                            │
│             │    • Annual Audit Reports                                             │
│             │    • Equipment Distribution Charts                                    │
│             │                                                                        │
│             ├──► Upload Network Equipment Count                                     │
│             │    │                                                                   │
│             │    ├─► Select Equipment Type                                          │
│             │    │   • Router                                                       │
│             │    │   • Switch                                                       │
│             │    │   • Firewall                                                     │
│             │    │   • Access Point                                                 │
│             │    │   • Load Balancer                                                │
│             │    │                                                                   │
│             │    ├─► Enter Details                                                  │
│             │    │   • Quantity                                                     │
│             │    │   • Location                                                     │
│             │    │   • Value                                                        │
│             │    │   • Purchase Date                                                │
│             │    │                                                                   │
│             │    └─► Upload ──► Data Saved ──► Visible on Finance Dashboard         │
│             │                                                                        │
│             ├──► Upload Server Count                                                │
│             │    │                                                                   │
│             │    ├─► Select Server Type                                             │
│             │    │   • Rack Server                                                  │
│             │    │   • Blade Server                                                 │
│             │    │   • Tower Server                                                 │
│             │    │   • Storage Server                                               │
│             │    │                                                                   │
│             │    ├─► Enter Details                                                  │
│             │    │   • Quantity                                                     │
│             │    │   • Data Center Location                                         │
│             │    │   • Value                                                        │
│             │    │   • Specifications                                               │
│             │    │                                                                   │
│             │    └─► Upload ──► Data Saved ──► Visible on Finance Dashboard         │
│             │                                                                        │
│             └──► View Equipment Inventory                                           │
│                  • Network Equipment List                                           │
│                  • Server List                                                      │
│                  • Filter by Type/Location                                          │
│                  • Export to Excel                                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                PRADEEP - AUDIO VIDEO EQUIPMENT WORKFLOW                              │
│                                                                                      │
│  ┌──────────────────────┐                                                           │
│  │ Audio Video          │                                                           │
│  │ Dashboard            │                                                           │
│  └──────────┬───────────┘                                                           │
│             │                                                                        │
│             ├──► View Dashboard Overview                                            │
│             │    • Total Audio Video Equipment                                      │
│             │    • Total Value                                                      │
│             │    • Equipment by Type                                                │
│             │    • Last Updated Date                                                │
│             │                                                                        │
│             ├──► View Power BI Dashboard (Placeholder)                              │
│             │    • Monthly Audit Reports                                            │
│             │    • Annual Audit Reports                                             │
│             │    • Equipment Distribution                                           │
│             │                                                                        │
│             ├──► Upload Audio Video Equipment Count                                 │
│             │    │                                                                   │
│             │    ├─► Select Equipment Type                                          │
│             │    │   • Conference Camera                                            │
│             │    │   • Microphone System                                            │
│             │    │   • Speaker System                                               │
│             │    │   • Video Conferencing System                                    │
│             │    │   • Projector                                                    │
│             │    │   • Display Screen                                               │
│             │    │                                                                   │
│             │    ├─► Enter Details                                                  │
│             │    │   • Quantity                                                     │
│             │    │   • Room/Location                                                │
│             │    │   • Value                                                        │
│             │    │   • Brand & Model                                                │
│             │    │                                                                   │
│             │    └─► Upload ──► Data Saved ──► Visible on Finance Dashboard         │
│             │                                                                        │
│             └──► View Equipment Inventory                                           │
│                  • Complete Equipment List                                          │
│                  • Filter by Type/Location                                          │
│                  • Export to Excel                                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│          REVANT - FURNITURE & FIXTURES AND OTHER EQUIPMENT WORKFLOW                  │
│                                                                                      │
│  ┌──────────────────────┐                                                           │
│  │ Furniture & Other    │                                                           │
│  │ Dashboard            │                                                           │
│  └──────────┬───────────┘                                                           │
│             │                                                                        │
│             ├──► View Dashboard Overview                                            │
│             │    • Total Furniture Items                                            │
│             │    • Total Other Equipment                                            │
│             │    • Combined Total Value                                             │
│             │    • Last Updated Date                                                │
│             │                                                                        │
│             ├──► View Power BI Dashboard (Placeholder)                              │
│             │    • Monthly Audit Reports                                            │
│             │    • Annual Audit Reports                                             │
│             │    • Distribution by Category                                         │
│             │                                                                        │
│             ├──► Upload Furniture Count                                             │
│             │    │                                                                   │
│             │    ├─► Select Furniture Type                                          │
│             │    │   • Office Chair                                                 │
│             │    │   • Desk                                                         │
│             │    │   • Meeting Table                                                │
│             │    │   • Storage Cabinet                                              │
│             │    │   • Bookshelf                                                    │
│             │    │                                                                   │
│             │    ├─► Enter Details                                                  │
│             │    │   • Quantity                                                     │
│             │    │   • Location                                                     │
│             │    │   • Value                                                        │
│             │    │   • Condition                                                    │
│             │    │                                                                   │
│             │    └─► Upload ──► Data Saved ──► Visible on Finance Dashboard         │
│             │                                                                        │
│             ├──► Upload Other Equipment Count                                       │
│             │    │                                                                   │
│             │    ├─► Select Equipment Type                                          │
│             │    │   • Whiteboard                                                   │
│             │    │   • Filing Cabinet                                               │
│             │    │   • Printer Stand                                                │
│             │    │   • Office Supplies Storage                                      │
│             │    │                                                                   │
│             │    ├─► Enter Details                                                  │
│             │    │   • Quantity                                                     │
│             │    │   • Location                                                     │
│             │    │   • Value                                                        │
│             │    │                                                                   │
│             │    └─► Upload ──► Data Saved ──► Visible on Finance Dashboard         │
│             │                                                                        │
│             └──► View Equipment Inventory                                           │
│                  • Furniture List                                                   │
│                  • Other Equipment List                                             │
│                  • Filter by Type/Location                                          │
│                  • Export to Excel                                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        EMPLOYEE VERIFICATION WORKFLOW                                │
│                                                                                      │
│  ┌─────────────────┐                                                                │
│  │ Employee Login  │                                                                │
│  └────────┬────────┘                                                                │
│           │                                                                          │
│           ├──► View Assigned Assets                                                 │
│           │    ┌─────────────────────────────────────┐                             │
│           │    │ Hardware Assets:                     │                             │
│           │    │ • Laptop (Dell Latitude 7420)        │                             │
│           │    │ • Monitor (Dell U2720Q)              │                             │
│           │    │ • Mobile (iPhone 13 Pro)             │                             │
│           │    │                                      │                             │
│           │    │ Peripherals:                         │                             │
│           │    │ • Mouse (Logitech MX Master 3)       │                             │
│           │    │ • Keyboard (Logitech K850)           │                             │
│           │    │ • Headset (Jabra Evolve 75)          │                             │
│           │    └─────────────────────────────────────┘                             │
│           │                                                                          │
│           ├──► Start Verification Process                                           │
│           │    │                                                                     │
│           │    ├─► Review Asset List                                                │
│           │    │   • Check all assigned items                                       │
│           │    │   • Verify serial numbers                                          │
│           │    │   • Check physical condition                                       │
│           │    │                                                                     │
│           │    ├─► For Each Asset:                                                  │
│           │    │   │                                                                 │
│           │    │   ├─► Confirm Possession                                           │
│           │    │   │   └─► Mark as "Verified"                                       │
│           │    │   │                                                                 │
│           │    │   ├─► Report Issue                                                 │
│           │    │   │   ├─► Select Issue Type:                                       │
│           │    │   │   │   • Not in Possession                                      │
│           │    │   │   │   • Damaged                                                │
│           │    │   │   │   • Lost/Stolen                                            │
│           │    │   │   │   • Incorrect Information                                  │
│           │    │   │   │   • Other                                                  │
│           │    │   │   │                                                             │
│           │    │   │   ├─► Add Comments                                             │
│           │    │   │   │   (Describe the issue in detail)                           │
│           │    │   │   │                                                             │
│           │    │   │   └─► Mark as "Exception"                                      │
│           │    │   │                                                                 │
│           │    │   └─► Upload Supporting Documents                                  │
│           │    │       (Photos, Police Report, etc.)                                │
│           │    │                                                                     │
│           │    ├─► Review All Verifications                                         │
│           │    │   • Check all assets marked                                        │
│           │    │   • Review exception comments                                      │
│           │    │                                                                     │
│           │    └─► Submit Verification                                              │
│           │        │                                                                 │
│           │        ├──► If All Verified:                                            │
│           │        │    └─► Status: "Verified"                                      │
│           │        │        ├─► Update Database                                     │
│           │        │        ├─► Send Confirmation Email                             │
│           │        │        └─► Close Campaign for User                             │
│           │        │                                                                 │
│           │        └──► If Exceptions Exist:                                        │
│           │             └─► Status: "Exception"                                     │
│           │                 ├─► Notify Asset Manager                                │
│           │                 ├─► Create Exception Ticket                             │
│           │                 └─► Await Review                                        │
│           │                                                                          │
│           └──► View Verification History                                            │
│                • Past Campaigns                                                     │
│                • Verification Dates                                                 │
│                • Asset Changes Over Time                                            │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                    VERIFICATION REVIEW PROCESS (Asset Manager)                       │
│                                                                                      │
│  ┌──────────────────────┐                                                           │
│  │ Exception Reported   │                                                           │
│  │ by Employee          │                                                           │
│  └──────────┬───────────┘                                                           │
│             │                                                                        │
│             ├──► Asset Manager Receives Notification                                │
│             │                                                                        │
│             ├──► View Exception Details                                             │
│             │    • Employee Information                                             │
│             │    • Asset Details                                                    │
│             │    • Issue Type                                                       │
│             │    • Employee Comments                                                │
│             │    • Supporting Documents                                             │
│             │                                                                        │
│             ├──► Review Exception                                                   │
│             │    │                                                                   │
│             │    ├─► Option 1: APPROVE Exception                                    │
│             │    │   ├─► Add Manager Comments                                       │
│             │    │    │   • Reason for approval                                     │
│             │    │    │   • Next steps                                              │
│             │    │    │                                                              │
│             │    │    ├─► Update Asset Status                                       │
│             │    │    │   • Mark as Lost/Damaged/etc.                               │
│             │    │    │   • Unassign from employee if needed                        │
│             │    │    │                                                              │
│             │    │    ├─► Create Action Item                                        │
│             │    │    │   • Replacement request                                     │
│             │    │    │   • Investigation                                           │
│             │    │    │   • Recovery attempt                                        │
│             │    │    │                                                              │
│             │    │    └─► Close Exception                                           │
│             │    │        ├─► Notify Employee                                       │
│             │    │        ├─► Update Finance Dashboard                              │
│             │    │        └─► Log in Audit Trail                                    │
│             │    │                                                                   │
│             │    └─► Option 2: REJECT Exception                                     │
│             │        ├─► Add Rejection Reason                                       │
│             │        │   • Asset found in employee's possession                     │
│             │        │   • Insufficient evidence                                    │
│             │        │   • Incorrect information                                    │
│             │        │                                                               │
│             │        ├─► Request Re-verification                                    │
│             │        │   • Send back to employee                                    │
│             │        │   • Provide specific instructions                            │
│             │        │                                                               │
│             │        └─► Notify Employee                                            │
│             │            ├─► Email notification                                     │
│             │            └─► Status: "Pending Re-verification"                      │
│             │                                                                        │
│             └──► Generate Exception Report                                          │
│                  • Export all exceptions                                            │
│                  • Filter by status/type                                            │
│                  • Send to Finance for audit                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW & INTEGRATIONS                                    │
│                                                                                      │
│  ┌────────────────┐                                                                 │
│  │   ServiceNow   │                                                                 │
│  │   (External)   │                                                                 │
│  └───────┬────────┘                                                                 │
│          │                                                                           │
│          │ CSV Export (Hardware Assets)                                             │
│          ↓                                                                           │
│  ┌──────────────────────────────────┐                                              │
│  │   Asset Manager Dashboard        │                                              │
│  │   • CSV Upload & Import          │                                              │
│  │   • Data Validation              │                                              │
│  │   • Hardware Assignment          │                                              │
│  └───────┬──────────────────────────┘                                              │
│          │                                                                           │
│          │ Hardware Data                                                            │
│          ↓                                                                           │
│  ┌──────────────────────────────────┐                                              │
│  │   Central Database               │◄─────── Manual Peripheral Entry              │
│  │   (mockData.ts in this version)  │                                              │
│  │                                  │◄─────── Equipment Count Uploads              │
│  │   Stores:                        │         (Debasish, Pradeep, Revant)          │
│  │   • Hardware Assets              │                                              │
│  │   • Peripheral Assignments       │                                              │
│  │   • Network Equipment Counts     │                                              │
│  │   • Server Counts                │                                              │
│  │   • Audio Video Equipment Counts │                                              │
│  │   • Furniture & Other Counts     │                                              │
│  │   • User/Employee Data           │                                              │
│  │   • Verification Campaigns       │                                              │
│  │   • Verification Status          │                                              │
│  │   • Exception Records            │                                              │
│  └───────┬──────────────────────────┘                                              │
│          │                                                                           │
│          │ Data Retrieval                                                           │
│          ↓                                                                           │
│  ┌──────────────────────────────────┐                                              │
│  │   Finance Dashboard              │                                              │
│  │   • Aggregate ALL Asset Data     │                                              │
│  │   • Generate Analytics           │                                              │
│  │   • Create Visualizations        │                                              │
│  │   • Export Reports               │                                              │
│  └───────┬──────────────────────────┘                                              │
│          │                                                                           │
│          │ Dashboard Output                                                         │
│          ↓                                                                           │
│  ┌──────────────────────────────────┐                                              │
│  │   Analytics & Reports            │                                              │
│  │   • Asset Distribution Charts    │                                              │
│  │   • Verification Trends          │                                              │
│  │   • Value Analysis               │                                              │
│  │   • Excel Exports                │                                              │
│  │   • Audit Compliance Reports     │                                              │
│  └──────────────────────────────────┘                                              │
│                                                                                      │
│  ┌──────────────────────────────────┐                                              │
│  │   Email Notifications            │◄───── Triggered by:                          │
│  │   • Campaign Launch              │       • Campaign Creation                    │
│  │   │ Campaign Reminders           │       • Verification Deadline                │
│  │   │ Verification Confirmations   │       • Exception Approvals                  │
│  │   │ Exception Updates            │       • Status Changes                       │
│  └──────────────────────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           KEY SYSTEM FEATURES                                        │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ ROLE-BASED ACCESS CONTROL                                                    │  │
│  │                                                                               │  │
│  │ • Finance User    → Full dashboard access, campaign creation, analytics      │  │
│  │ • Asset Manager   → Hardware/peripheral management, exception review         │  │
│  │ • Debasish        → Network & server equipment count uploads                 │  │
│  │ • Pradeep         → Audio video equipment count uploads                      │  │
│  │ • Revant          → Furniture & other equipment count uploads                │  │
│  │ • Employee        → View assigned assets, perform verification               │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ AUDIT COMPLIANCE                                                              │  │
│  │                                                                               │  │
│  │ • Hardware MUST come from ServiceNow CSV import (audit trail)                │  │
│  │ • Peripherals manually assigned (flexibility for IT team)                    │  │
│  │ • All equipment uploads tracked with timestamps                              │  │
│  │ • Complete verification history maintained                                   │  │
│  │ • Exception tracking with approval workflow                                  │  │
│  │ • Excel export for external auditors                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ COMPREHENSIVE ANALYTICS                                                       │  │
│  │                                                                               │  │
│  │ • Real-time asset distribution across ALL categories                         │  │
│  │ • Verification status tracking (Verified/Pending/Overdue/Exception)          │  │
│  │ • Asset value analysis by category                                           │  │
│  │ • Monthly and annual trend analysis                                          │  │
│  │ • Team-wise verification progress                                            │  │
│  │ • Interactive charts (Pie, Donut, Bar, Area)                                 │  │
│  │ • Export capabilities for reporting                                          │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ VERIFICATION CAMPAIGN LIFECYCLE                                               │  │
│  │                                                                               │  │
│  │ 1. Finance creates campaign with teams & asset types                         │  │
│  │ 2. System sends email notifications to all selected employees                │  │
│  │ 3. Employees log in and verify their assigned assets                         │  │
│  │ 4. Employees can report exceptions with supporting details                   │  │
│  │ 5. Asset Manager reviews and approves/rejects exceptions                     │  │
│  │ 6. Finance monitors progress on dashboard                                    │  │
│  │ 7. Campaign completes when all employees verified or deadline passed         │  │
│  │ 8. Final reports exported for compliance records                             │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │ ENTERPRISE FEATURES                                                           │  │
│  │                                                                               │  │
│  │ • Designed for 800+ users                                                    │  │
│  │ • Multi-location support                                                     │  │
│  │ • Team-based organization                                                    │  │
│  │ • Scalable data architecture                                                 │  │
│  │ • Professional SaaS styling                                                  │  │
│  │ • Responsive design (desktop/tablet/mobile)                                  │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│                      VERIFICATION STATUS STATES                                      │
│                                                                                      │
│  ┌────────────┐                                                                     │
│  │  PENDING   │  Initial state when campaign is launched                            │
│  └─────┬──────┘                                                                     │
│        │                                                                             │
│        ├─► Employee verifies all assets                                             │
│        │   └─► Status: VERIFIED ✓                                                   │
│        │                                                                             │
│        ├─► Employee reports exception                                               │
│        │   └─► Status: EXCEPTION (pending review)                                   │
│        │       │                                                                     │
│        │       ├─► Asset Manager APPROVES                                           │
│        │       │   └─► Status: VERIFIED (with exception note)                       │
│        │       │                                                                     │
│        │       └─► Asset Manager REJECTS                                            │
│        │           └─► Status: PENDING (re-verification required)                   │
│        │                                                                             │
│        └─► Deadline passes without verification                                     │
│            └─► Status: OVERDUE                                                      │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Summary

This comprehensive process flow diagram shows:

1. **6 User Roles** with distinct workflows
2. **Complete verification lifecycle** from campaign creation to completion
3. **Data integration** from ServiceNow and manual uploads
4. **Exception handling** with approval workflow
5. **Comprehensive analytics** aggregating all asset categories
6. **Audit compliance** features throughout
7. **Status state management** for verification tracking

The system is designed for enterprise-scale IT asset management with 800+ users, supporting monthly and annual audit requirements with complete data visibility for Finance users.
