document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", realizarLogin);
    } else {
        console.error("Elemento de formulário de login não encontrado.");
    }
});

async function realizarLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!usuario || !senha) {
        alert("Usuário ou senha não podem estar vazios.");
        return;
    }

    try {
        const response = await fetch("https://lucienesucatas.netlify.app", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "login",
                username: usuario,
                password: senha
            })
        });

        if (!response.ok) {
            throw new Error("Erro na conexão com o servidor.");
        }

        const data = await response.json();
        if (data.success) {
            alert("Login realizado com sucesso.");
            window.location.href = "index.html";
        } else {
            alert(data.message || "Erro ao realizar login.");
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        alert(`Erro ao realizar login: ${error.message}`);
    }
}
