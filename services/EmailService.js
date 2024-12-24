 
const nodemailer = require('nodemailer');
 
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD  // Use App-Specific Password
      }
    });
  }
 
  async sendEmail({ to, subject, html }) {
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters');
    }
 
    const mailOptions = {
      from: `"Savla Foods Cold Storage" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };
 
    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
 
 
module.exports = EmailService;
 