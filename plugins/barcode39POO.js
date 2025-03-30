// JavaScript Barcode39 refactorizado a un enfoque orientado a objetos

class Barcode39 {
    static chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
    static codes = [
        "111221211", "211211112", "112211112", "212211111", "111221112", "211221111", "112221111", "111211212",
        "211211211", "112211211", "211112112", "112112112", "212112111", "111122112", "211122111", "112122111",
        "111112212", "211112211", "112112211", "111122211", "211111122", "112111122", "212111121", "111121122",
        "211121121", "112121121", "111111222", "211111221", "112111221", "111121221", "221111112", "122111112",
        "222111111", "121121112", "221121111", "122121111", "121111212", "221111211", "122111211", "121121211",
        "121212111", "121211121", "121112121", "111212121"
    ];
    static barStyles = ['background-color: #000', 'background-color: #fff'];

    constructor({ x = 0, y = 0, barHeight = 50, fontHeight = 20, text = "", size = 1 } = {}) {
        this.x = x;
        this.y = y;
        this.barHeight = barHeight;
        this.fontHeight = fontHeight;
        this.text = text;
        this.size = Math.max(parseInt(size, 10) || 1, 1);
    }

    generate() {
        const positionStyle = `position:absolute;left:${this.x}px;top:${this.y}px;`;
        const fontStyle = `font-size:${this.fontHeight}px;font-family:Verdana;`;

        let html = `<div style='${positionStyle}'>`;
        html += "<table cellspacing='0' cellpadding='0'><tr>";

        html += `<td rowspan='2'>${this.generateBar('*')}</td>`;
        for (const char of this.text) {
            html += `<td>${this.generateBar(char)}</td>`;
        }
        html += `<td rowspan='2'>${this.generateBar('*')}</td>`;

        html += "</tr><tr>";
        for (const char of this.text) {
            html += `<td align='center' style='${fontStyle}'>${char}</td>`;
        }
        html += "</tr></table></div>";

        return html;
    }

    generateBar(char) {
        const index = Barcode39.chars.indexOf(char);
        const code = index >= 0 ? Barcode39.codes[index] : "9";
        let barHtml = "";

        for (let i = 0; i < code.length; i++) {
            const width = (code[i] * (3 * this.size - this.size % 2) - this.size + this.size % 2) / 2;
            barHtml += `<div style='float: left; ${Barcode39.barStyles[i % 2]}; width:${width}px; height:${this.barHeight}px;'></div>`;
        }

        // Space between bars
        barHtml += `<div style='float: left; ${Barcode39.barStyles[code.length % 2]}; width:${this.size}px; height:${this.barHeight}px;'></div>`;

        return barHtml;
    }
}

