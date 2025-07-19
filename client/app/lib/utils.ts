/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { type UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import type { HttpError } from './http'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function handleHttpError(error: HttpError, form?: UseFormReturn<any, any, any>) {
  console.log({ error })

  if (error.typeError === 'error') {
    toast.error(error.messageError)
    return
  }

  if (error.typeError === 'unknown') {
    toast.error('An unknown error occurred. Please try again later.')
    return
  }

  if (!form) return

  const keys = Object.keys(error.fieldErrors)
  keys.forEach((key) =>
    form.setError(key, {
      message: error.fieldErrors[key]
    })
  )

  form.setFocus(keys[0])
}

export default handleHttpError
