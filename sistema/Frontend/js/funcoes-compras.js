let listaCompras = [];
let totalCompras = 0;
let historicoCompras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
let exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];

// Função para adicionar uma compra à lista
function adicionarCompra() {
    const material = document.getElementById("material").value;
    const preco = parseFloat(document.getElementById("preco").value) || 0;
    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const total = preco * peso;

    if (!material || preco <= 0 || peso <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    listaCompras.push({ material, preco, peso, total });
    totalCompras += total;

    atualizarListaCompras();
}

// Função para atualizar a lista de compras e o total na interface
function atualizarListaCompras() {
    const lista = document.getElementById("lista-compras");
    lista.innerHTML = "";

    listaCompras.forEach((compra, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${compra.material}</td>
            <td>R$ ${compra.preco.toFixed(2)}</td>
            <td>${compra.peso.toFixed(2)} kg</td>
            <td>R$ ${compra.total.toFixed(2)}</td>
            <td><button onclick="excluirCompra(${index})" class="btn btn-danger btn-sm">Excluir</button></td>
        `;
        lista.appendChild(row);
    });

    document.getElementById("total-compra").innerText = totalCompras.toFixed(2);
}

// Função para excluir um item da lista de compras
function excluirCompra(index) {
    listaCompras.splice(index, 1);
    totalCompras = listaCompras.reduce((acc, item) => acc + item.total, 0);
    atualizarListaCompras();
}

// Função para finalizar a compra e salvar no histórico
function finalizarCompra() {
    if (listaCompras.length === 0) {
        alert("Adicione itens antes de finalizar a compra.");
        return;
    }

    const formaPagamento = document.getElementById("forma-pagamento").value;
    if (!formaPagamento) {
        alert("Escolha o método de pagamento antes de finalizar a compra.");
        return;
    }

    const agora = new Date();
    const data = agora.toLocaleDateString();
    const hora = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const compra = {
        data,
        hora,
        total: totalCompras,
        itens: [...listaCompras],
        formaPagamento
    };

    historicoCompras.push(compra);
    localStorage.setItem("historicoCompras", JSON.stringify(historicoCompras));

    // Atualizar totais globais de compras e caixa
    atualizarTotaisGlobais(formaPagamento, totalCompras);

    // Limpar a lista de compras e atualizar a interface
    listaCompras = [];
    totalCompras = 0;
    atualizarListaCompras();
    carregarHistorico();

    alert("Compra finalizada com sucesso!");
}

// Função para atualizar os totais globais no localStorage
function atualizarTotaisGlobais(formaPagamento, valor) {
    if (formaPagamento === "pix") {
        const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
        localStorage.setItem("totalComprasPix", totalComprasPix + valor);
    } else if (formaPagamento === "especie") {
        const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;
        localStorage.setItem("totalComprasEspecie", totalComprasEspecie + valor);
    }

    const totalGeralCompras = parseFloat(localStorage.getItem("totalGeralCompras")) || 0;
    localStorage.setItem("totalGeralCompras", totalGeralCompras + valor);
}

// Função para carregar o histórico de compras
function carregarHistorico() {
    const historico = document.getElementById("lista-historico");
    historico.innerHTML = "";

    historicoCompras.forEach((compra, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${compra.data} ${compra.hora}</td>
            <td>R$ ${compra.total.toFixed(2)}</td>
            <td>${compra.formaPagamento === "pix" ? "PIX" : "Espécie"}</td>
            <td>
                <button onclick="verDetalhesCompra(${index})" class="btn btn-info btn-sm">Ver Detalhes</button>
                <button onclick="confirmarExclusaoHistorico(${index})" class="btn btn-danger btn-sm">Excluir</button>
            </td>
        `;
        historico.appendChild(row);
    });
}

// Função para exibir detalhes da compra no modal
function verDetalhesCompra(index) {
    const compra = historicoCompras[index];
    const detalhesHtml = `
        <p><strong>Data:</strong> ${compra.data}</p>
        <p><strong>Total:</strong> R$ ${compra.total.toFixed(2)}</p>
        <p><strong>Forma de Pagamento:</strong> ${compra.formaPagamento === "pix" ? "PIX" : "Espécie"}</p>
        <h5>Itens:</h5>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Preço (R$ por kg)</th>
                    <th>Peso (kg)</th>
                    <th>Total (R$)</th>
                </tr>
            </thead>
            <tbody>
                ${compra.itens
                    .map(
                        (item) => `
                        <tr>
                            <td>${item.material}</td>
                            <td>R$ ${item.preco.toFixed(2)}</td>
                            <td>${item.peso.toFixed(2)} kg</td>
                            <td>R$ ${item.total.toFixed(2)}</td>
                        </tr>
                    `
                    )
                    .join("")}
            </tbody>
        </table>
    `;

    document.getElementById("detalhes-compra-body").innerHTML = detalhesHtml;
    $('#detalhesModal').modal('show');
}

// Função para confirmar exclusão de uma compra no histórico
function confirmarExclusaoHistorico(index) {
    const motivo = prompt("Informe o motivo da exclusão:");

    if (!motivo || motivo.trim() === "") {
        alert("Exclusão cancelada. O motivo é obrigatório.");
        return;
    }

    const compraRemovida = historicoCompras.splice(index, 1)[0];
    exclusoes.push({ ...compraRemovida, motivo });
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));
    localStorage.setItem("historicoCompras", JSON.stringify(historicoCompras));
    carregarHistorico();
}

// Função para filtrar o histórico por data
function filtrarHistoricoPorData() {
    const dataFiltro = document.getElementById("data-historico").value;
    const historico = document.getElementById("lista-historico");
    historico.innerHTML = "";

    historicoCompras.forEach((compra, index) => {
        if (compra.data === dataFiltro) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${compra.data}</td>
                <td>R$ ${compra.total.toFixed(2)}</td>
                <td>${compra.formaPagamento === "pix" ? "PIX" : "Espécie"}</td>
                <td>
                    <button onclick="verDetalhesCompra(${index})" class="btn btn-info btn-sm">Ver Detalhes</button>
                    <button onclick="confirmarExclusaoHistorico(${index})" class="btn btn-danger btn-sm">Excluir</button>
                </td>
            `;
            historico.appendChild(row);
        }
    });
}

// Função para imprimir a lista de compras
function imprimirLista() {
    if (listaCompras.length === 0) {
        alert("Não há itens na lista de compras para imprimir.");
        return;
    }

    const conteudo = `
        <h1 style="text-align: center;">Lista de Compras</h1>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Preço (R$ por kg)</th>
                    <th>Peso (kg)</th>
                    <th>Total (R$)</th>
                </tr>
            </thead>
            <tbody>
                ${listaCompras
                    .map(
                        (compra) => `
                        <tr>
                            <td>${compra.material}</td>
                            <td>R$ ${compra.preco.toFixed(2)}</td>
                            <td>${compra.peso.toFixed(2)} kg</td>
                            <td>R$ ${compra.total.toFixed(2)}</td>
                        </tr>
                    `
                    )
                    .join("")}
            </tbody>
        </table>
        <h3 style="text-align: right;">Total Geral: R$ ${totalCompras.toFixed(2)}</h3>
    `;

    const novaJanela = window.open("", "_blank");
    novaJanela.document.write(`
        <html>
        <head>
            <title>Lista de Compras</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                h1 {
                    text-align: center;
                }
                h3 {
                    text-align: right;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            ${conteudo}
        </body>
        </html>
    `);
    novaJanela.document.close();
    novaJanela.print();
    novaJanela.close();
}

// Inicializar a página
window.onload = function () {
    atualizarListaCompras();
    carregarHistorico();
};
