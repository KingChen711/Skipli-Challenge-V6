import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { ok } from "../../helpers/utils"
import { ChatService } from "./chat.service"

@injectable()
export class ChatController {
  constructor(
    @inject(ChatService)
    private readonly chatService: ChatService
  ) {}

  public sendMessage = async (req: Request, res: Response) => {
    await this.chatService.sendMessage(res.locals.user, res.locals.requestData)
    return ok(res)
  }

  public getConversations = async (req: Request, res: Response) => {
    const conversations = await this.chatService.getConversations(
      res.locals.user
    )
    return ok(res, conversations)
  }

  public getMessages = async (req: Request, res: Response) => {
    const messages = await this.chatService.getMessages(
      res.locals.user,
      res.locals.requestData
    )
    return ok(res, messages)
  }

  public getPotentialChatPartners = async (req: Request, res: Response) => {
    const partners = await this.chatService.getPotentialChatPartners(
      res.locals.user
    )
    return ok(res, partners)
  }
}
