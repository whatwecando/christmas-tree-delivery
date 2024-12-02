import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "sapin-de-saint-roch.firebaseapp.com",
  databaseURL: "https://sapin-de-saint-roch-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sapin-de-saint-roch",
  storageBucket: "sapin-de-saint-roch.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:YOUR_MESSAGING_SENDER_ID:web:YOUR_APP_ID_SUFFIX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
