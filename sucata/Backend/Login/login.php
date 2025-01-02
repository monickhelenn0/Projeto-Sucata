<?php
// login.php
session_start();
require 'db_connection.php';

// Obter dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha não fornecidos.']);
    exit;
}

// Consultar usuário no banco de dados
$query = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('ss', $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];

    echo json_encode(['success' => true, 'message' => 'Login bem-sucedido.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuário ou senha incorretos.']);
}

$stmt->close();
$conn->close();
?>
