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

  public createAccessCode = async (req: Request, res: Response) => {
    const accessCode = await this.authService.createAccessCode(req.body)
    return ok(res, accessCode)
  }
}
