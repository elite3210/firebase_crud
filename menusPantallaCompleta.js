import { MenuManager } from './src/menuComponent.js';
import { menuItems } from './src/contenidoMenu.js';

// renderizado y Configuración básica del menu
const menuManager = new MenuManager('navbar', { leftMenu: menuItems });
menuManager.init();
menuManager.updateMenuItem('rightMenu', 1, {
    title: 'Iniciar Sesión',
    submenu: [
        { title: 'Login', url: 'login.php' },
        { title: 'Registro', url: 'register.php' }
    ]
});



document.addEventListener('DOMContentLoaded', function() {
    // Manejar el botón de pantalla completa
    const fullscreenButton = document.getElementById('fullscreenButton');
    const app = document.getElementById('app');

    fullscreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            if (app.requestFullscreen) {
                app.requestFullscreen();
            } else if (app.webkitRequestFullscreen) {
                app.webkitRequestFullscreen();
            } else if (app.msRequestFullscreen) {
                app.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    });

    // Prevenir el scroll y el rebote en iOS
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    // Ocultar la barra de dirección al cargar
    window.addEventListener('load', function() {
        // Pequeño delay para asegurar que funcione
        setTimeout(function() {window.scrollTo(0, 1);}, 0);
    });
});