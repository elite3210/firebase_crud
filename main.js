const signupform = document.querySelector('#signup-form')
signupform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value

    console.log(email,password)

    auth
        .createUserWithEmailAndPassword(email,password)
        .then(async userCredential =>{
            signupform.reset()
            console.log('signUp')
            
        
    })
})

    /* sigin o login script */
const signinform = document.querySelector('#login-form')
signinform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    console.log(email,password)
    auth
    .signInWithEmailAndPassword(email,password)
    .then(async (userCredential) =>{

        signupform.reset()
        console.log('signin')
        
    })

})

const logout = document.querySelector('#logout')
logout.addEventListener('click',(e)=>{
    e.preventDefault();
    auth.signOut().then(() =>{
        console.log('sign out')  
    })
})
//post
const postList = document.querySelector('.posts');
const setupPosts = (data) =>{
    if(data.length){
        let html = ''
        data.forEach(doc => {
            const post =doc.data()
            //console.log(post)
            const li = `<li class='list-group-item list-group-item-action'>
                        <h5>${post.codigo}</h5>
                        <p>${post.descripcion}</p>
                        </li>`;
            html += li
        });
        postList.innerHTML=html;
    } else{
        postList.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'
    }
}


//Events
//Listar los datos del estado de cambios, mostrar si esta autentificado
auth.onAuthStateChanged((user)=>{
    if (user){
        fs.collection('Productos').get().then((snapshot)=>{
            console.log(snapshot.docs)
            setupPosts(snapshot.docs)
        }) 
        
    } else{
        setupPosts([])
    }
})