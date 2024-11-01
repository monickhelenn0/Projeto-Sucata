// Variáveis para armazenar os dados de compras e saídas
let totalCompras = parseFloat(localStorage.getItem("totalCompras")) || 0;
let totalSaidas = parseFloat(localStorage.getItem("totalSaidas")) || 0;
let ultimaFormaPagamento = localStorage.getItem("ultimaFormaPagamento") || "-";

// Função para exibir os valores de compras e saídas
function atualizarResumoValores() {
    document.getElementById("total-compras").innerText = totalCompras.toFixed(2);
    document.getElementById("total-saidas").innerText = totalSaidas.toFixed(2);
    document.getElementById("ultima-forma-pagamento").innerText = ultimaFormaPagamento;
}

// Atualizar valores no carregamento da página
window.onload = atualizarResumoValores;
