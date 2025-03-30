<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
   
    $host = "localhost";
    $username = "u871958228_elite3210";
    $password = "Onajudnameli123";
    $dbname = "u871958228_dbHeinz";

    try {
    // Conexión a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Determinar el método HTTP
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            // Obtener todos los usuarios
            if (isset($_GET['id'])) {
                // Obtener un solo usuario
                $id = $_GET['id'];
                $stmt = $pdo->prepare("SELECT * FROM tbl_empleados id = ?");
                $stmt->execute([$id]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($usuario);
            } else {
                // Obtener todos los usuarios
                $stmt = $pdo->query("SELECT * FROM tbl_empleados");
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($usuarios);
            }
            break;

        case 'POST':
            // Crear un nuevo usuario
            
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("INSERT INTO tbl_empleados (nombre, edad, telefono,cargo) VALUES (?, ?, ?,?)");
            $stmt->execute([$data['nombre'], $data['edad'], $data['telefono'],$data['cargo']]);
            echo json_encode(['message' => 'Empleado creado exitosamente']);
            break;

        case 'PUT':
            // Actualizar un usuario existente
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE tbl_empleados SET nombre = ?, edad = ?, telefono = ?, cargo = ?  WHERE id = ?");
            $stmt->execute([$data['nombre'], $data['edad'], $data['telefono'], $data['cargo'], $data['id']]);
            echo json_encode(['message' => 'Empleado actualizado exitosamente']);
            break;

        case 'DELETE':
            // Eliminar un usuario
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $stmt = $pdo->prepare("DELETE FROM tbl_empleados WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['message' => 'Empleado eliminado exitosamente']);
            } else {
                echo json_encode(['error' => 'ID no especificado']);
            }
            break;

        default:
            http_response_code(405); // Método no permitido
            echo json_encode(['error' => 'Método no soportado']);
            break;
    }
} catch (PDOException $e) {
    // Manejo de errores
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>