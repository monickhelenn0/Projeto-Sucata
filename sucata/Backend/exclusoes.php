<?php
// exclusoes.php
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
        // Listar exclusões (compras ou saídas) com filtro de data
        $data = $_GET['data'] ?? null;

        // Exclusões de Compras
        $queryCompras = "
            SELECT e.id, e.data, c.material AS descricao, e.motivo, e.valor, e.usuario_logado
            FROM exclusoes e
            JOIN compras c ON e.referencia = c.id
            WHERE e.tipo = 'compras'";

        if ($data) {
            $queryCompras .= " AND DATE(e.data) = ?";
        }

        $queryCompras .= " ORDER BY e.data DESC";

        $stmtCompras = $conn->prepare($queryCompras);

        if ($data) {
            $stmtCompras->bind_param('s', $data);
        }

        $stmtCompras->execute();
        $resultCompras = $stmtCompras->get_result();

        $exclusoesCompras = [];
        while ($row = $resultCompras->fetch_assoc()) {
            $exclusoesCompras[] = $row;
        }

        $stmtCompras->close();

        // Exclusões de Saídas
        $querySaidas = "
            SELECT e.id, e.data, s.funcionario AS descricao, e.motivo, e.valor, e.usuario_logado
            FROM exclusoes e
            JOIN saidas s ON e.referencia = s.id
            WHERE e.tipo = 'saidas'";

        if ($data) {
            $querySaidas .= " AND DATE(e.data) = ?";
        }

        $querySaidas .= " ORDER BY e.data DESC";

        $stmtSaidas = $conn->prepare($querySaidas);

        if ($data) {
            $stmtSaidas->bind_param('s', $data);
        }

        $stmtSaidas->execute();
        $resultSaidas = $stmtSaidas->get_result();

        $exclusoesSaidas = [];
        while ($row = $resultSaidas->fetch_assoc()) {
            $exclusoesSaidas[] = $row;
        }

        $stmtSaidas->close();

        echo json_encode([
            'success' => true,
            'data' => [
                'compras' => $exclusoesCompras,
                'saidas' => $exclusoesSaidas
            ]
        ]);
        break;

    case 'POST':
        // Registrar nova exclusão
        $data = json_decode(file_get_contents('php://input'), true);

        $tipo = $data['tipo'] ?? null;
        $referencia = $data['referencia'] ?? null; // ID de compra ou saída
        $motivo = $data['motivo'] ?? null;
        $valor = $data['valor'] ?? null;
        $usuario_logado = $_SESSION['username'] ?? 'Usuário Desconhecido';

        if (!$tipo || !in_array($tipo, ['compras', 'saidas']) || !$referencia || !$motivo || !$valor) {
            echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
            exit;
        }

        $query = "INSERT INTO exclusoes (tipo, referencia, motivo, valor, usuario_logado, data) VALUES (?, ?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('sssss', $tipo, $referencia, $motivo, $valor, $usuario_logado);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Exclusão registrada com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar exclusão.']);
        }

        $stmt->close();
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Método não suportado.']);
        break;
}

$conn->close();
?>
