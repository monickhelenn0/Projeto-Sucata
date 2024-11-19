document.addEventListener("DOMContentLoaded", () => {
    atualizarTotaisHome();
});

// Função para atualizar um elemento com valor formatado
function atualizarValor(id, valor) {
    document.getElementById(id).innerText = valor.toFixed(2);
}

// Função para registrar um valor no caixa
function atualizarCaixa() {
    const valorCaixa = parseFloat(document.getElementById("valor-caixa").value) || 0;
    if (valorCaixa < 0) {
        alert("O valor não pode ser negativo.");
        return;
    }

    let totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;
    totalCaixa += valorCaixa;

    localStorage.setItem("totalCaixa", totalCaixa);
    atualizarValor("total-caixa", totalCaixa);
    document.getElementById("valor-caixa").value = "";
}

// Função para "Iniciar o Dia" e resetar os valores
function iniciarDia() {
    // Resetar valores no localStorage
    localStorage.setItem("totalCaixa", 0);
    localStorage.setItem("totalSaidasDinheiro", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalCompradoDinheiro", 0);
    localStorage.setItem("totalCompradoPix", 0);

    // Atualizar a interface na página
    document.getElementById("total-caixa").innerText = "0.00";
    document.getElementById("total-saidas-dia").innerText = "0.00";
    document.getElementById("total-saidas-dinheiro").innerText = "0.00";
    document.getElementById("total-saidas-pix").innerText = "0.00";
    document.getElementById("total-comprado-dia").innerText = "0.00";
    document.getElementById("compras-dinheiro").innerText = "0.00";
    document.getElementById("compras-pix").innerText = "0.00";

    alert("O dia foi iniciado e os valores foram resetados.");
}

// Atualizar os totais na página Home
function atualizarTotaisHome() {
    const totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;

    atualizarValor("total-caixa", totalCaixa);
    atualizarValor("total-saidas-dia", totalSaidasDinheiro + totalSaidasPix);
    atualizarValor("total-saidas-dinheiro", totalSaidasDinheiro);
    atualizarValor("total-saidas-pix", totalSaidasPix);
    atualizarValor("total-comprado-dia", totalCompradoDinheiro + totalCompradoPix);
    atualizarValor("compras-dinheiro", totalCompradoDinheiro);
    atualizarValor("compras-pix", totalCompradoPix);
}

// Função para enviar resumo diário ao Telegram
function enviarResumoTelegram() {
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;

    // Buscar o maior valor retirado
    const historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];
    const maiorSaida = historicoSaidas.sort((a, b) => b.valor - a.valor)[0] || { valor: 0 };

    const mensagem = `
📊 *Resumo Diário:*
🔵 Total Compras - Dinheiro: R$ ${totalCompradoDinheiro.toFixed(2)}
🟢 Total Compras - PIX: R$ ${totalCompradoPix.toFixed(2)}
🔴 Total Saídas - Dinheiro: R$ ${totalSaidasDinheiro.toFixed(2)}
🟣 Total Saídas - PIX: R$ ${totalSaidasPix.toFixed(2)}

💰 *Maior Saída do Dia:*
- Valor: R$ ${maiorSaida.valor.toFixed(2) || "0.00"}
    `;

    enviarTelegram(mensagem);
}

// Função para enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "Sucatas_bot";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: mensagem,
                parse_mode: "Markdown",
            }),
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar mensagem para o Telegram.");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
}
