import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZACfckXf1eIn9jEUp3g96OBViEyEOFg8",
  authDomain: "ultragraphicox.firebaseapp.com",
  projectId: "ultragraphicox",
  storageBucket: "ultragraphicox.firebasestorage.app",
  messagingSenderId: "39159254765",
  appId: "1:39159254765:web:bb5838f4cead5c2fc7c6e4",
  measurementId: "G-HR6GDTWS2D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        // Guardar el usuario en Firestore automáticamente cuando inicia sesión
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);
        if(!userSnap.exists()) {
             await setDoc(userRef, {
                 name: result.user.displayName,
                 email: result.user.email,
                 photoURL: result.user.photoURL,
                 registeredAt: new Date().toISOString()
             });
        }
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
};
