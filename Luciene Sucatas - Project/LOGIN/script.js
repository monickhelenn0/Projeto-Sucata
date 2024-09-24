// Exemplo de validação básica
const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário

    const login = document.getElementById('login').value;
    const senha = document.getElementById('senha').value;

    if (login === '' || senha === '') {
        alert('Por favor, preencha todos os campos.');
    } else {
        // Envie os dados para o servidor aqui
        console.log('Login:', login);
        console.log('Senha:', senha);
    }
});