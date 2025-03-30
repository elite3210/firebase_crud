
fetch('https://heinzsport.com/db.php')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Aquí puedes manejar los datos recibidos
    })
    .catch(error => console.error('Error:', error));

/*
    fetch('https://heinzsport.com/db.php', { mode: 'no-cors' })
  .then(response => {
    // La respuesta será opaca y no podrás acceder a su contenido
    console.log(response);
  })
  .catch(error => console.error('Error:', error));

  */

