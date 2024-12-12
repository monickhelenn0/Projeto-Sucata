// Arquivo: funcoes-home.js

document.addEventListener("DOMContentLoaded", () => {
    atualizarTotaisHome();
});

// Atualiza o valor exibido no elemento com base no formato de moeda local
function atualizarValor(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerText = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
}

// Inicia um novo dia, resetando todos os valores
function iniciarDia() {
    const confirmacao = confirm("Tem certeza de que deseja iniciar um novo dia? Isso irá resetar os valores atuais.");
    if (!confirmacao) return;

    // Resetar valores no localStorage
    localStorage.setItem("totalCaixa", 0);
    localStorage.setItem("totalSaidasDinheiro", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalCompradoDinheiro", 0);
    localStorage.setItem("totalCompradoPix", 0);

    // Atualiza os valores na interface
    atualizarTotaisHome();
    alert("Novo dia iniciado com sucesso.");
}

// Finaliza o dia e envia um resumo ao Telegram
function finalizarDia() {
    const totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;

    // Gera um resumo formatado
    const resumo = `
Resumo do Dia:
- Caixa: ${formatarMoeda(totalCaixa)}
- Saídas (Dinheiro): ${formatarMoeda(totalSaidasDinheiro)}
- Saídas (PIX): ${formatarMoeda(totalSaidasPix)}
- Compras (Dinheiro): ${formatarMoeda(totalCompradoDinheiro)}
- Compras (PIX): ${formatarMoeda(totalCompradoPix)}`;

    const confirmacao = confirm(`Deseja finalizar o dia? Confira o resumo:\n${resumo}`);
    if (confirmacao) {
        enviarTelegram(resumo);
        alert("Resumo enviado e dia finalizado.");
    }
}

// Atualiza os totais na página Home com base nos valores armazenados
function atualizarTotaisHome() {
    const totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;

    atualizarValor("total-caixa", totalCaixa);
    atualizarValor("total-saidas-dia", totalSaidasDinheiro + totalSaidasPix);
    atualizarValor("total-comprado-dia", totalCompradoDinheiro + totalCompradoPix);
}

// Função para enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc"; // Token pré-definido
    const CHAT_ID = "-4585457524"; // ID do grupo
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: mensagem, parse_mode: "Markdown" })
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar mensagem para o Telegram.");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
};

// Formata valores em moeda brasileira
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}
