<?php
// estoque.php
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
        // Listar itens no estoque com filtros de ordenação ou período
        $order = $_GET['order'] ?? 'nome'; // Ordem padrão: nome
        $data_inicio = $_GET['data_inicio'] ?? null;
        $data_fim = $_GET['data_fim'] ?? null;

        // Validar e definir a ordem
        switch ($order) {
            case 'data':
                $orderQuery = "ORDER BY data_adicionado DESC";
                break;
            case 'mais_comprado':
                $orderQuery = "ORDER BY quantidade_vendida DESC";
                break;
            case 'nome':
            default:
                $orderQuery = "ORDER BY nome ASC";
                break;
        }

        // Filtrar por período de datas, se fornecido
        if ($data_inicio && $data_fim) {
            $query = "SELECT * FROM estoque WHERE data_adicionado BETWEEN ? AND ? $orderQuery";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('ss', $data_inicio, $data_fim);
        } else {
            $query = "SELECT * FROM estoque $orderQuery";
            $stmt = $conn->prepare($query);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $estoque = [];
        while ($row = $result->fetch_assoc()) {
            $estoque[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $estoque]);
        $stmt->close();
        break;

    case 'POST':
        // Abastecer estoque com compras realizadas
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['compra_id'])) {
            $compra_id = $data['compra_id'];

            // Obter dados da compra
            $queryCompra = "SELECT material_id, quantidade FROM compras WHERE id = ?";
            $stmtCompra = $conn->prepare($queryCompra);
            $stmtCompra->bind_param('i', $compra_id);
            $stmtCompra->execute();
            $resultCompra = $stmtCompra->get_result();

            if ($resultCompra->num_rows > 0) {
                $compra = $resultCompra->fetch_assoc();

                // Atualizar ou inserir no estoque
                $queryEstoque = "INSERT INTO estoque (nome, quantidade, data_adicionado) VALUES ((SELECT nome FROM materiais WHERE id = ?), ?, NOW()) ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)";
                $stmtEstoque = $conn->prepare($queryEstoque);
                $stmtEstoque->bind_param('ii', $compra['material_id'], $compra['quantidade']);

                if ($stmtEstoque->execute()) {
                    echo json_encode(['success' => true, 'message' => 'Estoque abastecido com sucesso.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Erro ao abastecer estoque.']);
                }

                $stmtEstoque->close();
            } else {
                echo json_encode(['success' => false, 'message' => 'Compra não encontrada.']);
            }

            $stmtCompra->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'ID da compra não fornecido.']);
        }
        break;

    case 'DELETE':
        // Excluir item do estoque
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['id'])) {
            $id = $data['id'];

            $query = "DELETE FROM estoque WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $id);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Item excluído do estoque com sucesso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir item do estoque.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'ID do item não fornecido.']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método não suportado.']);
        break;
}

$conn->close();
?>
