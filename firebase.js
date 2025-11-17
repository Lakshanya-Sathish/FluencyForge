// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

import { 
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ⭐ REPLACE with your real Firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyAglxk-LFScrn_w0eTm1PU-02u2RfOMPpU",
  authDomain: "fluencyforge-219a5.firebaseapp.com",
  projectId: "fluencyforge-219a5",
  storageBucket: "fluencyforge-219a5.firebasestorage.app",
  messagingSenderId: "952473992612",
  appId: "1:952473992612:web:730fac5a3702ba98625531",
  measurementId: "G-9YRX24W8DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export everything needed
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc
};
