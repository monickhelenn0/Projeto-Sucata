const backendUrl = 'https://projeto-sucata.onrender.com';

// Exemplo de requisição:
const response = await fetch(`${backendUrl}/index.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password }),
});
