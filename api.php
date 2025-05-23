<?php
require 'conexion.php';

try {
    // Conexión a la base de datos usando PDO
    //$pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    //$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Determinar el método HTTP
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            // Obtener todos los usuarios
            if (isset($_GET['employee_id'])) {
                // Obtener un solo usuario
                $id = $_GET['employee_id'];
                $stmt = $pdo->prepare("SELECT * FROM Employees where employee_id = ?");
                $stmt->execute([$id]);
                $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($usuario);
            } else {
                // Obtener todos los usuarios
                $stmt = $pdo->query("SELECT * FROM Employees");
                $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($usuarios);
            }
            break;

        case 'POST':
            // Crear un nuevo usuario
            $data = json_decode(file_get_contents("php://input"), true);
            $stmt = $pdo->prepare("INSERT INTO Employees (identity_document,first_name,last_name,email,phone_number,hire_date,position_id,department_id,manager_id,hourly_rate,status,address,city,state,zip_code,birth_date,gender) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            $stmt->execute([$data['identity_document'], $data['first_name'], $data['last_name'], $data['email'], $data['phone_number'], $data['hire_date'], $data['position_id'], $data['department_id'], $data['manager_id'], $data['hourly_rate'], $data['status'], $data['address'], $data['city'], $data['state'], $data['zip_code'], $data['birth_date'], $data['gender']]);
            echo json_encode(['message' => 'Empleado creado exitosamente']);
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
