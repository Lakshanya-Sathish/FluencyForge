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
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// ---------------- YOUR FIREBASE CONFIG ----------------
const firebaseConfig = {
  apiKey: "AIzaSyAglxk-LFScrn_w0eTm1PU-02u2RfOMPpU",
  authDomain: "fluencyforge-219a5.firebaseapp.com",
  projectId: "fluencyforge-219a5",
  storageBucket: "fluencyforge-219a5.firebasestorage.app",
  messagingSenderId: "952473992612",
  appId: "1:952473992612:web:730fac5a3702ba98625531",
  measurementId: "G-9YRX24W8DJ"
};

const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc
};