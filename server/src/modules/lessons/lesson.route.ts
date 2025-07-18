import express from "express"

import { authorize } from "src/middleware/authorize.middleware"
import { validateRequestData } from "src/middleware/validate-request-data.middleware"
import { ERole } from "src/types/enum"

import { container } from "../../config/inversify.config"
import { LessonController } from "./lesson.controller"
import {
  assignLessonSchema,
  getMyLessonsSchema,
  markLessonDoneSchema,
} from "./lesson.validation"

const router = express.Router()

const lessonController = container.get(LessonController)

router.post(
  "/assign-lesson",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(assignLessonSchema),
  lessonController.assignLesson
)

//TODO: Add README.md: maybe the intention of the person who proposed this challenge is to use phone as key. But since it can change it in profile, so I don't think it is trustworthy to be key. I will use studentId(userId)

//The studentId can get after authorize. Not need to pass it.
router.get(
  "/my-lessons",
  authorize([ERole.STUDENT]),
  validateRequestData(getMyLessonsSchema),
  lessonController.getMyLessons
)

//The studentId can get after authorize. Not need to pass it.
router.post(
  "/mark-lesson-done",
  authorize([ERole.STUDENT]),
  validateRequestData(markLessonDoneSchema),
  lessonController.markLessonDone
)

export { router as lessonRoute }
