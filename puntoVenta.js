
const cardData = [
    { heading: 'card-1', body: 'this is card body-1' },
    { heading: 'card-2', body: 'this is card body-2' },
    { heading: 'card-3', body: 'this is card body-3' },
    { heading: 'card-4', body: 'this is card body-4' },
    { heading: 'card-5', body: 'this is card body-5' },
    { heading: 'card-6', body: 'this is card body-6' },
    { heading: 'card-7', body: 'this is card body-7' },
    { heading: 'card-8', body: 'this is card body-8' },
];

const containerCards = document.querySelector('.row')


function renderCards(arrayObjetos) {
    arrayObjetos.map((postData) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.classList.add('border');
        card.innerHTML = `
        <img src="./imagenes/sorbetes_inicio.jpg" class="img-fluid" >
        <h3 class="card-heading">${postData.heading}</h3>
        <p class="card-body">${postData.body}</p>
        `
        containerCards.appendChild(card)
    })
}
renderCards(cardData);