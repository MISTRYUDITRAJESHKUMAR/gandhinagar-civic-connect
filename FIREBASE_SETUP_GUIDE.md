# 🔥 FIREBASE CONFIGURATION GUIDE - GANDHINAGAR CIVIC CONNECT

Welcome to **Gandhinagar Civic Connect**! This project is 100% pre-architected to work with **Google Firebase** (Firebase Authentication, Cloud Firestore Database, and Firebase Storage).

---

## 📍 Where to Add Your Firebase API Keys

There are **two easy ways** to connect your live Firebase project:

### Method 1: In `.env` File (Recommended)
Open the `.env` file in the root folder (`clean-gandhinagar/.env`) and paste your keys:

```env
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxx-xxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Method 2: Directly in `src/config/firebase.js`
Alternatively, you can open [src/config/firebase.js](file:///c:/Users/admin/Downloads/clean-gandhinagar/src/config/firebase.js) and paste the values into the `firebaseConfig` object directly.

---

## 🚀 Step-by-Step: How to Get Your Firebase Credentials (in 3 Minutes)

1. **Go to Firebase Console**:
   Visit [https://console.firebase.google.com/](https://console.firebase.google.com/) and click **"Add Project"** (e.g. `gandhinagar-civic-connect`).

2. **Register a Web App**:
   - In project overview, click the **Web icon (`</>`)**.
   - App nickname: `Gandhinagar Civic Portal`.
   - Click **Register App**.
   - Copy the `firebaseConfig` keys into your `.env` or `src/config/firebase.js`.

3. **Enable Firebase Authentication**:
   - In Firebase sidebar, click **Build > Authentication**.
   - Click **Get Started**.
   - Under Sign-in method, enable **Email/Password**.
   - (Optional) Enable **Anonymous** or **Phone** if desired.

4. **Enable Cloud Firestore Database**:
   - In Firebase sidebar, click **Build > Firestore Database**.
   - Click **Create Database**.
   - Choose location (e.g. `asia-south1 (Mumbai)` for fastest Gujarat / India performance).
   - Start in **Test Mode** (or see security rules below).
   - Click **Enable**.

5. **Enable Firebase Storage (for Complaints & Resolution Photos)**:
   - In Firebase sidebar, click **Build > Storage**.
   - Click **Get Started** in Test Mode.
   - Click **Done**.

---

## 🔒 Recommended Firestore Security Rules

When you are ready for production, go to **Firestore > Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Complaints collection
    match /complaints/{complaintId} {
      allow read: if true; // Public transparency / civic tracking
      allow create: if request.auth != null; // Registered citizens/users can submit
      allow update: if request.auth != null; // Admins, officers, workers can update workflow
      allow delete: if false; // Audit logs & complaints must never be deleted
    }
    
    // User Profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
    
    // Reference Wards & Departments
    match /wards/{wardId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /departments/{deptId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🛡️ Built-in Resilience & Automatic Seeding
- **Auto-Sync:** If you launch without Firebase keys, the system runs with local persistence pre-populated with Gandhinagar sectors, wards, and realistic complaint workflows so you can evaluate everything immediately.
- **Auto-Seed:** As soon as you add your real Firebase API keys and refresh, the app detects Firebase and automatically seeds the `complaints`, `wards`, and `departments` collections into your live Firestore!
