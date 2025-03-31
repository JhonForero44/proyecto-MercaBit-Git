// src/services/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {app} from "@/firebase/FirebaseConfig"; // Importa tu configuración existente

const auth = getAuth(app);
const db = getFirestore(app);

// Función para registrar usuario
export const registerUser = async (name, cedula, userType, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      cedula,
      userType,
      email
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Función para iniciar sesión
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Función para cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
