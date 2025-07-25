import { injectable } from "inversify"
import { v4 as uuidv4 } from "uuid"

import BadRequestException from "../../helpers/errors/bad-request.exception"
import { PagedList } from "../../helpers/paged-list"
import { asyncPoolAll } from "../../helpers/utils"
import { ERole } from "../../types/enum"
import { Conversation, Message, User } from "../../types/models"
import { FirebaseService } from "../firebase/firebase.service"
import { UserService } from "../users/user.service"
import {
  TGetConversationsSchema,
  TGetMessagesSchema,
  TSendMessageSchema,
} from "./chat.validation"
import { SocketService } from "./socket.service"

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

    const [senderConversationId, receiverConversationId] = await Promise.all([
      this.firebaseService.db
        .collection("conversations")
        .where("yourId", "==", sender.id)
        .where("partnerId", "==", receiverId)
        .limit(1)
        .get()
        .then((snapshot) =>
          snapshot.docs.length > 0
            ? (snapshot.docs[0].id as string) || uuidv4()
            : uuidv4()
        ),
      this.firebaseService.db
        .collection("conversations")
        .where("yourId", "==", receiverId)
        .where("partnerId", "==", sender.id)
        .limit(1)
        .get()
        .then((snapshot) =>
          snapshot.docs.length > 0
            ? (snapshot.docs[0].id as string) || uuidv4()
            : uuidv4()
        ),
    ])

    const newMessage: Message = {
      id: uuidv4(),
      content,
      senderId: sender.id,
      receiverId,
      createdAt: new Date(),
      conversationIds: [senderConversationId, receiverConversationId],
    }

    await Promise.all([
      this.firebaseService.db
        .collection("conversations")
        .doc(senderConversationId)
        .set({
          id: senderConversationId,
          yourId: sender.id,
          partnerId: receiverId,
          lastMessage: newMessage,
        }),
      this.firebaseService.db
        .collection("conversations")
        .doc(receiverConversationId)
        .set({
          id: receiverConversationId,
          yourId: receiverId,
          partnerId: sender.id,
          lastMessage: newMessage,
        }),
      this.firebaseService.db
        .collection("messages")
        .doc(newMessage.id)
        .set(newMessage),
    ])

    this.socketService.emitMessage(newMessage)
  }

  public getConversations = async (
    user: User,
    dto: TGetConversationsSchema
  ) => {
    const {
      query: { pageNumber, pageSize },
    } = dto

    const conversations = await this.firebaseService.db
      .collection("conversations")
      .where("yourId", "==", user.id)
      .orderBy("lastMessage.createdAt", "desc")
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .get()
      .then((snapshot) =>
        snapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              lastMessage: {
                ...doc.data().lastMessage,
                createdAt: new Date(
                  doc.data().lastMessage.createdAt._seconds * 1000
                ).toISOString(),
              },
            }) as Conversation
        )
      )

    const totalCount = await this.firebaseService.db
      .collection("conversations")
      .where("yourId", "==", user.id)
      .count()
      .get()
      .then((snapshot) => snapshot.data().count)

    const conversationsWithPartners = await asyncPoolAll(
      10,
      conversations,
      async (conversation) => {
        const partner = await this.userService.getUserById(
          conversation.partnerId
        )
        if (!partner) return null
        return {
          ...conversation,
          partner: this.userService.toPublicUser(partner),
        }
      }
    ).then(
      (conversations) =>
        conversations.filter(Boolean) as (Conversation & { partner: User })[]
    )

    return new PagedList<Conversation & { partner: User }>(
      conversationsWithPartners,
      totalCount,
      pageNumber,
      pageSize
    )
  }

  public getMessages = async (user: User, dto: TGetMessagesSchema) => {
    const {
      params: { partnerId },
      query: { pageNumber, pageSize },
    } = dto

    const conversationId = await this.firebaseService.db
      .collection("conversations")
      .where("yourId", "==", user.id)
      .where("partnerId", "==", partnerId)
      .limit(1)
      .get()
      .then((snapshot) =>
        snapshot.docs.length > 0 ? (snapshot.docs[0].id as string) : null
      )

    if (!conversationId)
      return new PagedList<Message>([], 0, pageNumber, pageSize)

    const messages = await this.firebaseService.db
      .collection("messages")
      .where("conversationIds", "array-contains", conversationId)
      .orderBy("createdAt", "desc")
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) => ({
          ...(doc.data() as Message),
          createdAt: new Date(
            doc.data().createdAt._seconds * 1000
          ).toISOString(),
        }))
      )

    const totalCount = await this.firebaseService.db
      .collection("messages")
      .where("conversationIds", "array-contains", conversationId)
      .count()
      .get()
      .then((snapshot) => snapshot.data().count)

    return new PagedList<Message>(messages, totalCount, pageNumber, pageSize)
  }

  public getPotentialChatPartners = async (user: User) => {
    // Students can chat with instructors, instructors can chat with students
    const targetRole =
      user.role === ERole.STUDENT ? ERole.INSTRUCTOR : ERole.STUDENT

    const users = await this.firebaseService.db
      .collection("users")
      .where("role", "==", targetRole)
      .get()
      .then((snapshot) =>
        snapshot.docs.map((doc) =>
          this.userService.toPublicUser(doc.data() as User)
        )
      )

    return users
  }
}
