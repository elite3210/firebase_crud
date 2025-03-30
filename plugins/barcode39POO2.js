// JavaScript Barcode39 refactorizado para generar SVG

/**
 * Barcode39 es una clase para generar códigos de barras en formato SVG basados en el estándar Code 39.
 *
 * Características:
 * - Genera un elemento SVG que representa el código de barras.
 * - Admite texto alfanumérico válido para Code 39.
 * - Personalización del tamaño y altura de las barras.
 *
 * Uso:
 * 1. Crear una instancia de Barcode39 pasando un objeto de configuración.
 * 2. Llamar al método `generate()` para obtener el elemento SVG generado.
 * 3. Agregar el elemento SVG al DOM.
 */

class Barcode39 {
    // Definición de caracteres y patrones válidos para Code 39
    static chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
    static codes = [
        "111221211", "211211112", "112211112", "212211111", "111221112", "211221111", "112221111", "111211212",
        "211211211", "112211211", "211112112", "112112112", "212112111", "111122112", "211122111", "112122111",
        "111112212", "211112211", "112112211", "111122211", "211111122", "112111122", "212111121", "111121122",
        "211121121", "112121121", "111111222", "211111221", "112111221", "111121221", "221111112", "122111112",
        "222111111", "121121112", "221121111", "122121111", "121111212", "221111211", "122111211", "121121211",
        "121212111", "121211121", "121112121", "111212121"
    ];

    /**
     * Constructor de la clase Barcode39
     * @param {Object} config Configuración inicial
     * @param {number} config.barHeight Altura de las barras
     * @param {string} config.text Texto para generar el código de barras
     * @param {number} config.size Tamaño de las barras (ancho mínimo)
     */
    constructor({ barHeight = 50, text = "", size = 1 } = {}) {
        this.barHeight = barHeight;
        this.text = text;
        this.size = Math.max(parseInt(size, 10) || 1, 1);
    }

    /**
     * Genera el elemento SVG que representa el código de barras
     * @returns {SVGElement} El elemento SVG generado
     */
    generate() {
        const svgNamespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNamespace, "svg");
        svg.setAttribute("xmlns", svgNamespace);
        svg.setAttribute("height", this.barHeight);
        svg.setAttribute("width", this.calculateWidth());
        svg.setAttribute("viewBox", `0 0 ${this.calculateWidth()} ${this.barHeight}`);

        let x = 0;
        this.generateBar('*').forEach(rect => {
            rect.setAttribute("x", x);
            svg.appendChild(rect);
            x += parseInt(rect.getAttribute("width"), 10);
        });

        for (const char of this.text) {
            this.generateBar(char).forEach(rect => {
                rect.setAttribute("x", x);
                svg.appendChild(rect);
                x += parseInt(rect.getAttribute("width"), 10);
            });
        }

        this.generateBar('*').forEach(rect => {
            rect.setAttribute("x", x);
            svg.appendChild(rect);
            x += parseInt(rect.getAttribute("width"), 10);
        });

        return svg;
    }

    /**
     * Genera los rectángulos que representan un carácter en el código de barras
     * @param {string} char Carácter a convertir en barras
     * @returns {SVGRectElement[]} Lista de rectángulos SVG
     */
    generateBar(char) {
        const index = Barcode39.chars.indexOf(char);
        const code = index >= 0 ? Barcode39.codes[index] : "9";
        const rects = [];

        for (let i = 0; i < code.length; i++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("width", (code[i] * this.size).toString());
            rect.setAttribute("height", this.barHeight);
            rect.setAttribute("fill", i % 2 === 0 ? "black" : "white");
            rects.push(rect);
        }

        // Espacio entre barras
        const spacer = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        spacer.setAttribute("width", this.size.toString());
        spacer.setAttribute("height", this.barHeight);
        spacer.setAttribute("fill", "white");
        rects.push(spacer);

        return rects;
    }

    /**
     * Calcula el ancho total del código de barras
     * @returns {number} Ancho total en píxeles
     */
    calculateWidth() {
        return (this.text.length + 2) * (this.size * 10) + (this.text.length + 1) * this.size;
    }
}

