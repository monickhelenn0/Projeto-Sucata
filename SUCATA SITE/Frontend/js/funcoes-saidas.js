let historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];

// Função para adicionar uma saída
function adicionarSaida() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Usuário não logado!");
        window.location.href = "login.html";
        return;
    }

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
        `💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Espécie"}\n` +
        `🏢 Galpão: ${usuarioLogado.usuario}`
    );

    if (!confirmacao) {
        alert("Registro cancelado.");
        return;
    }

    const saida = {
        id: Date.now(),
        data: new Date().toLocaleDateString(),
        galpao: usuarioLogado.usuario,
        funcionario,
        valor,
        motivo,
        formaPagamento,
    };

    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    atualizarListaSaidas();
    atualizarSaidasHome();

    alert("Saída registrada com sucesso!");

    // Enviar notificação ao Telegram
    const mensagem = `📤 *Nova Saída Registrada*:\n👤 Funcionário: ${funcionario}\n💵 Valor: R$ ${valor.toFixed(2)}\n📄 Motivo: ${motivo}\n💳 Forma de Pagamento: ${formaPagamento === "pix" ? "PIX" : "Espécie"}\n🏢 Galpão: ${usuarioLogado.usuario}`;
    enviarTelegram(mensagem);

    // Limpar formulário
    document.getElementById("funcionario").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("motivo").value = "";
    document.getElementById("forma-pagamento").value = "pix";
}

// Função para excluir uma saída
function excluirSaida(index) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Usuário não logado!");
        window.location.href = "login.html";
        return;
    }

    const motivo = prompt("Informe o motivo para a exclusão:");
    if (!motivo || motivo.trim() === "") {
        alert("Exclusão cancelada. O motivo é obrigatório.");
        return;
    }

    const saidaRemovida = historicoSaidas.splice(index, 1)[0];
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    atualizarListaSaidas();
    atualizarSaidasHome();

    alert("Saída excluída com sucesso!");

    // Enviar notificação ao Telegram
    const mensagem = `❌ *Saída Excluída*:\n👤 Funcionário: ${saidaRemovida.funcionario}\n💵 Valor: R$ ${saidaRemovida.valor.toFixed(2)}\n📄 Motivo da Exclusão: ${motivo}\n💳 Forma de Pagamento: ${saidaRemovida.formaPagamento === "pix" ? "PIX" : "Espécie"}\n🏢 Galpão: ${saidaRemovida.galpao}`;
    enviarTelegram(mensagem);
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
                <td>${saida.galpao}</td>
                <td>${saida.funcionario}</td>
                <td>R$ ${saida.valor.toFixed(2)}</td>
                <td>${saida.formaPagamento === "pix" ? "PIX" : "Espécie"}</td>
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
    const totalEspecie = historicoSaidas
        .filter((saida) => saida.formaPagamento === "dinheiro")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalPix = historicoSaidas
        .filter((saida) => saida.formaPagamento === "pix")
        .reduce((acc, saida) => acc + saida.valor, 0);

    const totalSaidas = totalEspecie + totalPix;

    localStorage.setItem("totalSaidasEspecie", totalEspecie);
    localStorage.setItem("totalSaidasPix", totalPix);
    localStorage.setItem("totalSaidas", totalSaidas);

    const totalSaidasDiaEl = document.getElementById("total-saidas-dia");
    const totalEspecieEl = document.getElementById("total-saidas-especie");
    const totalPixEl = document.getElementById("total-saidas-pix");

    if (totalSaidasDiaEl) totalSaidasDiaEl.innerText = totalSaidas.toFixed(2);
    if (totalEspecieEl) totalEspecieEl.innerText = totalEspecie.toFixed(2);
    if (totalPixEl) totalPixEl.innerText = totalPix.toFixed(2);
}

// Enviar mensagens ao Telegram
async function enviarTelegram(mensagem) {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: mensagem,
                parse_mode: "Markdown",
            }),
        });

        if (!response.ok) {
            console.error("Erro ao enviar mensagem ao Telegram:", await response.text());
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
    }
}

// Inicializar ao carregar a página
window.onload = () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
    }
    atualizarListaSaidas();
};
