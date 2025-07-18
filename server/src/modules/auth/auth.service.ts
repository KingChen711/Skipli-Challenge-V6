import { injectable } from "inversify"

import { FirebaseService } from "../firebase/firebase.service"
import { TCreateAccessCodeSchema } from "./auth.validation"
import { SmsService } from "./sms.service"

@injectable()
export class AuthService {
  constructor(
    private readonly smsService: SmsService,
    private readonly firebaseService: FirebaseService
  ) {}

  public createAccessCode = async (dto: TCreateAccessCodeSchema) => {
    const accessCode = Math.floor(100000 + Math.random() * 900000)

    //not need to await for synchronous operation

    this.firebaseService.db
      .collection("access-codes")
      .doc(dto.body.phoneNumber)
      .set({
        accessCode,
      })

    this.smsService.sendAccessCode(dto.body.phoneNumber, accessCode.toString())
    return "Ok"
  }
}
