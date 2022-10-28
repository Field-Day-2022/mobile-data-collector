import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAmjxPpYBWe1gwBvDXka9-Fk4zRuWPQw-Y',
    authDomain: 'asu-field-day.firebaseapp.com',
    databaseURL: 'https://asu-field-day-default-rtdb.firebaseio.com',
    projectId: 'asu-field-day',
    storageBucket: 'asu-field-day.appspot.com',
    messagingSenderId: '470318492986',
    appId: '1:470318492986:web:0e14ad60aaf2ca37fc7403',
    measurementId: 'G-3DBWYMJ1S8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
connectFirestoreEmulator(db, 'localhost', 8080);
// const analytics = getAnalytics(app);
