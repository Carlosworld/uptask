eventListeners();

function eventListeners() {
  document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e){
  e.preventDefault();

 var usuario = document.querySelector('#usuario').value,
     password = document.querySelector('#password').value,
     tipo = document.querySelector('#tipo').value;

     if (usuario === ''|| password === '') {
      // La validacion Fallo

      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Ambos campos son obligatorios!'
      })

     }else{
      //  Ambos campos son correctos, mandar ejecutar Ajax

      // Datos que se envian al servidor
      var datos = new FormData();
      datos.append('usuario', usuario);
      datos.append('password', password);
      datos.append('accion', tipo);

      // Crear el llamado ajax

      var xhr = new XMLHttpRequest();

      // Abrir la conexión.
      xhr.open('POST','inc/modelos/modelo-admin.php', true);

      // Retorno de datos

      xhr.onload = function() {
        if(this.status === 200){
          // console.log(JSON.parse(xhr.responseText));

          var respuesta = JSON.parse(xhr.responseText);
          // console.log(respuesta);
          if (respuesta.respuesta === 'correcto') {
            if (respuesta.tipo === 'crear') {
              Swal.fire({
                icon: 'success',
                title: 'corrrecto!',
                text: 'Agregastes correctamente los campos!'
          });
            }else if (respuesta.tipo === 'login') {
                Swal.fire({
                  icon: 'success',
                  title: 'Login corrrecto!',
                  text: 'preciona ok paea abrir el dashwor!'
            })
            .then(resultado=>{
              if(resultado.value){
                window.location.href = 'index.php';
              }
            })
          }


      }else{
            // Hubo un error.
            Swal.fire({
              icon: 'error',
              title: 'La contraseña contraseña o el usuario son incorrectos!',
              text: 'hubo un error!'
        });
          }
      }
    }
      // Enviar la peticion.

      xhr.send(datos);


     }
  }
