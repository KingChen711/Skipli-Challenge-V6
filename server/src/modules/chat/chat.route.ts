import express from "express"

import { container } from "../../config/inversify.config"
import { authorize } from "../../middleware/authorize.middleware"
import { validateRequestData } from "../../middleware/validate-request-data.middleware"
import { ChatController } from "./chat.controller"
import { sendMessageSchema } from "./chat.validation"

const router = express.Router()

const chatController = container.get(ChatController)

router.post(
  "/send-message",
  authorize(),
  validateRequestData(sendMessageSchema),
  chatController.sendMessage
)

export { router as chatRoute }
