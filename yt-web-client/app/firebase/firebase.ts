// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth";

import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADUYXUKL8CBppGVOHBR-3qFXLCpKESJ24",
  authDomain: "yt-clone-aa296.firebaseapp.com",
  projectId: "yt-clone-aa296",    
  appId: "1:1007598931989:web:f086b720c4f58dba3d3e1c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const functions = getFunctions(app);

export function signWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChangeHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}