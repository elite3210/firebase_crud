export function clearHTML(selector) {
    const element = document.querySelector(selector)

    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}