export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface Conversation {
  id: string
  name: string
  messages: Message[]
}

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Message>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'last_message_at'>;
        Update: Partial<Conversation>;
      };
    };
  };
} 