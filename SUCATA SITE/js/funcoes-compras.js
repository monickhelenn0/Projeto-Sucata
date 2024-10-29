// funcoes-compras.js

let listaCompras = [];
let totalGeral = 0;

// Função para calcular o total de uma compra com base no preço e peso
function calcularTotal(preco, peso) {
    return parseFloat(preco) * parseFloat(peso);
}

// Adiciona uma compra à lista temporária e atualiza o total geral
function adicionarCompra() {
    const material = document.getElementById("material").value;
    const preco = parseFloat(document.getElementById("preco").value) || 0;
    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const total = calcularTotal(preco, peso).toFixed(2);

    const compra = { material, preco, peso, total };
    listaCompras.push(compra);
    totalGeral += parseFloat(total);
    atualizarListaCompras();
}

// Atualiza a lista de compras visível na página e o total geral
function atualizarListaCompras() {
    const lista = document.getElementById("lista-compras");
    lista.innerHTML = "";

    listaCompras.forEach(compra => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${compra.material}</td>
            <td>R$ ${compra.preco.toFixed(2)}</td>
            <td>${compra.peso} kg</td>
            <td>R$ ${compra.total}</td>
        `;
        lista.appendChild(row);
    });

    document.getElementById("total-compra").innerText = totalGeral.toFixed(2);
}

// Função para impressão da lista de compras
function imprimirComprovante() {
    const lista = document.getElementById("tabela-compras").outerHTML;
    const total = document.getElementById("total-compra").outerHTML;
    const novaJanela = window.open('', '', 'width=800, height=600');
    novaJanela.document.write('<html><head><title>Comprovante de Compra</title></head><body>');
    novaJanela.document.write(lista + total);
    novaJanela.document.write('</body></html>');
    novaJanela.document.close();
    novaJanela.print();
}
