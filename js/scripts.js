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
   } 
});
}

function guardarProyectoDB(nuevoProyecto){
    console.log(nuevoProyecto);
}


