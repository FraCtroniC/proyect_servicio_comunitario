import nodemailer from 'nodemailer';
import { environment } from '../../config/environment';

const transporter = nodemailer.createTransport({
  host: environment.smtp.host,
  port: environment.smtp.port,
  secure: false, // STARTTLS en puerto 587
  auth: {
    user: environment.smtp.user,
    pass: environment.smtp.pass,
  },
});

export async function sendPasswordResetEmail(
  destinatario: string,
  username: string,
  code: string,
  expiresInMinutes: number,
): Promise<void> {
  await transporter.sendMail({
    from: `"Sistema Liceo Estilita Orozco" <${environment.smtp.from}>`,
    to: destinatario,
    subject: 'Código de recuperación de contraseña',
    text: [
      `Hola ${username},`,
      '',
      `Tu código de recuperación es: ${code}`,
      '',
      `Este código vence en ${expiresInMinutes} minutos.`,
      '',
      'Si no solicitaste este código, ignora este mensaje.',
      '',
      '— Sistema Liceo Estilita Orozco',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a237e; margin-bottom: 8px;">Recuperación de contraseña</h2>
        <p style="color: #333;">Hola <strong>${username}</strong>,</p>
        <p style="color: #333;">Tu código de recuperación es:</p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a237e; background: #e8eaf6; padding: 12px 24px; border-radius: 6px;">
            ${code}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Este código vence en <strong>${expiresInMinutes} minutos</strong>.</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Si no solicitaste este código, ignora este mensaje.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 24px;" />
        <p style="color: #bbb; font-size: 11px; text-align: center;">Sistema Liceo Estilita Orozco</p>
      </div>
    `,
  });
}

export async function sendAcademicAlert(
  destinatario: string,
  studentName: string,
  subjectName: string,
  notes: string,
): Promise<void> {
  await transporter.sendMail({
    from: `"Control de Estudios Liceo Estilita Orozco" <${environment.smtp.from}>`,
    to: destinatario,
    subject: `⚠️ Alerta Académica: ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #c62828; margin-bottom: 8px;">Notificación de Control de Estudios</h2>
        <p style="color: #333;">Estimado representante,</p>
        <p style="color: #333;">Le informamos que el estudiante <strong>${studentName}</strong> presenta una alerta en su rendimiento académico.</p>
        <p style="color: #333;"><strong>Detalle:</strong> ${subjectName}</p>
        <p style="color: #333;"><strong>Observaciones:</strong> ${notes}</p>
        <br/>
        <p style="color: #333;">Le sugerimos presentarse a la coordinación académica a la brevedad posible.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin-top: 24px;" />
        <p style="color: #999; font-size: 11px; text-align: center;">Este es un correo automático, por favor no responda.</p>
      </div>
    `,
  });
}
