import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSbHpryzUr2bF2gNhi1G2m9nd2tSG7cXw",
  authDomain: "expense-split-app-9bdcf.firebaseapp.com",
  projectId: "expense-split-app-9bdcf",
  storageBucket: "expense-split-app-9bdcf.appspot.com",
  messagingSenderId: "741470304173",
  appId: "1:741470304173:web:c395809a16c6cc36615324",
  measurementId: "G-YEY6EH1MR0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };