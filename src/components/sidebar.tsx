import { useState, useEffect } from 'react'
import { Search, ChevronDown, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Message, Conversation } from '@/types'
import { formatMessageDate, cn } from '@/lib/utils'

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
      // Fetch conversations
      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false })
      
      if (conversationsData) {
        setConversations(conversationsData)

        // Fetch last message for each conversation
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

    // Subscribe to new messages
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

          // Update conversation last_message_at
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
    <div className={cn(
      "w-[400px] flex flex-col border-r h-screen",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "px-4 py-2 flex items-center justify-between",
        isDarkMode ? "bg-gray-900" : "bg-[#008069]"
      )}>
        <h1 className="text-xl font-semibold text-white">
          WhatsApp
        </h1>
        <button className="text-white p-2 rounded-full hover:bg-white/10">
          <Settings size={20} />
        </button>
      </div>

      {/* Search */}
      <div className={cn(
        "p-2",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}>
        <div className="relative">
          <div className={cn(
            "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Buscar o empezar un nuevo chat"
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none",
              isDarkMode 
                ? "bg-gray-800 text-white placeholder-gray-400 border-gray-700"
                : "bg-gray-100 text-gray-900 placeholder-gray-500"
            )}
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
              className={cn(
                "p-3 cursor-pointer flex items-center border-b",
                isDarkMode
                  ? selectedConversationId === conversation.id
                    ? "bg-gray-700 border-gray-700"
                    : "hover:bg-gray-700 border-gray-700"
                  : selectedConversationId === conversation.id
                    ? "bg-[#f0f2f5] border-gray-100"
                    : "hover:bg-[#f0f2f5] border-gray-100"
              )}
              onClick={() => onSelectConversation(conversation)}
            >
              {/* Avatar */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mr-3",
                isDarkMode 
                  ? "bg-gray-600 text-gray-200"
                  : "bg-[#00a884] text-white"
              )}>
                {conversation.contact_name?.[0]?.toUpperCase() || '#'}
              </div>
              
              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className={cn(
                    "font-medium truncate",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    {conversation.contact_name || conversation.phone_number}
                  </h3>
                  <span className={cn(
                    "text-xs whitespace-nowrap ml-2",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {formatMessageDate(conversation.last_message_at)}
                  </span>
                </div>
                {lastMessage && (
                  <div className="flex items-center">
                    <p className={cn(
                      "text-sm truncate flex-1",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {lastMessage.sender_type === 'bot' && '🤖 '}
                      {lastMessage.sender_type === 'user' && '👤 '}
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