import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { ok } from "../../helpers/utils"
import { UserService } from "./user.service"

@injectable()
export class UserController {
  constructor(
    @inject(UserService)
    private readonly userService: UserService
  ) {}

  public getStudents = async (req: Request, res: Response) => {
    const students = await this.userService.getStudents(res.locals.requestData)
    return ok(res, students)
  }

  public getStudent = async (req: Request, res: Response) => {
    const student = await this.userService.getStudentByPhone(
      res.locals.requestData.params.phone
    )
    return ok(res, student)
  }

  public addStudent = async (req: Request, res: Response) => {
    await this.userService.addStudent(res.locals.requestData)
    return ok(res)
  }

  public editStudent = async (req: Request, res: Response) => {
    await this.userService.editStudent(res.locals.requestData)
    return ok(res)
  }

  public deleteStudent = async (req: Request, res: Response) => {
    await this.userService.deleteStudent(res.locals.requestData)
    return ok(res)
  }

  public editStudentProfile = async (req: Request, res: Response) => {
    await this.userService.editStudentProfile(
      res.locals.user.id,
      res.locals.requestData
    )
    return ok(res)
  }

  public getStudentLessons = async (req: Request, res: Response) => {
    const lessons = await this.userService.getStudentLessons(
      res.locals.requestData
    )
    return ok(res, lessons)
  }
}
