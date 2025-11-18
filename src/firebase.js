// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7R7HJVN5empIALPuENMeN-muatetmlyM",
  authDomain: "arroces-c8428.firebaseapp.com",
  projectId: "arroces-c8428",
  storageBucket: "arroces-c8428.firebasestorage.app",
  messagingSenderId: "789237843946",
  appId: "1:789237843946:web:54630f4bf0cd57ada91493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { db}