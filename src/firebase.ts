import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
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
        // En móviles y PWA es mejor usar popup o capturar el error sin que rompa la app
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
    } catch (error: any) {
        console.error("Error signing in with Google", error);
        // Evitamos que la app falle si el usuario cierra el popup o hay un error de dominio
        if (error.code === 'auth/popup-closed-by-user') {
            console.log("El usuario cerró el popup de inicio de sesión.");
            return null;
        }
        alert("No se pudo iniciar sesión con Google. Asegúrate de estar en un entorno seguro o intenta nuevamente.");
        return null;
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
