<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Registrar uma nova saída
        $data = json_decode(file_get_contents('php://input'), true);
        $funcionario = $data['funcionario'] ?? '';
        $valor = $data['valor'] ?? 0.0;
        $motivo = $data['motivo'] ?? '';
        $forma_pagamento = $data['forma_pagamento'] ?? '';

        if (!$funcionario || $valor <= 0 || !$motivo || !$forma_pagamento) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        $stmt = $connection->prepare("INSERT INTO saidas (funcionario, valor, motivo, forma_pagamento, data) 
                                      VALUES (?, ?, ?, ?, NOW())");
        $stmt->bind_param('sdss', $funcionario, $valor, $motivo, $forma_pagamento);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Saída registrada com sucesso.']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar a saída.']);
        }

        $stmt->close();
        break;

    case 'GET':
        // Listar saídas registradas
        $result = $connection->query("SELECT id, funcionario, valor, motivo, forma_pagamento, data FROM saidas");

        $saidas = [];
        while ($row = $result->fetch_assoc()) {
            $saidas[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $saidas]);
        break;

    case 'DELETE':
        // Excluir uma saída (com histórico em exclusões)
        parse_str(file_get_contents('php://input'), $data);
        $id = $data['id'] ?? 0;
        $motivo = $data['motivo'] ?? '';
        $usuario_logado = $data['usuario_logado'] ?? '';

        if (!$id || !$motivo || !$usuario_logado) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos para exclusão.']);
            exit;
        }

        // Obter informações da saída antes de excluir
        $stmt_info = $connection->prepare("SELECT valor FROM saidas WHERE id = ?");
        $stmt_info->bind_param('i', $id);
        $stmt_info->execute();
        $result_info = $stmt_info->get_result();

        if ($result_info->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Saída não encontrada.']);
            exit;
        }

        $saida = $result_info->fetch_assoc();
        $valor = $saida['valor'];

        // Registrar a exclusão na tabela de exclusões
        $stmt_exclusao = $connection->prepare("INSERT INTO exclusoes (tipo, referencia, motivo, valor, usuario_logado, data) 
                                               VALUES ('saidas', ?, ?, ?, ?, NOW())");
        $stmt_exclusao->bind_param('isds', $id, $motivo, $valor, $usuario_logado);

        if ($stmt_exclusao->execute()) {
            // Excluir a saída
            $stmt_delete = $connection->prepare("DELETE FROM saidas WHERE id = ?");
            $stmt_delete->bind_param('i', $id);

            if ($stmt_delete->execute()) {
                echo json_encode(['success' => true, 'message' => 'Saída excluída e registrada no histórico.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir a saída.']);
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
