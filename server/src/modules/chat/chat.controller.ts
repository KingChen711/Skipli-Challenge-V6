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
}
