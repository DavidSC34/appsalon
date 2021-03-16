let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '12:00',
    servicios: []
};

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();
    //Resalta el Div actual segun el tab al que se presiona
    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //Pagiacion siguiente y anterior
    paginaSiguiente();

    paginaAnterior();

    //Compureba l pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita(o mensaje en caso de no pasar la validacion)
    mostrarResumen();
    //Almacena el nombre de lacita en el objeto
    nombreCita();

    //Almacena la fecha de la cita en el obejto
    fechaCita();

    //DEshabilitar fecha anterior
    deshabilitarFechaAnterior();

    //Alamcena la hora de la cia en el objeto
    horaCita();

}

function mostrarSeccion() {

    //Eliminar mostrar-seccion del seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }


    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }


    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(e => {
        e.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            //Llamar la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador();
        });

    });
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

function seleccionarServicio(e) {

    let elemento;
    //Forzar que el eelemento al cual le damos click sea uel DVIV
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;

    }

    if (elemento.classList.contains('seleccionado')) {

        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {

        elemento.classList.add('seleccionado');
        // console.log(elemento.dataset.idServicio);
        // console.log(elemento.firstChild.textContent);
        // console.log(elemento.firstChild.nextElementSibling.textContent);
        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstChild.textContent,
            precio: elemento.firstChild.nextElementSibling.textContent
        };
        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    // console.log('Eliminando...', id);}
    console.log(cita);

}

function agregarServicio(servicioObj) {
    // console.log('Agregando servicio');
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; //la bunea practica es no modicar el original, creo una copia de servicios y pego el servicio elehido
    console.log(cita);

}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        console.log(pagina);
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        console.log(pagina);
        botonesPaginador();
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');
        mostrarResumen(); //estamos en la pagina 3, carga el resumen de la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();

}

function mostrarResumen() {
    // console.log(cita);
    //DEstructuring
    const { nombre, fecha, hora, servicios } = cita;
    //Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpiar el HTMl previo
    // resumenDiv.innerHTML = '';
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //validacion de objeto
    if (Object.values(cita).includes('')) {
        // console.log('El objeto esta vacio');
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');
        //Agrergar a resumenDiv
        resumenDiv.appendChild(noServicios);

        return;
    }
    //Mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora}`;
    // nombreCita.textContent = `<span>Nombre:</span>${nombre}`; las pone como texto

    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        // console.log(nombreTexto);
        //Validacion de nombre debe tener algo
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            // console.log('Nombre valido');
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            // console.log(cita);
        }

    });

}

function mostrarAlerta(mensaje, tipo) {
    // console.log('El mensaje es: ', mensaje);
    //Si hay un alerta previa, etnonces no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }
    const alerta = document.createElement('DIV');

    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //insertar en el HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);
    // console.log(alerta);

    //Eliminar la laerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        // console.log(e.target.value);
        const dia = new Date(e.target.value).getUTCDay();
        console.log(dia);

        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos', 'error');
        } else {
            cita.fecha = fechaInput.value;
            console.log(cita);
        }




    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    //formato deseado: AAA-MM-DD
    let mesString = mes.toString();
    if (mesString.length < 2) {
        mesString = `0${mesString}`;
    }
    const fechaDeshabilitar = `${year}-${mesString}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        // console.log(e.target.value);
        const horaCita = e.target.value;
        const hora = horaCita.split(':');
        if (hora[0] < 10 || hora[0] > 18) {

            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            // console.log('Hora valida');
            cita.hora = horaCita;
            console.log(cita);
        }
    });
}