// auth.js
import {
  auth,
  db,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "./firebase.js";

// ---------------- SIGNUP ----------------
export async function signupUser(email, password, fullName) {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // ⭐ Create Firestore user document
    await setDoc(doc(db, "users", res.user.uid), {
      name: fullName,
      email: email,
      hasTakenTest: false,
      createdAt: new Date()
    });

    return { success: true, user: res.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ---------------- LOGIN ----------------
export async function loginUser(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: res.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}