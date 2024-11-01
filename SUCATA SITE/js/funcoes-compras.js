let listaCompras = [];
let totalCompras = 0;

// Função para adicionar uma compra à lista
function adicionarCompra() {
    const material = document.getElementById("material").value;
    const preco = parseFloat(document.getElementById("preco").value) || 0;
    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const total = preco * peso;

    listaCompras.push({ material, preco, peso, total });
    totalCompras += total;

    atualizarListaCompras();
}

// Atualizar lista de compras na página
function atualizarListaCompras() {
    const lista = document.getElementById("lista-compras");
    lista.innerHTML = "";

    listaCompras.forEach(compra => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${compra.material}</td>
            <td>R$ ${compra.preco.toFixed(2)}</td>
            <td>${compra.peso} kg</td>
            <td>R$ ${compra.total.toFixed(2)}</td>
        `;
        lista.appendChild(row);
    });

    document.getElementById("total-compra").innerText = totalCompras.toFixed(2);
}

// Função para finalizar a compra e mover para o histórico
function finalizarCompra() {
    if (listaCompras.length === 0) {
        alert("Adicione itens antes de finalizar a compra.");
        return;
    }

    const data = new Date().toLocaleDateString();
    const totalCompra = totalCompras;
    
    const historico = document.getElementById("lista-historico");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${data}</td>
        <td>R$ ${totalCompra.toFixed(2)}</td>
        <td><button onclick="verDetalhesCompra('${data}')">Ver Detalhes</button></td>
    `;
    historico.appendChild(row);

    // Resetar lista e total após finalizar
    listaCompras = [];
    totalCompras = 0;
    atualizarListaCompras();
}

// Função para imprimir apenas a lista de compras
function imprimirComprovante() {
    const printContent = document.getElementById("tabela-compras").outerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}
