import { signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { auth } from "./firebase-init.js";

const logout = document.querySelector('#btn-logout')
if (logout) {
    logout.addEventListener('click',async ()=>{
        await signOut(auth);
        location.href='./login.html';
        console.log('User signed out...');
    })
} else {
    console.log('No hay boton logout...');
    
}

