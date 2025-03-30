import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"
import { getFirestore, doc,setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { auth, firebaseApp } from './firebase-init.js';
import { showMessage } from "./showMessage.js";

const signupForm = document.getElementById('signup-form');
const signupBtn = document.querySelector('#btn-signup');


signupBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log('signup Form:', signupForm);

    const name = signupForm['signup-name'].value
    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    //console.log('signup Form:', email, password);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        console.log('userCredential UID:',userCredential.user.uid);
        //comexion a base datos 
        const dbFirestore = getFirestore(firebaseApp)
        const UsuariosRef=doc(dbFirestore,`Usuarios/${userCredential.user.uid}`)
        //registrar usario en tabla usuarios
        setDoc(UsuariosRef,{userName:name,email:email,password:password,rolUser:'user'})
        
        //const signupModal = document.querySelector('#signupModal')
        //const modal = bootstrap.Modal.getInstance(signupModal)
        //modal.hide()
        showMessage('Bienvenido '+userCredential.user.email,'success')
        location.href='../login.html';

    } catch (error) {
        console.log(error);
        console.log(error.code);
        if (error.code === 'auth/invalid-email') {
            showMessage('Email incorrecto')
        } else if (error.code === 'auth/weak-password') {
            showMessage('Contraseña que no cumple con los 6 digitos o es muy debil')
        } else if (error.code === 'auth/email-already-in-use') {
            showMessage('El correo ingresado ya esta registrado')
        } else{
            showMessage(error.showMessage)
        }
    }
})



