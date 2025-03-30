<?php
$servername = "82.180.175.204";
$username = "u871958228_elite3210";
$password = "Onajudnameli123";
$dbname = "u871958228_dbHeinz";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Realizar una consulta
$sql = "SELECT * FROM tbl_empleados";
$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);


$conn->close();
?>