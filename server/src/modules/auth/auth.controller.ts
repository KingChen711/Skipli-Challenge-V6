import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { ok } from "../../helpers/utils"
import { UserService } from "../users/user.service"
import { AuthService } from "./auth.service"

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService)
    private readonly authService: AuthService,
    @inject(UserService)
    private readonly userService: UserService
  ) {}

  public whoami = async (req: Request, res: Response) => {
    return ok(res, this.userService.toPublicUser(res.locals.user))
  }

  public sendCode = async (req: Request, res: Response) => {
    const sentEmail = await this.authService.sendCode(res.locals.requestData)
    return ok(res, sentEmail)
  }

  public sendSMS = async (req: Request, res: Response) => {
    const sentPhone = await this.authService.sendSMS(res.locals.requestData)
    return ok(res, sentPhone)
  }

  public authenticate = async (req: Request, res: Response) => {
    const user = await this.authService.authenticate(res.locals.requestData)
    return ok(res, user)
  }

  public verifySetupToken = async (req: Request, res: Response) => {
    const user = await this.authService.verifySetupToken(res.locals.requestData)
    return ok(res, user)
  }

  public completeSetup = async (req: Request, res: Response) => {
    await this.authService.completeSetup(res.locals.requestData)
    return ok(res)
  }

  public checkExistAccount = async (req: Request, res: Response) => {
    const exist = await this.authService.checkExistAccount(
      res.locals.requestData
    )
    return ok(res, exist)
  }
}
