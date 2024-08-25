import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDocs, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "salestrack-b3c07.firebaseapp.com",
  projectId: "salestrack-b3c07",
  storageBucket: "salestrack-b3c07.appspot.com",
  messagingSenderId: "537089357138",
  appId: "1:537089357138:web:bad9eebf2dc237ed70768b",
  measurementId: "G-KWJ9C286BC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app);
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc,getDocs };
