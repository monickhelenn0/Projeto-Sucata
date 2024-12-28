<?php
// saidas.php
session_start();
require 'db_connection.php';

header('Content-Type: application/json');

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function enviarTelegram($mensagem) {
    $TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    $CHAT_ID = "-4585457524";
    $url = "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage";

    $data = [
        'chat_id' => $CHAT_ID,
        'text' => $mensagem,
        'parse_mode' => 'Markdown'
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
        ],
    ];
    $context  = stream_context_create($options);
    file_get_contents($url, false, $context);
}

switch ($method) {
    case 'GET':
        // Listar saídas com ou sem filtro de data
        if (isset($_GET['data_inicio']) && isset($_GET['data_fim'])) {
            $data_inicio = $_GET['data_inicio'];
            $data_fim = $_GET['data_fim'];

            $query = "SELECT * FROM saidas WHERE data BETWEEN ? AND ? ORDER BY data DESC";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('ss', $data_inicio, $data_fim);
            $stmt->execute();
            $result = $stmt->get_result();

            $saidas = [];
            while ($row = $result->fetch_assoc()) {
                $saidas[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $saidas]);
            $stmt->close();
        } else {
            // Listar todas as saídas
            $query = "SELECT * FROM saidas ORDER BY data DESC";
            $result = $conn->query($query);

            $saidas = [];
            while ($row = $result->fetch_assoc()) {
                $saidas[] = $row;
            }

            echo json_encode(['success' => true, 'data' => $saidas]);
        }
        break;

    case 'POST':
        // Registrar uma nova saída
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['funcionario'], $data['valor'], $data['motivo'], $data['forma_pagamento'])) {
            $funcionario = $data['funcionario'];
            $valor = $data['valor'];
            $motivo = $data['motivo'];
            $forma_pagamento = $data['forma_pagamento'];
            $usuario_logado = $_SESSION['username'] ?? 'Usuário Desconhecido';

            if ($valor <= 0) {
                echo json_encode(['success' => false, 'message' => 'Valor inválido.']);
                exit;
            }

            $query = "INSERT INTO saidas (funcionario, valor, motivo, forma_pagamento, usuario_logado, data) VALUES (?, ?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('sdsss', $funcionario, $valor, $motivo, $forma_pagamento, $usuario_logado);

            if ($stmt->execute()) {
                $mensagem = "📤 *Nova Saída Registrada*:\n👤 Funcionário: $funcionario\n💵 Valor: R$ " . number_format($valor, 2, ',', '.') . "\n📄 Motivo: $motivo\n💳 Forma de Pagamento: " . ($forma_pagamento === 'pix' ? 'PIX' : 'Espécie') . "\n👥 Usuário Logado: $usuario_logado";
                enviarTelegram($mensagem);

                echo json_encode(['success' => true, 'message' => 'Saída registrada com sucesso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao registrar saída.']);
            }

            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
        }
        break;

    case 'DELETE':
        // Excluir uma saída
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['id'])) {
            $saidaId = $data['id'];

            if ($saidaId <= 0) {
                echo json_encode(['success' => false, 'message' => 'ID inválido.']);
                exit;
            }

            $query = "DELETE FROM saidas WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param('i', $saidaId);

            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Saída excluída com sucesso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erro ao excluir saída.']);
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
