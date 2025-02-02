// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5l2czMHFS1znxupVlQ6yLEpJ6PQt1Pgw",
  authDomain: "result-management-system-3e5ca.firebaseapp.com",
  projectId: "result-management-system-3e5ca",
  storageBucket: "result-management-system-3e5ca.firebasestorage.app",
  messagingSenderId: "47617742692",
  appId: "1:47617742692:web:4616632aa7e7cec4470c71",
  measurementId: "G-DKJS6Z1B9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };