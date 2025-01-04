<?php
$host = 'dpg-ctsiv65umphs73ifn0a10-a'; // Hostname do Render
$port = '5432';                        // Porta fornecida
$user = 'sucata';                      // Usuário
$password = 'x00onMFxEEqkWli46XMTtnx5tWliDMvy'; // Senha fornecida
$database = 'sucata';                  // Nome do banco de dados

// Estabelecer conexão
$connection = new mysqli($host, $user, $password, $database, $port);

// Verificar conexão
if ($connection->connect_error) {
    die("Erro ao conectar ao banco de dados: " . $connection->connect_error);
}

echo "Conexão bem-sucedida com o banco de dados!";
?>
