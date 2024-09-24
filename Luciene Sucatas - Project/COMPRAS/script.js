document.addEventListener('DOMContentLoaded', () => {
    const materialSelect = document.getElementById('material-list');
    const materialValueInput = document.getElementById('material-value');
    const materialKgInput = document.getElementById('material-kg');
    const addMaterialBtn = document.getElementById('add-material-btn');
    const shoppingList = document.getElementById('shopping-list');
    const totalValueElement = document.getElementById('total-value');
    const printBtn = document.getElementById('print-btn');
    const finalizeBtn = document.getElementById('finalize-btn');
    const purchaseHistory = document.getElementById('purchase-history');
    const paymentMethodSelect = document.getElementById('payment-method');
    const modal = document.createElement('div');
    let totalValue = 0;

    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content">
            <p>Compra finalizada com sucesso!</p>
            <button class="close-modal-btn">Fechar</button>
        </div>`;
    document.body.appendChild(modal);

    function toggleModal() {
        modal.classList.toggle('hidden');
    }

    document.querySelector('.close-modal-btn').addEventListener('click', toggleModal);

    // Função para adicionar material à lista de compras
    function addMaterial() {
        const name = materialSelect.value;
        const valuePerKg = parseFloat(materialValueInput.value);
        const kg = parseFloat(materialKgInput.value);

        if (isNaN(valuePerKg) || isNaN(kg)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        const itemTotalValue = valuePerKg * kg;

        // Cria o item da lista de compras
        const listItem = document.createElement('li');
        listItem.className = 'animated-list-item'; // Classe animada
        listItem.innerHTML = `
            ${name} - ${kg}kg x R$${valuePerKg.toFixed(2)} = R$${itemTotalValue.toFixed(2)}
            <button class="remove-btn">Remover</button>
        `;

        shoppingList.appendChild(listItem);
        totalValue += itemTotalValue;
        totalValueElement.textContent = totalValue.toFixed(2);
        materialValueInput.value = '';
        materialKgInput.value = '';

        // Função para remover item da lista com transição
        listItem.querySelector('.remove-btn').addEventListener('click', () => {
            listItem.classList.add('fade-out');
            setTimeout(() => {
                shoppingList.removeChild(listItem);
                totalValue -= itemTotalValue;
                totalValueElement.textContent = totalValue.toFixed(2);
            }, 300); // Aguarda a transição para remover
        });
    }

    addMaterialBtn.addEventListener('click', addMaterial);

    // Função para finalizar a compra
    finalizeBtn.addEventListener('click', () => {
        const paymentMethod = paymentMethodSelect.value;
        const purchaseDetails = Array.from(shoppingList.children).map(item => ({
            name: item.innerHTML.split(' - ')[0], // Nome do material
            total: parseFloat(item.innerHTML.match(/=(.*)/)[1].replace('R$', '').trim()), // Total da linha
        }));

        const historyItem = {
            total: totalValue,
            paymentMethod: paymentMethod,
            date: new Date().toISOString().split('T')[0], // Data da compra
            details: purchaseDetails
        };

        // Armazenar a compra finalizada no localStorage
        let existingPurchases = JSON.parse(localStorage.getItem('purchases')) || [];
        existingPurchases.push(historyItem);
        localStorage.setItem('purchases', JSON.stringify(existingPurchases));

        toggleModal();

        // Limpar lista de compras e reiniciar total
        shoppingList.innerHTML = '';
        totalValue = 0;
        totalValueElement.textContent = '0,00';
    });

    // Função de imprimir a lista com valor total e método de pagamento
    printBtn.addEventListener('click', () => {
        const paymentMethod = paymentMethodSelect.value;
        const printContents = `
            <h2>Lista de Compras</h2>
            <ul>${Array.from(shoppingList.children).map(item => item.innerHTML.replace(/<button.*<\/button>/, '')).join('')}</ul>
            <h3>Valor Total: R$${totalValue.toFixed(2)}</h3>
            <h4>Pagamento: ${paymentMethod}</h4>
        `;
        const newWindow = window.open('', '', 'height=400,width=600');
        newWindow.document.write('<html><head><title>Lista de Compras</title>');
        newWindow.document.write('</head><body>');
        newWindow.document.write(printContents);
        newWindow.document.write('</body></html>');
        newWindow.document.close();
        newWindow.print();
    });
});
