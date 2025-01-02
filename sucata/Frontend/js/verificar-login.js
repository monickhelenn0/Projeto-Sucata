/**
 * Verifica se o usuário está logado. Caso contrário, redireciona para a tela de login.
 */
(function verificarUsuarioLogado() {
    const usuarioLogado = localStorage.getItem("usuarioLogado");

    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = "login.html";
    }
})();
