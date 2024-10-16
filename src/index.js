import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'jotai';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LoginWrapper } from './pages/LoginWrapper';
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
export const auth = getAuth(app);

enableIndexedDbPersistence(db).catch((error) => {
    if (error.code === 'failed-precondition') {
        console.error('Offline persistence only supported with 1 tab open at a time');
    } else if (error.code === 'unimplemented') {
        console.error('Browser does not support offline persistence');
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider>
            <LoginWrapper>
                <App />
            </LoginWrapper>
        </Provider>
    </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
