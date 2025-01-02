<?php
$host = getenv('DB_HOST') ?: 'sql308.infinityfree.com'; // URL do host no InfinityFree
$db_name = getenv('DB_NAME') ?: 'if0_37921675_sucata'; // Nome do banco
$user = getenv('DB_USER') ?: 'if0_37921675'; // Usuário do banco
$password = getenv('DB_PASSWORD') ?: 'Sucata22'; // Senha do banco

// Tente conectar ao banco
$conn = new mysqli($host, $user, $password, $db_name);

// Verifica erros na conexão
if ($conn->connect_error) {
    die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
}
?>
