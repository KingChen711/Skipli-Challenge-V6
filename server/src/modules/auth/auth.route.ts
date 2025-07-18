import express from "express"

import { authorize } from "src/middleware/authorize.middleware"
import { validateRequestData } from "src/middleware/validate-request-data.middleware"

import { container } from "../../config/inversify.config"
import { AuthController } from "./auth.controller"
import {
  createAccessCodeSchema,
  validateAccessCodeSchema,
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

export { router as authRoute }
