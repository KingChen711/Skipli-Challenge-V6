import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import BadRequestException from "src/helpers/errors/bad-request.exception"
import { PagedList } from "src/helpers/paged-list"
import { asyncPoolAll } from "src/helpers/utils"
import { EStudentLessonStatus } from "src/types/enum"

import { Lesson, StudentLesson } from "../../types/models"
import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import {
  TAssignLessonSchema,
  TGetMyLessonsSchema,
  TMarkLessonDoneSchema,
} from "./lesson.validation"

type MyLesson = Lesson & { status: EStudentLessonStatus }
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

    //Need to get student ids from phone numbers, although phone number is unique,it is changeable, it not reliable to save as key
    const studentIds =
      await this.userService.getStudentIdsByPhones(studentPhones)

    const newLesson: Lesson = {
      id: uuidv4(),
      title,
      description,
    }

    const studentLessons: StudentLesson[] = studentIds.map((studentId) => ({
      studentId,
      lessonId: newLesson.id,
      status: EStudentLessonStatus.PENDING,
    }))

    await this.firebaseService.db
      .collection("lessons")
      .doc(newLesson.id)
      .set(newLesson)

    await asyncPoolAll(10, studentLessons, (studentLesson) =>
      this.firebaseService.db.collection("students-lessons").add(studentLesson)
    )
  }

  public async getMyLessons(studentId: string, dto: TGetMyLessonsSchema) {
    const {
      query: { pageNumber, pageSize },
    } = dto

    //Not need to check if the student is exist, because the studentId is already checked in the authorize middleware

    const studentLessons = await this.firebaseService.db
      .collection("students-lessons")
      .where("studentId", "==", studentId)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => doc.data() as StudentLesson)
      )

    const totalCount = studentLessons.length

    const queriedStudentLessons = studentLessons.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    )

    const lessons =
      //TODO: Add reason why I use asyncPoolAll instead "in" query in README.md
      (
        await asyncPoolAll(
          10,
          queriedStudentLessons,
          async (studentLesson) =>
            await this.firebaseService.db
              .collection("lessons")
              .where("id", "==", studentLesson.lessonId)
              .limit(1)
              .get()
              .then((snapshot) =>
                snapshot.docs.length > 0
                  ? ({
                      ...snapshot.docs[0].data(),
                      status: studentLesson.status,
                    } as MyLesson)
                  : null
              )
        )
      ).filter(Boolean) as MyLesson[]

    return new PagedList<MyLesson>(lessons, totalCount, pageNumber, pageSize)
  }

  public async markLessonDone(studentId: string, dto: TMarkLessonDoneSchema) {
    const {
      body: { lessonId },
    } = dto

    //Not need to check if the student is exist, because the studentId is already checked in the authorize middleware

    const studentLesson = await this.firebaseService.db
      .collection("students-lessons")
      .where("studentId", "==", studentId)
      .where("lessonId", "==", lessonId)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0
          ? ({
              ...snapshot.docs[0].data(),
              id: snapshot.docs[0].ref.id,
            } as StudentLesson & { id: string })
          : null
      )

    if (!studentLesson) {
      throw new BadRequestException("The lesson is not assigned to student")
    }

    if (studentLesson.status === EStudentLessonStatus.COMPLETED) {
      throw new BadRequestException("The lesson is already completed")
    }

    await this.firebaseService.db
      .collection("students-lessons")
      .doc(studentLesson.id)
      .update({
        status: EStudentLessonStatus.COMPLETED,
      })
  }
}
