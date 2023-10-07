// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRABSE_API,
  authDomain: "mern-estate-ee9d2.firebaseapp.com",
  projectId: "mern-estate-ee9d2",
  storageBucket: "mern-estate-ee9d2.appspot.com",
  messagingSenderId: "203409728689",
  appId: "1:203409728689:web:769d5d766dfce5a0a0ae90",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
