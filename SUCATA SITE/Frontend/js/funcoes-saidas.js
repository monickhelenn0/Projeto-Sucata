let historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];
let exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];

// Função para adicionar uma saída
function adicionarSaida() {
    const funcionario = document.getElementById("funcionario").value.trim();
    const valor = parseFloat(document.getElementById("valor").value) || 0;
    const motivo = document.getElementById("motivo").value.trim();
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (!funcionario || valor <= 0 || !motivo || !formaPagamento) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const saida = { 
        data: new Date().toLocaleDateString(), 
        funcionario, valor, motivo, formaPagamento 
    };

    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    atualizarListaSaidas();

    // Mostrar modal de confirmação
    const modal = new bootstrap.Modal(document.getElementById("saidaConfirmadaModal"));
    modal.show();

// Enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: mensagem, parse_mode: "Markdown" }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro ao enviar mensagem ao Telegram:", error.description);
            alert(`Erro ao enviar mensagem ao Telegram: ${error.description}`);
        } else {
            console.log("Mensagem enviada ao Telegram com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
        alert("Erro ao enviar mensagem ao Telegram. Verifique sua conexão ou configurações.");
    }
};
}
// Atualizar a lista de saídas
function atualizarListaSaidas() {
    const tabelaSaidas = document.getElementById("lista-saidas");
    tabelaSaidas.innerHTML = "";

    historicoSaidas.forEach((saida, index) => {
        tabelaSaidas.innerHTML += `
            <tr>
                <td>${saida.data}</td>
                <td>${saida.funcionario}</td>
                <td>R$ ${saida.valor.toFixed(2)}</td>
                <td>${saida.formaPagamento}</td>
                <td>${saida.motivo}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirSaida(${index})">Excluir</button></td>
            </tr>
        `;
    });
}

// Enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "Sucatas_bot";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: mensagem }),
        });
        if (!response.ok) throw new Error("Erro ao enviar mensagem para o Telegram.");
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};

// Carregar saídas ao abrir a página
window.onload = atualizarListaSaidas;

// Testar envio de mensagem ao Telegram
function testeEnvioTelegram() {
    const mensagem = "🚀 Teste de envio de mensagem ao Telegram!";
    enviarTelegram(mensagem);
}

// Chamar a função ao carregar a página (para testar)
// Comente a linha abaixo após testar:
window.onload = testeEnvioTelegram;
