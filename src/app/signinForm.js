import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { auth } from './firebase-init.js';
import { showMessage } from "./showMessage.js";


const signinForm = document.querySelector('#login-form');
const btnSignin = document.querySelector('#btn-signin');

btnSignin.addEventListener('click', async (e)=>{
    e.preventDefault()
    const email = signinForm['login-email'].value;
    const password = signinForm['login-password'].value;
    
    try {
        const userCredential= await signInWithEmailAndPassword(auth,email,password)
        console.log('userCredential UID:',userCredential.user.uid);

        //const signinModal = document.querySelector('#signinModal')
        //const modal = bootstrap.Modal.getInstance(signinModal)
        //modal.hide()
        window.location.href='../app.html';//si el usario es authenticado se redirige a esta punto ../app.html
        showMessage('Hola!! '+userCredential.user.email,'success')

    } catch (error) {
        console.log(error);
        console.log(error.code);
        if (error.code === 'auth/invalid-email') {
            showMessage('Email incorrecto')
        } else if (error.code === 'auth/wrong-password') {
            showMessage('Contraseña que no cumple con los 6 digitos o es errado')
        } else if (error.code === 'auth/user-not-found') {
            showMessage('El correo ingresado no esta registrado')
        } else{
            showMessage(error.message)
        }
    }
    
})
