<?php
// compras.php
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
        // Listar materiais disponíveis ou compras
        if (isset($_GET['materiais'])) {
            // Listar materiais
            $query = "SELECT * FROM materiais ORDER BY nome ASC";
            $result = $conn->query($query);

            $materiais = [];
            while ($row = $result->fetch_assoc()) {
                $materiais[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $materiais]);
        } elseif (isset($_GET['data_inicio']) && isset($_GET['data_fim'])) {
            // Filtrar compras por data
            $data_inicio = $_GET['data_inicio'];
            $data_fim = $_GET['data_fim'];

            $query = "SELECT * FROM compras WHERE data BETWEEN ? AND ? ORDER BY data DESC";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('ss', $data_inicio, $data_fim);
            $stmt->execute();
            $result = $stmt->get_result();

            $compras = [];
            while ($row = $result->fetch_assoc()) {
                $compras[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $compras]);
            $stmt->close();
        } else {
            // Listar todas as compras
            $query = "SELECT * FROM compras ORDER BY data DESC";
            $result = $conn->query($query);

            $compras = [];
            while ($row = $result->fetch_assoc()) {
                $compras[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $compras]);
        }
        break;

    case 'POST':
        // Registrar nova compra
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['material_id'], $data['peso'], $data['preco_kg'], $data['forma_pagamento'])) {
            $material_id = $data['material_id'];
            $peso = $data['peso'];
            $preco_kg = $data['preco_kg'];
            $forma_pagamento = $data['forma_pagamento'];
            $valor_total = $peso * $preco_kg;

            if ($peso <= 0 || $preco_kg <= 0) {
                echo json_encode(['success' => false, 'message' => 'Peso ou preço inválidos.']);
                exit;
            }

            $query = "INSERT INTO compras (material_id, peso, preco_kg, valor_total, forma_pagamento, data) VALUES (?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('iddss', $material_id, $peso, $preco_kg, $valor_total, $forma_pagamento);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Compra registrada com sucesso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao registrar compra.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
        }
        break;

    case 'DELETE':
        // Excluir uma compra
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['id'])) {
            $compraId = $data['id'];

            if ($compraId <= 0) {
                echo json_encode(['success' => false, 'message' => 'ID inválido.']);
                exit;
            }

            $query = "DELETE FROM compras WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $compraId);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Compra excluída com sucesso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir compra.']);
            }

            $stmt->close();
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método não suportado.']);
        break;
}

$conn->close();
?>
