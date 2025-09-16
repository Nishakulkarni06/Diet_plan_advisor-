// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtquyfHEJkMK0groKpNi1FMsQCuNubjFk",
  authDomain: "ayurvedic-meal-planner.firebaseapp.com",
  projectId: "ayurvedic-meal-planner",
  storageBucket: "ayurvedic-meal-planner.firebasestorage.app",
  messagingSenderId: "378850125958",
  appId: "1:378850125958:web:ef4e955b3517eb8a5d0907",
  measurementId: "G-TW368854VX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);