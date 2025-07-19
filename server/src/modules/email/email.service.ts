import { injectable } from "inversify"
import { createTransport } from "nodemailer"

export type TEmailTemplate = {
  to: string | [string]
  subject: string
  html: string
  text?: string
}

@injectable()
export class EmailService {
  private readonly NODEMAILER_USER = process.env.NODEMAILER_USER

  private emailTransport() {
    const transporter = createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: false,
      auth: {
        user: this.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    })
    return transporter
  }

  async sendEmail(emailData: TEmailTemplate) {
    const transporter = this.emailTransport()

    try {
      await transporter.sendMail({
        ...emailData,
        from: this.NODEMAILER_USER,
      })
    } catch (error) {
      console.error(`Error sending email to ${emailData.to}: ${error}`)
    }
  }

  async sendAccountSetupEmail(
    studentEmail: string,
    studentName: string,
    setupToken: string
  ) {
    const setupLink = `${process.env.FRONTEND_URL}/setup-account?token=${setupToken}`

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Set Up Your Student Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6246ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #6246ea; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; text-align: center; }
        .button-container { text-align: center; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Learning Platform!</h1>
        </div>
        <div class="content">
          <h2>Hello ${studentName},</h2>
          <p>You've been enrolled as a student in our learning platform. To get started, you need to set up your account credentials.</p>
          
          <p>Click the button below to create your username and password:</p>
          
          <div class="button-container">
            <a href="${setupLink}" class="button">Set Up My Account</a>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">${setupLink}</p>
          
          <p>If you didn't expect this email or have any questions, please contact your instructor or our support team.</p>
          
          <p>Best regards,<br>The Learning Platform Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `

    const text = `
    Welcome to Our Learning Platform!
    
    Hello ${studentName},
    
    You've been enrolled as a student in our learning platform. To get started, you need to set up your account credentials.
    
    Please visit this link to create your username and password:
    ${setupLink}
    
    If you didn't expect this email or have any questions, please contact your instructor or our support team.
    
    Best regards,
    The Learning Platform Team
  `

    const emailData: TEmailTemplate = {
      to: studentEmail,
      subject: "Set Up Your Student Account",
      html,
      text,
    }

    await this.sendEmail(emailData)
  }

  public async sendAccessCode(email: string, accessCode: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Access Code</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6246ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .code { font-size: 24px; font-weight: bold; color: #6246ea; text-align: center; margin: 20px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Access Code</h1>
        </div>
        <div class="content">
          <p>Your access code is:</p>
          <div class="code">${accessCode}</div> 
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>The Learning Platform Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
    `

    const text = `
    Your access code is: ${accessCode}
    If you didn't request this code, please ignore this email.
    Best regards,
    The Learning Platform Team
  `

    const emailData: TEmailTemplate = {
      to: email,
      subject: "Your Access Code",
      html,
      text,
    }

    await this.sendEmail(emailData)
  }
}
