import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAninm3NdURp4BNSZrVPyOrH4-gZ3v0GtM",
  authDomain: "sapin-de-saint-roch.firebaseapp.com",
  databaseURL: "https://sapin-de-saint-roch-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sapin-de-saint-roch",
  storageBucket: "sapin-de-saint-roch.firebasestorage.app",
  messagingSenderId: "1076636579999",
  appId: "1:1076636579999:web:5359ad872bf4152791caaa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Connexion réussie");
    return userCredential.user;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export { app, auth, db };