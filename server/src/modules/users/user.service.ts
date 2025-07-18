import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import RequestValidationException, {
  ValidationErrors,
} from "src/helpers/errors/request-validation.exception"
import { PagedList } from "src/helpers/paged-list"
import { ERole } from "src/types/enum"

import NotFoundException from "../../helpers/errors/not-found.exception"
import { User } from "../../types/models"
import { EmailService } from "../email/email.service"
import { FirebaseService } from "../firebase/firebase.service"
import {
  TAddStudentSchema,
  TDeleteStudentSchema,
  TEditStudentSchema,
  TGetStudentsSchema,
} from "./user.validation"

@injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService
  ) {}

  public async getUserByPhone<T extends boolean>(
    phone: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const userQuery = await this.firebaseService.db
      .collection("users")
      .where("phone", "==", phone)
      .limit(1)
      .get()

    const user =
      userQuery.docs.length > 0 ? (userQuery.docs[0].data() as User) : null

    if (!user && require) {
      throw new NotFoundException(`User not found with phone ${phone}`)
    }

    return user as T extends true ? User : User | null
  }

  public async getUserByEmail<T extends boolean>(
    email: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const userQuery = await this.firebaseService.db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()

    const user =
      userQuery.docs.length > 0 ? (userQuery.docs[0].data() as User) : null

    if (!user && require) {
      throw new NotFoundException(`User not found with email ${email}`)
    }

    return user as T extends true ? User : User | null
  }

  public async getUserById<T extends boolean>(
    id: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const userQuery = await this.firebaseService.db
      .collection("users")
      .where("id", "==", id)
      .limit(1)
      .get()

    const user =
      userQuery.docs.length > 0 ? (userQuery.docs[0].data() as User) : null

    if (!user && require) {
      throw new NotFoundException(`User not found with id ${id}`)
    }

    return user as T extends true ? User : User | null
  }

  public async updateUser(user: User) {
    await this.firebaseService.db.collection("users").doc(user.id).set(user)
  }

  public async getStudents(dto: TGetStudentsSchema) {
    const {
      query: { pageNumber, pageSize },
    } = dto
    const studentQuery = await this.firebaseService.db
      .collection("users")
      .where("role", "==", ERole.STUDENT)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .get()

    const totalCountResult = await this.firebaseService.db
      .collection("users")
      .where("role", "==", ERole.STUDENT)
      .count()
      .get()

    const totalCount = totalCountResult.data().count
    const students = studentQuery.docs.map((student) => student.data() as User)

    const mappedStudents = students.map((student) => ({
      ...student,
      accessCode: undefined,
      password: undefined,
    }))

    return new PagedList<User>(mappedStudents, totalCount, pageNumber, pageSize)
  }

  public async getStudentByPhone<T extends boolean>(
    phone: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const studentQuery = await this.firebaseService.db
      .collection("users")
      .where("phone", "==", phone)
      .where("role", "==", ERole.STUDENT)
      .limit(1)
      .get()

    const student =
      studentQuery.docs.length > 0
        ? (studentQuery.docs[0].data() as User)
        : null

    if (!student && require) {
      throw new NotFoundException(`Student not found with phone ${phone}`)
    }

    return student as T extends true ? User : User | null
  }

  public async addStudent(dto: TAddStudentSchema) {
    const {
      body: { email, name, phone },
    } = dto

    const userByPhone = await this.getUserByPhone(phone)
    const userByEmail = await this.getUserByEmail(email)

    const errors: ValidationErrors = {}

    if (userByPhone) {
      errors.phone = "Phone is already in use"
    }

    if (userByEmail) {
      errors.email = "Email is already in use"
    }

    if (Object.keys(errors).length > 0) {
      throw new RequestValidationException(errors)
    }

    const newStudent: User = {
      id: uuidv4(),
      email,
      name,
      phone,
      role: ERole.STUDENT,
    }

    await this.firebaseService.db
      .collection("users")
      .doc(newStudent.id)
      .set(newStudent)

    //Not need to await
    //TODO: implement set up account for student
    this.emailService.sendEmail(
      newStudent.email!,
      "Welcome to the platform",
      `Welcome to the platform ${newStudent.name}`
    )
  }

  public async editStudent(dto: TEditStudentSchema) {
    const {
      body: updatedDate,
      params: { phone },
    } = dto

    const student = await this.getStudentByPhone(phone, true)

    Object.assign(student, updatedDate)

    await this.updateUser(student)
  }

  //TODO: Need check constraints before delete
  public async deleteStudent(dto: TDeleteStudentSchema) {
    const {
      params: { phone },
    } = dto

    const student = await this.getStudentByPhone(phone, true)

    await this.firebaseService.db.collection("users").doc(student.id).delete()
  }

  public async getStudentIdsByPhones(phones: string[]) {
    const studentQuery = await this.firebaseService.db
      .collection("users")
      .where("role", "==", ERole.STUDENT)
      .where("phone", "in", phones)
      .get()

    return studentQuery.docs.map((student) => student.data().id as string)
  }
}
