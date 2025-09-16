// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBtquyfHEJkMK0groKpNi1FMsQCuNubjFk",
//   authDomain: "ayurvedic-meal-planner.firebaseapp.com",
//   projectId: "ayurvedic-meal-planner",
//   storageBucket: "ayurvedic-meal-planner.firebasestorage.app",
//   messagingSenderId: "378850125958",
//   appId: "1:378850125958:web:ef4e955b3517eb8a5d0907",
//   measurementId: "G-TW368854VX"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Read the JSON file manually
const serviceAccountPath = path.resolve("./serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export { db };
  