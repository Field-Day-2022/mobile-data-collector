import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmjxPpYBWe1gwBvDXka9-Fk4zRuWPQw-Y",
  authDomain: "asu-field-day.firebaseapp.com",
  databaseURL: "https://asu-field-day-default-rtdb.firebaseio.com",
  projectId: "asu-field-day",
  storageBucket: "asu-field-day.appspot.com",
  messagingSenderId: "470318492986",
  appId: "1:470318492986:web:0e14ad60aaf2ca37fc7403",
  measurementId: "G-3DBWYMJ1S8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);