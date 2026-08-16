import express from 'express';
import { supabase } from '../config/supabase.js';
import { sendContactNotification } from '../services/emailService.js';
import { NOTIFICATION_EMAIL } from '../config/mail.js';

const router = express.Router();

router.post('/contato', async (req, res) => {
  try {
    const { nome, email, telefone, mensagem, area } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        success: false,
        error: 'Nome, e-mail e mensagem são campos obrigatórios.'
      });
    }

    const mensagemFormatada = area ? `[Assunto: ${area}]
${mensagem}` : mensagem;

    // 1. Enviar Notificação por E-mail (h.aniltonjr@gmail.com)
    try {
      await sendContactNotification({
        nome,
        telefone,
        email,
        area: area || 'Direito Cível',
        mensagem
      });
    } catch (mailErr) {
      console.error('Aviso ao processar notificação de e-mail:', mailErr.message);
    }

    // 2. Salvar no Supabase APENAS se estiver configurado
    if (supabase) {
      try {
        await supabase
          .from('contatos')
          .insert([
            {
              nome,
              email,
              telefone: telefone || null,
              mensagem: mensagemFormatada,
              status: 'novo',
              created_at: new Date().toISOString()
            }
          ]);
      } catch (dbErr) {
        console.warn('Aviso no Supabase:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! O Dr. Hanilton Kleiber entrará em contato em breve.',
      notificationEmail: NOTIFICATION_EMAIL
    });
  } catch (err) {
    console.error('Erro interno no servidor:', err);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar a solicitação.'
    });
  }
});

export default router;
