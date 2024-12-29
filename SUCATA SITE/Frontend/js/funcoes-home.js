//URL do backend
const backendUrl = '/api/home.php';

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    zerarTotaisHome();
    atualizarTotaisHome();
    configurarBotoesDia();
});

// Carregar o nome do usuário e a hora do login no dropdown
function carregarUsuario() {
    const dadosUsuario = localStorage.getItem("usuarioLogado");
    let usuarioLogado = "Usuário";
    let horaLogin = null;

    if (dadosUsuario) {
        const dados = JSON.parse(dadosUsuario);
        usuarioLogado = dados.usuario || "Usuário";
        horaLogin = dados.horarioLogin || null;
    }

    document.getElementById("username").innerText = usuarioLogado;

    if (horaLogin) {
        document.getElementById("login-time").innerText = `Logado desde: ${horaLogin}`;
    }
}

// Função para finalizar o dia e enviar o resumo ao Telegram
document.getElementById('finalizar-dia').addEventListener('click', async () => {
    if (confirm('Deseja realmente finalizar o dia?')) {
        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'finalizar_dia' })
            });

            const data = await response.json();
            if (data.success) {
                alert('Resumo enviado ao Telegram com sucesso.');
                zerarTotaisHome();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Erro ao finalizar o dia: ' + error.message);
        }
    }
});

// Zerar os totais na página Home
async function zerarTotaisHome() {
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'zerar_totais' })
        });

        const data = await response.json();
        if (data.success) {
            console.log("Totais zerados com sucesso.");
        } else {
            console.error("Erro ao zerar totais:", data.message);
        }
    } catch (error) {
        console.error("Erro ao zerar os totais:", error);
    }
}

// Atualizar os totais na página Home com dados do backend
async function atualizarTotaisHome() {
    try {
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
            const { total_compras, total_saidas, total_estoque, balanco, valor_recebido } = data.data;

            document.getElementById("totalCaixaPix").innerText = `R$ ${(total_compras || 0).toFixed(2)}`;
            document.getElementById("totalCaixaEspecie").innerText = `R$ ${(total_saidas || 0).toFixed(2)}`;
            document.getElementById("totalEstoque").innerText = `${(total_estoque || 0)} itens`;
            document.getElementById("balanco").innerText = `R$ ${(balanco || 0).toFixed(2)}`;
            document.getElementById("valor-recebido").innerText = `R$ ${(valor_recebido || 0).toFixed(2)}`;
        } else {
            console.error('Erro na resposta do servidor:', data.message);
        }
    } catch (error) {
        console.error('Erro ao atualizar os totais:', error);
    }
}

// Registrar o valor inicial dado pela gerente
document.getElementById('iniciar-dia').addEventListener('click', async () => {
    const valorInicial = parseFloat(prompt('Digite o valor inicial para o dia:'));

    if (isNaN(valorInicial) || valorInicial <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'registrar_valor_inicial', valor_inicial: valorInicial })
        });

        const data = await response.json();
        if (data.success) {
            alert("Valor inicial registrado com sucesso.");
            document.getElementById('valor-recebido').innerText = `R$ ${valorInicial.toFixed(2)}`;
        } else {
            console.error("Erro ao registrar valor inicial:", data.message);
        }
    } catch (error) {
        console.error("Erro ao registrar o valor inicial:", error);
    }
});

// Função para cadastrar o valor do caixa
document.getElementById('form-caixa').addEventListener('submit', async (event) => {
    event.preventDefault();

    const valorCaixa = parseFloat(document.getElementById('valor-caixa').value);
    if (isNaN(valorCaixa) || valorCaixa <= 0) {
        alert('Por favor, insira um valor válido para o caixa.');
        return;
    }

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'cadastrar_caixa', valor_caixa: valorCaixa })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('mensagem-caixa').innerText = 'Caixa cadastrado com sucesso!';
            document.getElementById('valor-recebido').innerText = `R$ ${valorCaixa.toFixed(2)}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao cadastrar o caixa: ' + error.message);
    }
});

// Configurar botões ou interações do dia
function configurarBotoesDia() {
    document.getElementById("btnRegistrarValorInicial").addEventListener("click", () => {
        const valor = parseFloat(prompt("Digite o valor inicial dado pela gerente:"));
        if (!isNaN(valor) && valor > 0) {
            registrarValorInicial(valor);
        } else {
            alert("Por favor, insira um valor válido.");
        }
    });

    document.getElementById("btnFinalizarDia").addEventListener("click", () => {
        if (confirm("Tem certeza de que deseja finalizar o dia e enviar o resumo para o Telegram?")) {
            finalizarDia();
        }
    });
}
