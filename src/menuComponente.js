import {menuItems } from "./menuContenido.js";

// Función para generar el menú
function generateMenu() {
    const sidebarMenu = document.getElementById('sidebarMenu');

    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item';

        const a = document.createElement('a');
        a.innerHTML = `
            ${item.icon || '<i class="fas fa-circle"></i>'} 
            <span>${item.title}</span>
            <span class="arrow">
                <i class="fas fa-chevron-right"></i>
            </span>
        `;

        li.appendChild(a);

        // Crear submenu
        if (item.submenu && item.submenu.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'submenu';

            item.submenu.forEach(subItem => {
                const subLi = document.createElement('li');
                subLi.className = 'submenu-item';

                const subA = document.createElement('a');
                subA.href = subItem.url;
                subA.textContent = subItem.title;

                subLi.appendChild(subA);
                ul.appendChild(subLi);
            });

            li.appendChild(ul);

            // Añadir evento para desplegar/contraer submenú
            a.addEventListener('click', function (e) {
                e.preventDefault();

                // Toggle submenu
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('active');

                // Toggle arrow
                const arrow = this.querySelector('.arrow');
                arrow.classList.toggle('active');
            });
        }

        sidebarMenu.appendChild(li);
    });
}

// Generar el menú al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    generateMenu();

    // Referencias a elementos del DOM
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const userSidebar = document.getElementById('userSidebar');
    const overlay = document.getElementById('overlay');

    // Menú izquierdo en móvil
    mobileMenuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        userSidebar.classList.remove('active');
        overlay.classList.toggle('active');
    });

    // Menú de usuario en móvil
    userMenuBtn.addEventListener('click', function () {
        userSidebar.classList.toggle('active');
        sidebar.classList.remove('active');
        overlay.classList.toggle('active');
    });

    // Cerrar menús al hacer clic en el overlay
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        userSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Botón de pantalla completa (solo en PC)
    const fullscreenButton = document.getElementById('fullscreenButton');
    
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', function () {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
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
    }
});