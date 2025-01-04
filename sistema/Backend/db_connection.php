<?php
$host = 'sql308.infinityfree.com'; // Substitua pelo hostname correto
$user = 'if0_37921675';            // Seu nome de usuário no InfinityFree
$password = 'Sucata22';            // Sua senha no InfinityFree
$database = 'if0_37921675_database'; // Nome do banco de dados

// Estabelecer conexão
$connection = new mysqli($host, $user, $password, $database);

// Verificar conexão
if ($connection->connect_error) {
    die("Erro na conexão: " . $connection->connect_error);
}
?>
