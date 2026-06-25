exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    // Suporte IronPay e PerfectPay
    const status = body.status || body.sale_status || "";
    const emailCliente = body.customer?.email || body.buyer_email || body.customer_email || "";

    const aprovado = ["paid", "approved", "complete", "completed"].includes(status.toLowerCase());

    if (!aprovado) {
      return { statusCode: 200, body: "Ignorado" };
    }

    if (!emailCliente) {
      return { statusCode: 400, body: "Email não encontrado" };
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Slothia <onboarding@resend.dev>",
        to: emailCliente,
        subject: "Seu acesso à Slothia",
        html: "<h2>Ola! Seu pagamento foi confirmado!</h2><p>Aqui estao seus dados de acesso:</p><p><strong>Link:</strong> https://slothia.space/cliente</p><p><strong>Senha:</strong> cBCCIRQSUk2rJNAe</p><p>Qualquer duvida, responda este email.</p><p>Equipe Slothia</p>"
      })
    });

    return { statusCode: 200, body: "OK" };

  } catch (err) {
    return { statusCode: 500, body: "Erro interno" };
  }
};
