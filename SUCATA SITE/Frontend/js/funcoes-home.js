document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    atualizarTotaisHome();
});

// Carregar o nome do usuário na barra superior
function carregarUsuario() {
    const usuarioLogado = localStorage.getItem("usuarioLogado") || "Usuário";
    document.getElementById("username").innerText = usuarioLogado;
}

// Atualizar os valores exibidos no caixa e totais
function atualizarTotaisHome() {
    const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
    const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalSaidasEspecie = parseFloat(localStorage.getItem("totalSaidasEspecie")) || 0;
    const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
    const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;

    // Atualizar os valores na interface
    atualizarValor("total-caixa", totalCaixaPix + totalCaixaEspecie);
    atualizarValor("total-saidas-pix", totalSaidasPix);
    atualizarValor("total-saidas-especie", totalSaidasEspecie);
    atualizarValor("total-comprado-pix", totalComprasPix);
    atualizarValor("total-comprado-especie", totalComprasEspecie);
}

// Função para formatar os valores em moeda brasileira
function atualizarValor(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerText = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(valor);
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

    if (formaPagamento === "pix") {
        const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
        localStorage.setItem("totalCaixaPix", totalCaixaPix + valor);
    } else if (formaPagamento === "especie") {
        const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
        localStorage.setItem("totalCaixaEspecie", totalCaixaEspecie + valor);
    }

    // Atualizar os totais na página
    atualizarTotaisHome();

    // Limpar os campos
    document.getElementById("valor-caixa").value = "";
    document.getElementById("forma-pagamento").value = "pix";

    alert("Valor adicionado ao caixa com sucesso!");
}

// Iniciar um novo dia
function iniciarDia() {
    if (!confirm("Tem certeza de que deseja iniciar um novo dia? Todos os valores serão zerados.")) {
        return;
    }

    // Resetar os valores no localStorage
    localStorage.setItem("totalCaixaPix", 0);
    localStorage.setItem("totalCaixaEspecie", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalSaidasEspecie", 0);
    localStorage.setItem("totalComprasPix", 0);
    localStorage.setItem("totalComprasEspecie", 0);

    // Atualizar a interface
    atualizarTotaisHome();

    alert("Novo dia iniciado com sucesso!");
}

// Finalizar o dia e exibir resumo
function finalizarDia() {
    const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
    const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalSaidasEspecie = parseFloat(localStorage.getItem("totalSaidasEspecie")) || 0;
    const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
    const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;

    const resumo = `
Resumo do Dia:
- Caixa (PIX): ${formatarMoeda(totalCaixaPix)}
- Caixa (Espécie): ${formatarMoeda(totalCaixaEspecie)}
- Saídas (PIX): ${formatarMoeda(totalSaidasPix)}
- Saídas (Espécie): ${formatarMoeda(totalSaidasEspecie)}
- Compras (PIX): ${formatarMoeda(totalComprasPix)}
- Compras (Espécie): ${formatarMoeda(totalComprasEspecie)}
`;

    if (confirm(`Deseja finalizar o dia? Confira o resumo:\n${resumo}`)) {
        enviarTelegram(resumo);
        alert("Resumo enviado com sucesso e dia finalizado.");
    }
}

// Enviar mensagem para o Telegram
async function enviarTelegram(mensagem) {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524";
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

// Formatar valores em moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}
