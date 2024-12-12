document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    atualizarTotaisHome();
});

// Atualizar todos os totais na página a partir do localStorage
function atualizarTotaisHome() {
    const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
    const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
    const totalAdicionadoPix = parseFloat(localStorage.getItem("totalAdicionadoPix")) || 0;
    const totalAdicionadoEspecie = parseFloat(localStorage.getItem("totalAdicionadoEspecie")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalSaidasEspecie = parseFloat(localStorage.getItem("totalSaidasEspecie")) || 0;
    const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
    const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;

    // Atualizar os valores na interface, mantendo os rótulos
    atualizarValorComRotulo("total-caixa-pix", "PIX: ", totalCaixaPix);
    atualizarValorComRotulo("total-caixa-especie", "Espécie: ", totalCaixaEspecie);

    // Atualizar o total adicionado no dia (soma de PIX + Espécie adicionados)
    const totalAdicionadoNoDia = totalAdicionadoPix + totalAdicionadoEspecie;
    atualizarValorComRotulo("total-adicionado-no-dia", "Total Adicionado no Dia: ", totalAdicionadoNoDia);

    atualizarValorComRotulo("total-saidas-pix", "PIX: ", totalSaidasPix);
    atualizarValorComRotulo("total-saidas-especie", "Espécie: ", totalSaidasEspecie);
    atualizarValorComRotulo("total-comprado-pix", "PIX: ", totalComprasPix);
    atualizarValorComRotulo("total-comprado-especie", "Espécie: ", totalComprasEspecie);
}

// Atualizar valores com rótulos fixos
function atualizarValorComRotulo(id, rotulo, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerText = `${rotulo}${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor)}`;
    }
}

// Adicionar valor ao caixa
function adicionarCaixa() {
    const valor = parseFloat(document.getElementById("valor-caixa").value) || 0;
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    // Atualizar valores no localStorage e na interface
    if (formaPagamento === "pix") {
        const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
        const totalAdicionadoPix = parseFloat(localStorage.getItem("totalAdicionadoPix")) || 0;

        localStorage.setItem("totalCaixaPix", totalCaixaPix + valor);
        localStorage.setItem("totalAdicionadoPix", totalAdicionadoPix + valor);
    } else if (formaPagamento === "especie") {
        const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
        const totalAdicionadoEspecie = parseFloat(localStorage.getItem("totalAdicionadoEspecie")) || 0;

        localStorage.setItem("totalCaixaEspecie", totalCaixaEspecie + valor);
        localStorage.setItem("totalAdicionadoEspecie", totalAdicionadoEspecie + valor);
    }

    atualizarTotaisHome();

    // Limpar os campos de entrada
    document.getElementById("valor-caixa").value = "";
    document.getElementById("forma-pagamento").value = "pix";

    alert("Valor adicionado ao caixa com sucesso!");
}

// Iniciar um novo dia (zerar valores no localStorage)
function iniciarDia() {
    if (!confirm("Tem certeza de que deseja iniciar um novo dia? Todos os valores serão zerados.")) {
        return;
    }

    // Resetar valores no localStorage
    localStorage.setItem("totalCaixaPix", 0);
    localStorage.setItem("totalCaixaEspecie", 0);
    localStorage.setItem("totalAdicionadoPix", 0);
    localStorage.setItem("totalAdicionadoEspecie", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalSaidasEspecie", 0);
    localStorage.setItem("totalComprasPix", 0);
    localStorage.setItem("totalComprasEspecie", 0);

    atualizarTotaisHome();
    alert("Novo dia iniciado com sucesso!");
}

// Finalizar o dia e exibir resumo
function finalizarDia() {
    const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
    const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
    const totalAdicionadoPix = parseFloat(localStorage.getItem("totalAdicionadoPix")) || 0;
    const totalAdicionadoEspecie = parseFloat(localStorage.getItem("totalAdicionadoEspecie")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalSaidasEspecie = parseFloat(localStorage.getItem("totalSaidasEspecie")) || 0;
    const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
    const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;

    const totalAdicionadoNoDia = totalAdicionadoPix + totalAdicionadoEspecie;

    const resumo = `
Resumo do Dia:
- Total Caixa (PIX): ${formatarMoeda(totalCaixaPix)}
- Total Caixa (Espécie): ${formatarMoeda(totalCaixaEspecie)}
- Total Adicionado no Dia: ${formatarMoeda(totalAdicionadoNoDia)}
- Saídas (PIX): ${formatarMoeda(totalSaidasPix)}
- Saídas (Espécie): ${formatarMoeda(totalSaidasEspecie)}
- Compras (PIX): ${formatarMoeda(totalComprasPix)}
- Compras (Espécie): ${formatarMoeda(totalComprasEspecie)}
`;

    if (confirm(`Deseja finalizar o dia? Confira o resumo:\n${resumo}`)) {
        enviarTelegram(resumo);
        alert("Resumo enviado e dia finalizado.");
    }
}

// Enviar mensagem ao Telegram
async function enviarTelegram(mensagem) {
    const TELEGRAM_TOKEN = "seu-telegram-token";
    const CHAT_ID = "seu-chat-id";
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
}

// Formatar valores em moeda brasileira
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}
