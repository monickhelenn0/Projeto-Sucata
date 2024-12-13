document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    configurarDropdown();
    atualizarTotaisHome();
});

// Carregar o nome do usuário e a hora do login no dropdown
function carregarUsuario() {
    // Recuperar os dados do usuário armazenados no localStorage
    const dadosUsuario = localStorage.getItem("usuarioLogado");
    let usuarioLogado = "Usuário";
    let horaLogin = null;

    if (dadosUsuario) {
        // Converter os dados do JSON string para um objeto
        const dados = JSON.parse(dadosUsuario);
        usuarioLogado = dados.usuario || "Usuário";
        horaLogin = dados.horarioLogin || null;
    }

    // Configurar o nome do usuário no topo
    document.getElementById("username").innerText = usuarioLogado;

    // Configurar as informações no dropdown
    document.getElementById("user-info").innerText = `Usuário: ${usuarioLogado}`;
    if (horaLogin) {
        document.getElementById("login-time").innerText = `Hora do login: ${horaLogin}`;
    } else {
        const horaAtual = new Date().toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify({ usuario: usuarioLogado, horarioLogin: horaAtual })
        );
        document.getElementById("login-time").innerText = `Hora do login: ${horaAtual}`;
    }
}

// Configurar o comportamento do dropdown do usuário
function configurarDropdown() {
    const dropdown = document.getElementById("userDropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu[aria-labelledby='userDropdown']");

    // Alternar a exibição do dropdown ao clicar
    dropdown.addEventListener("click", (event) => {
        event.preventDefault();
        dropdownMenu.classList.toggle("show");
    });

    // Fechar o dropdown ao clicar fora
    document.addEventListener("click", (event) => {
        if (!dropdown.contains(event.target) && dropdownMenu.classList.contains("show")) {
            dropdownMenu.classList.remove("show");
        }
    });
}

// Atualizar todos os totais na página a partir do localStorage
function atualizarTotaisHome() {
    const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
    const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
    const totalAdicionadoPix = parseFloat(localStorage.getItem("totalAdicionadoPix")) || 0;
    const totalAdicionadoEspecie = parseFloat(localStorage.getItem("totalAdicionadoEspecie")) || 0;
    const totalSaidasPix = parseFloat(localStorage.getItem("totalSaidasPix")) || 0;
    const totalSaidasEspecie = parseFloat(localStorage.getItem("totalSaidasEspecie")) || 0;
    const totalComprasPix = parseFloat(localStorage.getItem("totalComprasPix")) || 0;
    const totalComprasEspecie = parseFloat(localStorage.getItem("totalComprasEspecie")) || 0;

    // Atualizar os valores na interface
    atualizarValorComRotulo("total-caixa-pix", "PIX: ", totalCaixaPix);
    atualizarValorComRotulo("total-caixa-especie", "Espécie: ", totalCaixaEspecie);

    // Atualizar o total adicionado no dia (soma de PIX + Espécie adicionados)
    const totalAdicionadoNoDia = totalAdicionadoPix + totalAdicionadoEspecie;
    atualizarValorComRotulo("total-adicionado-no-dia", "", totalAdicionadoNoDia);

    atualizarValorComRotulo("total-saidas-pix", "PIX: ", totalSaidasPix);
    atualizarValorComRotulo("total-saidas-especie", "Espécie: ", totalSaidasEspecie);
    atualizarValorComRotulo("total-comprado-pix", "PIX: ", totalComprasPix);
    atualizarValorComRotulo("total-comprado-especie", "Espécie: ", totalComprasEspecie);
}

// Atualizar valores com rótulos fixos
function atualizarValorComRotulo(id, rotulo, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.innerText = `${rotulo}${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(valor)}`;
    }
}

// Adicionar valor ao caixa
function adicionarCaixa() {
    const valor = parseFloat(document.getElementById("valor-caixa").value) || 0;
    const formaPagamento = document.getElementById("forma-pagamento").value;

    if (valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    // Atualizar valores no localStorage e na interface
    if (formaPagamento === "pix") {
        const totalCaixaPix = parseFloat(localStorage.getItem("totalCaixaPix")) || 0;
        const totalAdicionadoPix = parseFloat(localStorage.getItem("totalAdicionadoPix")) || 0;

        localStorage.setItem("totalCaixaPix", totalCaixaPix + valor);
        localStorage.setItem("totalAdicionadoPix", totalAdicionadoPix + valor);
    } else if (formaPagamento === "especie") {
        const totalCaixaEspecie = parseFloat(localStorage.getItem("totalCaixaEspecie")) || 0;
        const totalAdicionadoEspecie = parseFloat(localStorage.getItem("totalAdicionadoEspecie")) || 0;

        localStorage.setItem("totalCaixaEspecie", totalCaixaEspecie + valor);
        localStorage.setItem("totalAdicionadoEspecie", totalAdicionadoEspecie + valor);
    }

    atualizarTotaisHome();

    // Limpar os campos de entrada
    document.getElementById("valor-caixa").value = "";
    document.getElementById("forma-pagamento").value = "pix";

    alert("Valor adicionado ao caixa com sucesso!");
}

// Sair e desconectar o usuário
function logout() {
    localStorage.removeItem("usuarioLogado");
    alert("Usuário desconectado com sucesso!");
    window.location.href = "login.html";
}

// Formatar valores em moeda brasileira
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}
