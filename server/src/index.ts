import "dotenv/config"
import "reflect-metadata"
import "express-async-errors"

import http from "http"
import bodyParser from "body-parser"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import { Server, type Socket } from "socket.io"

import initializeFirebase from "./config/firebase.config"
import { container } from "./config/inversify.config"
import NotFoundException from "./helpers/errors/not-found.exception"
import { ok } from "./helpers/utils"
import corsMiddleware from "./middleware/cors.middleware"
import errorHandlingMiddleware from "./middleware/error-handling.middleware"
import socketMiddleware from "./middleware/socket.middleware"
import { authRoute } from "./modules/auth/auth.route"
import { chatRoute } from "./modules/chat/chat.route"
import { SocketService } from "./modules/chat/socket.service"
import { lessonRoute } from "./modules/lessons/lesson.route"
import { userRoute } from "./modules/users/user.route"

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

io.engine.use(socketMiddleware)

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
