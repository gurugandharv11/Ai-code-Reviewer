// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
const firebaseConfig = {
  apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "guruai-reviewer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "guruai-reviewer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "guruai-reviewer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "709695803360",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:709695803360:web:7e48d87dc0797dd37ba585",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WQN485M803"
};

export let app: any = null;
export let auth: any = null;
export let googleProvider: any = null;

if (apiKey && apiKey.length > 10) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (e) {
    console.warn("Firebase initialization failed:", e);
  }
}