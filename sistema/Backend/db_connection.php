<?php
$host = getenv('sql308.infinityfree.com') ?: 'sql308.infinityfree.com'; // URL do host no InfinityFree
$db_name = getenv('if0_37921675_sucata') ?: 'if0_37921675_sucata'; // Nome do banco
$user = getenv('if0_37921675') ?: 'if0_37921675'; // Usuário do banco
$password = getenv('Sucata22') ?: 'Sucata22'; // Senha do banco

// Estabelecer conexão com o banco de dados
$connection = new mysqli($host, $user, $password, $database);

// Verificar conexão
if ($connection->connect_error) {
    log_error("Erro ao conectar ao banco de dados: " . $connection->connect_error);
    respond(false, "Erro interno no servidor.", null, 500);
}

// Configuração de charset para evitar problemas de codificação
$connection->set_charset("utf8");
?>