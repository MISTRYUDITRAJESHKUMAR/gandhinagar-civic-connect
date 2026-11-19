# 🏛️ GANDHINAGAR CIVIC CONNECT (ગાંધીનગર સિવિક કનેક્ટ)
### Production-Ready Citizen Complaint Reporting & Municipal Monitoring Platform

Built strictly following the **Complete Project Blueprint** for Gandhinagar Municipal Corporation (GMC).

---

## 🌟 Key Highlights & Senior Architectural Design

1. **5 Role-Segregated Dashboards (Strict RBAC)**:
   - 🧑 **Citizen Portal**: Lodge complaints with live GPS/Leaflet pin, image preview, duplicate detection alert, real-time 11-step progress tracker, 5-star feedback rating, and case reopening.
   - 🛡️ **Municipal Admin Command Desk**: City-wide verification queue, duplicate complaint linking, department allocation, priority assignment, SLA enforcement, and comprehensive audit logs.
   - 👥 **Ward Corporator Hub**: Dedicated ward filtering (Wards 1 to 10 covering Sectors 1-30, Infocity, Kudasan, Sargasan, Vavol, Pethapur), spatial incident map, recurring hotspot detection, and ward report generation.
   - 💼 **Department Officer Console**: Separate views for Sanitation, Roads & Civil, Electrical, Drainage, and Public Infrastructure. Dispatch field workers with work order instructions, set target dates, and inspect submitted completion proofs.
   - 👷 **Field Worker Hub**: Mobile-first responsive UI, direct Google Maps GPS navigation links, "Mark as Started", before/after photo upload, and completion notes submission.

2. **🔥 Firebase Database & Authentication Ready**:
   - Pre-configured for **Google Cloud Firestore**, **Firebase Authentication**, and **Firebase Storage**.
   - Built with **dual-engine resilience**:
     - *Live Firebase Mode*: When you provide your Firebase credentials in `.env`, the app automatically connects directly to your live Firestore and seeds collections!
     - *Smart Offline Demo Mode*: Zero-setup fallback with realistic Gandhinagar seed data and local persistence so you can test every workflow immediately without delay.

3. **🗺️ Interactive OpenStreetMap (Leaflet)**:
   - Centered on Gandhinagar (23.2156° N, 72.6369° E).
   - Dynamic marker clustering with status and priority color-coding.
   - Interactive pinpointing with browser Geolocation API.

---

## 📍 WHERE TO ADD YOUR FIREBASE API KEYS

Open the `.env` file at the root of the project:
```env
# ============================================================
# GANDHINAGAR CIVIC CONNECT - FIREBASE CONFIGURATION
# ============================================================

VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

> **Detailed Guide**: See [`FIREBASE_SETUP_GUIDE.md`](./FIREBASE_SETUP_GUIDE.md) for step-by-step instructions on enabling Firebase Auth, Firestore Database, and Storage in 3 minutes.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## 🎭 1-Click Evaluation Persona Switcher
In the top navigation bar, click the **Role Badge** to test all 5 personas without logging in and out:
- **Citizen**: Aarav Patel (`citizen@gandhinagar.gov.in`)
- **Municipal Admin**: S. K. Mehta (IAS) (`admin@gandhinagar.gov.in`)
- **Ward Corporator**: Rajeshbhai Vaghela (`corporator@gandhinagar.gov.in`)
- **Department Officer**: Dr. Priyaben Joshi (`officer@gandhinagar.gov.in`)
- **Field Worker**: Vikram Rathod (`worker@gandhinagar.gov.in`)

---

## 🔄 11-Step Complete Lifecycle Testing Walkthrough
1. **Citizen**: Click **"Report Problem"**, pick Sector 21, upload photo, click **"Submit Civic Complaint"** -> Unique ID created (e.g. `GCC-2026-000105`).
2. **Municipal Admin**: Switch to Admin -> Open **"Pending Verification Queue"** -> Click **"Verify & Assign"** -> Assign to Sanitation Dept with High priority.
3. **Department Officer**: Switch to Dept Officer -> View complaint under Sanitation -> Dispatch to Field Worker Vikram Rathod.
4. **Field Worker**: Switch to Field Worker -> Click **"Start Work"** -> Upload Before/After resolution photos -> Click **"Submit Completion Proof"**.
5. **Department Officer**: Open case -> Inspect before/after photos -> Click **"Approve Resolution"** -> Status becomes `Resolved`.
6. **Citizen**: Switch back to Citizen -> Notice real-time notification -> Rate 5 stars and click **"Confirm & Close Complaint"**!
