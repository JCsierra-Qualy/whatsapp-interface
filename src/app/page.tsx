'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Chat } from '@/components/chat'
import { Conversation } from '@/types'
import { Moon, Sun } from 'lucide-react'

export default function Home() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-white dark:bg-gray-900">
      {/* Theme toggle button */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Main content */}
      <div className="flex h-full">
        <Sidebar
          onSelectConversation={setSelectedConversation}
          selectedConversationId={selectedConversation?.id}
          isDarkMode={isDarkMode}
        />
        <div className="flex-1 h-full">
          {selectedConversation ? (
            <Chat conversation={selectedConversation} isDarkMode={isDarkMode} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
