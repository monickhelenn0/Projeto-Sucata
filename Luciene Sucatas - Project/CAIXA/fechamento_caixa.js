document.addEventListener('DOMContentLoaded', () => {
    const paymentFilter = document.getElementById('payment-filter');
    const filterBtn = document.getElementById('filter-btn');
    const dailyPurchases = document.getElementById('daily-purchases');

    // Exemplo de dados de compras do dia (poderia ser puxado de um banco de dados)
    const purchases = [
        { id: 1, total: 100.00, paymentMethod: 'Dinheiro', date: '2024-09-23' },
        { id: 2, total: 150.00, paymentMethod: 'PIX', date: '2024-09-23' },
        { id: 3, total: 200.00, paymentMethod: 'Dinheiro', date: '2024-09-23' },
        // Adicione mais compras conforme necessário
    ];

    function displayPurchases(filteredPurchases) {
        dailyPurchases.innerHTML = '';
        filteredPurchases.forEach(purchase => {
            const listItem = document.createElement('li');
            listItem.textContent = `Compra ID: ${purchase.id} - R$${purchase.total.toFixed(2)} (${purchase.paymentMethod})`;
            dailyPurchases.appendChild(listItem);
        });
    }

    filterBtn.addEventListener('click', () => {
        const selectedPayment = paymentFilter.value;
        let filteredPurchases = purchases.filter(purchase => {
            return selectedPayment === 'todos' || purchase.paymentMethod === selectedPayment;
        });
        displayPurchases(filteredPurchases);
    });

    // Exibe todas as compras ao carregar a página
    displayPurchases(purchases);
});
