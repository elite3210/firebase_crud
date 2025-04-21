<?php
require 'conexion.php';

try {
    // Determinar el método HTTP
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            // Obtener todos los usuarios
            if (isset($_GET['position_id'])) {
                // Obtener un solo usuario
                $id = $_GET['position_id'];
                $stmt = $pdo->prepare("SELECT * FROM JobPositions where position_id = ?");
                $stmt->execute([$id]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($usuario);
            } else {
                // Obtener todos los usuarios
                $stmt = $pdo->query("SELECT * FROM JobPositions");
                $Datos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($Datos);
            }
            break;

        case 'POST':
            // Crear un nuevo usuario
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("INSERT INTO JobPositions (position_title,min_salary,max_salary,department_id) VALUES (?,?,?,?)");
            $stmt->execute([$data['position_title'], $data['min_salary'], $data['max_salary'], $data['department_id']]);
            echo json_encode(['message' => 'JobPositions creado exitosamente']);
            break;

            
        case 'PUT':
            // Actualizar un usuario existente
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("UPDATE Employees SET nombre = ?, edad = ?, telefono = ?, cargo = ?  WHERE id = ?");
            $stmt->execute([$data['nombre'], $data['edad'], $data['telefono'], $data['cargo'], $data['id']]);
            echo json_encode(['message' => 'Empleado se actualizado exitosamente']);
            break;

        case 'DELETE':
            // Eliminar un usuario
            if (isset($_GET['id'])) {
                $id = $_GET['id'];
                $stmt = $pdo->prepare("DELETE FROM Employees WHERE id = ?");
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
