import nodemailer from 'nodemailer'
import { Order } from '../types'

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }

  async sendOrderConfirmation(order: Order): Promise<void> {
    const { shippingAddress, items, totalAmount } = order

    const itemsHtml = items.map(item =>
      `<tr>
        <td>${item.product.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Confirmation</h1>
        <p>Dear ${shippingAddress.name},</p>
        <p>Thank you for your order! Here are the details:</p>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
          <h3>Shipping Address:</h3>
          <p>
            ${shippingAddress.name}<br>
            ${shippingAddress.address}<br>
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
            ${shippingAddress.country}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f0f0f0; font-weight: bold;">
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total:</td>
              <td style="border: 1px solid #ddd; padding: 8px;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <p style="color: #666; font-size: 14px;">
          Order ID: ${order.id}<br>
          Order Date: ${order.createdAt.toLocaleDateString()}
        </p>

        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: shippingAddress.email,
      subject: `Order Confirmation - Order #${order.id}`,
      html
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Order confirmation email sent to ${shippingAddress.email}`)
    } catch (error) {
      console.error('Failed to send order confirmation email:', error)
      // Don't throw error to avoid breaking the order flow
    }
  }

  async sendOrderStatusUpdate(order: Order, oldStatus: string, newStatus: string): Promise<void> {
    const { shippingAddress } = order

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Order Status Update</h1>
        <p>Dear ${shippingAddress.name},</p>
        <p>Your order status has been updated:</p>

        <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="margin: 0; color: #2563eb;">${oldStatus} → ${newStatus}</h2>
        </div>

        <p style="color: #666; font-size: 14px;">
          Order ID: ${order.id}<br>
          Updated: ${new Date().toLocaleDateString()}
        </p>

        <p>You can track your order status in your account dashboard.</p>
        <p>Best regards,<br>The E-Commerce Team</p>
      </div>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: shippingAddress.email,
      subject: `Order Status Update - Order #${order.id}`,
      html
    }

    try {
      await this.transporter.sendMail(mailOptions)
      console.log(`Order status update email sent to ${shippingAddress.email}`)
    } catch (error) {
      console.error('Failed to send order status update email:', error)
    }
  }
}

export const emailService = new EmailService()

