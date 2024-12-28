<?php
// home.php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Resumo geral
    $dataHoje = date('Y-m-d');

    // Total de materiais no estoque
    $queryEstoque = "SELECT SUM(quantidade) AS total_estoque FROM estoque";
    $resultEstoque = $conn->query($queryEstoque);
    $totalEstoque = $resultEstoque->fetch_assoc()['total_estoque'] ?? 0;

    // Total de compras no dia
    $queryCompras = "SELECT SUM(valor) AS total_compras FROM compras WHERE DATE(data) = ?";
    $stmtCompras = $conn->prepare($queryCompras);
    $stmtCompras->bind_param('s', $dataHoje);
    $stmtCompras->execute();
    $resultCompras = $stmtCompras->get_result();
    $totalCompras = $resultCompras->fetch_assoc()['total_compras'] ?? 0;

    // Total de saídas no dia
    $querySaidas = "SELECT SUM(valor) AS total_saidas FROM saidas WHERE DATE(data) = ?";
    $stmtSaidas = $conn->prepare($querySaidas);
    $stmtSaidas->bind_param('s', $dataHoje);
    $stmtSaidas->execute();
    $resultSaidas = $stmtSaidas->get_result();
    $totalSaidas = $resultSaidas->fetch_assoc()['total_saidas'] ?? 0;

    // Comparação de entrada e saída
    $balanco = $totalCompras - $totalSaidas;

    echo json_encode([
        'success' => true,
        'data' => [
            'total_estoque' => $totalEstoque,
            'total_compras' => $totalCompras,
            'total_saidas' => $totalSaidas,
            'balanco' => $balanco
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Método não suportado.']);
}

$conn->close();
?>
