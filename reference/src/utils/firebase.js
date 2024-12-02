import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "sapin-de-saint-roch.firebaseapp.com",
  databaseURL: "https://sapin-de-saint-roch-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sapin-de-saint-roch",
  storageBucket: "sapin-de-saint-roch.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:YOUR_MESSAGING_SENDER_ID:web:YOUR_APP_ID_SUFFIX"
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