import { SNSClient } from "@aws-sdk/client-sns"
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
    // const command = new PublishCommand({
    //   Message: `Your access code is ${accessCode}`,
    //   PhoneNumber: to,
    //   MessageAttributes: {
    //     "AWS.SNS.SMS.SenderID": {
    //       DataType: "String",
    //       StringValue: "String",
    //     },
    //   },
    // })

    // const message = await this.snsClient.send(command)
    console.log(`Your access code is ${accessCode}`)
  }
}
