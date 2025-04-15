'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Chat } from '@/components/chat'
import { Conversation } from '@/types'
import { MessageSquare } from 'lucide-react'

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <div className="h-screen w-full overflow-hidden bg-[#efeae2]">
      <div className="max-w-[1800px] h-[100vh] mx-auto">
        <div className="h-full flex shadow-2xl">
          <Sidebar
            onSelectConversation={setSelectedConversation}
            selectedConversationId={selectedConversation?.id}
          />
          <div className="flex-1 h-full bg-white">
            {selectedConversation ? (
              <Chat conversation={selectedConversation} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-[#f0f2f5] text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-xl font-light">Selecciona una conversación para comenzar</p>
                <p className="text-sm mt-2 text-gray-400">Tus mensajes se mostrarán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
