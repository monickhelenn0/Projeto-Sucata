// URL do backend
const backendURL = "https://projeto-sucata-oen5.onrender.com"; // URL do backend Render

fetch(`${backendURL}/index.php`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ parametro: "valor" }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro na API");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Dados recebidos:", data);
  })
  .catch((error) => {
    console.error("Erro:", error);
  });


// Função para registrar o valor inicial do caixa
document.getElementById('iniciar-dia').addEventListener('click', async () => {
    const valorInicial = parseFloat(prompt('Digite o valor inicial para o dia:'));

    if (isNaN(valorInicial) || valorInicial <= 0) {
        alert('Por favor, insira um valor válido para o valor inicial.');
        return;
    }

    try {
        const response = await fetch('/api/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'iniciar_dia', valor_inicial: valorInicial })
        });

        const data = await response.json();
        if (data.success) {
            alert('Valor inicial registrado com sucesso.');
            document.getElementById('valor-recebido').innerText = `R$ ${valorInicial.toFixed(2)}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Erro ao registrar o valor inicial: ' + error.message);
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
        const response = await fetch('/api/index.php', {
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

// Função para atualizar os totais na página Home
async function atualizarTotaisHome() {
    try {
        const response = await fetch('/api/index.php?action=atualizar_totais', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro na requisição ao servidor.');
        }

        const data = await response.json();
        if (data.success) {
            document.getElementById('total-caixa-pix').innerText = `PIX: R$ ${data.data.pix.toFixed(2)}`;
            document.getElementById('total-caixa-especie').innerText = `Espécie: R$ ${data.data.especie.toFixed(2)}`;
            document.getElementById('total-compras').innerText = `Total Compras: R$ ${data.data.total_compras.toFixed(2)}`;
            document.getElementById('total-saidas').innerText = `Total Saídas: R$ ${data.data.total_saidas.toFixed(2)}`;
        } else {
            console.error('Erro ao atualizar totais:', data.message);
        }
    } catch (error) {
        console.error('Erro ao atualizar os totais:', error.message);
    }
}


// Chamada inicial para atualizar os totais ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarTotaisHome);
