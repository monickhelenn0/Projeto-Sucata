document.addEventListener("DOMContentLoaded", carregarExclusoes);

function carregarExclusoes() {
    const exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];
    const tabelaCompras = document.getElementById("tabela-exclusoes-compras");
    const tabelaSaidas = document.getElementById("tabela-exclusoes-saidas");

    tabelaCompras.innerHTML = "";
    tabelaSaidas.innerHTML = "";

    exclusoes.forEach(exclusao => {
        if (exclusao.material) {
            // Exclusões de Compras
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${exclusao.data || "N/A"}</td>
                <td>${exclusao.material}</td>
                <td>${exclusao.motivo}</td>
                <td>R$ ${exclusao.total.toFixed(2)}</td>
            `;
            tabelaCompras.appendChild(row);
        } else if (exclusao.funcionario) {
            // Exclusões de Saídas
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${exclusao.data || "N/A"}</td>
                <td>${exclusao.funcionario}</td>
                <td>${exclusao.motivo}</td>
                <td>R$ ${exclusao.valor.toFixed(2)}</td>
            `;
            tabelaSaidas.appendChild(row);
        }
    });
}
function filtrarExclusoes() {
    const dataFiltro = document.getElementById("filtro-data").value;
    const exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];

    const exclusoesFiltradas = exclusoes.filter((exclusao) => exclusao.data === dataFiltro);
    atualizarExclusoes(exclusoesFiltradas);
}

function atualizarExclusoes(lista) {
    const tabela = document.getElementById("tabela-exclusoes");
    tabela.innerHTML = "";

    lista.forEach((exclusao) => {
        const row = `
            <tr>
                <td>${exclusao.data}</td>
                <td>${exclusao.tipo}</td>
                <td>${exclusao.valor}</td>
                <td>${exclusao.motivo}</td>
            </tr>
        `;
        tabela.innerHTML += row;
    });
}
