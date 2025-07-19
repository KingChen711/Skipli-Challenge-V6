import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import RequestValidationException, {
  ValidationErrors,
} from "src/helpers/errors/request-validation.exception"
import { PagedList } from "src/helpers/paged-list"
import { asyncPoolAll } from "src/helpers/utils"
import { ERole } from "src/types/enum"

import NotFoundException from "../../helpers/errors/not-found.exception"
import { User } from "../../types/models"
import { TokenService } from "../auth/token.service"
import { EmailService } from "../email/email.service"
import { FirebaseService } from "../firebase/firebase.service"
import {
  TAddStudentSchema,
  TDeleteStudentSchema,
  TEditProfileSchema,
  TEditStudentSchema,
  TGetStudentsSchema,
} from "./user.validation"

@injectable()
export class UserService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService
  ) {}

  public async getUserByPhone<T extends boolean>(
    phone: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const user = await this.firebaseService.db
      .collection("users")
      .where("phone", "==", phone)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

    if (!user && require) {
      throw new NotFoundException(`User not found with phone ${phone}`)
    }

    return user as T extends true ? User : User | null
  }

  public async getUserByEmail<T extends boolean>(
    email: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const user = await this.firebaseService.db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

    if (!user && require) {
      throw new NotFoundException(`User not found with email ${email}`)
    }

    return user as T extends true ? User : User | null
  }

  public async getUserByUsername<T extends boolean>(
    username: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const user = await this.firebaseService.db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

    if (!user && require) {
      throw new NotFoundException(`User not found with username ${username}`)
    }

    return user as T extends true ? User : User | null
  }

  public async getUserById<T extends boolean>(
    id: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const user = await this.firebaseService.db
      .collection("users")
      .where("id", "==", id)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

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
    const students = await this.firebaseService.db
      .collection("users")
      .where("role", "==", ERole.STUDENT)
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((student) => student.data() as User)
      )

    const totalCount = await this.firebaseService.db
      .collection("users")
      .where("role", "==", ERole.STUDENT)
      .count()
      .get()
      .then((snapshot) => snapshot.data().count)

    const mappedStudents = students.map((student) => this.toPublicUser(student))

    return new PagedList<User>(mappedStudents, totalCount, pageNumber, pageSize)
  }

  public async getStudentByPhone<T extends boolean>(
    phone: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const student = await this.firebaseService.db
      .collection("users")
      .where("phone", "==", phone)
      .where("role", "==", ERole.STUDENT)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
      )

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

    const setupToken = this.tokenService.generateSetupToken()
    const newStudent: User = {
      id: uuidv4(),
      email,
      name,
      phone,
      role: ERole.STUDENT,
      setupToken,
    }

    await this.firebaseService.db
      .collection("users")
      .doc(newStudent.id)
      .set(newStudent)

    //Not need to await
    this.emailService.sendAccountSetupEmail(
      newStudent.email!,
      newStudent.name,
      setupToken
    )
  }

  public async editStudent(dto: TEditStudentSchema) {
    const {
      body: { email, name, phone: newPhone, username },
      params: { phone },
    } = dto
    const student = await this.getStudentByPhone(phone, true)
    const userByPhone = await this.getUserByPhone(newPhone)
    const userByEmail = await this.getUserByEmail(email)
    const userByUsername = await this.getUserByUsername(username)

    const errors: ValidationErrors = {}

    if (userByPhone && userByPhone.phone !== phone) {
      errors.phone = "Phone is already in use"
    }

    if (userByEmail && userByEmail.phone !== phone) {
      errors.email = "Email is already in use"
    }

    if (userByUsername && userByUsername.phone !== phone) {
      errors.username = "Username is already in use"
    }

    if (Object.keys(errors).length > 0) {
      throw new RequestValidationException(errors)
    }

    Object.assign(student, { email, name, phone: newPhone, username })

    await this.updateUser(student)
  }

  public async deleteStudent(dto: TDeleteStudentSchema) {
    const {
      params: { phone },
    } = dto

    const student = await this.getStudentByPhone(phone, true)

    await this.firebaseService.db.collection("users").doc(student.id).delete()
    await this.firebaseService.db
      .collection("students-lessons")
      .where("studentId", "==", student.id)
      .get()
      .then((snapshot) => {
        asyncPoolAll(10, snapshot.docs, async (doc) => {
          await doc.ref.delete()
        })
      })
  }

  public async getStudentIdsByPhones(phones: string[]): Promise<string[]> {
    return (
      await asyncPoolAll(
        10,
        phones,
        async (phone) =>
          await this.firebaseService.db
            .collection("users")
            .where("role", "==", ERole.STUDENT)
            .where("phone", "==", phone)
            .limit(1)
            .get()
            .then((snapshot) =>
              snapshot.docs.length > 0
                ? (snapshot.docs[0].data().id as string)
                : null
            )
      )
    ).filter(Boolean) as string[]
  }

  public async editStudentProfile(studentId: string, dto: TEditProfileSchema) {
    const {
      body: { name, phone, email },
    } = dto

    const userByPhone = await this.getUserByPhone(phone)
    const userByEmail = await this.getUserByEmail(email)

    const errors: ValidationErrors = {}

    if (userByPhone && userByPhone.id !== studentId) {
      errors.phone = "Phone is already in use"
    }

    if (userByEmail && userByEmail.id !== studentId) {
      errors.email = "Email is already in use"
    }

    if (Object.keys(errors).length > 0) {
      throw new RequestValidationException(errors)
    }

    //Not need to check if the student is exist, because the studentId is already checked in the authorize middleware
    await this.firebaseService.db
      .collection("users")
      .doc(studentId)
      .update({ name, phone, email })
  }

  public toPublicUser(user: User) {
    delete user.password
    delete user.accessCode
    delete user.setupToken
    return user as User
  }

  public async getUserByIdentifier<T extends boolean>(
    type: "email" | "phone" | "username",
    identifier: string,
    require = false as T
  ): Promise<T extends true ? User : User | null> {
    const collection = this.firebaseService.db.collection("users")
    let query
    switch (type) {
      case "email":
        query = collection.where("email", "==", identifier)
        break
      case "phone":
        query = collection.where("phone", "==", identifier)
        break
      case "username":
        query = collection.where("username", "==", identifier)
        break
    }

    const user = query
      ? ((await query
          .limit(1)
          .get()
          .then((snapshot) =>
            snapshot.docs.length > 0 ? (snapshot.docs[0].data() as User) : null
          )) as User)
      : null

    if (!user && require) {
      throw new NotFoundException(`User not found with ${type} ${identifier}`)
    }

    return user as T extends true ? User : User | null
  }
}
