<?php
$host = 'mysql.heliohost.org'; // Host correto do HelioHost
$user = 'monickhelenn0_sucata'; // Usuário do banco
$password = 'Sucata22';         // Senha do banco
$database = 'monickhelenn0_projeto_sucata'; // Nome do banco
$port = '3306';                 // Porta padrão do MySQL

$connection = new mysqli($host, $user, $password, $database, $port);

if ($connection->connect_error) {
    die("Erro ao conectar ao banco de dados: " . $connection->connect_error);
}

?>
