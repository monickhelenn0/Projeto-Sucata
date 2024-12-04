function realizarLogin() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const usuarios = {
        "GP.Varzea": "varzea01",
        "GP.Amarelo": "amarelo02",
    };

    if (usuarios[usuario] === senha) {
        const horarioLogin = new Date().toLocaleString();
        localStorage.setItem("usuarioLogado", JSON.stringify({ usuario, horarioLogin }));
        window.location.href = "index.html"; // Redireciona para a página inicial
        return false;
    } else {
        alert("Usuário ou senha incorretos!");
        return false;
    }
}

function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado || !usuarioLogado.usuario) {
        window.location.href = "login.html";
    }
}

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

function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

// Adicionar verificação de login ao carregar as páginas
document.addEventListener("DOMContentLoaded", () => {
    verificarLogin();
    carregarPainelUsuario();
});
