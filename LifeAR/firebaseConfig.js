import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAb0HbiOVISSPFyHs8NZVqqvegPMSW88Sc",
  authDomain: "lifear-project.firebaseapp.com",
  projectId: "lifear-project",
  storageBucket: "lifear-project.firebasestorage.app",
  messagingSenderId: "253745566802",
  appId: "1:253745566802:android:7a0f49b2c64c26488cfb8b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;