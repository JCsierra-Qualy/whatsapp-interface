import { useState, useEffect } from 'react'
import { Search, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Message, Conversation } from '@/types'
import { formatMessageDate } from '@/lib/utils'
import { clsx } from 'clsx'

export function Sidebar({
  onSelectConversation,
  selectedConversationId,
  isDarkMode = false,
}: {
  onSelectConversation: (conversation: Conversation) => void
  selectedConversationId?: string
  isDarkMode?: boolean
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [lastMessages, setLastMessages] = useState<Record<string, Message>>({})

  useEffect(() => {
    const fetchConversationsAndMessages = async () => {
      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
      
      if (conversationsData) {
        setConversations(conversationsData)

        const lastMessagesData: Record<string, Message> = {}
        for (const conv of conversationsData) {
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
          
          if (messages && messages.length > 0) {
            lastMessagesData[conv.id] = messages[0]
          }
        }
        setLastMessages(lastMessagesData)
      }
    }

    fetchConversationsAndMessages()

    const channel = supabase
      .channel('messages_and_conversations')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const newMessage = payload.new as Message
          setLastMessages(prev => ({
            ...prev,
            [newMessage.conversation_id]: newMessage
          }))

          const { data: updatedConv } = await supabase
            .from('conversations')
            .select('*')
            .eq('id', newMessage.conversation_id)
            .single()

          if (updatedConv) {
            setConversations(prev => 
              [...prev.filter(c => c.id !== updatedConv.id), updatedConv]
                .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const filteredConversations = conversations
    .filter(conv => 
      conv.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.phone_number.includes(searchTerm)
    )
    .sort((a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime())

  return (
    <div className={clsx("sidebar-container", isDarkMode && "dark")}>
      {/* Header */}
      <div className="sidebar-header">
        <h1 className="text-xl font-semibold text-white">
          WhatsApp
        </h1>
        <button className="text-white p-2 rounded-full hover:bg-white/10">
          <Settings size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar o empezar un nuevo chat"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const lastMessage = lastMessages[conversation.id]
          return (
            <div
              key={conversation.id}
              className={clsx(
                "conversation-item",
                selectedConversationId === conversation.id && "bg-[#f0f2f5] dark:bg-gray-700"
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              {/* Avatar */}
              <div className="avatar">
                {conversation.contact_name?.[0]?.toUpperCase() || '#'}
              </div>
              
              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate text-gray-900 dark:text-white">
                    {conversation.contact_name || conversation.phone_number}
                  </h3>
                  <span className="text-xs whitespace-nowrap ml-2 text-gray-500 dark:text-gray-400">
                    {formatMessageDate(conversation.last_message_at)}
                  </span>
                </div>
                {lastMessage && (
                  <div className="flex items-center">
                    <p className="text-sm truncate flex-1 text-gray-500 dark:text-gray-400">
                      {lastMessage.sender_type === 'BOT' && '🤖 '}
                      {lastMessage.sender_type === 'USER' && '👤 '}
                      {lastMessage.sender_type === 'AGENT' && '👨‍💼 '}
                      {lastMessage.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 