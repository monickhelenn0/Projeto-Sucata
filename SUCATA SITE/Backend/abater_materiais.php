<?php
// abater_materiais.php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Listar materiais disponíveis no estoque
        $query = "SELECT * FROM estoque ORDER BY nome ASC";
        $result = $conn->query($query);

        $estoque = [];
        while ($row = $result->fetch_assoc()) {
            $estoque[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $estoque]);
        break;

    case 'POST':
        // Abater material do estoque
        $data = json_decode(file_get_contents('php://input'), true);

        $material_id = $data['material_id'] ?? null;
        $quantidade = $data['quantidade'] ?? null;
        $galpao_origem = $data['galpao_origem'] ?? null;
        $destino = $data['destino'] ?? null;
        $usuario_logado = $_SESSION['username'] ?? 'Usuário Desconhecido';

        if (!$material_id || !$quantidade || $quantidade <= 0 || !$galpao_origem || !$destino) {
            echo json_encode(['success' => false, 'message' => 'Dados inválidos ou incompletos.']);
            exit;
        }

        // Verificar se o material existe e tem quantidade suficiente
        $queryCheck = "SELECT quantidade FROM estoque WHERE id = ?";
        $stmtCheck = $conn->prepare($queryCheck);
        $stmtCheck->bind_param('i', $material_id);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();

        if ($resultCheck->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Material não encontrado no estoque.']);
            exit;
        }

        $material = $resultCheck->fetch_assoc();

        if ($material['quantidade'] < $quantidade) {
            echo json_encode(['success' => false, 'message' => 'Quantidade insuficiente no estoque.']);
            exit;
        }

        // Atualizar o estoque
        $queryUpdate = "UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?";
        $stmtUpdate = $conn->prepare($queryUpdate);
        $stmtUpdate->bind_param('ii', $quantidade, $material_id);

        if ($stmtUpdate->execute()) {
            // Registrar abate no histórico
            $queryLog = "INSERT INTO abates (material_id, quantidade, galpao_origem, destino, usuario_logado, data) VALUES (?, ?, ?, ?, ?, NOW())";
            $stmtLog = $conn->prepare($queryLog);
            $stmtLog->bind_param('iisss', $material_id, $quantidade, $galpao_origem, $destino, $usuario_logado);
            $stmtLog->execute();

            echo json_encode(['success' => true, 'message' => 'Material abatido com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao atualizar o estoque.']);
        }

        $stmtCheck->close();
        $stmtUpdate->close();
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método não suportado.']);
        break;
}

$conn->close();
?>
