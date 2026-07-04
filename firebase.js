import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getFunctions,
  httpsCallable
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0wHZaUESU1cdmWtp0nRpvEPytHcitIA4",
  authDomain: "idle-legends-manager.firebaseapp.com",
  projectId: "idle-legends-manager",
  storageBucket: "idle-legends-manager.firebasestorage.app",
  messagingSenderId: "522871886650",
  appId: "1:522871886650:web:a21005dc71a933b8c97603"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

export const fb = {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  onSnapshot,
  httpsCallable
};

getRedirectResult(auth).catch(() => {});
