import { injectable } from "inversify"

import NotFoundException from "../../helpers/errors/not-found.exception"
import { User } from "../../types/models"
import { FirebaseService } from "../firebase/firebase.service"

@injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}

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
}
