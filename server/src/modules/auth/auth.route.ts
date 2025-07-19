import express from "express"

import { authorize } from "src/middleware/authorize.middleware"
import { validateRequestData } from "src/middleware/validate-request-data.middleware"

import { container } from "../../config/inversify.config"
import { AuthController } from "./auth.controller"
import {
  completeSetupSchema,
  createAccessCodeSchema,
  validateAccessCodeSchema,
  verifySetupTokenSchema,
} from "./auth.validation"

const router = express.Router()

const authController = container.get(AuthController)

router.get("/whoami", authorize(), authController.whoami)

router.post(
  "/create-access-code",
  validateRequestData(createAccessCodeSchema),
  authController.createAccessCode
)

router.post(
  "/validate-access-code",
  validateRequestData(validateAccessCodeSchema),
  authController.validateAccessCode
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

// router.get(
//   "/login/check-exist-account/:phoneOrUsernameOrEmail",
//   validateRequestData(checkExistAccountSchema),
//   authController.checkExistAccount
// )

// router.post(
//   "/login/password-method",
//   validateRequestData(loginPasswordMethodSchema),
//   authController.loginPasswordMethod
// )

export { router as authRoute }
