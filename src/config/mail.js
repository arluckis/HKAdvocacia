import dotenv from 'dotenv';
dotenv.config();

/**
 * Configuração do E-mail de Notificação
 * Você pode alterar o e-mail de destino abaixo ou definir a variável NOTIFICATION_EMAIL no arquivo .env
 */
export const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'h.aniltonjr@gmail.com';

export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
export const SMTP_HOST = process.env.SMTP_HOST || '';
export const SMTP_PORT = process.env.SMTP_PORT || 587;
export const SMTP_USER = process.env.SMTP_USER || '';
export const SMTP_PASS = process.env.SMTP_PASS || '';
