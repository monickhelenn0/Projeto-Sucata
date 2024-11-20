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
        `💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Dinheiro"}`
    );

    if (!confirmacao) {
        alert("Registro cancelado.");
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

    alert("Saída registrada com sucesso!");

    // Enviar notificação ao Telegram
    const mensagem = `📤 *Nova Saída Registrada*:\n👤 Funcionário: ${funcionario}\n💵 Valor: R$ ${valor.toFixed(2)}\n📄 Motivo: ${motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n📅 Data: ${saida.data}`;
    enviarTelegram(mensagem);

    // Limpar o formulário
    document.getElementById("funcionario").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("forma-pagamento").value = "pix";
}

// Função para excluir uma saída
function excluirSaida(index) {
    const confirmacao = confirm("Tem certeza de que deseja excluir esta saída?");
    if (!confirmacao) {
        alert("Ação cancelada.");
        return;
    }

    const saidaRemovida = historicoSaidas.splice(index, 1)[0]; // Remove do histórico
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas)); // Atualiza o LocalStorage

    // Registrar no log de exclusões
    exclusoes.push({ ...saidaRemovida, tipo: "Saída", motivo: "Exclusão manual" });
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));

    atualizarListaSaidas();
    atualizarSaidasHome();

    alert("Saída excluída com sucesso!");
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

// Função para atualizar os totais na página Home
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
    const totalSaidasDiaEl = document.getElementById("total-saidas-dia");
    const totalDinheiroEl = document.getElementById("total-saidas-dinheiro");
    const totalPixEl = document.getElementById("total-saidas-pix");

    if (totalSaidasDiaEl) totalSaidasDiaEl.innerText = totalSaidas.toFixed(2);
    if (totalDinheiroEl) totalDinheiroEl.innerText = totalDinheiro.toFixed(2);
    if (totalPixEl) totalPixEl.innerText = totalPix.toFixed(2);
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

// Inicializar ao carregar a página
window.onload = () => {
    atualizarListaSaidas();
    atualizarSaidasHome();
};
