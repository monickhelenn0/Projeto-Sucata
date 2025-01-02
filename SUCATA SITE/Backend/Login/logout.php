<?php
// logout.php
session_start();

// Finalizar sessão
session_destroy();

// Retornar resposta
echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso.']);
?>
