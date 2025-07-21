import "dotenv/config"

import { type NextFunction, type Request, type Response } from "express"

import { container } from "../config/inversify.config"
import ForbiddenException from "../helpers/errors/forbidden-exception"
import UnauthorizedException from "../helpers/errors/unauthorized-exception"
import { TokenService } from "../modules/auth/token.service"
import { UserService } from "../modules/users/user.service"
import { type ERole } from "../types/enum"

const authorize =
  (roles?: ERole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) throw new UnauthorizedException("Invalid Token")

    const decoded = await container.get(TokenService).verifyToken(token)
    if (!decoded) throw new UnauthorizedException("Invalid Token")

    const userService = container.get(UserService)
    const user = await userService.getUserById(decoded.userId)
    if (!user) throw new UnauthorizedException("Invalid Token")

    res.locals.user = user

    if (!roles) return next() //mean that just the token is required, every roles is allowed, middleware can go next

    const hasPermission = roles.includes(user.role as ERole)
    if (!hasPermission) {
      throw new ForbiddenException("You have no permission for this action")
    }

    next()
  }

export { authorize }
