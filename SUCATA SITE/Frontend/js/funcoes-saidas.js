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
        funcionario,
        valor,
        motivo,
        formaPagamento,
    };

    // Adicionar ao histórico de saídas
    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    // Atualizar lista e totais
    atualizarListaSaidas();
    atualizarSaidasHome();

    // Exibir modal de confirmação
    const modal = new bootstrap.Modal(document.getElementById("saidaConfirmadaModal"));
    modal.show();

    // Enviar notificação ao Telegram
    const mensagem = `📤 *Nova Saída Registrada*:\n👤 Funcionário: ${saida.funcionario}\n💵 Valor: R$ ${saida.valor.toFixed(2)}\n📄 Motivo: ${saida.motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n📅 Data: ${saida.data}`;
    enviarTelegram(mensagem);

    // Limpar o formulário
    document.getElementById("funcionario").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("forma-pagamento").value = "pix";
}

// Função para atualizar a lista de saídas
function atualizarListaSaidas() {
    const tabelaSaidas = document.getElementById("lista-saidas");
    if (!tabelaSaidas) return;

    tabelaSaidas.innerHTML = "";

    historicoSaidas.forEach((saida, index) => {
        const row = `
            <tr>
                <td>${saida.data}</td>
                <td>${saida.funcionario}</td>
                <td>R$ ${saida.valor.toFixed(2)}</td>
                <td>${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}</td>
                <td>${saida.motivo}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluirSaida(${index})">Excluir</button>
                </td>
            </tr>
        `;
        tabelaSaidas.innerHTML += row;
    });
}

// Função para atualizar totais na página Home
function atualizarSaidasHome() {
    const totalDinheiro = historicoSaidas
        .filter((saida) => saida.formaPagamento === "dinheiro")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalPix = historicoSaidas
        .filter((saida) => saida.formaPagamento === "pix")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalSaidas = totalDinheiro + totalPix;

    // Atualizar no localStorage
    localStorage.setItem("totalSaidasDinheiro", totalDinheiro);
    localStorage.setItem("totalSaidasPix", totalPix);
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar na interface (página Home)
    document.getElementById("total-saidas-dia").innerText = totalSaidas.toFixed(2);
    document.getElementById("total-saidas-dinheiro").innerText = totalDinheiro.toFixed(2);
    document.getElementById("total-saidas-pix").innerText = totalPix.toFixed(2);
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

    atualizarListaSaidas();
    atualizarSaidasHome();

    alert("Saída excluída com sucesso.");
}

// Enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524"; // ID do grupo
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

// Inicializar ao carregar a página
window.onload = () => {
    atualizarListaSaidas();
    atualizarSaidasHome();
};
