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

    const confirmacao = confirm(
        `Registrar a seguinte saída?\n\n` +
        `👤 Funcionário: ${funcionario}\n` +
        `💵 Valor: R$ ${valor.toFixed(2)}\n` +
        `📄 Motivo: ${motivo}\n` +
        `💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Espécie"}`
    );

    if (!confirmacao) {
        alert("Registro cancelado.");
        return;
    }

    const saida = {
        id: Date.now(), // ID único para cada saída
        data: new Date().toLocaleDateString(),
        funcionario,
        valor,
        motivo,
        formaPagamento,
    };

    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    atualizarListaSaidas();
    atualizarTotaisSaidas();

    const mensagem = `📤 *Nova Saída Registrada*:\n👤 Funcionário: ${funcionario}\n💵 Valor: R$ ${valor.toFixed(2)}\n📄 Motivo: ${motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Espécie"}\n📅 Data: ${saida.data}`;
    enviarTelegram(mensagem);

    alert("Saída registrada com sucesso!");

    // Limpar o formulário
    document.getElementById("funcionario").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("forma-pagamento").value = "pix";
}

// Função para excluir uma saída
function excluirSaida(index) {
    const motivoExclusao = prompt("Informe o motivo para a exclusão:");
    if (!motivoExclusao || motivoExclusao.trim() === "") {
        alert("Exclusão cancelada. O motivo é obrigatório.");
        return;
    }

    const saidaRemovida = historicoSaidas.splice(index, 1)[0];
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    atualizarListaSaidas();
    atualizarTotaisSaidas();

    // Registrar no log de exclusões
    const exclusao = {
        ...saidaRemovida,
        motivoExclusao,
        tipo: "Saída",
    };
    exclusoes.push(exclusao);
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));

    const mensagem = `❌ *Saída Excluída*:\n👤 Funcionário: ${saidaRemovida.funcionario}\n💵 Valor: R$ ${saidaRemovida.valor.toFixed(2)}\n📄 Motivo da Exclusão: ${motivoExclusao}\n💳 Forma de Pagamento: ${saidaRemovida.formaPagamento === "pix" ? "PIX" : "Espécie"}\n📅 Data: ${saidaRemovida.data}`;
    enviarTelegram(mensagem);

    alert("Saída excluída com sucesso!");
}

// Função para atualizar a lista de saídas
function atualizarListaSaidas() {
    const tabelaSaidas = document.getElementById("lista-saidas");
    if (!tabelaSaidas) return;

    tabelaSaidas.innerHTML = historicoSaidas.map((saida, index) => `
        <tr>
            <td>${saida.data}</td>
            <td>${saida.funcionario}</td>
            <td>R$ ${saida.valor.toFixed(2)}</td>
            <td>${saida.formaPagamento === "pix" ? "PIX" : "Espécie"}</td>
            <td>${saida.motivo}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="excluirSaida(${index})">Excluir</button>
            </td>
        </tr>
    `).join("");
}

// Função para atualizar os totais na página Home
function atualizarTotaisSaidas() {
    const totalEspécie = historicoSaidas
        .filter((saida) => saida.formaPagamento === "especie")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalPix = historicoSaidas
        .filter((saida) => saida.formaPagamento === "pix")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalSaidas = totalEspécie + totalPix;

    // Atualizar no LocalStorage
    localStorage.setItem("totalSaidasEspécie", totalEspécie);
    localStorage.setItem("totalSaidasPix", totalPix);
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar na interface (caso elementos existam)
    const totalSaidasEl = document.getElementById("total-saidas-dia");
    const totalEspécieEl = document.getElementById("total-saidas-especie");
    const totalPixEl = document.getElementById("total-saidas-pix");

    if (totalSaidasEl) totalSaidasEl.innerText = totalSaidas.toFixed(2);
    if (totalEspécieEl) totalEspécieEl.innerText = totalEspécie.toFixed(2);
    if (totalPixEl) totalPixEl.innerText = totalPix.toFixed(2);
}

// Função para enviar mensagens ao Telegram
async function enviarTelegram(mensagem) {
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
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
}

// Inicializar a página ao carregar
document.addEventListener("DOMContentLoaded", () => {
    atualizarListaSaidas();
    atualizarTotaisSaidas();
});
