<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Adicionar entrada ao estoque
        $data = json_decode(file_get_contents('php://input'), true);
        $material_id = $data['material_id'] ?? 0;
        $quantidade = $data['quantidade'] ?? 0;

        if (!$material_id || $quantidade <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("INSERT INTO estoque (material_id, quantidade, data_adicionado) VALUES (?, ?, NOW())");
        $stmt->bind_param('ii', $material_id, $quantidade);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Estoque atualizado com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao adicionar ao estoque.']);
        }

        $stmt->close();
        break;

    case 'GET':
        // Listar entradas de estoque
        $material_id = $_GET['material_id'] ?? 0;

        if ($material_id) {
            $stmt = $connection->prepare("SELECT id, quantidade, data_adicionado FROM estoque WHERE material_id = ?");
            $stmt->bind_param('i', $material_id);
            $stmt->execute();
            $result = $stmt->get_result();

            $estoque = [];
            while ($row = $result->fetch_assoc()) {
                $estoque[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $estoque]);
        } else {
            // Listar estoque de todos os materiais
            $result = $connection->query("SELECT estoque.id, materiais.nome, estoque.quantidade, estoque.data_adicionado 
                                          FROM estoque 
                                          INNER JOIN materiais ON estoque.material_id = materiais.id");

            $estoque = [];
            while ($row = $result->fetch_assoc()) {
                $estoque[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $estoque]);
        }
        break;

    case 'PUT':
        // Atualizar entrada de estoque
        $data = json_decode(file_get_contents('php://input'), true);
        $material_id = $data['material_id'] ?? 0;
        $quantidade = $data['quantidade'] ?? 0;

        if (!$material_id || $quantidade < 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("UPDATE estoque SET quantidade = quantidade + ?, data_adicionado = NOW() WHERE material_id = ?");
        $stmt->bind_param('ii', $quantidade, $material_id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Quantidade de estoque atualizada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar quantidade de estoque.']);
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
