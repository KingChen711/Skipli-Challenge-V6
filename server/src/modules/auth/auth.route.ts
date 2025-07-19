import express from "express"

import { authorize } from "src/middleware/authorize.middleware"
import { validateRequestData } from "src/middleware/validate-request-data.middleware"

import { container } from "../../config/inversify.config"
import { AuthController } from "./auth.controller"
import {
  authenticateSchema,
  checkExistAccountSchema,
  completeSetupSchema,
  verifySetupTokenSchema,
} from "./auth.validation"

const router = express.Router()

const authController = container.get(AuthController)

router.get("/whoami", authorize(), authController.whoami)

router.post(
  "/send-code",
  validateRequestData(checkExistAccountSchema),
  authController.sendCode
)

router.post(
  "/send-sms",
  validateRequestData(checkExistAccountSchema),
  authController.sendSMS
)

router.post(
  "/authenticate",
  validateRequestData(authenticateSchema),
  authController.authenticate
)

router.get(
  "/setup/verify/:token",
  validateRequestData(verifySetupTokenSchema),
  authController.verifySetupToken
)

router.post(
  "/setup/complete",
  validateRequestData(completeSetupSchema),
  authController.completeSetup
)

router.post(
  "/check-exist-account",
  validateRequestData(checkExistAccountSchema),
  authController.checkExistAccount
)

// router.post(
//   "/login/password-method",
//   validateRequestData(loginPasswordMethodSchema),
//   authController.loginPasswordMethod
// )

export { router as authRoute }
