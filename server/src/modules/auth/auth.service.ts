import bcrypt from "bcrypt"
import { injectable } from "inversify"

import BadRequestException from "../../helpers/errors/bad-request.exception"
import RequestValidationException from "../../helpers/errors/request-validation.exception"
import UnauthorizedException from "../../helpers/errors/unauthorized-exception"
import { ERole } from "../../types/enum"
import { User } from "../../types/models"
import { EmailService } from "../email/email.service"
import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import {
  TAuthenticateSchema,
  TCheckExistAccountSchema,
  TCompleteSetupSchema,
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
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService
  ) {}

  public authenticate = async (dto: TAuthenticateSchema) => {
    const {
      body: { type, identifier, authType, authValue },
    } = dto
    const user = await this.userService.getUserByIdentifier(
      type,
      identifier,
      true
    )

    if (user && user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

    if (authType === "password") {
      await this.authenticateByPassword(user, authValue)
    } else {
      await this.authenticateByCode(user, authValue)
    }

    delete user.accessCode

    await this.userService.updateUser(user)

    const token = await this.tokenService.generateToken(user.id)

    return {
      accessToken: token,
      role: user.role,
    }
  }

  private async authenticateByPassword(user: User, password: string) {
    if (!user.password) {
      throw new BadRequestException("This account is not set password yet")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new RequestValidationException({
        authValue: "Wrong password",
      })
    }
  }

  private async authenticateByCode(user: User, accessCode: string) {
    //Check if access code is correct
    if (user.accessCode !== accessCode.toString()) {
      throw new RequestValidationException({
        authValue: "Invalid code",
      })
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

    const existingUser = await this.userService.getUserByUsername(username)
    if (existingUser) {
      throw new RequestValidationException({
        username: "Username already exists",
      })
    }

    // Hash the password before storing
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    user.username = username
    user.password = hashedPassword
    user.hasSetupCompleted = true

    delete user.setupToken

    await this.userService.updateUser(user)
  }

  public checkExistAccount = async (dto: TCheckExistAccountSchema) => {
    const {
      body: { type, identifier },
    } = dto

    const user = await this.userService.getUserByIdentifier(type, identifier)

    if (user && user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

    return !!user
  }

  public sendCode = async (dto: TCheckExistAccountSchema) => {
    const {
      body: { type, identifier },
    } = dto

    const user = await this.userService.getUserByIdentifier(
      type,
      identifier,
      true
    )

    if (user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

    if (!user.email) {
      throw new BadRequestException("This account is not set email yet")
    }

    //Generate and set access code for user
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.accessCode = accessCode
    await this.userService.updateUser(user)

    //Not need to await this task
    this.emailService.sendAccessCode(user.email, accessCode)

    return user.email
  }

  public sendSMS = async (dto: TCheckExistAccountSchema) => {
    const {
      body: { type, identifier },
    } = dto

    const user = await this.userService.getUserByIdentifier(
      type,
      identifier,
      true
    )

    if (user.role === ERole.STUDENT && !user.hasSetupCompleted) {
      throw new BadRequestException(
        "You have not completed setup account. Please check your email for setup instructions."
      )
    }

    if (!user.phone) {
      throw new BadRequestException("This account is not set phone yet")
    }

    //Generate and set access code for user
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.accessCode = accessCode
    await this.userService.updateUser(user)

    //Not need to await this task
    this.smsService.sendAccessCode(user.phone, accessCode)

    return user.phone
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
