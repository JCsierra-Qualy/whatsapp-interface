import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Message, Conversation } from '@/types'
import { formatMessageDate, cn } from '@/lib/utils'

export function Chat({
  conversation,
  isDarkMode = false,
}: {
  conversation: Conversation
  isDarkMode?: boolean
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })
      
      if (data) {
        setMessages(data)
        setTimeout(scrollToBottom, 100)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
          setTimeout(scrollToBottom, 100)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [conversation.id])

  const getMessageEmoji = (senderType: string) => {
    switch (senderType.toLowerCase()) {
      case 'user':
        return '👤 '
      case 'bot':
        return '🤖 '
      default:
        return ''
    }
  }

  return (
    <div className={cn(
      "flex-1 flex flex-col h-screen",
      isDarkMode ? "bg-gray-900" : "bg-[#f0f2f5]"
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 py-3 shadow-sm flex items-center",
        isDarkMode ? "bg-gray-800" : "bg-white"
      )}>
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-gray-600 mr-3",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )}>
          {conversation.contact_name?.[0]?.toUpperCase() || '#'}
        </div>
        <div>
          <h2 className={cn(
            "font-medium",
            isDarkMode ? "text-white" : "text-gray-800"
          )}>
            {conversation.contact_name || conversation.phone_number}
          </h2>
          <p className={cn(
            "text-sm",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {conversation.phone_number}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className={cn(
          "flex-1 overflow-y-auto p-4 space-y-2",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}
        style={{ 
          backgroundImage: isDarkMode ? 'none' : 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA0SURBVDhPYxgFo2AUjAIYYGRkZETmU8UQmGHUMgjdUJpYCDMQF6CKhbBwHAWjYBSMgpEKGBgAoKIJ5KEJp6IAAAAASUVORK5CYII=")',
          backgroundRepeat: 'repeat'
        }}
      >
        {messages.map((message) => {
          const isBot = message.sender_type.toLowerCase() === 'bot'
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                isBot ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[75%] rounded-lg p-2 shadow-sm",
                isBot 
                  ? isDarkMode 
                    ? "bg-green-700 text-white"
                    : "bg-[#d9fdd3] text-gray-800"
                  : isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
              )}>
                <p className="whitespace-pre-wrap">
                  {getMessageEmoji(message.sender_type)}
                  {message.message}
                </p>
                <div className={cn(
                  "text-[11px] mt-1 flex items-center gap-1",
                  isDarkMode 
                    ? "text-gray-400"
                    : "text-gray-500"
                )}>
                  {formatMessageDate(message.created_at)}
                  {message.message_status && (
                    <span className="text-xs">
                      {message.message_status === 'sent' ? '✓' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 