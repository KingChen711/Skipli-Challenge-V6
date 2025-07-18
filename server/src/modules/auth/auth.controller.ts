import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { ok } from "../../helpers/utils"
import { AuthService } from "./auth.service"

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService)
    private readonly authService: AuthService
  ) {}

  public whoami = async (req: Request, res: Response) => {
    return ok(res, res.locals.user)
  }

  public createAccessCode = async (req: Request, res: Response) => {
    await this.authService.createAccessCode(req)
    return ok(res)
  }

  public validateAccessCode = async (req: Request, res: Response) => {
    const user = await this.authService.validateAccessCode(req)
    return ok(res, user)
  }
}
