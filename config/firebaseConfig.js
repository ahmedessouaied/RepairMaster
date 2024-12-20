import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBUlpBzH2HsnWwyOZmHklSu7sApcpY7vxE",
    authDomain: "repairmaster-supcom.firebaseapp.com",
    projectId: "repairmaster-supcom",
    storageBucket: "repairmaster-supcom.firebasestorage.app",
    messagingSenderId: "396887731178",
    appId: "1:396887731178:web:dcf7bfab9a6192f5e3a093",
    measurementId: "G-B16CTVJ0RF"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Auth with correct error handling
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };
export default app;
