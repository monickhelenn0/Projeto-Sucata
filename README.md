# **Luciene Sucatas**

Este é o repositório do projeto **Luciene Sucatas**, um sistema de gestão para empresas de compra e venda de sucata. O sistema permite registrar compras, saídas, exclusões, e gerenciar os valores do caixa. Ele também possui integração com o Telegram para notificações automáticas e está configurado como um Progressive Web App (PWA) hospedado no Netlify.

---

## **Características principais**

### **Frontend**
- **Tecnologias utilizadas**: HTML, CSS, JavaScript.
- Interface intuitiva para registrar:
  - **Compras de materiais**: Com opções de forma de pagamento (Dinheiro/PIX).
  - **Saídas de valores**: Com registro de motivo, forma de pagamento e exclusões.
  - **Exclusões**: Histórico detalhado de itens excluídos (separados por compras e saídas).
- Página inicial que exibe:
  - Total do **caixa**.
  - Total de **saídas** e **compras** com separação por formas de pagamento.
  - Botões de **"Iniciar o Dia"** (reseta os totais) e **"Finalizar o Dia"** (envia um resumo para o Telegram).
- **Gráficos dinâmicos**: Exibição em tempo real das quantidades compradas de materiais.

### **Notificações via Telegram**
- Integração com o bot do Telegram para enviar:
  - **Notificações de saídas**: Sempre que uma saída é registrada.
  - **Resumo diário**: Total de compras e saídas ao finalizar o dia.
  - **Exclusões**: Notifica sempre que um item é excluído.

### **PWA (Progressive Web App)**
- Instalação em dispositivos móveis ou desktops.
- Funcionalidades offline básicas.

---

## **Tecnologias Utilizadas**
### **Frontend**
- HTML5 e CSS3.
- JavaScript (uso de Local Storage para dados locais).
- [Bootstrap](https://getbootstrap.com/) para estilização.
- Gráficos gerados com [Chart.js](https://www.chartjs.org/).

### **Backend (Opcional - Render)**
- **Linguagem**: Python (Flask).
- **Banco de dados**: PostgreSQL.
- Configurado no Render para operações do backend.

### **Deploy**
- **Frontend**: [Netlify](https://www.netlify.com/).
- **Backend**: [Render](https://render.com/).

---

## **Como executar o projeto localmente**

### **Pré-requisitos**
- Navegador moderno (para frontend).
- Editor de texto ou IDE para alterações (opcional).
- Conta no Netlify (para frontend) e Render (para backend, se necessário).

### **Instalação**
1. **Clone o repositório**:
   ```bash
   git clone https://github.com/monickhelenn0/Projeto-Sucata.git

##   Contato
Desenvolvido por: Monick Helenn
Linkedin: https://www.linkedin.com/in/monickhelenn0/
