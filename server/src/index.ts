import "dotenv/config"
import "reflect-metadata"
import "express-async-errors"

import bodyParser from "body-parser"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"

import initializeFirebase from "./config/firebase"
// import serverless from "serverless-http"

import NotFoundException from "./helpers/errors/not-found.exception"
import { ok } from "./helpers/utils"
import errorHandlingMiddleware from "./middleware/error-handling.middleware"
import { authRoute } from "./modules/auth/auth.route"

//!Just for development
const DELAY = 0

// Initialize Firebase
initializeFirebase()

const app = express()

app.use((req, res, next) => {
  setTimeout(next, DELAY)
})

app.use(helmet())
app.use(morgan("dev"))
app.use(express.static("public"))

app.use(bodyParser.json())

app.use("/api/auth", authRoute)

app.get("/", (req, res) => {
  return ok(res, { message: "hello world" })
})

app.all("*", () => {
  throw new NotFoundException()
})

app.use(errorHandlingMiddleware)

const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

// export const handler = serverless(app)
