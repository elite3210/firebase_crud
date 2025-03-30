import { getDoc, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { auth, dbFirestore } from "./app/firebase-init.js";
import { loginCheck } from "./app/loginCheck.js";
import { MenuManager } from './menuComponent.js';
import { menuItems } from './contenidoMenu.js';

// Configuración básica del menu
const menuManager = new MenuManager('navbar', { leftMenu: menuItems });
menuManager.init();
menuManager.updateMenuItem('rightMenu', 1, {
    title: 'Iniciar Sesión',
    submenu: [
        { title: 'Login', url: 'login.php' },
        { title: 'Registro', url: 'register.php' }
    ]
});

onAuthStateChanged(auth, async (user) => {//esto es para mostrar datos de la DB segun este registrado el usuario
    

    loginCheck(user)

    if (user) {

        //traer el nombre del usario autenthicado
        const usuariosRef = doc(dbFirestore, `Usuarios/${user.uid}`)
        const usuarioCifrada = await getDoc(usuariosRef)
        //escribe nombre de usario
        const btnUserName = document.querySelector('#btn-userName')
        btnUserName.textContent = usuarioCifrada.data().userName;

    } else {
        console.log('registrase para ingresar al sistema');

    }
})
