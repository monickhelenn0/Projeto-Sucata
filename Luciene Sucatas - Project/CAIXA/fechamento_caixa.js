document.addEventListener('DOMContentLoaded', () => {
    const paymentFilter = document.getElementById('payment-filter');
    const materialFilter = document.getElementById('material-filter');
    const dateFilter = document.getElementById('date-filter');
    const filterBtn = document.getElementById('filter-btn');
    const dailyPurchases = document.getElementById('daily-purchases');
    const totalValueElement = document.getElementById('total-value');

    // Exemplo de dados de compras do dia
    const purchases = [
        { id: 1, total: 100.00, paymentMethod: 'Dinheiro', material: 'Cimento', date: '2024-09-23' },
        { id: 2, total: 150.00, paymentMethod: 'PIX', material: 'Areia', date: '2024-09-23' },
        { id: 3, total: 200.00, paymentMethod: 'Dinheiro', material: 'Tijolo', date: '2024-09-23' },
        // Adicione mais compras conforme necessário
    ];

    function displayPurchases(filteredPurchases) {
        dailyPurchases.innerHTML = '';
        let totalValue = 0;

        filteredPurchases.forEach(purchase => {
            const listItem = document.createElement('li');
            listItem.textContent = `Compra ID: ${purchase.id} - R$${purchase.total.toFixed(2)} (${purchase.paymentMethod}) - ${purchase.material}`;
            dailyPurchases.appendChild(listItem);
            totalValue += purchase.total; // Adiciona ao total
        });

        totalValueElement.textContent = `R$ ${totalValue.toFixed(2)}`; // Atualiza total
    }

    filterBtn.addEventListener('click', () => {
        const selectedPayment = paymentFilter.value;
        const selectedMaterial = materialFilter.value.toLowerCase();
        const selectedDate = dateFilter.value;

        let filteredPurchases = purchases.filter(purchase => {
            const matchesPayment = selectedPayment === 'todos' || purchase.paymentMethod === selectedPayment;
            const matchesMaterial = purchase.material.toLowerCase().includes(selectedMaterial);
            const matchesDate = selectedDate === '' || purchase.date === selectedDate;
            return matchesPayment && matchesMaterial && matchesDate;
        });
        
        displayPurchases(filteredPurchases);
    });

    // Exibe todas as compras ao carregar a página
    displayPurchases(purchases);
});
