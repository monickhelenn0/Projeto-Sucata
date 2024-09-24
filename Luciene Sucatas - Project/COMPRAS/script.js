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

    let totalValue = 0;

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
      listItem.innerHTML = `
        ${name} - ${kg}kg x R$${valuePerKg.toFixed(2)} = R$${itemTotalValue.toFixed(2)}
        <button class="remove-btn">Remover</button>
      `;

      shoppingList.appendChild(listItem);
      totalValue += itemTotalValue;
      totalValueElement.textContent = totalValue.toFixed(2);
      materialValueInput.value = '';
      materialKgInput.value = '';

      listItem.querySelector('.remove-btn').addEventListener('click', () => {
        shoppingList.removeChild(listItem);
        totalValue -= itemTotalValue;
        totalValueElement.textContent = totalValue.toFixed(2);
      });
    }

    addMaterialBtn.addEventListener('click', addMaterial);

    // Função para finalizar a compra
    finalizeBtn.addEventListener('click', () => {
      const paymentMethod = paymentMethodSelect.value;
      const historyItem = document.createElement('li');
      historyItem.innerHTML = `
        Compra finalizada: R$${totalValue.toFixed(2)} (${paymentMethod}) 
        <button class="details-btn">Detalhes</button>
      `;
      purchaseHistory.appendChild(historyItem);

      // Adiciona detalhamento da compra
      const details = document.createElement('div');
      details.style.display = 'none'; // Oculto inicialmente
      details.innerHTML = `<strong>Materiais:</strong><ul>${Array.from(shoppingList.children).map(item => item.innerHTML.replace(/<button.*<\/button>/, '')).join('')}</ul>`;
      historyItem.appendChild(details);

      historyItem.querySelector('.details-btn').addEventListener('click', () => {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
      });

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
