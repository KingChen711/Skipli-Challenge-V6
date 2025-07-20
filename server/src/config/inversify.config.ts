import { Container } from "inversify"

import { AuthController } from "../modules/auth/auth.controller"
import { AuthService } from "../modules/auth/auth.service"
import { SmsService } from "../modules/auth/sms.service"
import { TokenService } from "../modules/auth/token.service"
import { ChatController } from "../modules/chat/chat.controller"
import { ChatService } from "../modules/chat/chat.service"
import { SocketService } from "../modules/chat/socket.service"
import { EmailService } from "../modules/email/email.service"
import { FirebaseService } from "../modules/firebase/firebase.service"
import { LessonController } from "../modules/lessons/lesson.controller"
import { LessonService } from "../modules/lessons/lesson.service"
import { UserController } from "../modules/users/user.controller"
import { UserService } from "../modules/users/user.service"

const container = new Container()

container.bind(FirebaseService).toSelf().inSingletonScope()
container.bind(EmailService).toSelf().inSingletonScope()
container.bind(SocketService).toSelf().inSingletonScope()

container.bind(UserService).toSelf().inSingletonScope()
container.bind(UserController).toSelf().inSingletonScope()

container.bind(LessonService).toSelf().inSingletonScope()
container.bind(LessonController).toSelf().inSingletonScope()

container.bind(ChatService).toSelf().inSingletonScope()
container.bind(ChatController).toSelf().inSingletonScope()

container.bind(TokenService).toSelf().inSingletonScope()
container.bind(AuthService).toSelf().inSingletonScope()
container.bind(SmsService).toSelf().inSingletonScope()
container.bind(AuthController).toSelf().inSingletonScope()

export { container }
