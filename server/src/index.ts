import "dotenv/config"
import "reflect-metadata"
import "express-async-errors"

import http from "http"
import bodyParser from "body-parser"
import express, { type NextFunction } from "express"
import helmet from "helmet"
import morgan from "morgan"
import { Server, type Socket } from "socket.io"

import initializeFirebase from "./config/firebase.config"
import { container } from "./config/inversify.config"
import NotFoundException from "./helpers/errors/not-found.exception"
import { ok } from "./helpers/utils"
import corsMiddleware from "./middleware/cors.middleware"
import errorHandlingMiddleware from "./middleware/error-handling.middleware"
import { authRoute } from "./modules/auth/auth.route"
import { TokenService } from "./modules/auth/token.service"
import { chatRoute } from "./modules/chat/chat.route"
import { SocketService } from "./modules/chat/socker.service"
import { lessonRoute } from "./modules/lessons/lesson.route"
import { userRoute } from "./modules/users/user.route"
import { UserService } from "./modules/users/user.service"

//!Just for development
const DELAY = 0

// Initialize Firebase
initializeFirebase()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

//TODO:split to middleware
io.engine.use(async (req, res, next: NextFunction) => {
  const isHandshake = req._query.sid === undefined
  if (!isHandshake) {
    return next()
  }

  const token = req.headers.authorization?.split(" ")[1]
  if (!token) {
    return next(new Error("Authentication error"))
  }

  try {
    const decoded = await container.get(TokenService).verifyToken(token)

    if (!decoded) return next(new Error("Authentication error"))

    const userService = container.get(UserService)
    const user = await userService.getUserById(decoded.userId)
    if (!user) return next(new Error("Authentication error"))

    req.user = user
    next()
  } catch {
    return next(new Error("Invalid token"))
  }
})

app.use((req, res, next) => {
  setTimeout(next, DELAY)
})

app.use(helmet())
app.use(morgan("dev"))
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(corsMiddleware)

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/lessons", lessonRoute)
app.use("/api/chat", chatRoute)

app.get("/", (req, res) => {
  return ok(res, { message: "hello world" })
})

app.all("*", () => {
  throw new NotFoundException()
})

app.use(errorHandlingMiddleware)

const PORT = process.env.PORT || 6000

const bootstrap = async () => {
  server.listen(PORT, () => {
    const socketService = container.get(SocketService)
    io.on("connection", (socket: Socket) =>
      socketService.handleConnection(socket)
    )
    console.log(`Listening on port ${PORT}!!!`)
  })
}

bootstrap()

export { io }
