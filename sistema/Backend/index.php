<?php
// Habilitar CORS
header("Access-Control-Allow-Origin: https://lucienesucatas.netlify.app");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responder a requisições OPTIONS para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($conn) || $conn === null) {
    echo json_encode(['success' => false, 'message' => 'Conexão ao banco não estabelecida.']);
    exit;
}

// Exemplo de uso da conexão
$result = $conn->query("SELECT * FROM tabela");
if (!$result) {
    echo json_encode(['success' => false, 'message' => 'Erro na consulta ao banco.']);
    exit;
}

// Fechando a conexão corretamente
if ($conn) {
    $conn->close();
}

// Iniciar sessão
session_start();
require 'db_connection.php'; // Certifique-se de que este arquivo está configurado corretamente

// Configurar o tipo de resposta
header('Content-Type: application/json');

// Lidar com ações recebidas no backend
$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';

//if (!in_array($action, ['login', 'logout']) && !isset($_SESSION['user_id'])) {
//    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
//    exit;
//}

switch ($action) {
    case 'login':
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            echo json_encode(['success' => false, 'message' => 'Usuário ou senha não informados.']);
            exit;
        }

        // Consulta para verificar usuário e senha (com hash SHA2)
        $query = "SELECT id, username, nome FROM usuarios WHERE username = ? AND password = SHA2(?, 256)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('ss', $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['nome'] = $user['nome'];
            echo json_encode(['success' => true, 'message' => 'Login realizado com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Usuário ou senha inválidos.']);
        }

        $stmt->close();
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso.']);
        break;

    case 'iniciar_dia':
        $valorInicial = $data['valor_inicial'] ?? 0;

        if ($valorInicial <= 0) {
            echo json_encode(['success' => false, 'message' => 'Valor inicial inválido.']);
            exit;
        }

        $query = "INSERT INTO resumo_dia (data, valor_recebido) VALUES (CURDATE(), ?) 
                  ON DUPLICATE KEY UPDATE valor_recebido = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('dd', $valorInicial, $valorInicial);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Valor inicial registrado com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao registrar o valor inicial.']);
        }
        $stmt->close();
        break;

    case 'cadastrar_caixa':
        $valorCaixa = $data['valor_caixa'] ?? 0;

        if ($valorCaixa <= 0) {
            echo json_encode(['success' => false, 'message' => 'Valor do caixa inválido.']);
            exit;
        }

        $query = "INSERT INTO resumo_dia (data, valor_recebido) VALUES (CURDATE(), ?) 
                  ON DUPLICATE KEY UPDATE valor_recebido = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('dd', $valorCaixa, $valorCaixa);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Caixa cadastrado com sucesso.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar o caixa.']);
        }
        $stmt->close();
        break;

    case 'finalizar_dia':
        $query = "SELECT * FROM resumo_dia WHERE data = CURDATE()";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $resumo = $result->fetch_assoc();

            $mensagem = "Resumo do Dia:\n";
            $mensagem .= "Caixa: R$ " . number_format($resumo['valor_recebido'], 2) . "\n";

            echo json_encode(['success' => true, 'message' => 'Resumo gerado.', 'telegram_message' => $mensagem]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Nenhum resumo encontrado para hoje.']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida.']);
        break;
}

$conn->close();
