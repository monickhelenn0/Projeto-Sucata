function realizarLogin() {
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

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
    if (!usuarioLogado) {
        window.location.href = "login.html";
    }
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}
