<?php
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if($accion == 'crear') {

    include '../funciones/conexion.php';

    try {
        // Realizar la caonsulta a la base de datos.
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
        $stmt->bind_param('s',$proyecto);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado'=> $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
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
 ?>
