let listaSaidas = [];

// Função para registrar uma nova saída
function registrarSaida() {
    const funcionario = document.getElementById("funcionario").value;
    const valor = parseFloat(document.getElementById("valor").value) || 0;
    const motivo = document.getElementById("motivo").value;
    const data = new Date().toLocaleString();

    if (!funcionario || valor <= 0 || !motivo) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const saida = { funcionario, valor, motivo, data };
    listaSaidas.push(saida);
    atualizarListaSaidas();

    // Limpar campos do formulário
    document.getElementById("form-saidas").reset();
}

// Função para atualizar a tabela de histórico de saídas
function atualizarListaSaidas() {
    const lista = document.getElementById("lista-saidas");
    lista.innerHTML = "";

    listaSaidas.forEach(saida => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${saida.funcionario}</td>
            <td>R$ ${saida.valor.toFixed(2)}</td>
            <td>${saida.motivo}</td>
            <td>${saida.data}</td>
        `;

        lista.appendChild(row);
    });
}
function registrarSaida(valor) {
    totalSaidas += valor;
    localStorage.setItem("totalSaidas", totalSaidas);
}
