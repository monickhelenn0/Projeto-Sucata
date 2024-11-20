// Função para carregar o histórico do estoque
function carregarEstoque() {
    const compras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    const tabelaEstoque = document.getElementById("tabela-estoque");

    // Agrupar por material e calcular total
    const agrupados = compras.reduce((acc, compra) => {
        compra.itens.forEach((item) => {
            if (!acc[item.material]) {
                acc[item.material] = { total: 0, ultimaData: compra.data };
            }
            acc[item.material].total += item.peso;
            acc[item.material].ultimaData = compra.data;
        });
        return acc;
    }, {});

    // Transformar em array para ordenar
    const materiais = Object.entries(agrupados).map(([material, dados]) => ({
        material,
        total: dados.total,
        ultimaData: dados.ultimaData,
    }));

    // Ordenar por quantidade total (decrescente)
    materiais.sort((a, b) => b.total - a.total);

    // Preencher a tabela
    tabelaEstoque.innerHTML = materiais
        .map(
            (item) => `
        <tr>
            <td>${item.material}</td>
            <td>${item.total.toFixed(2)} kg</td>
            <td>${item.ultimaData}</td>
        </tr>
    `
        )
        .join("");
}

// Função para filtrar o histórico por período
function filtrarHistorico() {
    const dataInicio = new Date(document.getElementById("data-inicio").value);
    const dataFim = new Date(document.getElementById("data-fim").value);
    const compras = JSON.parse(localStorage.getItem("historicoCompras")) || [];
    const tabelaEstoque = document.getElementById("tabela-estoque");

    if (isNaN(dataInicio) || isNaN(dataFim)) {
        alert("Selecione um período válido.");
        return;
    }

    // Filtrar compras no período
    const comprasFiltradas = compras.filter((compra) => {
        const dataCompra = new Date(compra.data.split("/").reverse().join("-")); // Converter formato dd/mm/aaaa para yyyy-mm-dd
        return dataCompra >= dataInicio && dataCompra <= dataFim;
    });

    // Agrupar e exibir como antes
    const agrupados = comprasFiltradas.reduce((acc, compra) => {
        compra.itens.forEach((item) => {
            if (!acc[item.material]) {
                acc[item.material] = { total: 0, ultimaData: compra.data };
            }
            acc[item.material].total += item.peso;
            acc[item.material].ultimaData = compra.data;
        });
        return acc;
    }, {});

    const materiais = Object.entries(agrupados).map(([material, dados]) => ({
        material,
        total: dados.total,
        ultimaData: dados.ultimaData,
    }));

    materiais.sort((a, b) => b.total - a.total);

    tabelaEstoque.innerHTML = materiais
        .map(
            (item) => `
        <tr>
            <td>${item.material}</td>
            <td>${item.total.toFixed(2)} kg</td>
            <td>${item.ultimaData}</td>
        </tr>
    `
        )
        .join("");
}

// Inicializar ao carregar a página
document.addEventListener("DOMContentLoaded", carregarEstoque);
