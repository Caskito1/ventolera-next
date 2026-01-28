// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAONtao0udgnK7_wF8S2NBw5C3qdViUyWs",
  authDomain: "ventolera-cc6ba.firebaseapp.com",
  projectId: "ventolera-cc6ba",
  storageBucket: "ventolera-cc6ba.appspot.com",
  messagingSenderId: "138586295657",
  appId: "1:138586295657:web:eb3ee9484ac2573e9141f8"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
