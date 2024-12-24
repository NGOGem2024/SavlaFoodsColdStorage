const twilio = require('twilio');
require('dotenv').config();
 
class SMSService {
  constructor() {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials are not configured');
    }
   
    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error('Twilio phone number is not configured');
    }
 
    // Validate Twilio phone number format
    const twilioNumber = this.formatTwilioNumber(process.env.TWILIO_PHONE_NUMBER);
    if (!twilioNumber) {
      throw new Error('Invalid Twilio phone number format');
    }
 
    this.twilioNumber = twilioNumber;
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
 
  formatTwilioNumber(number) {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');
   
    // For US numbers (standard Twilio numbers)
    if (cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
   
    // For other country codes
    if (cleaned.length > 10) {
      return `+${cleaned}`;
    }
   
    // Default to US format if no country code
    return `+1${cleaned}`;
  }
 
  formatRecipientNumber(phone) {
    if (!phone) return null;
   
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
   
    // Remove leading zeros
    cleaned = cleaned.replace(/^0+/, '');
   
    // If number already has country code (91), keep it
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return `+${cleaned}`;
    }
   
    // If number is 10 digits, add India country code
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
   
    throw new Error(`Invalid phone number format: ${phone}`);
  }
 
  async sendOrderConfirmationSMS(orderDetails, customerPhone, customerName) {
    if (!customerPhone) {
      throw new Error('Customer phone number is required');
    }
 
    try {
      const formattedRecipientNumber = this.formatRecipientNumber(customerPhone);
     
      if (!formattedRecipientNumber) {
        throw new Error('Invalid recipient phone number format');
      }
 
      console.log('Sending SMS from:', this.twilioNumber);
      console.log('Sending SMS to:', formattedRecipientNumber);
 
      const itemsList = orderDetails.items
        .map((item, index) =>
          `\nItem ${index + 1}: ID-${item.ItemID}, Qty-${item.Quantity}, Lot-${item.LotNo}`
        )
        .join('');
 
      const message = `
Dear ${customerName || 'Valued Customer'},
 
Your order #${orderDetails.orderID} has been confirmed on ${new Date().toLocaleString()}.
 
Order Details:${itemsList}
 
${orderDetails.totalAmount ? `\nTotal Amount: ${orderDetails.totalAmount}` : ''}
 
Need help? Call us at +91 (22) 27632626/36
 
Thank you for your order!
`.trim();
 
      const result = await this.client.messages.create({
        body: message,
        from: this.twilioNumber,  // Use the validated Twilio number
        to: formattedRecipientNumber
      });
 
      console.log('SMS sent successfully:', result.sid);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      console.error('Attempted from number:', this.twilioNumber);
      console.error('Attempted to number:', customerPhone);
      throw error;
    }
  }
}
 
module.exports = SMSService;
 