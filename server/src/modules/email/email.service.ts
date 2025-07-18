import { injectable } from "inversify"
import { createTransport } from "nodemailer"

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

  async sendEmail(to: string | string[], subject: string, html: string) {
    const transporter = this.emailTransport()

    try {
      await transporter.sendMail({
        from: this.NODEMAILER_USER,
        to,
        subject,
        html,
      })
    } catch (error) {
      console.error(`Error sending email to ${to}: ${error}`)
    }
  }
}
