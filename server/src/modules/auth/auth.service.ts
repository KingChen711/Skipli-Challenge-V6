import { injectable } from "inversify"

import { TCreateAccessCodeSchema } from "./auth.validation"
import { TwilioService } from "./twilio.service"

@injectable()
export class AuthService {
  constructor(private readonly twilioService: TwilioService) {}

  public createAccessCode = async (dto: TCreateAccessCodeSchema) => {
    const accessCode = Math.floor(100000 + Math.random() * 900000)

    //not need to await for synchronous operation
    this.twilioService.sendAccessCode(
      dto.body.phoneNumber,
      accessCode.toString()
    )
    return dto
  }
}
