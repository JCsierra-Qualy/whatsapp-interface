'use client'

import { useEffect, useRef } from 'react'
import { Conversation } from '@/types'
import { formatDate } from '@/lib/utils'
import { UserCircle, MoreVertical, Phone, Video } from 'lucide-react'

interface ChatProps {
  conversation: Conversation
}

export function Chat({ conversation }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-[#f0f2f5] border-b">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <UserCircle className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900">{conversation.name}</h2>
          <p className="text-xs text-gray-500">En línea</p>
        </div>
        <div className="flex items-center space-x-3 text-[#54656f]">
          <Video className="w-5 h-5 cursor-pointer" />
          <Phone className="w-5 h-5 cursor-pointer" />
          <MoreVertical className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            } mb-4`}
          >
            <div
              className={`message-bubble ${
                message.role === 'assistant'
                  ? 'message-bubble-assistant'
                  : 'message-bubble-user'
              }`}
            >
              <p className="text-[15px] leading-tight text-gray-800">{message.content}</p>
              <p className="message-timestamp">
                {formatDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 