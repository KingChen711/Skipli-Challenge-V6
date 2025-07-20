import express from "express"

import { container } from "../../config/inversify.config"
import { authorize } from "../../middleware/authorize.middleware"
import { validateRequestData } from "../../middleware/validate-request-data.middleware"
import { ERole } from "../../types/enum"
import { getStudentLessonsSchema } from "../lessons/lesson.validation"
import { UserController } from "./user.controller"
import {
  addStudentSchema,
  deleteStudentSchema,
  editProfileSchema,
  editStudentSchema,
  getStudentSchema,
  getStudentsSchema,
} from "./user.validation"

const router = express.Router()

const userController = container.get(UserController)

router.get(
  "/students",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(getStudentsSchema),
  userController.getStudents
)

router.get(
  "/students/:phone",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(getStudentSchema),
  userController.getStudent
)

router.post(
  "/add-student",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(addStudentSchema),
  userController.addStudent
)

router.put(
  "/edit-student/:phone",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(editStudentSchema),
  userController.editStudent
)

//I do not know why, but the challenge only allow the student to edit their own profile.
router.put(
  "/edit-profile",
  authorize([ERole.STUDENT]),
  validateRequestData(editProfileSchema),
  userController.editStudentProfile
)

router.get(
  "/students/:phone/lessons",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(getStudentLessonsSchema),
  userController.getStudentLessons
)

router.delete(
  "/student/:phone",
  authorize([ERole.INSTRUCTOR]),
  validateRequestData(deleteStudentSchema),
  userController.deleteStudent
)

export { router as userRoute }
