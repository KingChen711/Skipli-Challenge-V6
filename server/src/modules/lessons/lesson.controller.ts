import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { ok } from "../../helpers/utils"
import { LessonService } from "./lesson.service"

@injectable()
export class LessonController {
  constructor(
    @inject(LessonService)
    private readonly lessonService: LessonService
  ) {}

  public assignLesson = async (req: Request, res: Response) => {
    const a = await this.lessonService.assignLesson(res.locals.requestData)
    return ok(res, a)
  }

  public getMyLessons = async (req: Request, res: Response) => {
    const lessons = await this.lessonService.getMyLessons(
      res.locals.user.id,
      res.locals.requestData
    )
    return ok(res, lessons)
  }

  public markLessonDone = async (req: Request, res: Response) => {
    await this.lessonService.markLessonDone(
      res.locals.user.id,
      res.locals.requestData
    )

    return ok(res)
  }

  public getLessons = async (req: Request, res: Response) => {
    const lessons = await this.lessonService.getLessons(res.locals.requestData)
    return ok(res, lessons)
  }

  public getLessonStudents = async (req: Request, res: Response) => {
    const students = await this.lessonService.getLessonStudents(
      res.locals.requestData
    )
    return ok(res, students)
  }
}
