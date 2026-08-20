import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBofs5UZ1oWHp4Gk-n6hiXz00IC2FXBAdw",
  authDomain: "elaxora-466c4.firebaseapp.com",
  projectId: "elaxora-466c4",
  storageBucket: "elaxora-466c4.firebasestorage.app",
  messagingSenderId: "103145495702",
  appId: "1:103145495702:web:cd17a2c15046b6051bf6b7",
  measurementId: "G-9B65FDTRZK"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
