<?php
$host = 'sql308.infinityfree.com'; // Servidor MySQL do InfinityFree
$user = 'if0_37921675';      // Usuário do banco
$password = 'Sucata22a';    // Senha do banco
$database = 'if0_37921675_sucata'; // Nome do banco

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}
?>
