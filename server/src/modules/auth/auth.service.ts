import bcrypt from "bcrypt"
import { injectable } from "inversify"

import BadRequestException from "src/helpers/errors/bad-request.exception"
import UnauthorizedException from "src/helpers/errors/unauthorized-exception"
import { ERole } from "src/types/enum"
import { User } from "src/types/models"

import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import {
  TCompleteSetupSchema,
  TCreateAccessCodeSchema,
  TValidateAccessCodeSchema,
  TVerifySetupTokenSchema,
} from "./auth.validation"
import { SmsService } from "./sms.service"
import { TokenService } from "./token.service"

@injectable()
export class AuthService {
  constructor(
    private readonly smsService: SmsService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService
  ) {}

  public createAccessCode = async (dto: TCreateAccessCodeSchema) => {
    const {
      body: { phoneNumber },
    } = dto
    const user = await this.userService.getUserByPhone(phoneNumber, true)

    //!As I understand after reading the requirements, this API endpoint is only used by Instructors or Students who have completed setup.
    if (user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

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

    //!As I understand after reading the requirements, this API endpoint is only used by Instructors or Students who have completed setup.
    if (user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

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

  public verifySetupToken = async (dto: TVerifySetupTokenSchema) => {
    const {
      params: { token },
    } = dto

    const user = await this.firebaseService.db
      .collection("users")
      .where("setupToken", "==", token)
      .where("role", "==", ERole.STUDENT)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

    if (!user) {
      throw new UnauthorizedException("Invalid setup token")
    }

    if (user?.hasSetupCompleted) {
      throw new BadRequestException("Setup already completed")
    }

    return this.userService.toPublicUser(user)
  }

  public completeSetup = async (dto: TCompleteSetupSchema) => {
    const {
      body: { token, username, password },
    } = dto

    const user = await this.verifySetupToken({
      params: { token },
    })

    // Hash the password before storing
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    user.username = username
    user.password = hashedPassword
    user.hasSetupCompleted = true

    delete user.setupToken

    await this.userService.updateUser(user)
  }

  // public login = async (dto: TLoginSchema) => {
  //   const {
  //     body: { username, password },
  //   } = dto

  //   // Find user by username
  //   const user = await this.userService.getUserByUsername(username, true)

  //   // Check if user has completed setup
  //   if (!user.hasSetupCompleted) {
  //     throw new UnauthorizedException("Account setup not completed")
  //   }

  //   // Verify password
  //   if (!user.password) {
  //     throw new UnauthorizedException("Invalid credentials")
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password)
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException("Invalid credentials")
  //   }

  //   // Generate token
  //   const token = await this.tokenService.generateToken(user.id)

  //   return {
  //     accessToken: token,
  //     user: this.userService.toProtectedUser(user),
  //   }
  // }
}
