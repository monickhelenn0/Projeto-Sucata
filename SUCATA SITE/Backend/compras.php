<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Registrar uma nova compra
        $data = json_decode(file_get_contents('php://input'), true);
        $material_id = $data['material_id'] ?? 0;
        $quantidade = $data['quantidade'] ?? 0;
        $valor = $data['valor'] ?? 0.0;

        if (!$material_id || $quantidade <= 0 || $valor <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("INSERT INTO compras (material_id, quantidade, valor, data) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param('iid', $material_id, $quantidade, $valor);

        if ($stmt->execute()) {
            $stmt_estoque = $connection->prepare("UPDATE estoque SET quantidade = quantidade + ? WHERE material_id = ?");
            $stmt_estoque->bind_param('ii', $quantidade, $material_id);

            if ($stmt_estoque->execute()) {
                echo json_encode(['success' => true, 'message' => 'Compra registrada e estoque atualizado com sucesso.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o estoque.']);
            }

            $stmt_estoque->close();
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar a compra.']);
        }

        $stmt->close();
        break;

    case 'GET':
        // Listar compras realizadas
        $result = $connection->query("SELECT compras.id, materiais.nome, compras.quantidade, compras.valor, compras.data 
                                      FROM compras 
                                      INNER JOIN materiais ON compras.material_id = materiais.id");

        $compras = [];
        while ($row = $result->fetch_assoc()) {
            $compras[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $compras]);
        break;

    case 'DELETE':
        // Remover uma compra
        parse_str(file_get_contents('php://input'), $data);
        $id = $data['id'] ?? 0;
        $motivo = $data['motivo'] ?? '';
        $usuario_logado = $data['usuario_logado'] ?? '';

        if (!$id || !$motivo || !$usuario_logado) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos para exclusão.']);
            exit;
        }

        // Obter informações da compra antes de excluir
        $stmt_info = $connection->prepare("SELECT material_id, quantidade, valor FROM compras WHERE id = ?");
        $stmt_info->bind_param('i', $id);
        $stmt_info->execute();
        $result_info = $stmt_info->get_result();

        if ($result_info->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Compra não encontrada.']);
            exit;
        }

        $compra = $result_info->fetch_assoc();
        $material_id = $compra['material_id'];
        $quantidade = $compra['quantidade'];
        $valor = $compra['valor'];

        // Registrar a exclusão na tabela de exclusões
        $stmt_exclusao = $connection->prepare("INSERT INTO exclusoes (tipo, referencia, motivo, valor, usuario_logado, data) 
                                               VALUES ('compras', ?, ?, ?, ?, NOW())");
        $stmt_exclusao->bind_param('isds', $id, $motivo, $valor, $usuario_logado);

        if ($stmt_exclusao->execute()) {
            // Excluir a compra
            $stmt_delete = $connection->prepare("DELETE FROM compras WHERE id = ?");
            $stmt_delete->bind_param('i', $id);

            if ($stmt_delete->execute()) {
                // Atualizar o estoque
                $stmt_estoque = $connection->prepare("UPDATE estoque SET quantidade = quantidade - ? WHERE material_id = ?");
                $stmt_estoque->bind_param('ii', $quantidade, $material_id);
                $stmt_estoque->execute();

                echo json_encode(['success' => true, 'message' => 'Compra excluída e estoque atualizado.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir a compra.']);
            }

            $stmt_delete->close();
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar a exclusão.']);
        }

        $stmt_exclusao->close();
        $stmt_info->close();
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
