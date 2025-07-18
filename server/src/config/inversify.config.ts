import { Container } from "inversify"

import { AuthController } from "src/modules/auth/auth.controller"
import { AuthService } from "src/modules/auth/auth.service"
import { SmsService } from "src/modules/auth/sms.service"
import { FirebaseService } from "src/modules/firebase/firebase.service"

const container = new Container()

container.bind(FirebaseService).toSelf().inSingletonScope()

container.bind(AuthService).toSelf().inSingletonScope()
container.bind(SmsService).toSelf().inSingletonScope()
container.bind(AuthController).toSelf().inSingletonScope()

export { container }
