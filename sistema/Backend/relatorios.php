<?php
// Importar o arquivo de conexão com o banco
require_once '../db_connection.php';

// Configurar cabeçalhos para resposta JSON
header('Content-Type: application/json');

// Verificar método da requisição
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido.']);
    exit;
}

// Tipo de relatório solicitado
$tipo = $_GET['tipo'] ?? '';

switch ($tipo) {
    case 'compras':
        // Total de compras
        $stmt = $connection->prepare("SELECT SUM(quantidade) AS total_quantidade, SUM(valor) AS total_valor FROM compras");
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        echo json_encode([
            'success' => true,
            'data' => [
                'total_quantidade' => $result['total_quantidade'] ?? 0,
                'total_valor' => $result['total_valor'] ?? 0.00
            ]
        ]);
        break;

    case 'saidas':
        // Total de saídas financeiras
        $stmt = $connection->prepare("SELECT SUM(valor) AS total_valor FROM saidas");
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        echo json_encode([
            'success' => true,
            'data' => [
                'total_valor' => $result['total_valor'] ?? 0.00
            ]
        ]);
        break;

    case 'estoque':
        // Resumo do estoque
        $result = $connection->query("SELECT materiais.nome, SUM(estoque.quantidade) AS quantidade_total 
                                      FROM estoque 
                                      INNER JOIN materiais ON estoque.material_id = materiais.id 
                                      GROUP BY estoque.material_id");

        $estoque = [];
        while ($row = $result->fetch_assoc()) {
            $estoque[] = $row;
        }

        echo json_encode([
            'success' => true,
            'data' => $estoque
        ]);
        break;

    case 'exclusoes':
        // Relatório de exclusões
        $result = $connection->query("SELECT tipo, COUNT(*) AS total_exclusoes, SUM(valor) AS total_valor 
                                      FROM exclusoes 
                                      GROUP BY tipo");

        $exclusoes = [];
        while ($row = $result->fetch_assoc()) {
            $exclusoes[] = $row;
        }

        echo json_encode([
            'success' => true,
            'data' => $exclusoes
        ]);
        break;

    default:
        // Tipo de relatório inválido
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tipo de relatório inválido ou não especificado.']);
        break;
}

// Fechar conexão
$connection->close();
?>
