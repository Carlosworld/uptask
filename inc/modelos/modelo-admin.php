<?php

$accion = (isset($_REQUEST['accion'])) ? $_REQUEST['accion'] : '';
$password = $_POST['password'];
$usuario = $_POST['usuario'];

    if($accion == 'crear') {
        // Codifo para crear los administradores.

        //hashear passwords.
        $opciones = array(
            'cost' => 12
        );

        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
        // Importar la conexión.
        include '../funciones/conexion.php';

        try {
            // Realizar la caonsulta a la base de datos.
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?,?)");
            $stmt->bind_param('ss',$usuario, $hash_password);
            $stmt->execute();
            if ($stmt->affected_rows) {
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'id_insertado'=> $stmt->insert_id,
                    'tipo' => $accion
                );
            }else{
                $respuesta = array(
                    'respuesta' => 'error',

                );
            }

            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            // En caso de un error, tomar la conexión.
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }



        echo json_encode($respuesta);
    }

    else if($accion == 'login'){


        // Escribir codigo para que loguee los administradores
        include '../funciones/conexion.php';

        try {
            // Realizar la caonsulta a la base de datos.
            $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            // Loguear el usuario.
            $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
            $stmt->fetch();

            if ($nombre_usuario) {
              // El usuario existe verificar el passwords.
              if(password_verify($password, $pass_usuario)){
                // Iniciar la sesiones
                SESSION_START();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;               
                // Login correcto.
                  $respuesta = array(
                      'respuesta' => 'correcto',
                      'nombre'=> $nombre_usuario,
                      'tipo'=>$accion
                  );

              }else{
                // Login incorrecto enviar error.
                $respuesta = array(
                    'respuesta' => 'password incorrecto!'

                );
              }

            }else{
                $respuesta = array(
                    'respuesta' => 'Usuario no existe!'

                );
            }

            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            // En caso de un error, tomar la conexión.
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }
