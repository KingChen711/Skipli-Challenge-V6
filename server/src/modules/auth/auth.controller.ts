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

  public createAccessCode = async (req: Request, res: Response) => {
    await this.authService.createAccessCode(res.locals.requestData)
    return ok(res)
  }

  public validateAccessCode = async (req: Request, res: Response) => {
    const user = await this.authService.validateAccessCode(
      res.locals.requestData
    )
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
}
