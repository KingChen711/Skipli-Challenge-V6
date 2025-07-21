import "dotenv/config"

import { container } from "../config/inversify.config"
import { TokenService } from "../modules/auth/token.service"
import { UserService } from "../modules/users/user.service"

const socketMiddleware = async (req, res, next) => {
  const isHandshake = req._query.sid === undefined
  if (!isHandshake) {
    return next()
  }

  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = await container.get(TokenService).verifyToken(token)

    if (!decoded) return next(new Error("Authentication error"))

    const userService = container.get(UserService)
    const user = await userService.getUserById(decoded.userId)
    if (!user) return next(new Error("Authentication error"))

    req.user = user
    next()
  } catch {
    return next(new Error("Invalid token"))
  }
}

export default socketMiddleware
