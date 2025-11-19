// client/src/providers/AuthProvider.jsx
import { createContext, useEffect, useState, useContext } from 'react';


import { createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged, signOut,GoogleAuthProvider, signInWithPopup,updateProfile } from 'firebase/auth';


import auth from '../firebase/firebase.config'; // Import the initialized auth object

export const AuthContext = createContext(null);

// Google Provider create 
const googleProvider = new GoogleAuthProvider();


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // Observer for user authentication state
     // 🅰️ ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্টার
    const registerUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };
     // 🅱️ ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // 🆎 গুগল দিয়ে লগইন
    const googleLogin = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };


   // 🔑 FIX: Corrected function call to Firebase's updateProfile 
    const updateUserProfile = (name, photoURL) => {
        // Firebase Auth SDK-er shothik 'updateProfile' function call
        return updateProfile(auth.currentUser, { 
            displayName: name,
            photoURL: photoURL
        });
    }


    // Logout function
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };


        useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
            console.log('Current User:', currentUser);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const authInfo = {
        user,
        loading,
        logOut,
        registerUser,
        loginUser,
        googleLogin,
        updateUserProfile, // Ekhon shothik function byabohar kora jabe
        auth,
        

        // Include other auth methods (login, register) here later
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;