<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Registrar uma nova exclusão
        $data = json_decode(file_get_contents('php://input'), true);
        $tipo = $data['tipo'] ?? '';
        $referencia = $data['referencia'] ?? 0;
        $motivo = $data['motivo'] ?? '';
        $usuario_logado = $data['usuario_logado'] ?? '';

        if (!$tipo || !$referencia || !$motivo || !$usuario_logado) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Dados incompletos ou inválidos.']);
            exit;
        }

        // Obter informações da referência
        $tabela = $tipo === 'compras' ? 'compras' : 'saidas';
        $stmt_ref = $connection->prepare("SELECT * FROM $tabela WHERE id = ?");
        $stmt_ref->bind_param('i', $referencia);
        $stmt_ref->execute();
        $result_ref = $stmt_ref->get_result();

        if ($result_ref->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Registro não encontrado.']);
            exit;
        }

        $registro = $result_ref->fetch_assoc();
        $valor = $registro['valor'];
        $quantidade = $registro['quantidade'] ?? 0;
        $material_id = $registro['material_id'] ?? null;

        // Registrar exclusão
        $stmt_exclusao = $connection->prepare("INSERT INTO exclusoes (tipo, referencia, motivo, valor, usuario_logado, data) 
                                               VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt_exclusao->bind_param('sisds', $tipo, $referencia, $motivo, $valor, $usuario_logado);

        if ($stmt_exclusao->execute()) {
            // Excluir o registro original
            $stmt_delete = $connection->prepare("DELETE FROM $tabela WHERE id = ?");
            $stmt_delete->bind_param('i', $referencia);

            if ($stmt_delete->execute()) {
                // Atualizar estoque, se aplicável
                if ($tipo === 'compras' && $material_id && $quantidade > 0) {
                    $stmt_update = $connection->prepare("UPDATE estoque SET quantidade = quantidade - ? WHERE material_id = ?");
                    $stmt_update->bind_param('ii', $quantidade, $material_id);
                    $stmt_update->execute();
                    $stmt_update->close();
                }

                echo json_encode(['success' => true, 'message' => 'Exclusão registrada e alterações aplicadas com sucesso.']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir o registro original.']);
            }

            $stmt_delete->close();
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar a exclusão.']);
        }

        $stmt_exclusao->close();
        $stmt_ref->close();
        break;

    case 'GET':
        // Listar exclusões
        $result = $connection->query("SELECT * FROM exclusoes");

        $exclusoes = [];
        while ($row = $result->fetch_assoc()) {
            $exclusoes[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $exclusoes]);
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
