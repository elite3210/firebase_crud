// JavaScript BarCode39 v. 1.0 (c) Lutz Tautenhahn, 2005
// The author grants you a non-exclusive, royalty free, license to use,
// modify and redistribute this software.
// This software is provided "as is", without a warranty of any kind.
// Modified 2015-03-11 Tres Finocchiaro, removed GIFs to fix HTML5 embedding

Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%";
Codes = new Array(
    "111221211", "211211112", "112211112", "212211111", "111221112", "211221111", "112221111", "111211212",
    "211211211", "112211211", "211112112", "112112112", "212112111", "111122112", "211122111", "112122111",
    "111112212", "211112211", "112112211", "111122211", "211111122", "112111122", "212111121", "111121122",
    "211121121", "112121121", "111111222", "211111221", "112111221", "111121221", "221111112", "122111112",
    "222111111", "121121112", "221121111", "122121111", "121111212", "221111211", "122111211", "121121211",
    "121212111", "121211121", "121112121", "111212121");
var BarPic = ['background-color: #000', 'background-color: #fff'];

function Code39(theX, theY, theBarHeight, theFontHeight, theBarCodeText, theBarCodeSize) {
    var pp = "", ff, ss = 1, html = "";
    if (theBarCodeSize) ss = parseInt(theBarCodeSize);
    if (isNaN(ss)) ss = 1;
    if (ss < 1) ss = 1;
    if ((theX != "") && (theY != "")) pp = "position:absolute;left:" + theX + ";top:" + theY + ";";
    if ((theFontHeight > 4) && (theBarHeight >= 2 * theFontHeight)) {
        ff = "style='font-size:" + theFontHeight + "px;font-family:Verdana;'";
        html += "<div style='" + pp + "font-size:" + theFontHeight + "px;font-family:Verdana;'><table noborder cellpadding=0 cellspacing=0><tr>";
        html += "<td rowspan=2 valign=top>" + CodePics("*", theBarHeight, ss) + "</td>";
        for (i = 0; i < theBarCodeText.length; i++)
            html += "<td>" + CodePics(theBarCodeText.charAt(i), theBarHeight - theFontHeight - 1, ss) + "</td>";
        html += "<td rowspan=2 valign=top>" + CodePics("*", theBarHeight, ss) + "</td>";
        html += "</tr><tr>";
        for (i = 0; i < theBarCodeText.length; i++)
            html += "<td align=center " + ff + ">" + theBarCodeText.charAt(i) + "</td>";
        html += "</tr></table></div>";
    }
    else {
        html += "<div style='" + pp + "'><table noborder cellpadding=0 cellspacing=0>";
        html += "<tr><td>" + CodePics("*", theBarHeight, ss) + "</td>";
        for (i = 0; i < theBarCodeText.length; i++)
            html += "<td>" + CodePics(theBarCodeText.charAt(i), theBarHeight, ss) + "</td>";
        html += "<td>" + CodePics("*", theBarHeight, ss) + "</td></tr></table></div>";
    }
    return html;
}
function CodePics(theChar, theHeight, theSize) {
    var ss = "", cc = "9", ii = Chars.indexOf(theChar);
    if (ii >= 0) cc = Codes[ii];
    for (ii = 0; ii < cc.length; ii++) ss += "<div style='float: left;" + BarPic[ii % 2] + "; width:" + ((cc.charAt(ii) * (3 * theSize - theSize % 2) - theSize + theSize % 2) / 2) + "px; height:" + theHeight + "px;'></div>";
    ss += "<div style='float: left;" + BarPic[ii % 2] + "; width:" + theSize + "px; height:" + theHeight + "px' ></div>";
    return (ss);
}