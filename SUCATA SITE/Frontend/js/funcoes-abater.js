let listaMateriais = [];
let historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];

// Função para adicionar um material à lista
function adicionarMaterial() {
    const material = document.getElementById("material").value;
    const quantidade = parseFloat(document.getElementById("quantidade").value) || 0;
    const galpao = document.getElementById("galpao").value;
    const destino = document.getElementById("destino").value.trim();

    if (!material || quantidade <= 0 || !galpao || !destino) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    listaMateriais.push({ material, quantidade, galpao, destino });
    atualizarListaMateriais();
}

// Função para atualizar a lista de materiais
function atualizarListaMateriais() {
    const tabela = document.getElementById("lista-materiais");
    tabela.innerHTML = "";

    listaMateriais.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.material}</td>
                <td>${item.quantidade} Kg</td>
                <td>${item.galpao}</td>
                <td>${item.destino}</td>
                <td><button class="btn btn-danger btn-sm" onclick="excluirItem(${index})">Excluir</button></td>
            </tr>
        `;
        tabela.innerHTML += row;
    });
}

// Função para excluir um item da lista
function excluirItem(index) {
    listaMateriais.splice(index, 1);
    atualizarListaMateriais();
}

// Função para finalizar o registro
function finalizarRegistro() {
    if (listaMateriais.length === 0) {
        alert("Adicione itens antes de finalizar o registro.");
        return;
    }

    const dataAtual = new Date().toLocaleDateString();
    listaMateriais.forEach((item) => {
        historicoSaidas.push({ ...item, data: dataAtual });
    });

    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    listaMateriais = [];
    atualizarListaMateriais();
    carregarHistorico();

    alert("Materiais registrados com sucesso!");
}

// Função para carregar o histórico
function carregarHistorico() {
    const tabela = document.getElementById("historico-materiais");
    tabela.innerHTML = "";

    historicoSaidas.forEach((item) => {
        const row = `
            <tr>
                <td>${item.data}</td>
                <td>${item.material}</td>
                <td>${item.quantidade} Kg</td>
                <td>${item.galpao}</td>
                <td>${item.destino}</td>
            </tr>
        `;
        tabela.innerHTML += row;
    });
}

// Função para imprimir a lista
function imprimirLista() {
    if (listaMateriais.length === 0) {
        alert("Não há itens na lista para imprimir.");
        return;
    }

    const conteudo = `
        <h1>Lista de Materiais a Abater</h1>
        <table border="1">
            <thead>
                <tr>
                    <th>Material</th>
                    <th>Quantidade (Kg)</th>
                    <th>Galpão</th>
                    <th>Destino</th>
                </tr>
            </thead>
            <tbody>
                ${listaMateriais
                    .map(
                        (item) => `
                        <tr>
                            <td>${item.material}</td>
                            <td>${item.quantidade} Kg</td>
                            <td>${item.galpao}</td>
                            <td>${item.destino}</td>
                        </tr>
                    `
                    )
                    .join("")}
            </tbody>
        </table>
    `;

    const novaJanela = window.open("", "_blank");
    novaJanela.document.write(conteudo);
    novaJanela.document.close();
    novaJanela.print();
    novaJanela.close();
}

// Inicializar a página
document.addEventListener("DOMContentLoaded", carregarHistorico);
