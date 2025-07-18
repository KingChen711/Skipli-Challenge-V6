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
}
