import { PublishCommand, SNSClient } from "@aws-sdk/client-sns"
import { injectable } from "inversify"

import "dotenv/config"

@injectable()
export class SmsService {
  private readonly snsClient: SNSClient

  constructor() {
    const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
    const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
    const AWS_REGION = process.env.AWS_REGION

    if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_REGION) {
      throw new Error(
        "AWS_ACCESS_KEY, AWS_SECRET_KEY and AWS_REGION must be set in env"
      )
    }

    this.snsClient = new SNSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    })
  }

  public sendAccessCode = async (to: string, accessCode: string) => {
    try {
      //!: Only works with Vietnam phone numbers
      //!: I can still create an input so the user can select an international phone number by selecting the prefix first. But I'll keep this challenge simple.
      const command = new PublishCommand({
        Message: `Your access code is ${accessCode}`,
        PhoneNumber: `+84${to.slice(1)}`,
      })

      await this.snsClient.send(command)
      console.log(
        `Sent SMS to ${to} with access code ${accessCode} (Just for development and testing)`
      )
    } catch (error) {
      console.error(`Error sending SMS to ${to}: ${error}`)
    }
  }
}
