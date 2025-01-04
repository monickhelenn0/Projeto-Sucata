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

        $stmt = $connection->prepare("INSERT INTO materiais (nome) VALUES (?)");
        $stmt->bind_param('s', $nome);

        if ($stmt->execute()) {
            $material_id = $connection->insert_id;
            $stmt_estoque = $connection->prepare("INSERT INTO estoque (material_id, quantidade, data_adicionado) VALUES (?, ?, NOW())");
            $stmt_estoque->bind_param('ii', $material_id, $quantidade);
            $stmt_estoque->execute();
            echo json_encode(['success' => true, 'message' => 'Material adicionado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar material.']);
        }

        $stmt->close();
        break;

    case 'GET':
        // Listar materiais
        $result = $connection->query("SELECT materiais.id, materiais.nome, IFNULL(SUM(estoque.quantidade), 0) AS quantidade FROM materiais LEFT JOIN estoque ON materiais.id = estoque.material_id GROUP BY materiais.id");

        $materiais = [];
        while ($row = $result->fetch_assoc()) {
            $materiais[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $materiais]);
        break;

    case 'PUT':
        // Atualizar material
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'] ?? 0;
        $nome = $data['nome'] ?? '';
        $quantidade = $data['quantidade'] ?? 0;

        if (!$id || !$nome || $quantidade < 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("UPDATE materiais SET nome = ? WHERE id = ?");
        $stmt->bind_param('si', $nome, $id);
        $stmt->execute();

        $stmt_estoque = $connection->prepare("UPDATE estoque SET quantidade = ? WHERE material_id = ?");
        $stmt_estoque->bind_param('ii', $quantidade, $id);
        $stmt_estoque->execute();

        echo json_encode(['success' => true, 'message' => 'Material atualizado com sucesso.']);
        $stmt->close();
        break;

    case 'DELETE':
        // Excluir material
        parse_str(file_get_contents('php://input'), $data);
        $id = $data['id'] ?? 0;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID do material é necessário.']);
            exit;
        }

        $stmt = $connection->prepare("DELETE FROM materiais WHERE id = ?");
        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Material excluído com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao excluir material.']);
        }

        $stmt->close();
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
