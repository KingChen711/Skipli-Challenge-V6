import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import BadRequestException from "src/helpers/errors/bad-request.exception"

import { Message, User } from "../../types/models"
import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import { TSendMessageSchema } from "./chat.validation"
import { SocketService } from "./socker.service"

@injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
    private readonly socketService: SocketService
  ) {}

  public sendMessage = async (sender: User, dto: TSendMessageSchema) => {
    const {
      body: { receiverId, content },
    } = dto

    const receiver = await this.userService.getUserById(receiverId, true)

    //According requirements, only students can send messages to instructors, and only instructors can send messages to students
    if (sender.role === receiver.role) {
      throw new BadRequestException("You can't send message to this user")
    }

    const newMessage: Message = {
      id: uuidv4(),
      content,
      senderId: sender.id,
      receiverId,
      createdAt: new Date(),
    }

    this.socketService.emitMessage(newMessage)

    await this.firebaseService.db
      .collection("messages")
      .doc(newMessage.id)
      .set(newMessage)
  }
}
