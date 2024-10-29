// Função para simular o carregamento dos valores
function carregarValoresDoDia() {
    document.getElementById('caixaInicial').textContent = 'R$ 10.000';
    document.getElementById('comprasSaidas').textContent = 'R$ 2.000';
    document.getElementById('entradas').textContent = 'R$ 3.500';
    document.getElementById('valorCaixas').textContent = 'R$ 23.000';
    document.getElementById('qtdCaixas').textContent = '50';
}

// Simular gráfico circular para materiais comprados
function atualizarGraficos() {
    const progressCircle1 = document.getElementById('progress1');
    const progressCircle2 = document.getElementById('progress2');
    
    const progress1 = 60; // porcentagem de progresso
    const progress2 = 40;
    
    progressCircle1.style.strokeDasharray = `${progress1}, 100`;
    progressCircle2.style.strokeDasharray = `${progress2}, 100`;
}

document.addEventListener('DOMContentLoaded', function() {
    carregarValoresDoDia();
    atualizarGraficos();
});
