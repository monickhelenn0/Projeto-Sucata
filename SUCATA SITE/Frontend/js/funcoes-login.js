document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", realizarLogin);
});

/**
 * Credenciais de login permitidas.
 */
const usuarios = {
    "GP.Varzea": "varzea01",
    "GP.Amarelo": "amarelo02",
};

/**
 * Realiza o login verificando as credenciais.
 * @param {Event} event - Evento de envio do formulário.
 */
function realizarLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (usuarios[usuario] === senha) {
        salvarUsuarioLogado(usuario);
        window.location.href = "index.html"; // Redireciona para a página principal
    } else {
        exibirErroLogin();
    }
}

/**
 * Salva os dados do usuário logado no localStorage.
 * @param {string} usuario - Nome do usuário logado.
 */
function salvarUsuarioLogado(usuario) {
    const horarioLogin = new Date().toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const dadosUsuario = {
        usuario,
        horarioLogin,
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
}

/**
 * Exibe uma mensagem de erro ao usuário.
 */
function exibirErroLogin() {
    const erroDiv = document.getElementById("login-error");
    erroDiv.style.display = "block";
    setTimeout(() => {
        erroDiv.style.display = "none";
    }, 3000);
}

/**
 * Verifica se o usuário está logado e redireciona caso não esteja.
 */
function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado || !usuarioLogado.usuario) {
        window.location.href = "login.html";
    }
}

/**
 * Carrega as informações do painel do usuário logado.
 */
function carregarPainelUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        verificarLogin();
        return;
    }

    const nomeUsuario = document.getElementById("username");
    const horarioLogin = document.getElementById("login-time");

    if (nomeUsuario) {
        nomeUsuario.innerText = usuarioLogado.usuario || "Usuário";
    }

    if (horarioLogin) {
        horarioLogin.innerText = `Logado desde: ${usuarioLogado.horarioLogin || "N/A"}`;
    }
}

/**
 * Realiza o logout do usuário.
 */
function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}
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
