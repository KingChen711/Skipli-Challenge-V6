import { Container } from "inversify"

import { AuthController } from "src/modules/auth/auth.controller"
import { AuthService } from "src/modules/auth/auth.service"
import { SmsService } from "src/modules/auth/sms.service"
import { TokenService } from "src/modules/auth/token.service"
import { EmailService } from "src/modules/email/email.service"
import { FirebaseService } from "src/modules/firebase/firebase.service"
import { LessonController } from "src/modules/lessons/lesson.controller"
import { LessonService } from "src/modules/lessons/lesson.service"
import { UserController } from "src/modules/users/user.controller"
import { UserService } from "src/modules/users/user.service"

const container = new Container()

container.bind(FirebaseService).toSelf().inSingletonScope()
container.bind(EmailService).toSelf().inSingletonScope()

container.bind(UserService).toSelf().inSingletonScope()
container.bind(UserController).toSelf().inSingletonScope()

container.bind(LessonService).toSelf().inSingletonScope()
container.bind(LessonController).toSelf().inSingletonScope()

container.bind(TokenService).toSelf().inSingletonScope()
container.bind(AuthService).toSelf().inSingletonScope()
container.bind(SmsService).toSelf().inSingletonScope()
container.bind(AuthController).toSelf().inSingletonScope()

export { container }
