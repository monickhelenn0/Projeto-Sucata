let historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];
let exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];

// Função para adicionar uma saída
function adicionarSaida() {
    const funcionario = document.getElementById("funcionario").value.trim();
    const valor = parseFloat(document.getElementById("valor").value) || 0;
    const motivo = document.getElementById("motivo").value.trim();
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (!funcionario || valor <= 0 || !motivo || !formaPagamento) {
        exibirNotificacao("Erro", "Preencha todos os campos corretamente.", "danger");
        return;
    }

    const saida = {
        data: new Date().toLocaleDateString(),
        funcionario,
        valor,
        motivo,
        formaPagamento,
    };

    // Adicionar a saída ao histórico
    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    // Atualizar totais
    if (formaPagamento === "dinheiro") {
        const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
        localStorage.setItem("totalSaidasDinheiro", totalDinheiro + valor);
    } else if (formaPagamento === "pix") {
        const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
        localStorage.setItem("totalSaidasPix", totalPix + valor);
    }
    atualizarSaidasHome();

    // Atualizar a lista de saídas
    atualizarListaSaidas();

    // Notificar sucesso
    exibirNotificacao("Sucesso", "Saída registrada com sucesso!", "success");

    // Enviar notificação ao Telegram
    const mensagem = `📤 *Nova Saída Registrada*:\n\n👤 Funcionário: ${saida.funcionario}\n💵 Valor: R$ ${saida.valor.toFixed(2)}\n📄 Motivo: ${saida.motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n📅 Data: ${saida.data}`;
    enviarTelegram(mensagem);
}

// Função para excluir uma saída
function excluirSaida(index) {
    const motivo = prompt("Informe o motivo para a exclusão:");
    if (!motivo || motivo.trim() === "") {
        exibirNotificacao("Erro", "A exclusão foi cancelada. O motivo é obrigatório.", "danger");
        return;
    }

    const saidaRemovida = historicoSaidas.splice(index, 1)[0];
    exclusoes.push({ ...saidaRemovida, motivo, tipo: "Saída" });

    // Recalcular totais
    if (saidaRemovida.formaPagamento === "dinheiro") {
        const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
        localStorage.setItem("totalSaidasDinheiro", totalDinheiro - saidaRemovida.valor);
    } else if (saidaRemovida.formaPagamento === "pix") {
        const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
        localStorage.setItem("totalSaidasPix", totalPix - saidaRemovida.valor);
    }

    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));

    // Atualizar lista de saídas
    atualizarListaSaidas();
    atualizarSaidasHome();

    // Notificar sucesso
    exibirNotificacao("Sucesso", "Saída excluída com sucesso!", "success");

    // Enviar notificação ao Telegram
    const mensagem = `❌ *Saída Excluída*:\n\n👤 Funcionário: ${saidaRemovida.funcionario}\n💵 Valor: R$ ${saidaRemovida.valor.toFixed(2)}\n📄 Motivo da Exclusão: ${motivo}`;
    enviarTelegram(mensagem);
}

// Atualizar a lista de saídas
function atualizarListaSaidas() {
    const tabelaSaidas = document.getElementById("lista-saidas");
    if (!tabelaSaidas) return;

    tabelaSaidas.innerHTML = "";

    historicoSaidas.forEach((saida, index) => {
        tabelaSaidas.innerHTML += `
            <tr>
                <td>${saida.data}</td>
                <td>${saida.funcionario}</td>
                <td>R$ ${saida.valor.toFixed(2)}</td>
                <td>${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}</td>
                <td>${saida.motivo}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirSaida(${index})">Excluir</button></td>
            </tr>
        `;
    });
}

// Atualizar totais na Home
function atualizarSaidasHome() {
    const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;

    const totalSaidas = totalDinheiro + totalPix;
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar os totais na interface
    document.getElementById("total-saidas-dia").innerText = totalSaidas.toFixed(2);
    document.getElementById("total-saidas-dinheiro").innerText = totalDinheiro.toFixed(2);
    document.getElementById("total-saidas-pix").innerText = totalPix.toFixed(2);
}

// Função para exibir notificações
function exibirNotificacao(titulo, mensagem, tipo) {
    const notificacao = document.createElement("div");
    notificacao.className = `alert alert-${tipo} alert-dismissible fade show`;
    notificacao.role = "alert";
    notificacao.innerHTML = `
        <strong>${titulo}</strong> ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(notificacao);

    setTimeout(() => {
        notificacao.remove();
    }, 5000);
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
        console.log("Mensagem enviada ao Telegram com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
        exibirNotificacao("Erro", "Falha ao enviar mensagem ao Telegram.", "danger");
    }
};

// Inicializar a lista de saídas e totais ao carregar a página
window.onload = () => {
    atualizarListaSaidas();
    atualizarSaidasHome();
};
