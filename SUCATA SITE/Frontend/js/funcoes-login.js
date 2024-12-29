document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", realizarLogin);
});

const API_URL = "/api/home.php"; // Caminho para o backend

/**
 * Realiza o login verificando as credenciais no backend.
 * @param {Event} event - Evento de envio do formulário.
 */
async function realizarLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "login",
                username: usuario,
                password: senha,
            }),
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
            salvarUsuarioLogado(data.user); // Salva os dados do usuário retornados pelo backend
            window.location.href = "index.html"; // Redireciona para a página principal
        } else {
            exibirErroLogin(data.message || "Usuário ou senha incorretos.");
        }
    } catch (error) {
        exibirErroLogin(`Erro ao realizar login: ${error.message}`);
    }
}

/**
 * Salva os dados do usuário logado no localStorage.
 * @param {Object} usuario - Dados do usuário retornados pelo backend.
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
        usuario: usuario.nome,
        horarioLogin,
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));
}

/**
 * Exibe uma mensagem de erro ao usuário.
 * @param {string} mensagem - Mensagem de erro a ser exibida.
 */
function exibirErroLogin(mensagem = "Erro ao realizar login.") {
    const erroDiv = document.getElementById("login-error");
    erroDiv.style.display = "block";
    erroDiv.innerText = mensagem;
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
