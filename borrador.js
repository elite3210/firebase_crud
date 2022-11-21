




export const pintarConsulta = traerConsulta((nombre) => {
    //console.log(querySnapshot)
    //console.log(querySnapshot.docs.length)
    //console.log('estoy dentro de registrotrabajadores')
    //if(querySnapshot){
        //console.log('estoy dentro del if de registrotrabajadores')
        let html = "";
        let contador =0;
        const dia=['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
        
        querySnapshot.forEach(doc =>{
            
            const fila = doc.data()
            html += `<tr><td>${fila.description}</td><td>${dia[`${new Date(`${fila.title}`).getDay()}`]}</td><td>${fila.title}</td><td>${fila.salida}</td>
                    <td>${(((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))-((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))%(1000*60*60))/(1000*60*60)}
                    <span>:${((((new Date(`${fila.salida}`).getTime()))-(new Date(`${fila.title}`).getTime()))%(1000*60*60))/60000}</span></td>
                    <td><span></span>${((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))/(1000*60*60)/**3.125*/}</td>
                    <td><button class ='btn-delete' data-id=${doc.id}>del</button></td>
                    <td><button class ='btn-edit' data-id=${doc.id}>edit</button></td>
                    </tr>`
            
            contador += 1
            //horas += ((new Date(`${fila.salida}`).getTime())-(new Date(`${fila.title}`).getTime()))/(1000*60*60)
        });

        console.log('# REgistros:',contador)
        //console.log('Importe:',horas*3.125)
    
        tareasContainer.innerHTML =html;

        const btnDelete = tareasContainer.querySelectorAll('.btn-delete')
            btnDelete.forEach(btn=>{
                btn.addEventListener('click',(e)=>{deleteTask(e.target.dataset.id)})
            })

        const btnEdit = tareasContainer.querySelectorAll('.btn-edit')
        
        btnEdit.forEach((btn)=>{
            btn.addEventListener('click', async (e)=>{
                let id = e.target.dataset.id;
                console.log(id);
                const doc = await traerTask(e.target.dataset.id);
                console.log(doc)
                })
        });
             
    //} else{tareasContainer.innerHTML='<p>Para acceder a inventario necesitas estar autorizado</p>'}
})