<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Registrar um novo abate
        $data = json_decode(file_get_contents('php://input'), true);
        $material_id = $data['material_id'] ?? 0;
        $quantidade = $data['quantidade'] ?? 0;
        $galpao_origem = $data['galpao_origem'] ?? '';
        $destino = $data['destino'] ?? '';
        $usuario_logado = $data['usuario_logado'] ?? '';

        if (!$material_id || $quantidade <= 0 || !$galpao_origem || !$destino || !$usuario_logado) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        // Verificar se há quantidade suficiente no estoque
        $stmt_estoque = $connection->prepare("SELECT quantidade FROM estoque WHERE material_id = ?");
        $stmt_estoque->bind_param('i', $material_id);
        $stmt_estoque->execute();
        $result_estoque = $stmt_estoque->get_result();

        if ($result_estoque->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Material não encontrado no estoque.']);
            exit;
        }

        $estoque = $result_estoque->fetch_assoc();
        if ($estoque['quantidade'] < $quantidade) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Quantidade insuficiente no estoque.']);
            exit;
        }

        // Registrar o abate na tabela de abates
        $stmt_abate = $connection->prepare("INSERT INTO abates (material_id, quantidade, galpao_origem, destino, usuario_logado, data) 
                                            VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt_abate->bind_param('iisss', $material_id, $quantidade, $galpao_origem, $destino, $usuario_logado);

        if ($stmt_abate->execute()) {
            // Atualizar o estoque
            $stmt_update = $connection->prepare("UPDATE estoque SET quantidade = quantidade - ? WHERE material_id = ?");
            $stmt_update->bind_param('ii', $quantidade, $material_id);

            if ($stmt_update->execute()) {
                echo json_encode(['success' => true, 'message' => 'Abate registrado e estoque atualizado com sucesso.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o estoque.']);
            }

            $stmt_update->close();
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar o abate.']);
        }

        $stmt_abate->close();
        $stmt_estoque->close();
        break;

    case 'GET':
        // Listar abates registrados
        $result = $connection->query("SELECT abates.id, materiais.nome, abates.quantidade, abates.galpao_origem, abates.destino, abates.usuario_logado, abates.data 
                                      FROM abates 
                                      INNER JOIN materiais ON abates.material_id = materiais.id");

        $abates = [];
        while ($row = $result->fetch_assoc()) {
            $abates[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $abates]);
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
