// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyBfxYYrvBKbDEt0VNmFAyLGaSS9WzbMx6A",
    authDomain: "fir-crud-b6554.firebaseapp.com",
    projectId: "fir-crud-b6554",
    storageBucket: "fir-crud-b6554.appspot.com",
    messagingSenderId: "117285018947",
    appId: "1:117285018947:web:e08ffbe2963e5fe2d0e3f6"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const dbFirestore   = getFirestore(firebaseApp);