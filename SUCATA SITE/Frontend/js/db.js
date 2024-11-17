let db;

// Abrir ou criar o banco de dados
const request = indexedDB.open("sucatasDB", 1);

request.onupgradeneeded = (event) => {
    db = event.target.result;

    // Criar tabelas
    db.createObjectStore("compras", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("saidas", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("exclusoes", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("notas", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = (event) => {
    console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
};

// Funções para manipular o banco de dados
function adicionarItem(storeName, data) {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(data);
}

function listarItens(storeName, callback) {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => callback(request.result);
    request.onerror = () => console.error("Erro ao listar itens:", request.error);
}
