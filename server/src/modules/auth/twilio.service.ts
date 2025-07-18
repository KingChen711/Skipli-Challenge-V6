import { injectable } from "inversify"
import twilio, { Twilio } from "twilio"

import "dotenv/config"

@injectable()
export class TwilioService {
  private readonly client: Twilio
  private readonly TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

  constructor() {
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
    this.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

    if (
      !TWILIO_ACCOUNT_SID ||
      !TWILIO_AUTH_TOKEN ||
      !this.TWILIO_PHONE_NUMBER
    ) {
      throw new Error(
        "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER must be set in env"
      )
    }

    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  }

  public sendAccessCode = async (to: string, accessCode: string) => {
    return this.client.messages
      .create({
        body: `Your access code is ${accessCode}`,
        from: this.TWILIO_PHONE_NUMBER,
        to,
      })
      .then((message) => console.log(`Message sent: ${message.sid}`))
      .catch((err) => console.error(err))
  }
}
