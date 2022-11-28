// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfINw9nW54GECIu-0TWkglIZT8Zo7ofis",
    authDomain: "clone-bf944.firebaseapp.com",
    projectId: "clone-bf944",
    storageBucket: "clone-bf944.appspot.com",
    messagingSenderId: "660662038078",
    appId: "1:660662038078:web:55141c21b5724b844a2b6f",
    measurementId: "G-JE3H25GDPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;