/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import queryString from 'query-string'

type CustomOptions = RequestInit & {
  baseUrl?: string
  searchParams?: queryString.StringifiableRecord | undefined
  responseType?: 'json' | 'blob'
}

export type HttpResponse<TData = undefined> = TData extends undefined
  ? { success: true }
  : { success: true; data: TData }

export type HttpError =
  | { success: false; typeError: 'unknown' }
  | {
      success: false
      typeError: 'error'
      messageError: string
    }
  | {
      success: false
      typeError: 'form'
      fieldErrors: Record<string, string>
    }

type FetchResponse<TData = undefined> = {
  success?: boolean
  message?: string
  data?: TData
  errors?: Record<string, string>
}

class FetchError extends Error {
  type: 'unknown' | 'error' | 'form'
  fieldErrors: Record<string, string>
  constructor({
    fieldErrors,
    message,
    type
  }: {
    type: 'unknown' | 'error' | 'form'
    message?: string
    fieldErrors?: Record<string, string>
  } & (
    | {
        type: 'unknown'
      }
    | {
        type: 'error'
        message: string
      }
    | {
        type: 'form'
        fieldErrors: Record<string, string>
      }
  )) {
    super(message)
    this.type = type
    this.fieldErrors = fieldErrors || {}
  }
}

const request = async <TData = undefined>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
): Promise<HttpResponse<TData> | HttpError> => {
  try {
    const body = options?.body
      ? options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body)
      : undefined

    const baseHeaders = {
      'Content-Type': 'application/json'
    }

    if (body instanceof FormData) {
      // @ts-ignore
      delete baseHeaders['Content-Type']
    }

    const responseType = options?.responseType === 'blob' ? 'blob' : 'json'

    const baseUrl = options?.baseUrl === undefined ? import.meta.env.VITE_PUBLIC_API_ENDPOINT : options.baseUrl

    const fetchUrl =
      baseUrl +
      queryString.stringifyUrl(
        {
          url: url,
          query: options?.searchParams
        },
        { skipNull: true }
      )

    const res = await fetch(fetchUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers
      },
      body,
      method
    })

    if (responseType === 'blob') {
      if (!res.ok) {
        throw new Error(`Failed to fetch blob: ${res.status} ${res.statusText}`)
      }
      const blob = await res.blob()
      return {
        success: true,
        data: blob as TData
      } as HttpResponse<TData>
    }

    const payload = (await res.json()) as FetchResponse<TData>

    if (!res.ok || !payload.success) {
      if (res.status === 422 && payload?.errors) {
        throw new FetchError({
          type: 'form',
          fieldErrors: payload.errors
        })
      }

      if (payload.message) {
        throw new FetchError({
          type: 'error',
          message: payload.message
        })
      }

      throw new FetchError({
        type: 'unknown'
      })
    }

    return payload as HttpResponse<TData>
  } catch (error: unknown) {
    if (!(error instanceof FetchError) || error.type === 'unknown') {
      return {
        success: false,
        typeError: 'unknown'
      }
    }

    if (Object.keys(error.fieldErrors).length !== 0 && error.type === 'form') {
      return {
        typeError: 'form',
        fieldErrors: error.fieldErrors,
        success: false
      }
    }

    if (error.message && error.type !== 'form') {
      return {
        success: false,
        typeError: error.type,
        messageError: error.message
      }
    }

    return {
      success: false,
      typeError: 'unknown'
    }
  }
}

export const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('GET', url, options)
  },
  post<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('PUT', url, { ...options, body })
  },
  patch<Response>(url: string, body: any, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('PATCH', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, 'body'>) {
    return request<Response>('DELETE', url, options)
  }
}
