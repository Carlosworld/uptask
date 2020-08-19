<?php

$accion = $_POST['accion'];
$id_proyecto =  (int)$_POST['id_proyecto'];
$tarea = $_POST['tarea'];


if($accion == 'crear') {

    include '../funciones/conexion.php';

    try {
        // Realizar la caonsulta a la base de datos.
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?,?)");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado'=> $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
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

// jalar los datos de la base de datos.





 ?>
