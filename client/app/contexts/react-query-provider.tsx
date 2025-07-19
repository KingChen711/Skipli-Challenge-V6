import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  const [client] = useState(new QueryClient())

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
