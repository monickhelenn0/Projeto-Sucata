const TELEGRAM_BOT_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
const TELEGRAM_CHAT_ID = "https://t.me/Sucatas_bot";

function enviarTelegram(mensagem) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: mensagem
        })
    })
    .then(response => response.json())
    .then(data => console.log("Mensagem enviada ao Telegram:", data))
    .catch(error => console.error("Erro ao enviar mensagem:", error));
}
