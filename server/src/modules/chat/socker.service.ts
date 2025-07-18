import { injectable } from "inversify"
import { Socket } from "socket.io"

import { io } from "../.."
import { Message, User } from "../../types/models"

@injectable()
export class SocketService {
  constructor() {}

  public handleConnection(socket: Socket) {
    //The socket middleware is already checked, so we can access the user
    //@ts-ignore
    const user: User = socket.request.user
    console.log("A user connected", user.id)

    socket.join(`user:${user.id}`)

    socket.on("disconnect", () => {
      console.log("A user disconnected", user.id)
    })
  }

  public emitMessage(message: Message) {
    console.log("emitting message", message)

    io.to(`user:${message.senderId}`).emit("message", message)
    io.to(`user:${message.receiverId}`).emit("message", message)
  }
}
