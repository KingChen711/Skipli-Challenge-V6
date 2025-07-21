import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { Send, Plus, Search, Loader2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'

import { useAuth } from '~/contexts/auth-provider'
import { useSocket } from '~/contexts/socket-provider'
import { useConversations, type ConversationWithPartner } from '~/hooks/messages/use-conversations'
import { useMessages } from '~/hooks/messages/use-messages'
import { useSendMessage } from '~/hooks/messages/use-send-message'
import { usePotentialPartners } from '~/hooks/messages/use-potential-partners'
import handleHttpError, { cn } from '~/lib/utils'
import type { Message, User } from '~/types/models'
import { useInView } from 'react-intersection-observer'

function Messages() {
  const { user } = useAuth()
  const { isConnected, socket } = useSocket()
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithPartner | null>(null)
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef<number>(0)
  const [newMessages, setNewMessages] = useState<Message[]>([])

  const { ref: refConversationBottom, inView: inViewConversationBottom } = useInView()

  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    fetchNextPage: fetchNextConversations,
    hasNextPage: hasNextConversationsPage,
    isFetchingNextPage: isFetchingNextConversations,
    refetch: refetchConversations
  } = useConversations()

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasNextMessagesPage,
    isFetchingNextPage: isFetchingNextMessages
  } = useMessages(selectedConversation?.partner.id || null)

  const { data: potentialPartners = [], isLoading: isLoadingPotentialPartners } = usePotentialPartners(isNewChatOpen)
  const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage()
  const [conversations, setConversations] = useState<ConversationWithPartner[]>([])

  const allConversations = useMemo(
    () => conversationsData?.pages.flatMap((page) => page.items) || [],
    [conversationsData]
  )

  const allMessages = useMemo(
    () => messagesData?.pages.flatMap((page) => page.items).reverse() || [],
    [messagesData?.pages]
  )

  useEffect(() => {
    if (isLoadingConversations) return
    setConversations(allConversations)
  }, [allConversations, isLoadingConversations])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView()
  }

  useEffect(() => {
    if (isSendingMessage) return
    inputRef.current?.focus()
  }, [isSendingMessage, selectedConversation])

  useLayoutEffect(() => {
    scrollToBottom()
  }, [newMessages])

  useLayoutEffect(() => {
    if (allMessages.length <= 20) scrollToBottom()
  }, [allMessages])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight - prevScrollHeightRef.current
  }, [allMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation) return

    const res = await sendMessage({
      receiverId: selectedConversation.partner.id,
      content: messageText.trim()
    })
    setMessageText('')
    if (res.success) return
    handleHttpError(res)
  }

  const handleStartNewChat = (partner: User) => {
    const newConversation: ConversationWithPartner = {
      id: '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      lastMessage: null,
      partner,
      yourId: user!.id,
      partnerId: partner.id
    }
    setSelectedConversation(newConversation)
    setIsNewChatOpen(false)
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.partner.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPotentialPartners = potentialPartners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !conversations.some((conv) => conv.partner.id === partner.id)
  )

  useEffect(() => {
    if (!isConnected || !socket) return
    socket.on('message', (message: Message) => {
      if (selectedConversation?.id && message.conversationIds.includes(selectedConversation.id)) {
        setNewMessages((prev) => [...prev, message])
      }

      const conversationIndex = conversations.findIndex((conv) => conv.partner.id === message.receiverId)

      if (conversationIndex === -1) {
        refetchConversations()
        return
      }

      const conversation = conversations[conversationIndex]
      conversation.lastMessage = message
      setConversations((prev) => {
        const clone = structuredClone(prev)
        clone.splice(conversationIndex, 1)
        return [conversation, ...clone]
      })
    })

    return () => {
      socket.off('message')
    }
  }, [socket, isConnected, refetchConversations, conversations, selectedConversation])

  useEffect(() => {
    setNewMessages([])
  }, [selectedConversation])

  useEffect(() => {
    if (inViewConversationBottom && hasNextConversationsPage && !isFetchingNextConversations) {
      fetchNextConversations()
    }
  }, [fetchNextConversations, hasNextConversationsPage, inViewConversationBottom, isFetchingNextConversations])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (container.scrollTop < 100 && hasNextMessagesPage && !isFetchingNextMessages) {
        prevScrollHeightRef.current = container.scrollHeight
        fetchNextMessages()
      }
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [hasNextMessagesPage, isFetchingNextMessages, fetchNextMessages])

  return (
    <div className='flex h-[calc(100vh-64px)] bg-background'>
      <div className='w-80 border-r border-border flex flex-col'>
        <div className='p-4 border-b border-border'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <h2 className='text-2xl font-semibold'>Messages</h2>
            </div>
            <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
              <DialogTrigger asChild>
                <Button size='sm' variant='outline'>
                  <Plus className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Chat</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search users...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                  <ScrollArea className='h-60'>
                    <div className='space-y-2'>
                      {filteredPotentialPartners.map((partner) => (
                        <div
                          key={partner.id}
                          className='flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer border'
                          onClick={() => handleStartNewChat(partner)}
                        >
                          <Avatar className='h-10 w-10'>
                            <AvatarFallback>
                              {partner.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <p className='font-medium'>{partner.name}</p>
                            <p className='text-sm text-muted-foreground capitalize'>{partner.role}</p>
                          </div>
                        </div>
                      ))}
                      {isLoadingPotentialPartners && (
                        <div className='flex justify-center items-center h-full py-8'>
                          <Loader2 className='size-8 animate-spin' />
                        </div>
                      )}
                      {!isLoadingPotentialPartners && filteredPotentialPartners.length === 0 && (
                        <p className='text-center text-muted-foreground py-4'>No users found</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className='relative'>
            <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search conversations...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <ScrollArea className='flex-1'>
          <div className='p-2'>
            {isLoadingConversations ? (
              <div className='space-y-2'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center gap-3 p-3 rounded-lg animate-pulse'>
                    <div className='h-10 w-10 bg-muted rounded-full' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 bg-muted rounded w-3/4' />
                      <div className='h-3 bg-muted rounded w-1/2' />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className='text-center py-8 text-muted-foreground'>
                <p>No conversations yet</p>
                <p className='text-sm'>Start a new chat to begin messaging</p>
              </div>
            ) : (
              <div className='space-y-1'>
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.partner.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors',
                      selectedConversation?.partner.id === conversation.partner.id && 'bg-muted'
                    )}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback>
                        {conversation.partner.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <p className='font-medium truncate'>{conversation.partner.name}</p>
                        {conversation.lastMessage && (
                          <span className='text-xs text-muted-foreground'>
                            {format(new Date(conversation.lastMessage.createdAt), 'HH:mm')}
                          </span>
                        )}
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm text-muted-foreground line-clamp-1'>
                          {conversation.lastMessage?.senderId === user?.id ? 'You: ' : null}
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load more conversations */}
                {hasNextConversationsPage && <div ref={refConversationBottom}></div>}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className='flex-1 flex flex-col'>
        {selectedConversation ? (
          <>
            <div className='p-4 border-b border-border'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarFallback>
                    {selectedConversation.partner.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-semibold'>{selectedConversation.partner.name}</h3>
                  <p className='text-sm text-muted-foreground capitalize'>{selectedConversation.partner.role}</p>
                </div>
              </div>
            </div>

            <div className='flex-1 p-4 max-h-[calc(100vh-210px)] overflow-y-auto' ref={containerRef}>
              <div className='flex gap-4 flex-col'>
                {isLoadingMessages && (
                  <div className='flex justify-center items-center h-full py-8'>
                    <Loader2 className='size-8 animate-spin' />
                  </div>
                )}
                {!isLoadingMessages && allMessages.length === 0 && newMessages.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground'>
                    <p>No messages yet</p>
                    <p className='text-sm'>Send a message to start the conversation</p>
                  </div>
                ) : (
                  <>
                    {[...allMessages, ...newMessages].map((message) => {
                      const isOwnMessage = message.senderId === user?.id
                      return (
                        <div key={message.id} className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}>
                          <div
                            className={cn(
                              'max-w-[70%] rounded-lg px-4 py-2',
                              isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}
                          >
                            <p className='text-sm'>{message.content}</p>
                            <p
                              className={cn(
                                'text-xs mt-1',
                                isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}
                            >
                              {format(new Date(message.createdAt), 'HH:mm')}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
              <div ref={bottomRef} />
            </div>

            <div className='p-4 border-t border-border'>
              <form onSubmit={handleSendMessage} className='flex gap-2'>
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder='Type a message...'
                  className='flex-1'
                  disabled={isSendingMessage}
                  ref={inputRef}
                />
                <Button type='submit' size='icon' disabled={!messageText.trim() || isSendingMessage}>
                  <Send className='h-4 w-4' />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <Card className='w-96'>
              <CardHeader>
                <CardTitle className='text-center'>Welcome to Messages</CardTitle>
              </CardHeader>
              <CardContent className='text-center space-y-4'>
                <p className='text-muted-foreground'>
                  Select a conversation from the sidebar or start a new chat to begin messaging.
                </p>
                <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className='h-4 w-4 mr-2' />
                      Start New Chat
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
