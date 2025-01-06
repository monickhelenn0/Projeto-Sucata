<?php
$host = 'localhost'; // Hostname do Render
$port = '3306';  // Porta fornecida
$user = 'sucata'; // Usuário
$password = 'Sucata22'; // Senha fornecida
$database = 'monickhelenn0_projeto_sucata';  // Nome do banco de dados

// Estabelecer conexão
$connection = new mysqli($host, $user, $password, $database, $port);

// Verificar conexão
if ($connection->connect_error) {
    die("Erro ao conectar ao banco de dados: " . $connection->connect_error);
}

echo "Conexão bem-sucedida com o banco de dados!";
?>
