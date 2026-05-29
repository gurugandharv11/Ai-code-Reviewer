// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "guruai-reviewer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "guruai-reviewer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "guruai-reviewer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "709695803360",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:709695803360:web:7e48d87dc0797dd37ba585",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-WQN485M803"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);