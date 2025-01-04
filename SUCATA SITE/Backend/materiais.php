<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Adicionar material
        $data = json_decode(file_get_contents('php://input'), true);
        $nome = $data['nome'] ?? '';
        $quantidade = $data['quantidade'] ?? 0;

        if (!$nome || $quantidade <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("INSERT INTO materiais (nome, quantidade) VALUES (?, ?)");
        $stmt->bind_param('si', $nome, $quantidade);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Material adicionado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar material.']);
        }

        $stmt->close();
        break;

    case 'GET':
        // Listar materiais
        $result = $connection->query("SELECT id, nome, quantidade FROM materiais");

        $materiais = [];
        while ($row = $result->fetch_assoc()) {
            $materiais[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $materiais]);
        break;

    default:
        // Método não permitido
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
        break;
}

// Fechar conexão
$connection->close();
?>
