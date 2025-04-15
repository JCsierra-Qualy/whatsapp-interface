export type Message = {
  id: string;
  phone_number: string;
  sender_type: 'USER' | 'BOT' | 'AGENT';
  message: string;
  created_at: string;
  conversation_id: string;
  message_status?: string;
  media_url?: string;
  message_type?: string;
  metadata?: Record<string, any>;
}

export type Conversation = {
  id: string;
  phone_number: string;
  last_message_at: string;
  created_at: string;
  contact_name?: string;
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