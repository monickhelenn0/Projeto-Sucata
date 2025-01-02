// Função para carregar os dados do estoque
function carregarEstoque() {
    const historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    const tabelaEstoque = document.getElementById("tabela-estoque");

    // Agrupar os materiais por tipo e calcular os totais
    const materiais = {};
    historicoCompras.forEach((compra) => {
        compra.itens.forEach((item) => {
            materiais[item.material] = (materiais[item.material] || 0) + item.peso;
        });
    });

    // Transformar o objeto em array, ordenar e preencher a tabela
    const materiaisOrdenados = Object.entries(materiais)
        .map(([material, peso]) => ({ material, peso }))
        .sort((a, b) => b.peso - a.peso);

    tabelaEstoque.innerHTML = materiaisOrdenados
        .map((item) => `
            <tr>
                <td>${item.material}</td>
                <td>${item.peso.toFixed(2)} kg</td>
            </tr>
        `)
        .join("");
}

// Função para carregar o usuário logado no painel
function carregarUsuarioLogado() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || {};
    document.getElementById("username").innerText = usuarioLogado.nome || "Usuário";
    document.getElementById("login-time").innerText = `Logado desde: ${usuarioLogado.horario || "N/A"}`;
}

// Função para logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarioLogado();
    carregarEstoque();
});
