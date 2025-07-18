import { Container } from "inversify"

import { AuthController } from "src/modules/auth/auth.controller"
import { AuthService } from "src/modules/auth/auth.service"
import { TwilioService } from "src/modules/auth/twilio.service"

import { EmbeddingController } from "../modules/embedding/embedding.controller"
import { EmbeddingService } from "../modules/embedding/embedding.service"

const container = new Container()

container.bind(EmbeddingService).toSelf().inSingletonScope()
container.bind(EmbeddingController).toSelf().inSingletonScope()

container.bind(AuthService).toSelf().inSingletonScope()
container.bind(TwilioService).toSelf().inSingletonScope()
container.bind(AuthController).toSelf().inSingletonScope()

export { container }
