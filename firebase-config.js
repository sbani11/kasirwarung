// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAj_cVsmVT9n375KmB3gX-SyCXxQiuMydI",
  authDomain: "kasirwarung-381d7.firebaseapp.com",
  projectId: "kasirwarung-381d7",
  storageBucket: "kasirwarung-381d7.appspot.com", // diperbaiki formatnya
  messagingSenderId: "7215017094",
  appId: "1:7215017094:web:94b385a31c470ec9e63507",
  measurementId: "G-5G8XLFSKYC"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore database
export const db = getFirestore(app);
