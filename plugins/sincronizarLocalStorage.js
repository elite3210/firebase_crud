export function sincronizarLocalStorage(arrayObj,dataName) {
    localStorage.setItem(dataName, JSON.stringify(arrayObj))
    arrayObj = JSON.parse(localStorage.getItem(dataName))
}