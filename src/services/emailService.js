import { NOTIFICATION_EMAIL, RESEND_API_KEY } from '../config/mail.js';

/**
 * Envia e-mail de notificação quando o formulário de contato for preenchido
 * @param {Object} data - Dados do formulário (nome, telefone, email, area, mensagem)
 */
export async function sendContactNotification(data) {
  const { nome, telefone, email, area, mensagem } = data;
  const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Fortaleza' });
  const senderEmail = process.env.EMAIL_FROM || 'HK Advocacia <onboarding@resend.dev>';

  console.log('====================================================');
  console.log('📩 [NOVA MENSAGEM DO FORMULÁRIO DE CONTATO]');
  console.log(`⏰ Data/Hora: ${timestamp}`);
  console.log(`👤 Nome: ${nome}`);
  console.log(`📞 Telefone/WhatsApp: ${telefone || 'Não informado'}`);
  console.log(`✉️ E-mail: ${email}`);
  console.log(`⚖️ Área/Assunto: ${area || 'Direito Cível'}`);
  console.log(`📝 Mensagem:
${mensagem}`);
  console.log(`🎯 Destinatário Configurado: ${NOTIFICATION_EMAIL}`);
  console.log('====================================================');

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
        Mensagem gerada automaticamente pela Landing Page de Hanilton Kleiber Advocacia.
      </div>
    </div>
  `;

  // Se a chave do Resend estiver configurada, envia via API HTTP nativa
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [NOTIFICATION_EMAIL],
          subject: subject,
          html: htmlContent
        })
      });

      if (response.ok) {
        console.log(`✅ E-mail enviado com sucesso via Resend para: ${NOTIFICATION_EMAIL}`);
      } else {
        const errorData = await response.json();
        console.warn('⚠️ Resend retornou erro:', errorData);
      }
    } catch (err) {
      console.error('❌ Erro ao enviar e-mail via API Resend:', err);
    }
  } else {
    console.warn('ℹ️ Para disparar e-mails reais na Vercel, defina a variável RESEND_API_KEY nas Environment Variables.');
  }

  return { success: true, targetEmail: NOTIFICATION_EMAIL };
}
