export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const { nome, email, telefone, mensagem, area } = req.body || {};

    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        success: false,
        error: 'Nome, e-mail e mensagem são campos obrigatórios.'
      });
    }

    // Chave do Resend e E-mail de destino
    const resendApiKey = process.env.RESEND_API_KEY || 're_FRFis8ZV_Fz4qYt5PekdcUbfAGM8ZE6eV';
    const targetEmail = process.env.NOTIFICATION_EMAIL || 'h.aniltonjr@gmail.com';
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' });

    const subject = `[Novo Contato HK Advocacia] ${nome} - ${area || 'Direito Cível'}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d8b257; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #29040a; padding: 24px; text-align: center; border-bottom: 2px solid #d8b257;">
          <h2 style="color: #ebd082; margin: 0; font-size: 22px; letter-spacing: 1px;">Hanilton Kleiber Advocacia</h2>
          <p style="color: #ffffff; margin: 6px 0 0; font-size: 14px;">Novo contato recebido pelo site</p>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <h3 style="color: #29040a; margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 8px;">Dados do Interessado</h3>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Telefone / WhatsApp:</strong> <a href="https://wa.me/55${(telefone || '').replace(/\D/g, '')}" style="color: #25d366; font-weight: bold; text-decoration: none;">${telefone || 'Não informado'}</a></p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}" style="color: #0b57d0;">${email}</a></p>
          <p><strong>Assunto / Área:</strong> ${area || 'Direito Cível'}</p>
          <p><strong>Data/Hora do Envio:</strong> ${timestamp}</p>
          
          <h3 style="color: #29040a; margin-top: 24px; border-bottom: 1px solid #eee; padding-bottom: 8px;">Mensagem Enviada</h3>
          <div style="background-color: #f9f9f9; border-left: 4px solid #d8b257; padding: 14px; margin-top: 10px; border-radius: 4px; font-style: italic; white-space: pre-wrap;">${mensagem}</div>
        </div>
        <div style="background-color: #f4f4f4; padding: 16px; text-align: center; font-size: 12px; color: #777;">
          Mensagem gerada automaticamente pelo site Hanilton Kleiber Advocacia.
        </div>
      </div>
    `;

    // Dispara e-mail via API REST do Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'HK Advocacia <onboarding@resend.dev>',
        to: [targetEmail],
        subject: subject,
        html: htmlContent
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Erro na API do Resend:', resendData);
      return res.status(500).json({
        success: false,
        error: resendData.message || 'Erro ao enviar e-mail através do Resend.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! O e-mail foi entregue.',
      data: resendData
    });
  } catch (err) {
    console.error('Erro interno ao processar formulário:', err);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a solicitação: ' + err.message
    });
  }
}
