// Variáveis para armazenar os dados de compras e saídas
let totalCompras = 0;
let totalSaidas = 0;

// Função para salvar o valor inicial do caixa
function salvarCaixaInicial() {
    const valorDia = parseFloat(document.getElementById("valor-dia").value) || 0;
    document.getElementById("caixa-inicial").innerText = valorDia.toFixed(2);
}

// Função para adicionar um novo valor ao caixa
function adicionarValor() {
    const valor = parseFloat(document.getElementById("novo-valor").value) || 0;
    const formaPagamento = document.getElementById("forma-pagamento").value;

    // Atualizar total de compras e saídas dependendo da página de origem
    if (formaPagamento === "pix") {
        totalCompras += valor;
    } else {
        totalSaidas += valor;
    }

    // Exibir os totais atualizados
    document.getElementById("total-compras").innerText = totalCompras.toFixed(2);
    document.getElementById("total-saidas").innerText = totalSaidas.toFixed(2);
    document.getElementById("ultima-forma-pagamento").innerText = formaPagamento === "pix" ? "PIX" : "Dinheiro";

    // Limpar campos
    document.getElementById("novo-valor").value = "";
    document.getElementById("forma-pagamento").value = "pix";
}
