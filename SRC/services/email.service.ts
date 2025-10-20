import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  static async sendPasswordEmail(to: string, password: string): Promise<void> {
    const mailOptions = {
      from: `"HILFE Platform" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Votre mot de passe HILFE Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Bienvenue sur HILFE Platform</h2>
          <p>Votre compte a été approuvé par un administrateur.</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Votre mot de passe temporaire :</p>
            <p style="margin: 0; font-size: 24px; color: #2563eb;">${password}</p>
          </div>
          <p>Connectez-vous à : <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
          <p><strong>Il est recommandé de changer votre mot de passe après la première connexion.</strong></p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send password email:', error);
      throw new Error('Erreur lors de l\\'envoi de l\\'email');
    }
  }

  static async sendRegistrationNotification(to: string, userName: string): Promise<void> {
    const mailOptions = {
      from: `"HILFE Platform" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Nouvelle inscription en attente - HILFE Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nouvelle inscription en attente</h2>
          <p>Un nouvel utilisateur s'est inscrit et nécessite votre approbation :</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Nom :</strong> ${userName}</p>
            <p style="margin: 0;"><strong>Email :</strong> ${to}</p>
          </div>
          <p>Veuillez vous connecter au dashboard administrateur pour traiter cette demande.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Registration notification sent to ${to}`);
    } catch (error) {
      console.error('Failed to send registration notification:', error);
    }
  }
}
