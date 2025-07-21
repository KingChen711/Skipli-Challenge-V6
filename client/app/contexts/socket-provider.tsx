import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from './auth-provider'

import { io, Socket } from 'socket.io-client'

type SocketContextType = {
  isConnected: boolean
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
  socket: null
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

type SocketProviderProps = {
  children: React.ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!accessToken) return

    const socket: Socket = io(`${import.meta.env.VITE_PUBLIC_API_ENDPOINT}`, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    setSocket(socket)

    socket.on('connect', () => {
      setIsConnected(true)
    })

    return () => {
      setIsConnected(false)
    }
  }, [accessToken, queryClient])

  return <SocketContext.Provider value={{ isConnected, socket }}>{children}</SocketContext.Provider>
}
