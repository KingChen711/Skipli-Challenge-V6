import express from "express"

import { validateRequestData } from "src/middleware/validate-request-data.middleware"

import { container } from "../../config/inversify.config"
import { AuthController } from "./auth.controller"
import { createAccessCodeSchema } from "./auth.validation"

const router = express.Router()

const authController = container.get(AuthController)

router.post(
  "/create-access-code",
  validateRequestData(createAccessCodeSchema),
  authController.createAccessCode
)

export { router as authRoute }
