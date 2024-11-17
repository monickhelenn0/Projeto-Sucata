document.addEventListener("DOMContentLoaded", () => {
    // Recuperar dados salvos no localStorage
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;
    const totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;

    // Atualizar os totais na interface
    atualizarValor("total-caixa", totalCaixa);
    atualizarValor("total-saidas-dia", totalSaidasDinheiro + totalSaidasPix);
    atualizarValor("total-saidas-dinheiro", totalSaidasDinheiro);
    atualizarValor("total-saidas-pix", totalSaidasPix);
    atualizarValor("total-comprado-dia", totalCompradoDinheiro + totalCompradoPix);
    atualizarValor("compras-dinheiro", totalCompradoDinheiro);
    atualizarValor("compras-pix", totalCompradoPix);
});

// Função para atualizar um elemento com valor formatado
function atualizarValor(id, valor) {
    document.getElementById(id).innerText = valor.toFixed(2);
}

// Função para registrar um valor no caixa
function atualizarCaixa() {
    const valorCaixa = parseFloat(document.getElementById("valor-caixa").value) || 0;
    if (valorCaixa < 0) {
        alert("O valor não pode ser negativo.");
        return;
    }

    let totalCaixa = parseFloat(localStorage.getItem("totalCaixa")) || 0;
    totalCaixa += valorCaixa;

    localStorage.setItem("totalCaixa", totalCaixa);
    atualizarValor("total-caixa", totalCaixa);
    document.getElementById("valor-caixa").value = "";
}
//Função Botão iniciar o Dia
function iniciarDia() {
    // Resetar valores no localStorage
    localStorage.setItem("totalCaixa", 0);
    localStorage.setItem("totalSaidasDinheiro", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalCompradoDinheiro", 0);
    localStorage.setItem("totalCompradoPix", 0);

    // Atualizar a interface
    document.getElementById("total-caixa").innerText = "0.00";
    document.getElementById("total-saidas-dia").innerText = "0.00";
    document.getElementById("total-saidas-dinheiro").innerText = "0.00";
    document.getElementById("total-saidas-pix").innerText = "0.00";
    document.getElementById("total-comprado-dia").innerText = "0.00";
    document.getElementById("compras-dinheiro").innerText = "0.00";
    document.getElementById("compras-pix").innerText = "0.00";

    alert("O dia foi iniciado e os valores foram resetados.");
}

// Função para os dados totais do dia
function atualizarTotaisHome() {
    // Recuperar os valores do localStorage
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalCompradoDinheiro = parseFloat(localStorage.getItem("totalCompradoDinheiro")) || 0;
    const totalCompradoPix = parseFloat(localStorage.getItem("totalCompradoPix")) || 0;

    // Atualizar os campos na página
    document.getElementById("total-saidas-dia").innerText = (totalSaidasDinheiro + totalSaidasPix).toFixed(2);
    document.getElementById("total-saidas-dinheiro").innerText = totalSaidasDinheiro.toFixed(2);
    document.getElementById("total-saidas-pix").innerText = totalSaidasPix.toFixed(2);
    document.getElementById("total-comprado-dia").innerText = (totalCompradoDinheiro + totalCompradoPix).toFixed(2);
    document.getElementById("compras-dinheiro").innerText = totalCompradoDinheiro.toFixed(2);
    document.getElementById("compras-pix").innerText = totalCompradoPix.toFixed(2);
}

// Chamar a função ao carregar a página
document.addEventListener("DOMContentLoaded", atualizarTotaisHome);


function iniciarDia() {
    // Resetar valores no localStorage
    localStorage.setItem("totalCaixa", 0);
    localStorage.setItem("totalSaidasDinheiro", 0);
    localStorage.setItem("totalSaidasPix", 0);
    localStorage.setItem("totalCompradoDinheiro", 0);
    localStorage.setItem("totalCompradoPix", 0);

    // Atualizar a interface na página
    document.getElementById("total-caixa").innerText = "0.00";
    document.getElementById("total-saidas-dia").innerText = "0.00";
    document.getElementById("total-saidas-dinheiro").innerText = "0.00";
    document.getElementById("total-saidas-pix").innerText = "0.00";
    document.getElementById("total-comprado-dia").innerText = "0.00";
    document.getElementById("compras-dinheiro").innerText = "0.00";
    document.getElementById("compras-pix").innerText = "0.00";

    alert("O dia foi iniciado e os valores foram resetados.");
}

function atualizarSaidasHome() {
    // Recuperar os totais de Dinheiro e PIX
    const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;

    // Atualizar os valores de saídas no localStorage
    const totalSaidas = totalSaidasDinheiro + totalSaidasPix;
    localStorage.setItem("totalSaidas", totalSaidas);

    // Atualizar a interface na página Home
    document.getElementById("total-saidas-dia").innerText = totalSaidas.toFixed(2);
    document.getElementById("total-saidas-dinheiro").innerText = totalSaidasDinheiro.toFixed(2);
    document.getElementById("total-saidas-pix").innerText = totalSaidasPix.toFixed(2);
}
