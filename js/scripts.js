evenListener();
// Lista de proyectos.
var listaProyectos = document.querySelector('ul#proyectos')

function evenListener() {
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);

    // Boton para nueva tarea.
    if(document.querySelector('.nueva-tarea') !== null ) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }

    // Botones para las acciones de las tareas.

    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
     e.preventDefault();
         // console.log('Distes click');
var listaProyectos = document.querySelector('ul#proyectos');
 // Crea un <input> para el nombre del nuevo proyecto.
 var nuevoProyecto = document.createElement('li');
 nuevoProyecto.innerHTML = '<input type="text" id ="nuevo-proyecto">';
 listaProyectos.appendChild(nuevoProyecto);

// Seleccionar el id con el nuevoProyecto
var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

// Al preciona enter crea nuevo proyecto

inputNuevoProyecto.addEventListener('keypress',function(e) {
   var tecla = e.which || e.keycode;
   if (tecla === 13) {
    guardarProyectoDB(inputNuevoProyecto.value);
    listaProyectos.removeChild (nuevoProyecto);
   }
});
}

function guardarProyectoDB(nombreProyecto){
    // Crear el llamado ajax.
    var xhr = new XMLHttpRequest();
    // Enviar datos por formdata.
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexion.
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);
console.log(datos);
    // En la carga
    xhr.onload = function () {
      if (this.status === 200) {
        // console.log(JSON.parse(xhr.responseText));
        // Obtener los datos de la respuesta

        var respuesta = JSON.parse(xhr.responseText);
        // console.log(respuesta);
        var proyecto = respuesta.nombre_proyecto,
            id_proyecto = respuesta.id_insertado,
            tipo = respuesta.tipo;
            resultado = respuesta.respuesta;

        // comprovar la insercion.
        if(resultado === 'correcto'){
          // Fue exitoso.
          if (tipo === 'crear') {
            // Se creo nuevo proyecto.
            // Inyectar en el html.
             var nuevoProyecto = document.createElement('li');
             nuevoProyecto.innerHTML = `
                <a href = "index.php?id_proyecto=${id_proyecto}" id = "proyecto:${id_proyecto}">
                  ${proyecto}
                </a>
              `;
              // Agregar al html.
              listaProyectos.appendChild(nuevoProyecto);

              // Enviar alerta.
              Swal.fire({
                icon: 'success',
                title: 'Proyecto creado!',
                text: 'El proyecto: '+proyecto+' se creo correctamente.'
              })

              .then(resultado=>{
                if(resultado.value){
                    window.location.href = 'index.php?id_proyecto='+id_proyecto;
                   // console.log(id_proyecto);
                }
              })

          }else {
            // Se actualizo o se elimino
          }
        }else {
          // Hubo un error
          Swal.fire({
            icon: 'error',
            title: 'resultado incorrecto!',
            text: 'hubo un error!'
          });
        }
      }
    }

    // Enviar el reques.
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actuaL.
function agregarTarea(e){
  e.preventDefault();
  console.log('diste click');

  var nombreTarea = document.querySelector('.nombre-tarea').value;

  // Validar que el campo tenga algo escrito.
  if(nombreTarea === ''){
    Swal.fire({
      icon: 'error',
      title: 'Una tarea no puede ir vacia!',
      text: 'Error!'
    });
  }else {
    // la tarea tiene algo, insertar en php

    // Crear el llamdo a ajax.
    var xhr = new XMLHttpRequest();
    // crear FormData
    var datos = new FormData();
    datos.append('tarea', nombreTarea);
    datos.append('accion', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);


    // Abrir la conexión.
    xhr.open('POST', 'inc/modelos/modelo-tareas.php',true);


    // Ejecutarlo y respuesta
    xhr.onload = function(){
      if(this.status === 200) {

        // Todo correcto
        var respuesta = JSON.parse(xhr.responseText);
        // Asignar valores.
        var resultado = respuesta.respuesta,
            tarea = respuesta.tarea,
            id_insertado = respuesta.id_insertado,
            tipo = respuesta.tipo;

          if (resultado === 'correcto') {
          // La tarea correctamente.
          Swal.fire({
            icon: 'success',
            title: 'Tarea creada!',
            text: 'La tarea: '+tarea+' se creo correctamente.'
          });
          // Construir el template.
          var nuevaTarea = document.createElement('li');

          // Agregamos el ID.
          nuevaTarea.classList.add('tarea');

          // Construir el html.
          nuevaTarea.innerHTML = `
             <p>${tarea}</p>
             <div class="acciones">
                <i class="far fa-check-circle"></i>
                <i class="fas fa-trash"></i>
             </div>
           `;

           // Agregarlo al html.
           var listado = document.querySelector('.listado-pendientes ul');
           listado.appendChild(nuevaTarea);

           // Limpiar el formulario.
           document.querySelector('.agregar-tarea').reset();

          }else {
            // Hubo un error.
            Swal.fire({
              icon: 'console.error();',
              title: 'error!',
              text: 'Hubo un error'
            })
          }

      }
    }

    // Enviar la consulta

    xhr.send(datos);


  }

}
 // cambia el estado de las tareas o las elimina

 function accionesTareas(e) {
   e.preventDefault();
  if(e.target.classList.contains('fa-check-circle')){
    if(e.target.classList.contains('completo')){
      e.target.classList.remove('completo');
      cambiarEstadoTarea(e.target, 0);
    }
    else {
      e.target.classList.add('completo');
      cambiarEstadoTarea(e.target , 1);

    }
  }
  if(e.target.classList.contains('fa-trash')){
    Swal.fire({
    title: 'Estas seguro(a)?',
    text: "Esta accion no se puede deshacer!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Borrar!'
  }).then((result) => {
    if (result.value) {
      var tareaEliminar= e.target.parentElement.parentElement;

      // Borrar de la base de datos
      eliminarTareaBD(tareaEliminar);
      // Borar del html.
      tareaEliminar.remove();

      Swal.fire(
        'Eliminado!',
        'La tarea fue eliminada.',
        'success'
      )
    }
  })
    // console.log('hiciste click en el boton de borrado');
  }
 }

 // completa o descompleta una tarea.
 function cambiarEstadoTarea(tarea, estado) {
   var idTarea = tarea.parentElement.parentElement.id.split(':');
   // Crear llamado ajax.
   var xhr = new XMLHttpRequest();

   // informacion
   var datos = new FormData();
   datos.append('id', idTarea[1]);
   datos.append('accion', 'actualizar');
   datos.append('estado', estado);


   // Abrir la conexion.
   xhr.open('POST','inc/modelos/modelo-tareas.php',true);

   // on load
   xhr.onload = function() {
     if(this.status === 200){
console.log(JSON.parse(xhr.responseText));
     }
   }

   // Enviar la peticion.
   xhr.send(datos);

 }

function eliminarTareaBD(tarea){

  var idTarea = tarea.id.split(':');
  // Crear llamado ajax.
  var xhr = new XMLHttpRequest();

  // informacion
  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'eliminar');



  // Abrir la conexion.
  xhr.open('POST','inc/modelos/modelo-tareas.php',true);

  // on load
  xhr.onload = function() {
    if(this.status === 200){
console.log(JSON.parse(xhr.responseText));
    }
  }

  // Enviar la peticion.
  xhr.send(datos);
}
