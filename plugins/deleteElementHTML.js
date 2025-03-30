export function deleteElementHTML(selector) {
    
    const element = document.querySelector(selector)
    console.log('BorradorHTML:',element);
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}