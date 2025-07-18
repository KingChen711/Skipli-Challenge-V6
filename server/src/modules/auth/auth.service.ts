import { injectable } from "inversify"

import UnauthorizedException from "src/helpers/errors/unauthorized-exception"

import { UserService } from "../users/user.service"
import {
  TCreateAccessCodeSchema,
  TValidateAccessCodeSchema,
} from "./auth.validation"
import { SmsService } from "./sms.service"
import { TokenService } from "./token.service"

@injectable()
export class AuthService {
  constructor(
    private readonly smsService: SmsService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  public createAccessCode = async (dto: TCreateAccessCodeSchema) => {
    const {
      body: { phoneNumber },
    } = dto
    const user = await this.userService.getUserByPhone(phoneNumber, true)

    //Generate and set access code for user
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.accessCode = accessCode
    await this.userService.updateUser(user)

    //Not need to await this task
    this.smsService.sendAccessCode(phoneNumber, accessCode)
  }

  public validateAccessCode = async (dto: TValidateAccessCodeSchema) => {
    const {
      body: { accessCode, phoneNumber },
    } = dto
    const user = await this.userService.getUserByPhone(phoneNumber, true)

    //Check if access code is correct
    if (user.accessCode !== accessCode.toString()) {
      throw new UnauthorizedException("Invalid access code")
    }

    //Remove access code from user object
    //Normally I prefer undefined for performance but firestore doesn't accept undefined values
    // user.accessCode = undefined
    delete user.accessCode

    await this.userService.updateUser(user)

    const token = await this.tokenService.generateToken(user.id)

    return {
      accessToken: token,
    }
  }
}
