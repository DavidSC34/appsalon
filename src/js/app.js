document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
}

async function mostrarServicios() {
    // console.log('Consultado...');
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;
        // console.log(servicios);

        //Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            //DOm SCripting
            //Generar nombre servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Generar precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.dataset.idServicio = id;
            servicioDiv.classList.add('servicio');

            //Seleccion un servicio para la cira
            servicioDiv.onclick = seleccionarServicio;

            //INyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //Inyectar al HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

            // console.log(servicioDiv);

        });

    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e){

   let elemento;
    //Forzar que el eelemento al cual le damos click sea uel DVIV
    if(e.target.tagName ==='P'){
      elemento = e.target.parentElement;
    }else{
        elemento = e.target;  

    }

    if(elemento.classList.contains('seleccionado')){

        elemento.classList.remove('seleccionado');
    }else{

        elemento.classList.add('seleccionado');
    }
}
