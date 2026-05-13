// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCulPnzUg86Szlcb85HIJUnkOX0Q3N1-zw",
  authDomain: "guruai-reviewer.firebaseapp.com",
  projectId: "guruai-reviewer",
  storageBucket: "guruai-reviewer.firebasestorage.app",
  messagingSenderId: "709695803360",
  appId: "1:709695803360:web:7e48d87dc0797dd37ba585",
  measurementId: "G-WQN485M803"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);