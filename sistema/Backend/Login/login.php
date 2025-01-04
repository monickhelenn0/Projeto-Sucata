<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

// Obter dados da requisição
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$email = $data['email'] ?? '';

// Validar dados recebidos
if (!$username || !$password || !$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    exit;
}

// Verificar se o usuário já existe
$stmt = $connection->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Usuário ou email já existe.']);
    exit;
}

// Inserir novo usuário no banco de dados
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $connection->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $username, $hashedPassword, $email);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Usuário registrado com sucesso.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro ao registrar usuário.']);
}

// Finalizar a consulta
$stmt->close();
?>
