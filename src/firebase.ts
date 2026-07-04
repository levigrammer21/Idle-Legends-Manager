import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

export const firebaseConfig = {
  apiKey: 'AIzaSyA0wHZaUESU1cdmWtp0nRpvEPytHcitIA4',
  authDomain: 'idle-legends-manager.firebaseapp.com',
  projectId: 'idle-legends-manager',
  storageBucket: 'idle-legends-manager.firebasestorage.app',
  messagingSenderId: '522871886650',
  appId: '1:522871886650:web:a21005dc71a933b8c97603'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  try { connectFunctionsEmulator(functions, '127.0.0.1', 5001); } catch {}
}
