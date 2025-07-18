import express from "express"

import { authorize } from "src/middleware/authorize.middleware"
import { validateRequestData } from "src/middleware/validate-request-data.middleware"
import { ERole } from "src/types/enum"

import { container } from "../../config/inversify.config"
import { LessonController } from "./lesson.controller"
import { assignLessonSchema } from "./lesson.validation"

const router = express.Router()

const lessonController = container.get(LessonController)

router.post(
  "/assign-lesson",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(assignLessonSchema),
  lessonController.assignLesson
)

export { router as lessonRoute }
