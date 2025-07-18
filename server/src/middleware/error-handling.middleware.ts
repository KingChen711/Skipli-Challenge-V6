import { type NextFunction, type Request, type Response } from "express"
import { StatusCodes } from "http-status-codes"

import type ApiError from "../helpers/api-error"
import RequestValidationException, {
  type ValidationErrors,
} from "../helpers/errors/request-validation.exception"

const errorHandlingMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  if (!err?.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = err.data || {
    success: false,
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    errors: undefined as ValidationErrors | undefined,
    // stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  }

  if (err instanceof RequestValidationException) {
    responseError.errors = err.errors
  }

  console.log(err.stack)

  res.status(err.statusCode).json(responseError)
}

export default errorHandlingMiddleware
