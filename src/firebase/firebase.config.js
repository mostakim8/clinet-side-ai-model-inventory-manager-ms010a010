import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore"; // <-- ADD THIS
// Your web app's Firebase 
import { getStorage } from "firebase/storage";
// configuration (PASTE YOUR KEYS HERE)
const firebaseConfig = {
      apiKey:"AIzaSyDs2yFjxUcwe_m2n8eGV5dBb92btsZQ8-Q",
  authDomain: "ai-model-inventory-manag-4a255.firebaseapp.com",
  projectId: "ai-model-inventory-manag-4a255",
  storageBucket: "ai-model-inventory-manag-4a255.firebasestorage.app",
  messagingSenderId: "231950487718",
  appId: "1:231950487718:web:7756c78bb2ee77c677e467"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // <-- INITIALIZE FIRESTORE HERE
const storage = getStorage(app);
export  {auth,db,app,storage}; // Export the auth object for use in components

export default auth;