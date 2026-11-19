import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ============================================================================
// 🔥 FIREBASE CONFIGURATION CENTER FOR GANDHINAGAR CIVIC CONNECT
// ============================================================================
// You can either:
// OPTION A: Set these in the `.env` file at the root of the project (Recommended):
//           VITE_FIREBASE_API_KEY=AIzaSy...
//           VITE_FIREBASE_AUTH_DOMAIN=...
//
// OPTION B: Replace the fallback strings below directly with your Firebase Web App credentials!
// ============================================================================

const getEnv = (key, fallback) => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch {}
  return fallback;
};

export const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "AIzaSyCH_aRxn0uG9Us07gvJsuL2baikylG-Rfc"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "west-manage.firebaseapp.com"),
  databaseURL: getEnv("VITE_FIREBASE_DATABASE_URL", "https://west-manage-default-rtdb.asia-southeast1.firebasedatabase.app"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "west-manage"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "west-manage.firebasestorage.app"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "361990501727"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "1:361990501727:web:06baf02d857972b59b72ea")
};

// Check if actual user Firebase credentials have been configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("YOUR_FIREBASE_API_KEY") &&
  !firebaseConfig.apiKey.includes("your_firebase_api_key")
);

let app = null;
let auth = null;
let db = null;
let storage = null;

const isNodeTest = typeof process !== 'undefined' && process.env && process.env.TEST_MODE === 'true';

if (isFirebaseConfigured && !isNodeTest) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("🔥 [Firebase] Successfully connected to live Firebase Project:", firebaseConfig.projectId);
  } catch (error) {
    console.warn("⚠️ [Firebase] Initialization failed. Falling back to local offline-resilient store:", error);
  }
} else if (isNodeTest) {
  console.log("⚡ [Test Suite] Running in Fast Store for Project:", firebaseConfig.projectId);
} else {
  console.log("ℹ️ [Firebase] Running in Smart Local Demo Store. Add your keys in .env to switch to live Firebase!");
}

export { app, auth, db, storage };
