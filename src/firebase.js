import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1nmGvmu7QXvutLt4y4MNnhW8C3lU4eXk",
  authDomain: "meals-on-wings.firebaseapp.com",
  databaseURL: import.meta.env.VITE_REACT_APP_FIREBASE_DATABASE_URL,
  projectId: "meals-on-wings",
  storageBucket: "meals-on-wings.appspot.com",
  messagingSenderId: "886077398226",
  appId: "1:886077398226:web:44926d6b12ba3531c7610b",
  measurementId: "G-5S10SF1N5H"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, firestore, storage, auth };
