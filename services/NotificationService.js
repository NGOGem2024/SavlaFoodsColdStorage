 
const EmailService = require('./EmailService');
const SMSService = require('./SMSService');
 
 
class NotificationService {
  constructor() {
    this.emailService = new EmailService();
    this.smsService = new SMSService();
  }
 
  async sendOrderConfirmations(orderDetails, customerInfo) {
    if (!orderDetails || !customerInfo) {
      throw new Error('Missing order details or customer information');
    }
 
    const { orderID, items } = orderDetails;
    const { email, name, phone } = customerInfo;
 
    const itemsList = items.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.itemName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.ItemID}</td>
        <td style="padding: 8px; border: 1px solid #ddd; color:#F28C28;">${item.LotNo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.Quantity}</td>
      </tr>
    `).join('');
 
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for your order. Your order ID is: <strong>${orderID}</strong></p>
       
        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color:#007BFA;">
              <th style="padding: 8px; border: 1px solid #FFFFFF;">Item Name</th>
              <th style="padding: 8px; border: 1px solid #FFFFFF;">Item ID</th>
              <th style="padding: 8px; border: 1px solid #FFFFFF;">Lot No</th>
              <th style="padding: 8px; border: 1px solid #FFFFFF;">Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
       
        <p>We will process your order shortly.</p>
        <p>Best regards,<br>Savla Foods Cold Storage</p>
      </div>
    `;
 
    const results = { email: null, sms: null };
 
    if (email) {
      try {
        results.email = await this.emailService.sendEmail({
          to: email,
          subject: `Order Confirmation - Order #${orderID}`,
          html: emailContent
        });
      } catch (error) {
        console.error('Email notification failed:', error);
        results.email = { success: false, error: error.message };
      }
    }
 
    if (phone) {
      try {
        const smsContent = `Savla Foods: Your order #${orderID} has been received and will be processed shortly. Thank you for your business.`;
        results.sms = await this.smsService.sendSMS(phone, smsContent);
      } catch (error) {
        console.error('SMS notification failed:', error);
        results.sms = { success: false, error: error.message };
      }
    }
 
    return results;
  }
}
 
module.exports = NotificationService;
 