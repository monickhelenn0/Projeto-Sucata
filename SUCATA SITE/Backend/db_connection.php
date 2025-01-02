<?php
$host = getenv('sql308.infinityfree.com') ?: 'sql308.infinityfree.com'; // URL do host no InfinityFree
$db_name = getenv('if0_37921675_sucata') ?: 'if0_37921675_sucata'; // Nome do banco
$user = getenv('if0_37921675') ?: 'if0_37921675'; // Usuário do banco
$password = getenv('Sucata22') ?: 'Sucata22'; // Senha do banco

// Tente conectar ao banco
$conn = new mysqli($host, $user, $password, $db_name);

// Verifica erros na conexão
if ($conn->connect_error) {
    die('Erro na conexão com o banco de dados: ' . $conn->connect_error);
}
?>
