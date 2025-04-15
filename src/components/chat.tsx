'use client'

import { useEffect, useRef } from 'react'
import { Conversation } from '@/types'
import { formatDate } from '@/lib/utils'
import { UserCircle } from 'lucide-react'

interface ChatProps {
  conversation: Conversation
}

export function Chat({ conversation }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-[#f0f2f5] border-b">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <UserCircle className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{conversation.name}</h2>
          <p className="text-sm text-gray-500">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 bg-[#efeae2]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e5e5e5' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat'
        }}
      >
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            } mb-4`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 shadow-sm ${
                message.role === 'assistant'
                  ? 'bg-white rounded-tl-none'
                  : 'bg-[#dcf8c6] rounded-tr-none'
              }`}
            >
              <p className="text-[15px] leading-tight text-gray-800">{message.content}</p>
              <p className="text-[11px] mt-1 text-gray-500 text-right">
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