let historicoSaidas = JSON.parse(localStorage.getItem("historicoSaidas")) || [];

function adicionarSaida() {
    const funcionario = document.getElementById("funcionario").value.trim();
    const valor = parseFloat(document.getElementById("valor").value) || 0;
    const motivo = document.getElementById("motivo").value.trim();
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (!funcionario || valor <= 0 || !motivo || !formaPagamento) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const saida = { 
        data: new Date().toLocaleDateString(), 
        funcionario, valor, motivo, formaPagamento 
    };

    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    atualizarListaSaidas();
}

function excluirSaida(index) {
    const motivo = prompt("Informe o motivo para a exclusão:");
    if (!motivo || motivo.trim() === "") {
        alert("Exclusão cancelada. O motivo é obrigatório.");
        return;
    }

    const saidaRemovida = historicoSaidas[index]; // Obter a saída que será removida

    // Recalcular os totais com base na forma de pagamento
    if (saidaRemovida.formaPagamento === "dinheiro") {
        const totalSaidasDinheiro = parseFloat(localStorage.getItem("totalSaidasDinheiro")) || 0;
        localStorage.setItem("totalSaidasDinheiro", totalSaidasDinheiro - saidaRemovida.valor);
    } else if (saidaRemovida.formaPagamento === "pix") {
        const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
        localStorage.setItem("totalSaidasPix", totalSaidasPix - saidaRemovida.valor);
    }

    // Registrar exclusão no localStorage
    const exclusoes = JSON.parse(localStorage.getItem("exclusoes")) || [];
    exclusoes.push({ ...saidaRemovida, motivo });
    localStorage.setItem("exclusoes", JSON.stringify(exclusoes));

    // Remover a saída do histórico
    historicoSaidas.splice(index, 1);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));

    // Atualizar a interface e os valores
    atualizarListaSaidas();
    atualizarSaidasHome();
}

function atualizarListaSaidas() {
    const lista = document.getElementById("lista-saidas");
    lista.innerHTML = "";

    historicoSaidas.forEach((saida, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${saida.data}</td>
            <td>${saida.funcionario}</td>
            <td>R$ ${saida.valor.toFixed(2)}</td>
            <td>${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}</td>
            <td>${saida.motivo}</td>
            <td><button onclick="excluirSaida(${index})" class="btn btn-danger btn-sm">Excluir</button></td>
        `;
        lista.appendChild(row);
    });
}

function atualizarSaidasHome() {
    const totalSaidas = historicoSaidas.reduce((acc, saida) => acc + saida.valor, 0);
    localStorage.setItem("totalSaidas", totalSaidas);
}

window.onload = function () {
    atualizarListaSaidas();
};

function adicionarSaida() {
    const funcionario = document.getElementById("funcionario").value.trim();
    const valor = parseFloat(document.getElementById("valor").value) || 0;
    const motivo = document.getElementById("motivo").value.trim();
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (!funcionario || valor <= 0 || !motivo || !formaPagamento) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const saida = { 
        data: new Date().toLocaleDateString(), 
        funcionario, 
        valor, 
        motivo, 
        formaPagamento 
    };

    historicoSaidas.push(saida);
    localStorage.setItem("historicoSaidas", JSON.stringify(historicoSaidas));
    atualizarListaSaidas();

    // Enviar para o Telegram
    const mensagem = `Nova saída registrada:\n
        Funcionário: ${saida.funcionario}\n
        Valor: R$ ${saida.valor.toFixed(2)}\n
        Motivo: ${saida.motivo}\n
        Forma de Pagamento: ${saida.formaPagamento === "pix" ? "PIX" : "Dinheiro"}\n
        Data: ${saida.data}`;
    enviarTelegram(mensagem);
}