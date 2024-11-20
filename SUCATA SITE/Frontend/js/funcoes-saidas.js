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
        formaPagamento 
    };

    // Adicionar a saída ao histórico
    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    // Atualizar os totais no localStorage e interface
    if (formaPagamento === "dinheiro") {
        const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
        localStorage.setItem("totalSaidasDinheiro", totalDinheiro + valor);
    } else if (formaPagamento === "pix") {
        const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
        localStorage.setItem("totalSaidasPix", totalPix + valor);
    }
    atualizarSaidasHome();

    // Atualizar a lista na interface
    atualizarListaSaidas();

    // Mostrar modal de confirmação
    const modal = new bootstrap.Modal(document.getElementById("saidaConfirmadaModal"));
    modal.show();

    // Enviar mensagem ao Telegram
    const mensagem = `📤 *Nova Saída Registrada*:\n\n👤 Funcionário: ${saida.funcionario}\n💵 Valor: R$ ${saida.valor.toFixed(2)}\n📄 Motivo: ${saida.motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n📅 Data: ${saida.data}`;
    enviarTelegram(mensagem);
}

// Atualizar os totais na Home
function atualizarSaidasHome() {
    const totalDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;

    const totalSaidas = totalDinheiro + totalPix;
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar a interface na página Home
    const totalSaidasDia = document.getElementById("total-saidas-dia");
    if (totalSaidasDia) {
        totalSaidasDia.innerText = totalSaidas.toFixed(2);
    }

    const totalSaidasDinheiro = document.getElementById("total-saidas-dinheiro");
    if (totalSaidasDinheiro) {
        totalSaidasDinheiro.innerText = totalDinheiro.toFixed(2);
    }

    const totalSaidasPix = document.getElementById("total-saidas-pix");
    if (totalSaidasPix) {
        totalSaidasPix.innerText = totalPix.toFixed(2);
    }
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

// Enviar mensagens ao Telegram
const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524"; // ID do grupo GALPÃO
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

// Carregar saídas ao abrir a página
window.onload = () => {
    atualizarListaSaidas();
    atualizarSaidasHome();
};
