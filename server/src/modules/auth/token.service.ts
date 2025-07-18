import { injectable } from "inversify"
import jwt from "jsonwebtoken"

import "dotenv/config"

import { promisify } from "util"

import UnauthorizedException from "src/helpers/errors/unauthorized-exception"

const sign = promisify(jwt.sign).bind(jwt)
const verify = promisify(jwt.verify).bind(jwt)

@injectable()
export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

  constructor() {
    if (!this.JWT_SECRET || !this.JWT_EXPIRES_IN) {
      throw new Error("JWT_SECRET and JWT_EXPIRES_IN must be set in env")
    }
  }

  public generateToken = async (userId: string): Promise<string> => {
    return await sign({ userId }, this.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: this.JWT_EXPIRES_IN,
    })
  }

  public verifyToken = async (
    token: string,
    ignoreExpiration = false
  ): Promise<{ userId: string }> => {
    try {
      return await verify(token, this.JWT_SECRET, {
        ignoreExpiration,
      })
    } catch {
      throw new UnauthorizedException("Invalid Token")
    }
  }
}
