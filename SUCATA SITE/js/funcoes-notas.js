function cadastrarNota() {
    const caminhao = document.getElementById("caminhao").value;
    const motorista = document.getElementById("motorista").value.trim();
    const tara = parseFloat(document.getElementById("tara").value) || 0;
    const totalBruto = parseFloat(document.getElementById("totalBruto").value) || 0;
    const valorNota = parseFloat(document.getElementById("valorNota").value) || 0;

    if (!caminhao || !motorista || tara <= 0 || totalBruto <= 0 || valorNota <= 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const nota = {
        caminhao,
        motorista,
        tara,
        totalBruto,
        valorNota,
        data: new Date().toLocaleDateString()
    };

    // Salvar no IndexedDB ou localStorage
    const notas = JSON.parse(localStorage.getItem("notas")) || [];
    notas.push(nota);
    localStorage.setItem("notas", JSON.stringify(notas));

    alert("Nota cadastrada com sucesso!");
    document.getElementById("cadastro-notas-form").reset();

    // Enviar para o Telegram
    const mensagem = `Nova nota cadastrada:\n
        Caminhão: ${nota.caminhao}\n
        Motorista: ${nota.motorista}\n
        Tara: ${nota.tara} kg\n
        Total Bruto: ${nota.totalBruto} kg\n
        Valor da Nota: R$ ${nota.valorNota.toFixed(2)}\n
        Data: ${nota.data}`;
    enviarTelegram(mensagem);
}
