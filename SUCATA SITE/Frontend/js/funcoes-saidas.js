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
    atualizarSaidasHome();

    // Enviar notificação ao Telegram
    enviarTelegram(`📤 *Nova Saída Registrada*:\n\n👤 Funcionário: ${saida.funcionario}\n💵 Valor: R$ ${saida.valor.toFixed(2)}\n📄 Motivo: ${saida.motivo}\n💳 Forma de Pagamento: ${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n📅 Data: ${saida.data}`);
}

// Função para excluir uma saída
function excluirSaida(index) {
    const motivo = prompt("Informe o motivo para a exclusão:");
    if (!motivo || motivo.trim() === "") {
        alert("Exclusão cancelada. O motivo é obrigatório.");
        return;
    }

    const saidaRemovida = historicoSaidas.splice(index, 1)[0];
    exclusoes.push({ ...saidaRemovida, motivo, tipo: "Saída" });
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));

    // Recalcular totais
    if (saidaRemovida.formaPagamento === "dinheiro") {
        const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
        localStorage.setItem("totalSaidasDinheiro", totalDinheiro - saidaRemovida.valor);
    } else if (saidaRemovida.formaPagamento === "pix") {
        const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
        localStorage.setItem("totalSaidasPix", totalPix - saidaRemovida.valor);
    }

    atualizarListaSaidas();
    atualizarSaidasHome();

    // Enviar notificação ao Telegram
    enviarTelegram(`❌ *Saída Excluída*:\n\n👤 Funcionário: ${saidaRemovida.funcionario}\n💵 Valor: R$ ${saidaRemovida.valor.toFixed(2)}\n📄 Motivo da Exclusão: ${motivo}`);
}

// Atualizar a lista de saídas
function atualizarListaSaidas() {
    const lista = document.getElementById("lista-saidas");
    lista.innerHTML = "";

    historicoSaidas.forEach((saida, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${saida.data}</td>
            <td>${saida.funcionario}</td>
            <td>R$ ${saida.valor.toFixed(2)}</td>
            <td>${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}</td>
            <td>${saida.motivo}</td>
            <td><button onclick="excluirSaida(${index})" class="btn btn-danger btn-sm">Excluir</button></td>
        `;
        lista.appendChild(row);
    });
}

// Atualizar os totais na Home
function atualizarSaidasHome() {
    const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;

    const totalSaidas = totalDinheiro + totalPix;
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar na interface
    document.getElementById("total-saidas-dia").innerText = totalSaidas.toFixed(2);
    document.getElementById("total-saidas-dinheiro").innerText = totalDinheiro.toFixed(2);
    document.getElementById("total-saidas-pix").innerText = totalPix.toFixed(2);
}

// Enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "@Sucatas_bot";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: mensagem, parse_mode: "Markdown" }),
        });
        if (!response.ok) throw new Error("Erro ao enviar mensagem para o Telegram.");
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
};

window.onload = function () {
    atualizarListaSaidas();
};
