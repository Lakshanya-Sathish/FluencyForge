// auth.js
import {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc
} from "./firebase.js";


// ===== Signup =====
export async function signupUser(email, password, name) {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Add user to Firestore
    await setDoc(doc(db, "users", userCred.user.uid), {
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}


// ===== Login =====
export async function loginUser(email, password) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCred.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
