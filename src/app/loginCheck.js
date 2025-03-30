const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

//console.log(loggedInLinks);
//console.log(loggedOutLinks);

export function loginCheck(user) {
    if (user) {
        loggedOutLinks.forEach(btn=>btn.style.display='none');//oculta las clases loggedOutLinks
        loggedInLinks.forEach(btn=>btn.style.display='block');//muestra las clases loggedInLinks
    } else {
        loggedOutLinks.forEach(btn=>btn.style.display='Block');
        loggedInLinks.forEach(btn=>btn.style.display='none');
    }
}