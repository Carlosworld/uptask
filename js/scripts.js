evenListener();
// Lista de proyectos.
var listaProyectos = document.querySelector('ul#proyectos')

function evenListener() {
    document.querySelector('.crear-proyecto a').addEventListener('click',nuevoProyecto);
}

function nuevoProyecto(e) {
     e.preventDefault();
         console.log('Distes click');
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
    // console.log(nuevoProyecto);
    // Inyectar el HTML.
    // var nuevoProyecto = document.createElement('li');
    // nuevoProyecto.innerHTML = `
    //   <a href = "#">
    //     ${nombreProyecto}
    //   </a>
    // `;
    // listaProyectos.appendChild(nuevoProyecto);


    // Crear el llamado ajax.
    var xhr = new XMLHttpRequest();
    // Enviar datos por formdata.
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexion.
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga
    xhr.onload = function () {
      if (this.status === 200) {
        // console.log(JSON.parse(xhr.responseText));
        // Obtener los datos de la respuesta

        var respuesta = JSON.parse(xhr.responseText);
        var proyecto = respuesta.nombre_proyecto,
            id_proyecto = respuesta.id_proyecto,
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
                <a href = "#">
                  ${nombreProyecto}
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
              // .then(resultado =>{
              //   // redireccionar al nueva url.
              //   if(resultado.value){
              //     window.location.href = 'index.php?id_proyecto'+ id_proyecto;
              //   }
              // })
              .then(resultado=>{
                if(resultado.value){
                  window.location.href = 'index.php?id_proyecto'+ id_proyecto;
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
