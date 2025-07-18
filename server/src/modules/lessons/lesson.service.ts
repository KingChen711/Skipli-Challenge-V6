import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import { Lesson } from "../../types/models"
import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import { TAssignLessonSchema } from "./lesson.validation"

@injectable()
export class LessonService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService
  ) {}

  public async assignLesson(dto: TAssignLessonSchema) {
    const {
      body: { title, description, studentPhones },
    } = dto

    //Need to get student ids from phone numbers, although phone number is unique,it is changeable, it not reliable to save in lesson
    const studentIds =
      await this.userService.getStudentIdsByPhones(studentPhones)

    const newLesson: Lesson = {
      id: uuidv4(),
      title,
      description,
      studentIds,
    }

    await this.firebaseService.db
      .collection("lessons")
      .doc(newLesson.id)
      .set(newLesson)
  }
}
