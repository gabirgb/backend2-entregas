import nodemailer from 'nodemailer';

// Este transporter es el encargado de enviar correos.
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  from: process.env.MAIL_FROM,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})