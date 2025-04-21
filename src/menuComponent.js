
export class MenuManager {
    constructor(targetId, config = {}) {
        // Elemento donde se renderizará el menú
        this.targetElement = document.getElementById(targetId);
        if (!this.targetElement) {
            throw new Error(`Elemento con id '${targetId}' no encontrado`);
        }


        // Configuración por defecto
        this.config = {
            // Configuración de botones
            rightButtonContent: '☻',
            rightButtonCloseContent: 'X',
            leftButtonContent: '☰',

            // Configuración de estilos
            menuWidth: '50vw',
            menuWidthPC: '300px',
            transitionTime: '3s',
            theme: 'default', // Permite diferentes temas
            // Configuración de menús
            //leftMenu:'insertarMenu',

            rightMenu: [
                {
                    title: 'Perfil',
                    submenu: [
                        { title: 'Mi Cuenta', url: 'profile.php' },
                        { title: 'Cerrar Sesión', url: 'logout.php' }
                    ]
                }
            ],

            // Callbacks personalizados
            onMenuToggle: null,
            onSubmenuToggle: null,

            ...config
        };

        // Inyectar estilos
        this.injectStyles();

        // Renderizar estructura inicial
       // this.renderInitialStructure();

        // Selectores
        this.selectors = {
            menuToggle: '.menu-toggle',
            menuToggleRight: '.menu-toggle-right',
            menu: '.menu',
            menuRight: '.menu-right',
            menuLink: '.menu-link',
            menuItem: '.menu-item',
            submenu: '.submenu',
            submenuItem: '.submenu-item'
        };

        // Estado
        this.state = {
            isPCView: window.innerWidth > 768,
            activeMenus: new Set(),
            activeSubmenus: new Set()
        };

        // Inicialización
        this.initializeElements();
        this.bindEvents();
        this.renderMenus();
    }

    // Inyectar estilos en el documento
    injectStyles() {
        if (!document.getElementById('menu-manager-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'menu-manager-styles';
            styleSheet.textContent = `
        /* Variables globales */
:root {
    --primary-color: #090947;
    --secondary-color: #34495e;
    --hover-color: #3498db;
    --text-color: #a0e8fa;
    --text-color-menu: rgba(68, 71, 247, 0.5);
    --text-color-hover: #ffffff;
    --navbar-height: 54px;
    --menu-width: 50vw;
    --transition-time: 1s;
}
        
        /* Aquí van todos los estilos del menú */
        .navbar {
            /* ... estilos ... */
        }
        /* Reset y estilos base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #73d4d7;
}

/* Navbar principal */
.navbar1 {
    background-color: var(--primary-color);
    padding: 0 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    position: relative;
}

/* Contenedores de navegación */
.nav-container,
.nav-container-right {
    position: relative;
    display: flex;
}

.nav-container-right {
    display: none;
}

/* Estilos de menú común */
.menu,
.menu-right {
    list-style: none;
    display: flex;
    transition: transform var(--transition-time) ease;
}

/* Elementos del menú */
.menu-item {
    position: relative;
}

.menu-link {
    display: block;
    padding: 15px 20px;
    color: var(--text-color);
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.3s;
}

.menu-link:hover {
    background-color: var(--text-color-menu);
    color: var(--text-color-hover);
}

/* Submenús */
.submenu {
    display: none;
    position: absolute;
    background-color: var(--secondary-color);
    min-width: 200px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
}

.submenu-item {
    display: block;
    padding: 12px 20px;
    color: var(--text-color);
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.3s;
    background-color: var(--secondary-color);
    /*magenta;*/
}

.submenu-item:hover {
    background-color: var(--hover-color);
}

/* Botones de toggle */
.menu-toggle,
.menu-toggle-right {
    display: none;
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    padding: 10px;
    cursor: pointer;
}

.menu-toggle {
    padding-right: 25px;
}

/* Modificar la visibilidad del contenedor derecho y el botón */
.nav-container-right {
    display: flex;
    /* Cambiado de 'none' a 'flex' */
    align-items: center;
    justify-content: flex-end;
}

.menu-toggle-right {
    display: block;
    /* Cambiado de 'none' a 'block' */
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    padding: 10px;
    cursor: pointer;
    margin-right: -20px;
}

/* Mantener el menú derecho oculto en PC */
.menu-right {
    display: none;
}

/* Estilos base para el menú derecho */
.menu-right {
    display: none;
    flex-direction: column;
    width: var(--menu-width);
    position: fixed;
    right: 0;
    top: var(--navbar-height);
    height: calc(100vh - var(--navbar-height));
    background-color: var(--primary-color);
    transform: translateX(100%);
    transition: transform var(--transition-time) ease;
}

/* Estado activo del menú derecho (común para PC y móvil) */
.menu-right.active {
    display: flex;
    transform: translateX(0);
}

.menu-icon-company {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-color);
    color: var(--text-color-hover);
    font-size: 24px;
    padding: 10px;
    cursor: pointer;
    margin-left: -15px;
    padding: 0px;
    border: 0px;
}

/* Ajustes específicos para PC */
@media screen and (min-width: 769px) {
    .menu-right {
        width: 300px;
        /* O el ancho que prefieras para PC */
    }

    .submenu {
        
        background-color: var(--primary-color);
        width: 100%;
        padding-left: 3px;
    }

}


/* Estilos para móvil */
@media screen and (max-width: 768px) {

    /* Contenedores en móvil */
    .nav-container-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    /* Botones toggle en móvil */
    .menu-toggle,
    .menu-toggle-right {
        display: block;
    }

    .menu-toggle {
        margin-left: -15px;
    }

    .menu-toggle-right {
        margin-right: -20px;
    }

    /* Menús en móvil */
    .menu,
    .menu-right {
        display: none;
        flex-direction: column;
        width: var(--menu-width);
        position: fixed;
        top: var(--navbar-height);
        height: calc(100vh - var(--navbar-height));
        background-color: var(--primary-color);
    }

    .menu {
        left: 0;
        transform: translateX(-100%);
    }

    .menu-right {
        right: 0;
        transform: translateX(100%);
    }

    /* Estados activos de los menús */
    .menu.active {
        display: flex;
        transform: translateX(0);
    }

    /* ... resto del código media query ... */

    .menu-right.active {
        display: flex;
        transform: translateX(0);
    }

    /* Ajustes de submenús en móvil */
    .submenu {
        position: static;
        background-color: var(--primary-color);
        padding-left: 20px;
    }

    .menu-item {
        width: 100%;
    }
}
    `;
            document.head.appendChild(styleSheet);
        }
    }

    // Renderizar estructura inicial
    renderInitialStructure() {
        this.targetElement.innerHTML = `
    <div class="navbar1">
        <div class="nav-container">
            <button class="menu-toggle">☰</button>
            <button class="menu-icon-company" id=""fullscreenButton>Heinz Sport</button>
            <ul class="menu"></ul>
        </div>
        <div class="nav-container-right">
            <button id="btn-userName" style="background-color:transparent;color:magenta; border:none;"></button>
            <button class="menu-toggle-right">☻</button>
            <ul class="menu-right"></ul>
        </div>
    </div>
`;
    }

    // Inicialización de elementos DOM
    initializeElements() {
        this.elements = {
            menuLeft: document.querySelector(this.selectors.menu),
            menuRight: document.querySelector(this.selectors.menuRight),
            toggleLeft: document.querySelector(this.selectors.menuToggle),
            toggleRight: document.querySelector(this.selectors.menuToggleRight)
        };
    }

    // Vinculación de eventos
    bindEvents() {
        this.handleSubmenuClick = this.handleSubmenuClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    // Métodos de renderizado
    renderMenus() {
        this.renderMenu(this.config.leftMenu, this.elements.menuLeft);
        this.renderMenu(this.config.rightMenu, this.elements.menuRight);
        this.setButtonContent(this.config.rightButtonContent);
        this.elements.toggleLeft.innerHTML = this.config.leftButtonContent;
    }

    renderMenu(menuConfig, container) {
        if (!container) return;

        // Crear el contenido del menú
        container.innerHTML = menuConfig.map(item => `
    <li class="menu-item">
        <a href="javascript:void(0)" class="menu-link">
            ${item.title}
        </a>
        ${this.renderSubmenu(item.submenu)}
    </li>
`).join('');

        // Volver a agregar los event listeners después de renderizar
        this.attachMenuEventListeners(container);
    }

    renderSubmenu(submenuItems) {
        if (!submenuItems?.length) return '';

        return `
    <div class="submenu">
        ${submenuItems.map(item => `
            <a href="${item.url}" class="submenu-item">
                ${item.title}
            </a>
        `).join('')}
    </div>
`;
    }

    // Nuevo método para adjuntar event listeners
    attachMenuEventListeners(container) {
        // Agregar event listeners a los menu-link
        container.querySelectorAll(this.selectors.menuLink).forEach(link => {
            link.addEventListener('click', this.handleSubmenuClick.bind(this));
        });
    }

    // Métodos de gestión de contenido
    setButtonContent(content, options = {}) {
        const { silent = false } = options;

        if (!content && !silent) {
            console.warn('Contenido del botón no especificado');
            return false;
        }

        if (this.elements.toggleRight) {
            this.elements.toggleRight.innerHTML = content;

            const event = new CustomEvent('buttonContentChanged', {
                detail: { content, timestamp: new Date() }
            });
            this.elements.toggleRight.dispatchEvent(event);

            return true;
        }

        return false;
    }

    // Métodos de actualización
    updateMenuConfig(menuType, newConfig) {
        if (menuType !== 'leftMenu' && menuType !== 'rightMenu') {
            console.warn('Tipo de menú no válido');
            return false;
        }

        this.config[menuType] = newConfig;
        this.renderMenus();
        return true;
    }

    updateMenuItem(menuType, itemIndex, newData) {
        // Validar que el tipo de menú existe
        if (!this.config[menuType]) {
            console.warn(`Tipo de menú '${menuType}' no válido`);
            return false;
        }

        // Si el índice no existe, agregar nuevo item
        if (typeof this.config[menuType][itemIndex] === 'undefined') {
            this.config[menuType][itemIndex] = newData;
        } else {
            // Actualizar item existente
            this.config[menuType][itemIndex] = {
                ...this.config[menuType][itemIndex],
                ...newData
            };
        }

        // Debug para verificar el estado
        console.log('Menú actualizado:', this.config[menuType]);

        // Renderizar los cambios
        this.renderMenus();
        return true;
    }

    // Manejadores de eventos
    toggleMenu(menuSelector, otherMenuSelector) {
        const menu = document.querySelector(menuSelector);
        const otherMenu = document.querySelector(otherMenuSelector);

        menu.style.display = 'flex';

        setTimeout(() => {
            menu.classList.toggle('active');
            otherMenu.classList.remove('active');

            if (!this.state.isPCView && menuSelector === this.selectors.menuRight) {
                const isMenuActive = menu.classList.contains('active');
                const newContent = isMenuActive ?
                    this.config.rightButtonCloseContent :
                    this.config.rightButtonContent;

                this.setButtonContent(newContent);
            }

            if (this.config.onMenuToggle) {
                this.config.onMenuToggle(menuSelector, menu.classList.contains('active'));
            }
        }, 10);
    }

    // Método privado para cerrar otros submenús
    #closeOtherSubmenus(currentSubmenu, parentUl) {
        parentUl.querySelectorAll(this.selectors.submenu).forEach(submenu => {
            if (submenu !== currentSubmenu) {
                submenu.style.display = 'none';
            }
        });
    }

    // Método privado para cerrar todos los submenús
    #closeAllSubmenus() {
        document.querySelectorAll(this.selectors.submenu).forEach(submenu => {
            submenu.style.display = 'none';
        });
    }

    // Métodos de gestión de submenús
    // Manejador de eventos para submenús corregido
    handleSubmenuClick(event) {
        event.preventDefault();
        const menuLink = event.currentTarget;
        const submenu = menuLink.nextElementSibling;
        const parentUl = menuLink.closest('ul');

        if (!submenu) return;

        if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
        } else {
            this.#closeOtherSubmenus(submenu, parentUl);
            submenu.style.display = 'block';
            //cambia position a static y un padding 5px al submenu si esta dentro de un ul.menu-right
            submenu.style.position = parentUl.classList.contains('menu-right') ? 'static' : '';
        }

        event.stopPropagation();
    }

    // Manejador de clics fuera corregido
    handleOutsideClick(event) {
        const { menuLeft, menuRight, toggleLeft, toggleRight } = this.elements;

        if (!menuLeft.contains(event.target) && !toggleLeft.contains(event.target)) {
            menuLeft.classList.remove('active');
        }

        if (!menuRight.contains(event.target) && !toggleRight.contains(event.target)) {
            menuRight.classList.remove('active');
            if (!this.state.isPCView) {
                this.setButtonContent(this.config.rightButtonContent);
            }
        }

        // Solo cerrar submenús si el clic no fue en un elemento de menú
        if (!event.target.closest(this.selectors.menuItem)) {
            this.#closeAllSubmenus();
        }
    }

    // Inicialización de eventos corregida
    initializeEventListeners() {
        const { toggleLeft, toggleRight } = this.elements;
        const { menu, menuRight } = this.selectors;

        // Event listeners para los toggles
        toggleLeft.addEventListener('click', (e) => {
            this.toggleMenu(menu, menuRight);
            e.stopPropagation();
        });

        toggleRight.addEventListener('click', (e) => {
            this.toggleMenu(menuRight, menu);
            e.stopPropagation();
        });

        // Event listeners para los menús
        document.querySelectorAll(this.selectors.menuLink).forEach(link => {
            link.addEventListener('click', this.handleSubmenuClick.bind(this));
        });

        // Event listener para clics fuera
        document.addEventListener('click', this.handleOutsideClick.bind(this));

        // Event listener para resize
        window.addEventListener('resize', () => {
            this.state.isPCView = window.innerWidth > 768;
            const menuRightElement = document.querySelector(menuRight);
            if (menuRightElement) {
                menuRightElement.classList.remove('active');
                this.setButtonContent(this.config.rightButtonContent);
            }
            this.#closeAllSubmenus();
        });
    }

    // Método de inicialización
    init() {
        this.initializeEventListeners();
    }
}
