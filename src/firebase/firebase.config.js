// client/src/firebase/firebase.config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration (PASTE YOUR KEYS HERE)
const firebaseConfig = {
  apiKey: "AIzaSyAuvfi_jgn3vYCZrDgIFfhim-G0J_xEm4Q",
  authDomain: "ai-model-inventory-manag-390aa.firebaseapp.com",
  projectId: "ai-model-inventory-manag-390aa",
  storageBucket: "ai-model-inventory-manag-390aa.firebasestorage.app",
  messagingSenderId: "768557931805",
  appId: "1:768557931805:web:5dc639ce895ee1df1c15f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth; // Export the auth object for use in components