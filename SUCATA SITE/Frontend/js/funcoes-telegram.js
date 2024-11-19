const enviarTelegram = async (mensagem) => {
    const TELEGRAM_TOKEN = "7670865041:AAFuZra_jwBXfACjc3ZBwee_GCrGrhYCCrc";
    const CHAT_ID = "-4585457524"; // ID do grupo GALPÃO
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: mensagem, parse_mode: "Markdown" }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Erro ao enviar mensagem ao Telegram:", error.description);
            alert(`Erro ao enviar mensagem ao Telegram: ${error.description}`);
        } else {
            console.log("Mensagem enviada ao Telegram com sucesso!");
        }
    } catch (error) {
        console.error("Erro ao enviar mensagem ao Telegram:", error);
        alert("Erro ao enviar mensagem ao Telegram. Verifique sua conexão ou configurações.");
    }
};