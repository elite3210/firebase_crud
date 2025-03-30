//Controla el css del boton welcome

const container = document.querySelector(".container");
const btnSignIn =document.getElementById("btn-sign-in");
const btnSignUp =document.getElementById("btn-sign-up");//tbn de welcome

btnSignIn.addEventListener("click",()=>{
    container.classList.remove("toggle");
})

btnSignUp.addEventListener("click",()=>{
    container.classList.add("toggle");
})