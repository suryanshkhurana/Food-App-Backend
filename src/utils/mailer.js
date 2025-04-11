import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderConfirmationMail = async (userEmail, order) => {
  // Format order items for email
  const itemsList = order.items
    .map((item) => 
      `${item.itemName} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    )
    .join('\n');

  // Calculate total with tax
  const tax = order.totalAmount - order.totalAmount / 1.02;

  // Email template
  const mailOptions = {
    from: `"Your Store" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Order Confirmation #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Thank You for Your Order!</h1>
        <p>Dear Customer,</p>
        <p>We're pleased to confirm your order #${order._id}.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h2 style="color: #333; margin-bottom: 15px;">Order Details:</h2>
          <pre style="font-family: monospace;">${itemsList}</pre>
          
          <div style="border-top: 1px solid #ddd; margin-top: 15px; padding-top: 15px;">
            <p><strong>Subtotal:</strong> $${(order.totalAmount - tax).toFixed(2)}</p>
            <p><strong>Tax (2%):</strong> $${tax.toFixed(2)}</p>
            <p style="font-size: 1.2em;"><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h2 style="color: #333; margin-bottom: 15px;">Shipping Address:</h2>
          <p style="margin: 0;">${order.address.street}</p>
          <p style="margin: 0;">${order.address.city}, ${order.address.state} ${order.address.zipCode}</p>
          <p style="margin: 0;">${order.address.country}</p>
        </div>
        
        <p>We'll notify you when your order ships.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
