exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);

    if (body.status !== "paid") {
      return { statusCode: 200, body: "Ignorado" };
    }

    const emailCliente = body.customer?.email;

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
        from: "suporte@slothia.space",
        to: emailCliente,
        subject: "Seu acesso à Slothia 🎉",
        html: `
          <h2>Olá! Seu pagamento foi confirmado 🎉</h2>
          <p>Aqui estão seus dados de acesso:</p>
          <p><strong>Link:</strong> https://slothia.space/cliente</p>
          <p><strong>Senha:</strong> cBCCIRQSUk2rJNAe</p>
